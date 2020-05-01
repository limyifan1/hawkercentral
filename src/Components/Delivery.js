import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import name from "../logo-brown.png";
import firebase from "./Firestore";
import { Form, Button } from "react-bootstrap";
import { db } from "./Firestore";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import driver from "../driver.png";

const analytics = firebase.analytics();

function onLoad(name) {
  analytics.logEvent(name);
}

const addData = async ({ driver_contact }) => {
  let now = new Date();
  var field = {
    driver_contact: driver_contact,
    timeaccepted: now,
  };
  let id = await db
    .collection("deliveries")
    .add(field)
    .then(function (docRef) {
      return docRef.id;
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  return id;
};

export class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postal: "",
      latitude: "",
      longitude: "",
      latitude_to: "",
      longitude_to: "",
      street: "",
      street_to: "",
      cost: "",
      distance: "",
      unit: "",
      unit_to: "",
      contact: "",
      contact_to: "",
      retrieved: false,
      id: queryString.parse(this.props.location.search).id,
      pickup_option: false,
      submitted: false,
      driver_contact: "",
    };
  }

  callPostal = (postal) => {
    return fetch(
      "https://developers.onemap.sg/commonapi/search?searchVal=" +
        postal +
        "&returnGeom=Y&getAddrDetails=Y"
    )
      .then(function (response) {
        return response.json();
      })
      .then(
        function (jsonResponse) {
          if (
            jsonResponse !== undefined &&
            jsonResponse["results"] !== undefined
          ) {
            return jsonResponse["results"][0];
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  componentWillMount() {
    onLoad("find_driver");
  }

  getDoc = async () => {
    await db
      .collection("deliveries")
      .doc(this.state.id)
      .get()
      .then(async (snapshot) => {
        if (snapshot.exists) {
          this.setState({ data: snapshot.data(), retrieved: true });
        }
        onLoad("info_load", snapshot.data().name);
        if (!snapshot.data().viewed) {
          await db
            .collection("deliveries")
            .doc(this.state.id)
            .update({ viewed: true })
            .then((d) => {});
          await this.sendData({
            message_id: snapshot.data().message_id,
            driver_mobile: this.state.driver_contact,
            requester_mobile: snapshot.data().contact,
          });
        }
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendData = async (query) => {
    let urls = [
      "https://us-central1-hawkercentral.cloudfunctions.net/telegramEdit",
    ];
    try {
      Promise.all(
        urls.map((url) =>
          fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(query),
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              return data;
            })
            .catch((error) => {
              console.log(error);
              return error;
            })
        )
      ).then((data) => {
        // window.location.reload();
      });
    } catch (error) {
      return error;
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ submitted: true });
    await this.getDoc().then(async () => {
      if (!this.state.data.viewed) {
        await addData({
          driver_contact: this.state.driver_contact,
        });
      }
    });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <div
          class="jumbotron"
          style={{
            "padding-top": "70px",
            "padding-bottom": "240px",
            height: "100%",
            "background-color": "white",
          }}
        >
          <div class="container-fluid col-md-10 content col-xs-offset-2">
            <div class="row justify-content-center">
              <div
                class="card shadow row"
                style={{ width: "100%", padding: "20px" }}
              >
                <img src={driver} alt="" style={{ width: "100%" }} />

                {!this.state.submitted ? (
                  <Form onSubmit={this.handleSubmit.bind(this)}>
                    <br />
                    <label for="unit">Mobile Number:</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">
                          +65
                        </span>
                      </div>
                      <input
                        onChange={this.handleChange}
                        value={this.state.driver_contact}
                        type="number"
                        class="form-control"
                        name="driver_contact"
                        placeholder="9xxxxxxx"
                        required
                      ></input>
                    </div>
                    <br />
                    <Button
                      class="shadow-lg"
                      style={{
                        backgroundColor: "green",
                        borderColor: "green",
                        fontSize: "25px",
                      }}
                      type="Submit"
                    >
                      Accept Order
                    </Button>
                  </Form>
                ) : this.state.retrieved ? (
                  <div>
                    {!this.state.data.viewed ? (
                      <div>
                        <br />
                        <h3>
                          Congratulations, you got the order!
                          <br />
                        </h3>
                        <br />
                        <h5>
                          Please take a screenshot of this page as the following
                          information will be deleted after refresh.{" "}
                        </h5>
                        <br />
                        <b>Delivery From:</b> {this.state.data.unit}{" "}
                        <a
                          href={
                            "https://maps.google.com/?q=" +
                            this.state.data.street
                          }
                        >
                          {this.state.data.street}
                        </a>
                        <br />
                        <b>Delivery To:</b> {this.state.data.unit_to}{" "}
                        <a
                          href={
                            "https://maps.google.com/?q=" +
                            this.state.data.street_to
                          }
                        >
                          {this.state.data.street_to}
                        </a>
                        <br />
                        <b>Hawker Contact:</b> {this.state.data.contact}
                        <br />
                        <b>Customer Contact:</b> {this.state.data.contact_to}
                        <br />
                        <b>Distance:</b> {this.state.data.distance.slice(0, 4)}
                        km
                        <br />
                        <b>Estimated Fee:</b> $
                        {this.state.data.cost.slice(0, 4)}
                        <br /> <br />
                        <b>
                          <h4>
                            Contact the hawker directly to arrange delivery
                          </h4>
                        </b>
                        <br /> <br />
                        <small>
                          For technical problems, please email us at
                          foodleh@outlook.com
                        </small>
                      </div>
                    ) : (
                      <div>
                        {
                          <h3>
                            {" "}
                            <br />
                            <br />
                            Sorry, someone has already taken the order
                            <br />
                          </h3>
                        }
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <br />
                    <br />
                    <h3>Loading</h3>
                    <Spinner class="" animation="grow" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Driver);