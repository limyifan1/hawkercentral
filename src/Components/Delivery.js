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
          await this.sendData({
            message_id: snapshot.data().message_id,
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
                {this.state.retrieved ? (
                  <div>
                    {!this.state.data.viewed ? (
                      <div>
                        {" "}
                        <h3>
                          {" "}
                          Congratulations, you got the order!
                          <br />
                          <small style={{ color: "grey" }}>
                            {" "}
                            Delivery by{" "}
                          </small>{" "}
                          <img src={name} alt="" style={{ width: "80px" }} />
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
        </div>
      </div>
    );
  }
}

export default withRouter(Driver);
