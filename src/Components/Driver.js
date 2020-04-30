import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import name from "../logo-brown.png";
import firebase from "./Firestore";
import { Form, Button } from "react-bootstrap";
import { db } from "./Firestore";

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
      pickup_option: false,
      submitted: false,
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
    let distance = distance_calc(
      this.state.latitude,
      this.state.longitude,
      this.state.latitude_to,
      this.state.longitude_to
    );
    let cost = 6 + distance * 0.5;
    this.getPostal(this.state.postal, "to");
    this.getPostal(this.state.postal, "from");
    await addData({
      origin: this.state.street,
      destination: this.state.street_to,
      distance: distance.toString(),
      cost: cost.toString(),
      postal: this.state.postal,
      latitude: this.state.latitude,
      longitude: this.state.latitude,
      latitude_to: this.state.latitude,
      longitude_to: this.state.latitude,
      street: this.state.street,
      street_to: this.state.street_to,
      unit: this.state.unit,
      unit_to: this.state.unit_to,
      contact: this.state.contact,
      contact_to: this.state.contact_to,
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

  componentWillMount() {
    onLoad("find_driver");
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "postal" && value.toString().length === 6) {
      this.getPostal(value);
    }
    if (name === "postal_to" && value.toString().length === 6) {
      this.getPostal(value, "to");
    }

    this.setState({ [name]: value });
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
              <div class="row justify-content-center">
                <div
                  class="card shadow row"
                  style={{ width: "100%", padding: "20px" }}
                >
                  <h3>
                    {" "}
                    Find A Driver 找司机
                    <br />
                    <small style={{ color: "grey" }}> by </small>{" "}
                    <img src={name} alt="" style={{ width: "80px" }} />
                  </h3>
                  <br />
                  <div
                    class="shadow"
                    style={{ backgroundColor: "#f2f2f2", padding: "20px" }}
                  >
                    <h4>Deliver From (我的地址): </h4>
                    <br />
                    <div class="row">
                      {" "}
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {" "}
                        <div class="form-group create-title">
                          <label for="postalcode">Postal Code</label>
                          <div class="input-group">
                            <input
                              onChange={this.handleChange.bind(this)}
                              value={this.state.postal}
                              type="number"
                              class="form-control"
                              name="postal"
                              placeholder="Enter Postal Code"
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
                            Street Name<b> (Auto-Filled)</b>
                          </label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.street}
                            type="text"
                            class="form-control"
                            name="street"
                            placeholder="Enter Street Name"
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      {" "}
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {" "}
                        <div class="form-group create-title">
                          <label for="unit">Unit #</label>
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
                      <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <div class="form-group create-title">
                          <label for="unit">Contact Number: </label>
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">
                                +65
                              </span>
                            </div>
                            <input
                              onChange={this.handleChange}
                              value={this.state.contact}
                              type="number"
                              class="form-control"
                              name="contact"
                              placeholder="9xxxxxxx"
                              required
                            ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div
                    class="shadow-lg"
                    style={{ backgroundColor: "#b48300", padding: "20px" }}
                  >
                    <h4 style={{ color: "white" }}>Deliver To (顾客地址): </h4>
                    <br />
                    <div class="row">
                      {" "}
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {" "}
                        <div class="form-group create-title">
                          <label for="postalcode" style={{ color: "white" }}>
                            Postal Code
                          </label>
                          <div class="input-group">
                            <input
                              onChange={this.handleChange.bind(this)}
                              value={this.state.postal_to}
                              type="number"
                              class="form-control"
                              name="postal_to"
                              placeholder="Enter Postal Code"
                              min="0"
                              required
                            ></input>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        {" "}
                        <div class="form-group create-title">
                          <label for="street" style={{ color: "white" }}>
                            Street Name<b> (Auto-Filled)</b>
                          </label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.street_to}
                            type="text"
                            class="form-control"
                            name="street_to"
                            placeholder="Enter Street Name"
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      {" "}
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        {" "}
                        <div class="form-group create-title">
                          <label for="unit" style={{ color: "white" }}>
                            Unit #
                          </label>
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
                          <label for="unit" style={{ color: "white" }}>
                            Contact Number:{" "}
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
                              type="number"
                              class="form-control"
                              name="contact_to"
                              placeholder="9xxxxxxx"
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
                        backgroundColor: "#000080",
                        padding: "20px",
                        color: "white",
                      }}
                    >
                      <h4 style={{ color: "white" }}> Summary </h4>
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
                            <small>(Start at $6, $0.5 per km)</small>
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
                          }}
                        >
                          Submitted! If found, a driver will contact you directly. 
                        </div>
                      ) : (
                        <Button
                          class="shadow-lg"
                          style={{
                            backgroundColor: "blue",
                            borderColor: "white",
                            fontSize: "25px",
                          }}
                          type="Submit"
                        >
                          Find Delivery Now
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
