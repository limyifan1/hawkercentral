import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import firebase from "./Firestore";
import { Form, Button } from "react-bootstrap";
import { db } from "./Firestore";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import driver from "../driver.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const analytics = firebase.analytics();

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
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
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

const updateData = async ({ driver_contact, id, paynow_alternate }) => {
  let now = new Date();
  var field = {
    driver_contact: driver_contact ? driver_contact : "",
    timeaccepted: now,
    paynow_alternate: paynow_alternate ? paynow_alternate : "",
  };
  await db
    .collection("deliveries")
    .doc(id)
    .update(field)
    .then(function (docRef) {
      return docRef.id;
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  return id;
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
      driver_contact: cookies.get("driver_contact")
        ? cookies.get("driver_contact")
        : "",
      payment: cookies.get("payment") ? cookies.get("payment") : "",
      paynow_alternate: cookies.get("paynow_alternate")
        ? cookies.get("paynow_alternate")
        : "",
    };
  }

  componentWillMount() {
    onLoad("find_delivery");
    if (this.state.cancel) {
      this.cancelDoc();
    }
  }

  cancelDoc = async () => {
    await db
      .collection("deliveries")
      .doc(this.state.cancel)
      .get()
      .then(async (snapshot) => {
        if (snapshot.exists) {
          snapshot.ref.update({ cancelled: true });
          this.cancelData({ message_id: snapshot.data().message_id });
        }
      });
  };

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
        if (
          !snapshot.data().viewed &&
          !snapshot.data().cancelled &&
          !snapshot.data().expired
        ) {
          await db
            .collection("deliveries")
            .doc(this.state.id)
            .update({ viewed: true })
            .then(async (d) => {
              await this.sendData({
                message_id: snapshot.data().message_id,
                driver_mobile: this.state.driver_contact,
                requester_mobile: snapshot.data().contact,
                customer_mobile: snapshot.data().contact_to,
                origin: snapshot.data().unit + " " + snapshot.data().street,
                destination:
                  snapshot.data().unit_to + " " + snapshot.data().street_to,
                time:
                  snapshot.data().time &&
                  typeof snapshot.data().time !== "string"
                    ? dayName[snapshot.data().time.toDate().getDay()] +
                      " " +
                      snapshot.data().time.toDate().getDate() +
                      " " +
                      monthNames[snapshot.data().time.toDate().getMonth()] +
                      " " +
                      formatAMPM(snapshot.data().time.toDate())
                    : null,
                note: snapshot.data().note,
                cost: snapshot.data().cost,
                arrival: snapshot.data().arrival
              });
            });
        }
        return true;
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

  sendData = async (query) => {
    let urls = [
      "https://asia-east2-hawkercentral.cloudfunctions.net/telegramEdit",
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
    cookies.set("driver_contact", this.state.driver_contact, { path: "/" });
    cookies.set("paynow_alternate", this.state.paynow_alternate, { path: "/" });
    cookies.set("payment", this.state.payment, { path: "/" });
    await this.getDoc().then(async () => {
      if (!this.state.data.viewed) {
        await updateData({
          id: this.state.id,
          driver_contact: this.state.driver_contact,
          paynow_alternate: this.state.paynow_alternate,
        });
      }
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
      this.setState({ [name]: value });
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
                  <h2>You have successfully cancelled the request</h2>
                ) : (
                  <div>
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
                        <div class="form-check create-title">
                          <label class="checkbox-inline">
                            <input
                              onChange={this.handleChange}
                              type="checkbox"
                              checked={this.state.payment}
                              value={this.state.payment}
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
