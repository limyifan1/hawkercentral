import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import firebase from "./Firestore";
import { Form, Modal, Spinner } from "react-bootstrap";
import { db } from "./Firestore";
import driver from "../driver.png";
import question from "../question.png";
import store_address from "../store_address.png";
import delivery_address from "../delivery_address.png";
import summary from "../summary.png";
import instructions from "../infographic.jpg";
import check_rates from "../check-delivry-rates.png";
import Cookies from "universal-cookie";
import Helpers from "../Helpers/helpers";
import GetApp from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import queryString from "query-string";
const cookies = new Cookies();
const API_KEY = `${process.env.REACT_APP_GKEY}`;
const analytics = firebase.analytics();

function onLoad(name) {
  analytics.logEvent(name);
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

const addData = async ({
  postal,
  latitude,
  longitude,
  latitude_to,
  longitude_to,
  street,
  street_to,
  cost,
  distance,
  unit,
  unit_to,
  contact,
  contact_to,
  time,
  note,
  arrival,
  duration,
}) => {
  let now = new Date();
  var field = {
    postal: postal,
    latitude: latitude,
    longitude: longitude,
    latitude_to: latitude_to,
    longitude_to: longitude_to,
    street: street,
    street_to: street_to,
    cost: cost,
    distance: distance,
    unit: unit,
    unit_to: unit_to,
    contact: contact,
    contact_to: contact_to,
    lastmodified: now,
    viewed: false,
    time: time,
    note: note,
    expired: false,
    cancelled: false,
    arrival: arrival,
    duration: duration,
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

const time_now = new Date();
time_now.setHours(time_now.getHours() + 1);
// var time_now_plus = time_now.toLocaleString('en-US')

export class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postal: queryString.parse(this.props.location.search).postal ? queryString.parse(this.props.location.search).postal : (cookies.get("postal") ? cookies.get("postal") : ""),
      postal_to: queryString.parse(this.props.location.search).postal_to ? queryString.parse(this.props.location.search).postal_to : '',
      latitude: "",
      longitude: "",
      latitude_to: "",
      longitude_to: "",
      street: queryString.parse(this.props.location.search).street ? queryString.parse(this.props.location.search).street : (cookies.get("street") ? cookies.get("street") : ""),
      street_to: queryString.parse(this.props.location.search).street_to ? queryString.parse(this.props.location.search).street_to : '',
      cost: "",
      distance: "",
      unit: queryString.parse(this.props.location.search).unit ? queryString.parse(this.props.location.search).unit : (cookies.get("unit") ? cookies.get("unit") : ""),
      unit_to: queryString.parse(this.props.location.search).unit_to ? queryString.parse(this.props.location.search).unit_to : '',
      contact: queryString.parse(this.props.location.search).contact ? queryString.parse(this.props.location.search).contact : (cookies.get("contact") ? cookies.get("contact") : ""),
      contact_to: queryString.parse(this.props.location.search).contact_to ? queryString.parse(this.props.location.search).contact_to : '',
      time: time_now.getHours() + ":" + time_now.getMinutes(),
      date: time_now,
      datetime: time_now,
      note: cookies.get("note") ? cookies.get("note") : "",
      pickup_option: false,
      submitted: false,
      show: false,
      directions: false,
      loadingDir: false,
      loadingMap: false,
      retrievedDir: false,
      retrievedMap: false,
      regionFrom: "",
      planningDetails: "",
    };
  }

  getMap = async () => {
    this.setState({ loadingMap: true });
    var regionFrom = await Helpers.postalPlanningRegion(this.state.postal);
    var regionTo;
    var cost;
    if (this.state.postal_to) {
      regionTo = await Helpers.postalPlanningRegion(this.state.postal_to);
      cost = await Helpers.getPlanningDetails(
        regionFrom.planningarea,
        regionTo.planningarea
      );
    }
    this.setState({
      cost: cost ? cost : null,
      regionFrom: regionFrom,
      loadingMap: false,
      retrievedMap: true,
    });
  };

  getDirections = async () => {
    this.setState({ loadingDir: true });
    var regionFrom = await Helpers.postalPlanningRegion(this.state.postal);
    var regionTo = await Helpers.postalPlanningRegion(this.state.postal_to);
    var cost = await Helpers.getPlanningDetails(
      regionFrom.planningarea,
      regionTo.planningarea
    );
    const query =
      "https://fathomless-falls-12833.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?" +
      "mode=driving" +
      "&" +
      "region=sg" +
      "&" +
      "units=metric" +
      "&" +
      "origin=" +
      this.state.street +
      "&" +
      "destination=" +
      this.state.street_to +
      "&departure_time=" +
      parseInt(this.state.datetime.valueOf() / 1000) +
      "&" +
      "key=" +
      API_KEY;

    return fetch(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
    })
      .then((response) => {
        return response.json();
      })
      .then((contents) => {
        if (cost) {
          var distance =
            contents && contents.routes.length > 0
              ? contents.routes[0].legs[0].distance.value
              : 0;
          this.setState({
            cost: cost,
            directions: contents,
            distance: distance,
            loadingDir: false,
            retrievedDir: true,
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error.toString());
      });
  };

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

  sendData = async (query) => {
    let urls = [
      "https://asia-east2-hawkercentral.cloudfunctions.net/telegramSend",
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

  async getPostal(postal, direction) {
    // event.preventDefault();
    let data = await this.callPostal(postal);
    if (data !== undefined) {
      if (direction === "to") {
        this.setState({
          street_to: data["ADDRESS"],
          longitude_to: data["LONGITUDE"],
          latitude_to: data["LATITUDE"],
        });
      } else {
        this.setState({
          street: data["ADDRESS"],
          longitude: data["LONGITUDE"],
          latitude: data["LATITUDE"],
        });
      }
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ submitting: true });
    if (this.state.datetime < time_now) {
      alert(
        "Time cannot be less than 1 hour from now取食物时间必须至少在30分钟后"
      );
    }
    if (!this.state.retrievedDir) {
      alert("Please wait for directions to load");
    }
    await this.getPostal(this.state.postal_to, "to");
    await this.getPostal(this.state.postal, "from");
    cookies.set("postal", this.state.postal, { path: "/" });
    cookies.set("street", this.state.street, { path: "/" });
    cookies.set("unit", this.state.unit, { path: "/" });
    cookies.set("contact", this.state.contact, { path: "/" });
    cookies.set("note", this.state.note, { path: "/" });
    var arrival = new Date(this.state.datetime);
    arrival.setMinutes(
      arrival.getMinutes() +
        15 +
        this.state.directions.routes[0].legs[0].duration.value / 60
    );
    arrival =
      dayName[arrival.getDay()] +
      " " +
      arrival.getDate() +
      " " +
      monthNames[arrival.getMonth()] +
      " " +
      formatAMPM(arrival);
    await addData({
      origin: this.state.street,
      destination: this.state.street_to,
      distance: this.state.directions.routes[0].legs[0].distance.text,
      cost: this.state.cost,
      postal: this.state.postal,
      postal_to: this.state.postal_to,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitude_to: this.state.latitude_to,
      longitude_to: this.state.longitude_to,
      street: this.state.street,
      street_to: this.state.street_to,
      unit: this.state.unit,
      unit_to: this.state.unit_to,
      contact: this.state.contact,
      contact_to: this.state.contact_to,
      time: this.state.datetime,
      note: this.state.note,
      arrival: arrival,
      duration: this.state.directions.routes[0].legs[0].duration.text,
    }).then(async (id) => {
      await this.sendData({
        origin: this.state.street,
        destination: this.state.street_to,
        distance: this.state.directions.routes[0].legs[0].distance.text,
        requester_mobile: this.state.contact,
        cost: "$" + this.state.cost,
        id: id,
        url: "www.foodleh.app/delivery?id=" + id,
        time:
          dayName[this.state.datetime.getDay()] +
          " " +
          this.state.datetime.getDate() +
          " " +
          monthNames[this.state.datetime.getMonth()] +
          " " +
          formatAMPM(this.state.datetime),
        duration: this.state.directions.routes[0].legs[0].duration.text,
        arrival: arrival,
      }).then((d) => {
        this.setState({ submitted: true, submitting: false });
      });
    });
  };

  componentWillMount() {
    this.getMap();
    onLoad("find_driver");
  }

  componentDidMount() {
    // this.setState({time: time_now})
  }

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

  handleChange = async (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "postal" && value.toString().length === 6) {
      await this.getPostal(value, "from");
      await this.getMap();
    }
    if (name === "postal_to" && value.toString().length === 6) {
      await this.getPostal(value, "to");
    }
    if (
      (name === "postal" || name === "postal_to") &&
      this.state.street !== "" &&
      this.state.street_to !== ""
    ) {
      this.getDirections();
    }
    this.setState({ [name]: value });
  };

  setShow = () => {
    this.setState({ show: true });
  };

  setHide = () => {
    this.setState({ show: false });
  };

  render() {
    var arrival;
    if (
      this.state.retrievedDir &&
      this.state.directions &&
      this.state.directions.routes.length > 0
    ) {
      arrival = new Date(this.state.datetime);
      arrival.setMinutes(
        arrival.getMinutes() +
          15 +
          this.state.directions.routes[0].legs[0].duration.value / 60
      );
    }
    return (
      <div>
        <Modal
          size="xl"
          onHide={this.setHide}
          show={this.state.show}
          className="modal"
          dialogClassName="modal-dialog modal-100w modal-dialog-centered"
          style={{ marginTop: "30px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              How DriverLeh? Works
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={instructions}
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </Modal.Body>
        </Modal>

        <div
          class="jumbotron"
          style={{
            "padding-top": "70px",
            "padding-bottom": "240px",
            height: "100%",
            "background-color": "white",
          }}
        >
          <div class="align-items-center" style={{ width: "100%" }}></div>

          <Form onSubmit={this.handleSubmit.bind(this)}>
            <div class="container-fluid col-md-10 content col-xs-offset-2">
              <div class="d-flex row justify-content-center">
                <img
                  src={driver}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
                <div class="row" style={{ marginTop: "10px" }}>
                  <div style={{ padding: "10px", width: "100%" }}>
                    <hr
                      style={{
                        color: "orange",
                        backgroundColor: "orange",
                        height: 5,
                        width: "50%",
                      }}
                    />
                    Now, everyone can deliver <br /> Find out more: <br />
                    <img
                      onClick={() => this.setShow()}
                      style={{
                        cursor: "pointer",
                        height: "40px",
                        width: "34px",
                      }}
                      src={question}
                      alt="question"
                    />
                  </div>
                </div>
                <div
                  class="card row"
                  style={{ width: "100%", padding: "", marginTop: "10px" }}
                >
                  <div
                    class="shadow-lg"
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      marginBottom: "20px",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      class="d-none d-md-inline-block"
                      src={check_rates}
                      alt=""
                      style={{ width: "30%" }}
                    />
                    <img
                      class="d-inline-block d-md-none"
                      src={check_rates}
                      alt=""
                      style={{ width: "50%" }}
                    />
                    <div
                      class="d-flex flex-row justify-content-center"
                      style={{ margin: "10px" }}
                    >
                      <div
                        class="d-flex p-6 justify-content-center align-items-center"
                        style={{ padding: "0px 10px" }}
                      >
                        <div class="form-group create-title">
                          <label for="postalcode">Delivery From 出发地点</label>
                          <div class="input-group">
                            <input
                              onChange={this.handleChange.bind(this)}
                              value={this.state.postal}
                              type="number"
                              class={
                                !this.state.postal
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              name="postal"
                              placeholder="Enter Postal Code 邮区编号"
                              min="0"
                              required
                              maxLength="6"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="p-6" style={{ padding: "0px 10px" }}>
                        <div class="form-group create-title">
                          <label for="postalcode">Delivery To 送往地点</label>
                          <div class="input-group">
                            <input
                              onChange={this.handleChange.bind(this)}
                              value={this.state.postal_to}
                              type="number"
                              class={
                                !this.state.postal_to
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              name="postal_to"
                              placeholder="Enter Postal Code 邮区编号"
                              min="0"
                              required
                              maxLength="6"
                              style={{ padding: "0px 10px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="d-flex flex-row justify-content-center align-items-center"
                      style={{ padding: "0px 10px" }}
                    >
                      {this.state.loadingDir ? (
                        <Spinner class="" animation="grow" />
                      ) : (
                        <div style={{ fontSize: "14px", textAlign: "left" }}>
                          {this.state.retrievedDir &&
                          this.state.directions &&
                          this.state.directions.routes.length > 0 ? (
                            <div
                              class="p-6 d-flex align-items-center"
                              style={{
                                padding: "15px",
                              }}
                            >
                              <div>
                                <b>Duration: </b>
                                {this.state.directions.routes.length > 0
                                  ? this.state.directions.routes[0].legs[0]
                                      .duration.text
                                  : null}
                                <br />
                                <b>Delivery Cost: </b>
                                {this.state.cost
                                  ? "$" + this.state.cost.toString()
                                  : null}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                      <div class="p-6 d-flex flex-row justify-content-center align-items-center">
                        {this.state.loadingMap ? (
                          <div>
                            <br />
                            <Spinner class="" animation="grow" />
                          </div>
                        ) : (
                          <div>
                            {this.state.retrievedMap &&
                            this.state.regionFrom.planningarea ? (
                              <span>
                                <div>
                                  <img
                                    src={
                                      "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/maps%2F" +
                                      this.state.regionFrom.planningarea
                                        .replace(/ /g, "")
                                        .toLowerCase() +
                                      ".png?alt=media&token=5942b166-0826-41e2-9a33-268dce1e9aac"
                                    }
                                    alt="map"
                                    style={{
                                      width: "100px",
                                      height: "auto",
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    color={"secondary"}
                                    size="large"
                                    startIcon={<GetApp />}
                                    style={{
                                      fontSize: "10px",
                                      width: "auto",
                                      margin: "10px",
                                      // position: "absolute",
                                      // right: "40px",
                                    }}
                                    target="blank"
                                    href={
                                      "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/maps%2F" +
                                      this.state.regionFrom.planningarea
                                        .replace(/ /g, "")
                                        .toLowerCase() +
                                      ".png?alt=media&token=5942b166-0826-41e2-9a33-268dce1e9aac"
                                    }
                                    download
                                  >
                                    <div>View Map (全图)</div>
                                  </Button>
                                </div>
                              </span>
                            ) : (
                              <div>
                                Map will be loaded after details are given
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ paddingTop: "20px" }}>
                      <b>↓ To Arrange Delivery 安排送餐添表格 ↓</b>
                    </div>
                  </div>

                  <img
                    class="d-none d-md-inline-block"
                    src={store_address}
                    alt=""
                    style={{ width: "40%" }}
                  />
                  <img
                    class="d-inline-block d-md-none"
                    src={store_address}
                    alt=""
                    style={{ width: "80%" }}
                  />
                  <div style={{ padding: "20px" }}>
                    <div class="row">
                      {" "}
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {" "}
                        <div class="form-group create-title">
                          <label for="postalcode">Postal Code 邮区编号</label>
                          <div class="input-group">
                            <input
                              onChange={this.handleChange.bind(this)}
                              value={this.state.postal}
                              type="number"
                              class={
                                !this.state.postal
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              name="postal"
                              placeholder="Enter Postal Code 邮区编号"
                              min="0"
                              required
                              maxLength="6"
                            ></input>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        {" "}
                        <div class="form-group create-title">
                          <label for="street">
                            Street Name 街道<b> (Auto-Filled)</b>
                          </label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.street}
                            type="text"
                            class={
                              !this.state.street
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            name="street"
                            placeholder="Enter Street Name 街道"
                            required
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                        <div class="form-group create-title">
                          <label for="unit">Unit # 门牌</label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.unit}
                            type="text"
                            class="form-control"
                            name="unit"
                            placeholder="E.g. #01-01"
                          ></input>
                        </div>
                      </div>
                      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                        <div class="form-group create-title">
                          <label for="unit">Mobile Number 手机号: </label>
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">
                                +65
                              </span>
                            </div>
                            <input
                              onChange={this.handleChange}
                              value={this.state.contact}
                              type="tel"
                              class={
                                !this.state.contact
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              name="contact"
                              placeholder="9xxxxxxx"
                              maxLength="8"
                              minlength="8"
                              pattern="[8-9]{1}[0-9]{7}"
                              required
                            ></input>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <div class="form-group create-title">
                          <label for="note">
                            Note To Driver 司机启示 (Optional, max 40 char)
                          </label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.note}
                            type="text"
                            class="form-control"
                            name="note"
                            placeholder="E.g. Collect order number 3"
                            maxLength="40"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    class="d-none d-md-inline-block"
                    src={delivery_address}
                    alt=""
                    style={{ width: "40%" }}
                  />
                  <img
                    class="d-inline-block d-md-none"
                    src={delivery_address}
                    alt=""
                    style={{ width: "80%" }}
                  />
                  <div style={{ padding: "20px" }}>
                    <div class="row">
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <div class="form-group create-title">
                          <label for="postalcode">Postal Code 邮区编号 </label>
                          <div class="input-group">
                            <input
                              onChange={this.handleChange.bind(this)}
                              value={this.state.postal_to}
                              type="number"
                              class={
                                !this.state.postal_to
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              name="postal_to"
                              placeholder="Enter Postal Code 邮区编号"
                              min="0"
                              required
                            ></input>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <div class="form-group create-title">
                          <label for="street_to">
                            Street Name 街道<b> (Auto-Filled)</b>
                          </label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.street_to}
                            type="text"
                            class={
                              !this.state.street_to
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            name="street_to"
                            placeholder="Enter Street Name 街道"
                            required
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      {" "}
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {" "}
                        <div class="form-group create-title">
                          <label for="unit">Unit # 门牌</label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.unit_to}
                            type="text"
                            class="form-control"
                            name="unit_to"
                            placeholder="E.g. #01-01"
                          ></input>
                        </div>
                      </div>
                      <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <div class="form-group create-title">
                          <label for="unit">Mobile Number 手机号:</label>
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">
                                +65
                              </span>
                            </div>
                            <input
                              onChange={this.handleChange}
                              value={this.state.contact_to}
                              type="tel"
                              name="contact_to"
                              placeholder="9xxxxxxx"
                              maxLength="8"
                              pattern="[8-9]{1}[0-9]{7}"
                              minlength="8"
                              class={
                                !this.state.contact_to
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              required
                            ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                        <div class="form-group create-title">
                          <label for="time">Pickup Date 取食物日期</label>
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
                      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                        <div class="form-group create-title">
                          <label for="time">Pickup Time 取食物时间</label>
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
                              Time cannot be less than 1 hour from now
                              <br />
                              取食物时间必须至少在1小时后
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div>
                    <div
                      class="shadow-lg"
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                      }}
                    >
                      <img
                        class="d-none d-md-inline-block"
                        src={summary}
                        alt=""
                        style={{ width: "20%" }}
                      />
                      <img
                        class="d-inline-block d-md-none"
                        src={summary}
                        alt=""
                        style={{ width: "40%" }}
                      />
                      {this.state.loadingDir ? (
                        <div>
                          <br />
                          <Spinner class="" animation="grow" />
                        </div>
                      ) : (
                        <div>
                          {this.state.retrievedDir &&
                          this.state.directions &&
                          this.state.directions.routes.length > 0 ? (
                            <span>
                              <p
                                style={{
                                  textAlign: "center",
                                  fontSize: "20px",
                                }}
                              >
                                <b>Distance 距离 (Google Maps): </b>
                                <br />
                                {this.state.directions.routes.length > 0
                                  ? this.state.directions.routes[0].legs[0]
                                      .distance.text
                                  : null}
                                <br />
                                <b>Est. Duration 预测行程时间: </b>
                                <br />
                                {this.state.directions.routes.length > 0
                                  ? this.state.directions.routes[0].legs[0]
                                      .duration.text
                                  : null}
                                <br />
                                <b>
                                  Arrival Time 预测到达时间 <br />{" "}
                                  <small style={{ color: "grey" }}>
                                    (Pickup Time + Duration + 15 min Buffer):
                                  </small>
                                </b>
                                <br />
                                {this.state.directions.routes.length > 0
                                  ? dayName[arrival.getDay()] +
                                    " " +
                                    arrival.getDate() +
                                    " " +
                                    monthNames[arrival.getMonth()] +
                                    " " +
                                    formatAMPM(arrival)
                                  : null}

                                <br />
                                <b>Delivery Cost: </b>
                                <br />
                                {this.state.cost
                                  ? "$" + this.state.cost.toString()
                                  : null}
                              </p>
                            </span>
                          ) : (
                            <div>Fill in details above</div>
                          )}
                        </div>
                      )}
                      <div
                        class="form-check create-title"
                        style={{ textAlign: "center" }}
                      >
                        <label class="checkbox-inline">
                          <input
                            onChange={this.handleChange}
                            type="checkbox"
                            checked={this.state.pickup_option}
                            value={this.state.pickup_option}
                            name="pickup_option"
                            class="form-check-input"
                            required
                          ></input>
                          I agree that I am a local F&B looking for a delivery
                          and FoodLeh is not liable for any event not limited to
                          inaccuracies, delays, costs, spillage, accidents,
                          injuries, food poisoning, etc. FoodLeh is only
                          responsible for matching the two sides who will assume
                          all responsibilities.
                        </label>
                        <br />
                        <br />
                      </div>
                      {this.state.submitting ? (
                        <Spinner class="" animation="grow" />
                      ) : (
                        <div>
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
                                Submitted! If found, a driver will contact you
                                directly. Driver will use customer mobile no. to
                                collect order.
                                成功！若有司机接受，司机会直接通知您。取食物时，司机会提供顾客电话号码。
                              </div>
                              <h5>
                                To arrange a new delivery, please refresh the
                                page.
                              </h5>
                            </div>
                          ) : (
                            <Button
                              variant="contained"
                              color={"primary"}
                              type="Submit"
                            >
                              Search (搜索)
                            </Button>
                          )}
                        </div>
                      )}

                      <br />
                      <br />
                      <small>
                        {" "}
                        Disclaimer: FoodLeh is only responsible for broadcasting
                        deliveries to potential drivers and is not responsible
                        for any inaccuracies, misrepresentation, damage, delay,
                        losses or otherwise. Contact us at foodleh@outlook.com
                        if you have any suggestions or notice anything we could
                        improve!
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Driver);
