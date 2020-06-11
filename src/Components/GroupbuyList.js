import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import { firebase, uiConfig } from "./Firestore";
import { Button } from "react-bootstrap";
import { db } from "./Firestore";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import update from "immutability-helper";
import { Groupbuy } from "./Groupbuy";

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

// This is an individual area's groupbuys. Redirected from Groupbuy.js with area name in URL params
// Retrieve separately from db instead of passing area data from Groupbuy.js
// This is to allow users accessing link directly to also have access to information
export class GroupbuyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryData: null,
      orderData: [], // each elt is an array that represents orderData for 1 groupbuy
      firebaseUser: true, // temporarily set to true, TODO: implement verification
      wantToVerify: false,
    };
    this.getDoc.bind(this)
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

  addItem = async (event) => {
    console.log("addItem");
    const idx = event.target.name; // this idx represents item index in specific groupbuy
    const groupBuyidx = event.currentTarget.dataset.idx
    // make a shallow copy of specific groupbuy's order data and update qty for the specific item
    let items = [...this.state.orderData[groupBuyidx]];
    items[idx] = parseInt(items[idx]) + 1;
    console.log(items);
    this.setState({
      totalPrice:
        parseFloat(this.state.totalPrice) +
        parseFloat(
          this.state.deliveryData[groupBuyidx].menuitem[idx].price
            ? this.state.deliveryData[groupBuyidx].menuitem[idx].price
            : 0
        ),
      orderData: update(this.state.orderData, {
        [groupBuyidx]: { $set: items },
      }),
    });
  };

  minusItem = async (event) => {
    console.log("minusItem");
    const idx = event.target.name; // this idx represents item index in specific groupbuy
    const groupBuyidx = event.currentTarget.dataset.idx // TODO: use
    // make a shallow copy of specific groupbuy's order data and update qty for the specific item
    let items = [...this.state.orderData[groupBuyidx]];
    items[idx] = items[idx] === 0
    ? 0
    : parseInt(items[idx]) - 1
    this.setState({
      // if customer did not order this item previously, do not change total price, keep # item at 0
      totalPrice:
        this.state.orderData[groupBuyidx] === 0.0
          ? this.state.totalPrice
          : parseFloat(this.state.totalPrice) -
          parseFloat(
            this.state.deliveryData[groupBuyidx].menuitem[idx].price
              ? this.state.deliveryData[groupBuyidx].menuitem[idx].price
              : 0
          ),
      orderData: update(this.state.orderData, {
        [groupBuyidx]: {
          $set: items,
        },
      }),
    });
  };

  getDoc = () => {
    return db
      .collection("groupbuy")
      .where(
        "area",
        "==",
        this.props.match.params.area
      )
      .get()
      .then(async (snapshot) => {
        // initialize deliveryData to array with length=# groupbuys, each elt = map containing info for specific groupbuy
        var dataToReturn = [];
        // initialize orderData to array with length=# groupbuys, each elt = array with length=# menuitems for the groupbuy
        var initOrderData = [];
        snapshot.forEach((d) => {
          console.log(d.data());
          dataToReturn.push(d.data())
          if (d.data().menuitem !== undefined) {
            initOrderData.push(new Array(d.data().menuitem.length).fill(0));
          } else {
            initOrderData.push([]);
          }
        });
        this.setState({
          deliveryData: dataToReturn,
          orderData: initOrderData,
        });
        console.log("initOrderData");
        console.log(initOrderData);
        return dataToReturn;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const idx = event.currentTarget.dataset.idx
    console.log("submit");
    // If no firebaseUser, submit button brings user to verify phone number
    // If there is a firebaseUser, user is verified and submit button creates Groupbuy
    if (!this.state.firebaseUser) {
      console.log("verifyPhoneNumber");
      // check that user has added item
      if (this.state.orderData[idx].length === 0) {
        alert("You must groupbuy at least 1 item");
        return;
      }
      this.setState({ wantToVerify: true });
    } else {
      // Create map of item index to qty ordered for items that have non-zero qty ordered
      // Item index represents index of item in menuItems array, can skip
      let finalItems = this.state.orderData[idx].filter((data, index) => {
        console.log("mapping finalItems")
        console.log(data);
        if (data > 0) {
          var thisItem = { index: data };
          console.log(thisItem);
          return (thisItem)
        }
      });
      if (finalItems.length === 0) {
        alert("You must groupbuy at least 1 item");
        return;
      }
      console.log("submitOrder");

      var newBuyer = {
        contact: this.state.firebaseUser.phoneNumber,
        items: finalItems,
      };
      // 1. Update buyers in groupbuy collection
      // 2. For each item ordered, update numBuyers in menuitem

      // db.collection("groupbuy") // TODO: save docId of each groupbuy in deliveryData and use to retrieve to update
      //   .where("categories", "array-contains-any", categories)
      //   .add(newGroupbuy)
      //   .then( (docRef) => {
      //     console.log("submitted, docref:");
      //     console.log(docRef);
      //     this.setState({ submitted: true });
      //     return docRef.id;
      //   })
      //   .catch(function (error) {
      //     console.error("Error adding document: ", error);
      //   });

    }
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


  handleExpand = async (event) => {
    event.preventDefault();
    console.log("handleExpand");
    const idx = event.currentTarget.dataset.idx
    // Get current groupbuy and 
    let newGroupbuy = this.state.deliveryData[idx];
    // Reverse expanded status of current groupbuy
    newGroupbuy.expanded = !newGroupbuy.expanded;
    // Set state to update this groupbuy's expanded status
    this.setState({
      deliveryData: update(this.state.deliveryData, {
        [idx]: { $set: newGroupbuy },
      }),
    });
    //this.setState({ expanded: !this.state.expanded });
  };

  render() {
    let dataToDisplay = []
    if (this.state.deliveryData !== null) {
      dataToDisplay = this.state.deliveryData.map((data, index) => {
        return (
          <div>
            <div>
              <div
                onClick={this.handleExpand.bind(this)}
                data-idx={index}
                style={{ cursor: "pointer" }}>
                {data.name} {data.active === false ? (<b>(Not Active)</b>) : null}
                <br />
              </div>
              {/* Display menu items available */}
              <div class="row">
                {(data.expanded === true && data.menuitem !== undefined) ? (
                  data.menuitem.map((item, menuIndex) =>
                    <div>
                      {/* <div>{item.name}: ${item.price}</div>
                    <div>Buyers: {item.numBuyers}</div>
                    <br /> */}
                      {/* // Nice display of menu items */}
                      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <figure
                          class="shadow row"
                          style={{
                            margin: "20px",
                            minHeight: "100px",
                            backgroundColor: "#f1f1f1",
                            "border-radius": "5px",
                            position: "relative",
                            display: "flex",
                            padding: "10px 40px 40px",
                            width: "300px",
                          }}
                        >
                          <div class="row">
                            <span
                              style={{
                                alignContent: "right",
                                fontSize: "110%",
                                display: "flex",
                              }}
                            >
                              <b>
                                {item.name !== "" && item.price !== "" ? (
                                  <span>
                                    {item.name}
                                    {/* {element && element.description ? (
                                      <span> ({element.description})</span>
                                    ) : null} */}
                                    <span style={{ fontSize: "60%" }}> <br />({item.numBuyers} people buying)</span>
                                  </span>
                                ) : null}
                              </b>
                            </span>
                            <div class="row">
                              <div
                                class="col"
                                style={{
                                  position: "absolute",
                                  left: "5px",
                                  bottom: "13px",
                                }}
                              >
                                <span
                                  class="shadow badge badge-info m-2"
                                  style={{
                                    backgroundColor: "#b48300",
                                    alignContent: "left",
                                    fontSize: "110%",
                                  }}
                                >
                                  ${item.price ? item.price : "TBD"}
                                </span>
                              </div>
                              <div
                                class="col"
                                style={{
                                  position: "absolute",
                                  left: "10px",
                                  bottom: "10px",
                                }}
                              >
                                <div
                                  class="btn-group float-right"
                                  role="group"
                                  aria-label="Basic example"
                                >
                                  <br />
                                  {this.state.firebaseUser ? (
                                    <div>
                                      <Button
                                        variant="light"
                                        size="sm"
                                        onClick={this.minusItem}
                                        data-idx={index} // represents index of groupbuy
                                        name={menuIndex}
                                        className="shadow-sm"
                                        style={{
                                          backgroundColor: "white",
                                          color: "black",
                                          "border-radius": "3px",
                                          margin: "10px",
                                        }}
                                      >
                                        -
                          </Button>
                                      <span
                                        style={{
                                          margin: "10px",
                                        }}
                                      >
                                        <b>
                                          {this.state.orderData[index][menuIndex] !== undefined
                                            ? this.state.orderData[index][
                                            JSON.parse(JSON.stringify(menuIndex))
                                            ]
                                            : 0}
                                        </b>
                                      </span>
                                      <Button
                                        variant="dark"
                                        size="sm"
                                        onClick={this.addItem}
                                        data-idx={index} // represents index of groupbuy
                                        name={menuIndex}
                                        className="shadow-sm"
                                        style={{
                                          backgroundColor: "black",
                                          color: "white",
                                          "border-radius": "3px",
                                          margin: "10px",
                                        }}
                                      >
                                        +
                          </Button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <br />
                          </div>
                        </figure>
                      </div>
                    </div>
                  )
                ) : null}
              </div>

              {(data.expanded === true && data.menuitem !== undefined && data.buyers !== undefined) ? (
                // Display general information about this groupbuy
                <div>
                  <div>
                    Total Number of buyers: {data.buyers.length}
                    <br />
                Total Groupbuy Size: ??
                </div>
                  {/* Show firebase verification status */}
                  {this.state.firebaseUser ? (
                    <div
                      style={{ color: "green" }}>
                      <p>
                        Verified Mobile Number To Order With:{" "}
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
                                Submitted your order! Please PayNow/PayLah to 9xxxxxxx and upload a screenshot here.
                                  </div>
                              <h5 style={{ color: "black" }}>
                                To order from another groupbuy or update your order, please refresh the
                                page.
                              </h5>
                            </div>
                          ) : (
                              <Button
                                class="shadow-lg"
                                onClick={this.handleSubmit}
                                data-idx={index}
                                style={{
                                  backgroundColor: "green",
                                  borderColor: "green",
                                  fontSize: "25px",
                                  cursor: "pointer",
                                }}
                              //type="Submit"
                              >
                                Place Your Order
                              </Button>
                            )}


                        </span>
                      </p>
                    </div>
                  ) : (<Button
                    class="shadow-lg"
                    onClick={this.handleSubmit}
                    data-idx={index}
                  //type="Submit"
                  >
                    Verify Phone Number
                  </Button>)}
                  <br />
                </div>
              ) : null}
              <hr
                style={{
                  color: "#b48300",
                  backgroundColor: "#b48300",
                  height: "1px",
                  borderColor: "#b48300",
                  width: "100%",
                  alignItems: "center",
                }}
              />
            </div>
            <br />

          </div >
        );
      });
    }
    return (
      <div
        style={{
          "padding-top": "80px",
        }}>
        {/* Back button */}
        < Button
          onClick={() => this.props.history.push('/groupbuy')}
          style={{
            cursor: "pointer",
          }}>
          Back to All Groupbuys
          </Button >
        <h1>{this.props.match.params.area}</h1>
        <hr
          style={{
            color: "#b48300",
            backgroundColor: "#b48300",
            height: "1px",
            borderColor: "#b48300",
            width: "100%",
            alignItems: "center",
          }}
        />
        {/* Let user verify phone number */}
        <div
          style={{
            display: (this.state.firebaseUser || !this.state.wantToVerify) ? "none" : "block",
          }}
        >
          <div
            class="card shadow row"
            style={{ width: "100%", padding: "20px", margin: "20px" }}>
            <h2>Verify Mobile Number To Order With</h2>
            <div style={{ fontSize: "80%", color: "grey", margin: "10px" }}>
              PDPA stuff: You are ordering from this groupbuy so your mobile number will be available to the person in charge of the groupbuy for organising and contacting you. It will not be used for any other purpose.
    </div>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
          <div id="recaptcha-container"></div>
          <br />
        </div>
        {dataToDisplay}
      </div >
    );
  }
}



export default withRouter(GroupbuyList);
