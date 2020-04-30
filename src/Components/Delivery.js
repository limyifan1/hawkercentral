import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import name from "../logo-brown.png";
import firebase from "./Firestore";
import { Form } from "react-bootstrap";
import { db } from "./Firestore";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";

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
      retrieved: false,
      id: queryString.parse(this.props.location.search).id,
      pickup_option: false,
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
      street: this.state.latitude,
      street_to: this.state.latitude,
      unit: this.state.latitude,
      unit_to: this.state.latitude,
      contact: this.state.latitude,
      contact_to: this.state.latitude,
    }).then((id) => {
      this.sendData({
        origin: this.state.street,
        destination: this.state.street_to,
        distance: distance.toString().slice(0, 4),
        cost: "$" + cost.toString().slice(0, 4),
        url: "www.foodleh.app/delivery?id=" + id,
      });
    });
  };

  componentWillMount() {
    onLoad("find_driver");
    this.getDoc();
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
          console.log("Fetched successfully!");
        }
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                  {this.state.retrieved ? (
                    <div>
                      {!this.state.data.viewed ? (
                        <h3>
                          {" "}
                          Congratulations, you got the order!
                          <small style={{ color: "grey" }}>
                            {" "}
                            Delivery by{" "}
                          </small>{" "}
                          <img src={name} alt="" style={{ width: "80px" }} />
                        </h3>
                      ) : (
                        <h3>
                          {" "}
                          Sorry, someone has already taken the order
                          <br />
                          <small style={{ color: "grey" }}>
                            {" "}
                            Delivery by{" "}
                          </small>{" "}
                          <img src={name} alt="" style={{ width: "80px" }} />
                        </h3>
                      )}
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <h3>Loading</h3>
                      <Spinner class="" animation="grow" />
                    </div>
                  )}
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
