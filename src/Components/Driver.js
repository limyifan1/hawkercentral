import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import firebase from "./Firestore";
import { Form, Button, Modal } from "react-bootstrap";
import { db } from "./Firestore";
import driver from "../driver.png";
import store_address from "../store_address.png";
import delivery_address from "../delivery_address.png";
import summary from "../summary.png";
import instructions from "../instructions.jpeg";
import Cookies from "universal-cookie";
import GoogleMap from 'google-map-react';

const cookies = new Cookies();
const API_KEY = `${process.env.REACT_APP_GKEY}`

const analytics = firebase.analytics();

function onLoad(name) {
  analytics.logEvent(name);
}

function distance_calc(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1.609344;
  }
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
time_now.setMinutes(time_now.getMinutes() + 30);
const time_now_plus = time_now.toLocaleTimeString("en-US", {
  hour12: false,
  hour: "numeric",
  minute: "numeric",
});

export class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postal: cookies.get("postal"),
      latitude: "",
      longitude: "",
      latitude_to: "",
      longitude_to: "",
      street: cookies.get("street"),
      street_to: "",
      cost: "",
      distance: "",
      unit: cookies.get("unit"),
      unit_to: "",
      contact: cookies.get("contact"),
      contact_to: "",
      time: time_now_plus,
      note: cookies.get("note"),
      pickup_option: false,
      submitted: false,
      show: false,
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

  sendData = async (query) => {
    let urls = [
      "https://us-central1-hawkercentral.cloudfunctions.net/telegramSend",
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
    let distance = distance_calc(
      this.state.latitude,
      this.state.longitude,
      this.state.latitude_to,
      this.state.longitude_to
    );
    let cost = 6 + distance * 0.5;
    await this.getPostal(this.state.postal_to, "to");
    await this.getPostal(this.state.postal, "from");
    cookies.set("postal", this.state.postal, { path: "/" });
    cookies.set("street", this.state.street, { path: "/" });
    cookies.set("unit", this.state.unit, { path: "/" });
    cookies.set("contact", this.state.contact, { path: "/" });
    cookies.set("note", this.state.note, { path: "/" });
    await addData({
      origin: this.state.street,
      destination: this.state.street_to,
      distance: distance.toString(),
      cost: cost.toString(),
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
      time: this.state.time,
      note: this.state.note,
    }).then((id) => {
      this.sendData({
        origin: this.state.street,
        destination: this.state.street_to,
        distance: distance.toString().slice(0, 4),
        cost: "$" + cost.toString().slice(0, 4),
        id: id,
        url: "www.foodleh.app/delivery?id=" + id,
      });
      this.setState({ submitted: true });
    });
  };


  mapRender(result) {
    let latitude = 1.2830
    let longitude = 103.8579
    let zoom = 12
    if (this.props.data.data.length > 0){      
      return (
        <GoogleMap
        bootstrapURLKeys={{ key: API_KEY}}
        defaultCenter={[latitude,longitude]}
        defaultZoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        // onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, this.state)}
        >
          {result}
        </GoogleMap>)
    }
    else{
      return(
        <GoogleMap
        bootstrapURLKeys={{ key: API_KEY}}
        defaultCenter={[latitude,longitude]}
        defaultZoom={zoom}
        >
        </GoogleMap>
      )
    }
  }

  componentWillMount() {
    onLoad("find_driver");
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "postal" && value.toString().length === 6) {
      this.getPostal(value, "from");
    }
    if (name === "postal_to" && value.toString().length === 6) {
      this.getPostal(value, "to");
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
    var distance = distance_calc(
      this.state.latitude,
      this.state.longitude,
      this.state.latitude_to,
      this.state.longitude_to
    );
    var cost = 6 + distance * 0.5;

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
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <div class="container-fluid col-md-10 content col-xs-offset-2">
              <div class="d-flex row justify-content-center">
                <img
                  src={driver}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
                <Modal
                  onHide={this.setHide}
                  show={this.state.show}
                  dialogClassName="modal-90w"
                  aria-labelledby="example-custom-modal-styling-title"
                  style={{ "margin-top": "50px" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                      How DriverLeh? Works
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <img src={instructions} alt="" style={{ width: "100%" }} />
                  </Modal.Body>
                </Modal>

                <div
                  onClick={() => this.setShow()}
                  class="d-flex justify-content-center align-items-center"
                  style={{
                    border: "2px solid",
                    color: "white",
                    width: "130px",
                    height: "40px",
                    alignText: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    cursor: "pointer",
                    marginTop: "12px",
                    backgroundColor: "#b48300",
                    borderColor: "black",
                  }}
                >
                  {
                    <svg
                      class="bi bi-question-circle"
                      width="3em"
                      height="3em"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ paddingLeft: "7px" }}
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z"
                        clip-rule="evenodd"
                      />
                      <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                    </svg>
                  }{" "}
                  <div style={{ padding: "10px" }}>What is DriverLeh?</div>
                </div>
                <div
                  class="card shadow row"
                  style={{ width: "100%", padding: "", marginTop: "10px" }}
                >
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
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <div class="form-group create-title">
                          <label for="unit">Unit # 门牌 (Optional)</label>
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
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
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
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <div class="form-group create-title">
                          <label for="time">Pickup Time 取食物时间</label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.time}
                            type="time"
                            class={
                              time_now_plus > this.state.time
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            name="time"
                            placeholder="E.g. #01-01"
                          ></input>
                          {time_now_plus > this.state.time ? (
                            <span class="invalid-tooltip">
                              Time cannot be less than 30 minutes from now
                              <br />
                              取食物时间必须至少在30分钟后
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div class="row">
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
                        {" "}
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
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      {" "}
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {" "}
                        <div class="form-group create-title">
                          <label for="unit">Unit # 门牌 (Optional)</label>
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
                          <label for="unit">
                            Mobile Number 手机号: (Optional)
                          </label>
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
                              class="form-control"
                              name="contact_to"
                              placeholder="9xxxxxxx"
                              maxLength="8"
                              pattern="[8-9]{1}[0-9]{7}"
                              minlength="8"
                            ></input>
                          </div>
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

                      {this.state.latitude &&
                      this.state.longitude &&
                      this.state.latitude_to &&
                      this.state.longitude_to ? (
                        <span>
                          <p style={{ textAlign: "center", fontSize: "20px" }}>
                            <b>Distance: </b>
                            {distance.toString().slice(0, 4) + " km away"}
                            <br />
                            <b>Estimated Cost: </b>
                            {"$" + cost.toString().slice(0, 4)}
                            <br />
                            <small>
                              (Start at $6, $0.5 per km. Please confirm with
                              driver. )
                            </small>
                          </p>
                        </span>
                      ) : (
                        <div>Fill in details above</div>
                      )}
                      <br />
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
                          inaccuracies, delays, costs, spillage, etc.
                        </label>
                        <br />
                        <br />
                      </div>
                      {this.state.submitted ? (
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
                          directly.
                        </div>
                      ) : (
                        <Button
                          class="shadow-lg"
                          style={{
                            backgroundColor: "#b48300",
                            borderColor: "#b48300",
                            fontSize: "25px",
                          }}
                          type="Submit"
                        >
                          Search (搜索)
                        </Button>
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
                    {this.mapRender}
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
