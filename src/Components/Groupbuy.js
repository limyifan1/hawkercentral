import React from "react";
import "../App.css";
import { Redirect, withRouter } from "react-router-dom";
import { firebase, uiConfig } from "./Firestore";
import { Form, Button } from "react-bootstrap";
import { db } from "./Firestore";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import update from "immutability-helper";

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

const time_now = new Date();

// Retrieves all groupbuys from db and displays unique set of areas eg Tampines, Bishan.
// Upon clicking area, redirect user with specific area param and retrieve groupbuys in this area from db
// Redirects to GroupbuyList.js
export class Groupbuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryData: null,
      redirect: false,
      areaSelected: "",
      create: false,
      shopName: "",
      shopArea: "",
      shopItems: [{ name: "", price: "" }], // initialize to 1 empty item
      datetime: time_now,
      date: time_now,
      time: time_now,
      firebaseUser: null,
      create_contact: null,
      submitted: false
    };
    this.renderRedirect.bind(this)
    this.handleMenuDisplay.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // Set up Firebase reCAPTCHA
    // To apply the default browser preference instead of explicitly setting it.
    firebase.auth().useDeviceLanguage();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved
        },
      }
    );

    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          // User is signed in, set state
          // More auth information can be obtained here but for verification purposes, we just need to know user signed in
          this.setState({
            firebaseUser: user,
            create_contact: user.phoneNumber.slice(3),
          });
          onLoad("hawker_dashboard", user.phoneNumber.slice(3));
        } else {
          // No user is signed in.
        }
      }.bind(this)
    );
  }

  componentWillMount() {
    this.getDoc();
  }

  getDoc = () => {
    return db
      .collection("groupbuy")
      .get()
      .then(async (snapshot) => {
        var dataToReturn = [];
        snapshot.forEach((d) => {
          console.log(d.data());
          dataToReturn.push(d.data())
        });
        this.setState({ deliveryData: dataToReturn });
        return dataToReturn;
      })
      .catch((error) => {
        console.log(error);
      });
  };


  handleDate = async (date) => {
    this.setState({
      date: date,
      datetime: new Date(
        date.getMonth() +
        1 +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " " +
        this.state.time
      ),
    });
  };

  handleTime = async (time) => {
    this.setState({
      time: time,
      datetime: new Date(
        this.state.date.getMonth() +
        1 +
        "/" +
        this.state.date.getDate() +
        "/" +
        this.state.date.getFullYear() +
        " " +
        time
      ),
    });
  };

  handleChangeNumber = async (event) => {
    event.preventDefault();
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
    this.setState({
      firebaseUser: null,
      create_contact: null,
    })
    alert("Poof! You are signed out for this phone number. \nPlease refresh page to verify another phone number");
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");
    // If no firebaseUser, submit button brings user to verify phone number
    // If there is a firebaseUser, user is verified and submit button creates Groupbuy
    if (!this.state.firebaseUser) {
      console.log("verifyPhoneNumber");
      if (this.state.datetime < time_now) {
        alert("Date can't be in the past");
        return;
      }
      if (this.state.shopItems[0].name === "" || this.state.shopItems[0].price === "") {
        alert("You must groupbuy at least 1 item and state its price");
        return;
      }
      this.setState({ wantToVerify: true });
    } else {
      if (this.state.datetime < time_now) {
        alert("Date can't be in the past");
        return;
      }
      if (this.state.shopItems[0].name === "" || this.state.shopItems[0].price === "") {
        alert("You must groupbuy at least 1 item and state its price");
        return;
      }
      console.log("createGroupbuy");
      // Initialize numBuyers in shopItems to 0
      let newShopItems = this.state.shopItems.map((shopItem) => {
        let newItem = shopItem;
        newItem["numBuyers"] = 0;
        console.log(newItem);
        return (newItem);
      });
      var newGroupbuy = {
        active: true,
        area: this.state.shopArea,
        name: this.state.shopName,
        buyers: [],
        menuitem: newShopItems
      };
      db.collection("groupbuy")
        .add(newGroupbuy)
        .then( (docRef) => {
          console.log("submitted, docref:");
          console.log(docRef);
          this.setState({ submitted: true });
          return docRef.id;
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });

    }
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "moreShopItems") {
      this.setState({
        shopItems: this.state.shopItems.concat({ name: "", price: "" })
      });
    } else if (name.slice(0, 8) === "itemName") {
      let idxToChange = parseInt(name.slice(8));
      let newShopItem = this.state.shopItems[idxToChange];
      newShopItem.name = value;
      this.setState({
        shopItems: update(this.state.shopItems, {
          [idxToChange]: { $set: newShopItem },
        }),
      });
    } else if (name.slice(0, 9) === "itemPrice") {
      let idxToChange = parseInt(name.slice(9));
      let newShopItem = this.state.shopItems[idxToChange];
      newShopItem.price = value;
      this.setState({
        shopItems: update(this.state.shopItems, {
          [idxToChange]: { $set: newShopItem },
        }),
      });
    }
    else {
      this.setState({ [name]: value });
    }
  };

  handleOneArea = (event) => {
    const target = event.target;
    const value = target.value;
    // Get the groupbuys for this area
    this.setState({
      areaSelected: value,
      redirect: true,
    });
  };

  handleCreate = (event) => {
    // Get the groupbuys for this area
    this.setState({
      create: !this.state.create
    });
  };

  handleView = (event) => {
    this.props.history.push("/groupbuy-customer");
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      // let areaGroupbuys = [];
      // // parse groupbuys in this area from this.state.deliverydata
      // areaGroupbuys = this.state.deliveryData.filter((data) => {
      //   if (data.area === this.state.areaSelected) {
      //     return (data)
      //   }
      // })
      return (
        <Redirect
          to={{
            pathname: `/groupbuy/${this.state.areaSelected}`,
          }}
        />
      );
    }
  };

  handleMenuDisplay = (context) => {
    let data = [];
    // Push the number of rows corresponding to number of menu items
    for (var i = 0; i < this.state.shopItems.length; i++) {
      data.push(
        <div>
          <div class="form-row">
            <div class="col-7">
              <input
                onChange={this.handleChange}
                value={this.state.shopItems[i].name}
                name={"itemName" + i.toString()}
                type="text"
                class="form-control"
                placeholder="E.g. Chicken Rice"
                maxlength="60"
              />
            </div>
            <div class="col-5">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">
                    $
                  </span>
                </div>
                <input
                  onChange={this.handleChange}
                  value={this.state.shopItems[i].price}
                  name={"itemPrice" + i.toString()}
                  type="number"
                  class="form-control"
                  placeholder="e.g. 4.00"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return data;
  };

  render() {
    let dataToDisplay = [];
    let areaSet = []
    if (this.state.deliveryData !== null) {
      // get the unique set of areas to display as buttons
      areaSet = [...new Set(this.state.deliveryData.map(data => data.area))]
      dataToDisplay = areaSet.map((data) => {
        return (
          <Button
            onClick={this.handleOneArea.bind(this)}
            class="shadow-lg"
            style={{
              backgroundColor: "#b48300",
              borderColor: "#b48300",
              margin: "10px"
            }}
            value={data} // pass in groupbuy area
          >
            {data}
          </Button>
        );
      });
    }

    return (
      <div>
        {this.renderRedirect()}
        <div
          class="jumbotron"
          style={{
            "padding-top": "70px",
            "padding-bottom": "240px",
            height: "100%",
            "background-color": "white",
          }}
        >
          <div class="container-fluid col-md-12 content col-xs-offset-2">
            <div>
              <h1>Create and Find Groupbuys for Free</h1>
              <div>
                <br />
                <span>
                  <Button
                    onClick={this.handleCreate.bind(this)}
                    style={{
                      backgroundColor: "#b48300",
                      borderColor: "#b48300",
                    }}
                  >
                    {this.state.create ? <>Cancel New Groupbuy</> : <> Create New Groupbuy</>}

                  </Button>
                  <Button
                    onClick={this.handleView.bind(this)}
                    style={{
                      backgroundColor: "#b48300",
                      borderColor: "#b48300",
                      margin: "10px"
                    }}
                  >View My Groupbuys</Button>
                </span>
              </div>
              {/* Display create form if user creates new groupbuy */}
              {this.state.create ? (
                <div
                  class="card shadow row"
                  style={{ width: "100%", padding: "20px", margin: "20px" }}
                >
                  <div>
                    <h2>New Groupbuy</h2>
                    <Form onSubmit={this.handleSubmit}>
                      <label for="shopName">Groupbuy What?</label>
                      <div class="input-group">
                        <input
                          onChange={this.handleChange}
                          value={this.state.shopName}
                          type="text"
                          class="form-control"
                          name="shopName"
                          placeholder="e.g. Block 88 Huat Huat Rice"
                          required
                        ></input>
                      </div>
                      <br />
                      <label for="shopArea">Groupbuy for Which Estate? (use nearest MRT)</label>
                      <div class="input-group">
                        <input
                          onChange={this.handleChange}
                          value={this.state.shopArea}
                          type="text"
                          class="form-control"
                          name="shopArea"
                          placeholder="e.g. Bedok, Tampines"
                          required
                        ></input>
                      </div>
                      <br />
                      <label for="shopItem">Groupbuy What Items?</label>
                      <p>{this.handleMenuDisplay()} </p>
                      {/* Option to add additional menu items */}
                      <div class="create-title">
                        <Button
                          class="shadow-sm"
                          style={{
                            backgroundColor: "#b48300",
                            borderColor: "#b48300",
                          }}
                          onClick={this.handleChange}
                          name="moreShopItems"
                        >
                          Add Groupbuy Item
                        </Button>
                        <br />
                      </div>
                      <br />
                      <div class="row">
                        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                          <div class="form-group create-title">
                            <label for="time">
                              Cut-off Date
                                  </label>
                            <DatePicker
                              class="form-control is-invalid"
                              dayPlaceholder="dd"
                              monthPlaceholder="mm"
                              yearPlaceholder="yyyy"
                              onChange={this.handleDate}
                              value={this.state.date}
                              format="dd/MMM/yyyy"
                              required
                            />
                          </div>
                        </div>
                        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                          <div class="form-group create-title">
                            <label for="time">
                              Cutoff Time
                                  </label>
                            <TimePicker
                              class="form-control is-invalid"
                              dayPlaceholder="dd"
                              monthPlaceholder="mm"
                              yearPlaceholder="yyyy"
                              hourPlaceholder="hh"
                              minutePlaceholder="mm"
                              onChange={this.handleTime}
                              value={this.state.time}
                              format="hh:mma"
                              disableClock
                              required
                            />
                            {time_now > this.state.datetime ? (
                              <span class="badge badge-danger">
                                <div>
                                  Date can't be in the past
                                    </div>
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <br />
                      {/* Ensure phone number is verified */}
                      {this.state.firebaseUser ? (
                        <div
                          style={{ color: "green" }}>
                          <p>
                            Verified Person-In-Charge Mobile Number:{" "}
                            {this.state.firebaseUser.phoneNumber}
                            <br />
                            <div
                              onClick={this.handleChangeNumber.bind(this)}
                              style={{ color: "blue", textDecorationLine: "underline", cursor: "pointer" }}>
                              (Change Mobile Number)
                            </div>
                            <span>
                              <br />

                              {this.state.submitted ? (
                                <div>
                                  <div
                                    class="shadow-lg"
                                    style={{
                                      backgroundColor: "green",
                                      borderColor: "white",
                                      fontSize: "25px",
                                      color: "white",
                                    }}
                                  >
                                    Created your groupbuy! You may look for it in the estates below.
                                  </div>
                                  <h5 style={{ color: "black" }}>
                                    To create a new groupbuy, please refresh the
                                    page.
                              </h5>
                                </div>
                              ) : (
                                  <Button
                                    class="shadow-lg"
                                    style={{
                                      backgroundColor: "green",
                                      borderColor: "green",
                                      fontSize: "25px",
                                      cursor: "pointer",
                                    }}
                                    type="Submit"
                                  >
                                    Create Groupbuy
                                  </Button>
                                )}


                            </span>
                          </p>
                        </div>
                      ) : <Button
                        class="shadow-lg"
                        type="Submit"
                      >
                          Verify Phone Number
                      </Button>}
                    </Form>

                  </div>
                </div>
              ) : null}
              <br />
              <div
                style={{
                  display: (this.state.firebaseUser || !this.state.wantToVerify) ? "none" : "block",
                }}
              >
                <div
                  class="card shadow row"
                  style={{ width: "100%", padding: "20px", margin: "20px" }}>
                  <h2>Verify Person-In-Charge Mobile Number</h2>
                  <div style={{ fontSize: "80%", color: "grey", margin: "10px" }}>
                    PDPA stuff: You are managing this groupbuy so your mobile number will be publicly available to people who join the groupbuy (verified phone numbers only). It will not be used for any other purpose. We will permanently delete it from our database after you close the groupbuy.
                    <br />
                  </div>
                  <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                  />
                </div>
                <div id="recaptcha-container"></div>
                <br />
              </div>
              <div>

              </div>
              {/* Display groupbuy estates */}
              <div
                class="card shadow row"
                style={{ width: "100%", padding: "20px", margin: "20px" }}
              >
                <br />
                <h2>Join a Groupbuy for...</h2>
                <div>{dataToDisplay}</div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default withRouter(Groupbuy);
