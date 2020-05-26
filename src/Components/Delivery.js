import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import { firebase, uiConfig } from "./Firestore";
import { Form, Button } from "react-bootstrap";
import { db } from "./Firestore";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import driver from "../driver.png";
import Cookies from "universal-cookie";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
const cookies = new Cookies();

const analytics = firebase.analytics();

function getPhoneNumberFromUserInput() {
  return document.getElementById("phone-number").value;
}

function onLoad(name) {
  analytics.logEvent(name);
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const dayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const updateData = async ({ viewed, driver_contact, id, paynow_alternate }) => {
  let now = new Date();
  var field = {
    viewed: viewed,
    driver_contact: driver_contact ? driver_contact : "",
    timeaccepted: now,
    paynow_alternate: paynow_alternate ? paynow_alternate : "",
  };
  return db
    .collection("deliveries")
    .doc(id)
    .update(field)
    .then(function (docRef) {
      return docRef.id;
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

export class Delivery extends React.Component {
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
      cancel: queryString.parse(this.props.location.search).cancel,
      pickup_option: false,
      submitted: false,
      submitting: false,
      firebaseUser: null,
      driver_contact: cookies.get("driver_contact")
        ? cookies.get("driver_contact")
        : "",
      driver_name: cookies.get("driver_name") ? cookies.get("driver_name") : "",
      payment: cookies.get("payment") ? cookies.get("payment") : "",
      paynow_alternate: cookies.get("paynow_alternate")
        ? cookies.get("paynow_alternate")
        : "",
    };
  }

  componentDidMount() {
    // Set up Firebase reCAPTCHA
    // To apply the default browser preference instead of explicitly setting it.
    firebase.auth().useDeviceLanguage();
    console.log(firebase.auth().languageCode);

    if (!this.state.cancel) {
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
              driver_contact: user.phoneNumber.slice(3),
            });
          } else {
            // No user is signed in.
          }
        }.bind(this)
      );
    }
  }

  componentWillMount() {
    onLoad("find_delivery");
    if (this.state.cancel) {
      this.cancelDoc();
    }
  }

  cancelDoc = async () => {
    this.setState({ loadingCancel: true });
    await db
      .collection("deliveries")
      .doc(this.state.cancel)
      .get()
      .then((snapshot) => {
        console.log(snapshot.data());
        if (snapshot.data().viewed === true) {
          this.setState({ cancel: "denied", loadingCancel: false });
        } else {
          snapshot.ref.update({ cancelled: true });
          this.setState({ loadingCancel: false });
          this.cancelData({ data: snapshot.data() });
        }
      });
  };

  getDoc = () => {
    return db
      .collection("deliveries")
      .doc(this.state.id)
      .get()
      .then(async (snapshot) => {
        this.setState({ data: snapshot.data(), retrieved: true });
        return snapshot.data();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  cancelData = async (query) => {
    let urls = [
      "https://asia-east2-hawkercentral.cloudfunctions.net/telegramCancel",
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

  sendData = (query) => {
    let urls = [
      "https://asia-east2-hawkercentral.cloudfunctions.net/telegramEdit",
    ];
    try {
      return Promise.all(
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
        console.log("Message Requested");
      });
    } catch (error) {
      return error;
    }
  };

  handleVerify = async (event) => {
    event.preventDefault();
    //cookies.set("driver_contact", this.state.driver_contact, { path: "/" });
    // Handle Firebase phone number-OTP verification
    var phoneNumber = getPhoneNumberFromUserInput();
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent
        window.confirmationResult = confirmationResult;
      })
      .catch(function (error) {
        // Error; SMS not sent
        // Reset reCAPTCHA so user can try again
        console.log("error, sms not sent");
      });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      driver_contact: this.state.firebaseUser.phoneNumber.slice(3),
      submitting: true,
    });
    cookies.set("driver_contact", this.state.driver_contact, { path: "/" });
    cookies.set("driver_name", this.state.driver_name, { path: "/" });
    cookies.set("paynow_alternate", this.state.paynow_alternate, { path: "/" });
    cookies.set("payment", this.state.payment, { path: "/" });
    this.getDoc()
      .then(async (data) => {
        if (!data.viewed && !data.cancelled && !data.expired) {
          await updateData({
            viewed: true,
            id: this.state.id,
            driver_contact: this.state.driver_contact,
            driver_name: this.state.driver_name,
            paynow_alternate: this.state.paynow_alternate,
          }).then(async (d) => {
            await this.sendData({
              foodleh_id: data.message_id.foodleh,
              deliverysg_id: data.message_id.deliverysg,
              driver_mobile: this.state.driver_contact,
              driver_name: this.state.driver_name,
              requester_mobile: data.contact,
              customer_mobile: data.contact_to,
              // origin: data.unit + " " + data.street,
              // destination: data.unit_to + " " + data.street_to,
              origin: data.street,
              destination: data.street_to,
              time:
                data.time && typeof data.time !== "string"
                  ? dayName[data.time.toDate().getDay()] +
                    " " +
                    data.time.toDate().getDate() +
                    " " +
                    monthNames[data.time.toDate().getMonth()] +
                    " " +
                    formatAMPM(data.time.toDate())
                  : null,
              note: data.note,
              cost: data.cost,
              arrival: data.arrival,
              duration: data.duration,
              paynow_alternate: this.state.paynow_alternate,
            });
          });
        }
      })
      .then((d) => {
        this.setState({
          submitted: true,
          submitting: false,
        });
      });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "payment") {
      const checked = target.checked;
      this.setState({ [name]: checked });
    } else {
      this.setState({
        [name]: value,
      });
    }
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
            <div class="d-flex row justify-content-center">
              <img
                src={driver}
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
              <div
                class="card shadow row"
                style={{ width: "100%", padding: "20px", margin: "20px" }}
              >
                {this.state.cancel ? (
                  this.state.loadingCancel ? (
                    <div class="d-flex row justify-content-center">
                      <Spinner class="" animation="grow" />
                    </div>
                  ) : this.state.cancel === "denied" ? (
                    <h2>
                      A driver has already picked up this order. Please contact
                      him/her to cancel.
                    </h2>
                  ) : (
                    <h2>You have successfully cancelled the request</h2>
                  )
                ) : (
                  <div>
                    {!this.state.submitted ? (
                      <Form onSubmit={this.handleSubmit.bind(this)}>
                        {/* <br />
                        <label for="unit">Your Name:</label>
                        <div class="input-group">
                          <input
                            onChange={this.handleChange}
                            value={this.state.driver_name}
                            type="text"
                            class="form-control"
                            name="driver_name"
                            placeholder="e.g. Tan Xiao Ming"
                            required
                          ></input>
                        </div> */}
                        {/* <br />
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
                        </div> */}
                        <br />

                        {/* Separate handler for verifying mobile number with OTP */}
                        {/* Check if user is already logged in with Firebase */}
                        <div
                          style={{
                            display: this.state.firebaseUser ? "none" : "block",
                          }}
                        >
                          <div>
                            <p>Verify Mobile Number</p>
                            <StyledFirebaseAuth
                              uiConfig={uiConfig}
                              firebaseAuth={firebase.auth()}
                            />
                          </div>
                          <div id="recaptcha-container"></div>
                          <br />
                        </div>
                        <br />
                        {this.state.firebaseUser ? (
                          <div>
                            <p>
                              Already verified phone number:{" "}
                              {this.state.firebaseUser.phoneNumber}
                            </p>
                          </div>
                        ) : null}

                        <label for="unit">Your Name:</label>
                        <div class="input-group">
                          <input
                            onChange={this.handleChange}
                            value={this.state.driver_name}
                            type="text"
                            class="form-control"
                            name="driver_name"
                            placeholder="e.g. Tan Xiao Ming"
                            required
                          ></input>
                        </div>
                        <br />
                        <div class="form-check create-title">
                          <label class="checkbox-inline">
                            <input
                              onChange={this.handleChange}
                              type="checkbox"
                              checked={this.state.payment}
                              // value={this.state.payment}
                              name="payment"
                              class="form-check-input"
                            ></input>
                            Prefer a different PayNow number/UEN?
                          </label>
                          <br />
                        </div>
                        {this.state.payment ? (
                          <div class="input-group">
                            <input
                              onChange={this.handleChange}
                              value={this.state.paynow_alternate}
                              type="number"
                              class="form-control"
                              name="paynow_alternate"
                              placeholder="UEN/PayNow Number"
                            ></input>
                          </div>
                        ) : null}
                        <br />
                        {this.state.submitting ? (
                          <Spinner class="" animation="grow" />
                        ) : (
                          <Button
                            class="shadow-lg"
                            disabled={this.state.firebaseUser === null}
                            style={{
                              backgroundColor: !(
                                this.state.firebaseUser === null
                              )
                                ? "green"
                                : "grey",
                              borderColor: !(this.state.firebaseUser === null)
                                ? "green"
                                : "grey",
                              fontSize: "25px",
                              cursor: !(this.state.firebaseUser === null)
                                ? "pointer"
                                : "not-allowed",
                            }}
                            type="Submit"
                          >
                            Accept Order
                          </Button>
                        )}
                      </Form>
                    ) : this.state.retrieved ? (
                      <div>
                        {!this.state.data.viewed &&
                        !this.state.data.expired &&
                        !this.state.data.cancelled ? (
                          <div>
                            <br />
                            <h3>
                              Congratulations, you got the order!
                              <br />
                            </h3>
                            <br />
                            <h5>
                              Please take a screenshot of this page as the
                              following information will be deleted after
                              refresh.{" "}
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
                            <b>Customer Contact:</b>{" "}
                            {this.state.data.contact_to}
                            <br />
                            {this.state.data.time ? (
                              <div>
                                <b>Pickup Time:</b>
                                {dayName[
                                  this.state.data.time.toDate().getDay()
                                ] +
                                  " " +
                                  this.state.data.time.toDate().getDate() +
                                  " " +
                                  monthNames[
                                    this.state.data.time.toDate().getMonth()
                                  ] +
                                  " " +
                                  formatAMPM(this.state.data.time.toDate())}
                              </div>
                            ) : null}
                            <b>Note from Requester:</b> {this.state.data.note}
                            <br />
                            <b>Distance:</b> {this.state.data.distance}
                            <br />
                            {this.state.data.duration ? (
                              <div>
                                <b>Est. Duration:</b> {this.state.data.duration}
                                <br />{" "}
                              </div>
                            ) : null}
                            {this.state.data.arrival ? (
                              <div>
                                <b>Est. Arrival Time:</b>{" "}
                                {this.state.data.arrival}
                                <br />{" "}
                              </div>
                            ) : null}
                            <b>Estimated Fee:</b> ${this.state.data.cost}
                            <br /> <br />
                            <b>
                              <h4>
                                Contact the hawker directly to arrange delivery.
                                Provide last 4 digits of customer number.
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
                            {this.state.data.viewed ? (
                              <h3>
                                <br />
                                <br />
                                Sorry, someone has already taken the order
                                <br />
                              </h3>
                            ) : (
                              <h3>
                                <br />
                                <br />
                                Sorry, this order has expired
                                <br />
                              </h3>
                            )}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Delivery);
