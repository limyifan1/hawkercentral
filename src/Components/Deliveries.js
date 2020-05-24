// This is the dashboard for drivers to track their deliveries. Similar to Orders.js
import React from "react";
import "../App.css";
import { withRouter } from "react-router-dom";
import { firebase, uiConfig } from "./Firestore";
import { Button } from "react-bootstrap";
import { db } from "./Firestore";
import queryString from "query-string";
import Cookies from "universal-cookie";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const cookies = new Cookies();

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
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

function getPhoneNumberFromUserInput() {
  return document.getElementById("phone-number").value;
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

export class Deliveries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: queryString.parse(this.props.location.search).id,
      submitted: false,
      firebaseUser: null,
      hawker_contact: cookies.get("hawker_contact")
        ? cookies.get("hawker_contact")
        : "",
      deliveryData: null,
    };
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
            hawker_contact: user.phoneNumber.slice(3),
          });
          onLoad("hawker_dashboard", user.phoneNumber.slice(3));
        } else {
          // No user is signed in.
        }
      }.bind(this)
    );
  }
  componentWillMount() {
    // onLoad("find_delivery");
    // if (this.state.cancel) {
    //   this.cancelDoc();
    // }
  }

  getDoc = () => {
    return db
      .collection("deliveries")
      .where(
        "driver_contact",
        "==",
        this.state.firebaseUser.phoneNumber.slice(3).toString()
      )
      .get()
      .then(async (snapshot) => {
        var dataToReturn = [];
        snapshot.forEach((d) => {
          console.log(typeof d.data().time);
          // Push entire entry if firebase data is valid, sort and format before rendering
          if (typeof d.data().time !== "string" && d.data().time) {
            dataToReturn.push(d.data());
          }

          // if (typeof d.data().time !== "string" && d.data().time) {
          //   var pickupTime = d.data().time.toDate();
          //   var time =
          //     dayName[pickupTime.getDay()] +
          //     " " +
          //     " " +
          //     monthNames[pickupTime.getMonth()] +
          //     " " +
          //     pickupTime.getDate() +
          //     " " +
          //     formatAMPM(pickupTime);
          //   dataToReturn.push(
          //     <div style={{ textAlign: "left" }}>
          //       <br />
          //       <b>Delivery from: </b>
          //       {d.data().street}
          //       <br />
          //       <b>Delivery to: </b>
          //       {d.data().street_to}
          //       <br />
          //       <b>Hawker contact (Pickup): </b>
          //       {d.data().contact}
          //       <br />
          //       <b>Customer contact (Dropoff): </b>
          //       {d.data().contact_to}
          //       <br />
          //       <b>Pickup Time: </b>
          //       {time}
          //       <br />
          //       <b>Note: </b>
          //       {d.data().note}
          //       <br />
          //       <b>Distance: </b>
          //       {d.data().distance}
          //       <br />
          //       <b>Est. Duration: </b>
          //       {d.data().duration}
          //       <br />
          //       <b>Est. Arrival Time: </b>
          //       {d.data().arrival}
          //       <br />
          //       <b>Delivery fee: </b>${d.data().cost}
          //       <hr
          //         style={{
          //           color: "#b48300",
          //           backgroundColor: "#b48300",
          //           height: "1px",
          //           borderColor: "#b48300",
          //           width: "100%",
          //           alignItems: "center",
          //         }}
          //       />
          //     </div>
          //   );
          // }
        });
        this.setState({ deliveryData: dataToReturn });
        return dataToReturn;
      })
      .catch((error) => {
        console.log(error);
      });
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

  // After hawker is verified, let them enter dashboard page
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ submitted: true });
    cookies.set("hawker_contact", this.state.hawker_contact, { path: "/" });
    await this.getDoc().then(async (data) => { });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  render() {
    let dataToDisplay = [];
    let sortedDeliveryData = [];
    if (this.state.deliveryData !== null) {
      // sort the data by descending order of time
      sortedDeliveryData = this.state.deliveryData.sort((a, b) => b.time - a.time)
      dataToDisplay = sortedDeliveryData.map((data) => {
        var pickupTime = data.time.toDate();
        var time =
          dayName[pickupTime.getDay()] +
          " " +
          " " +
          pickupTime.getDate() +
          " " +
          monthNames[pickupTime.getMonth()] +

          " " +
          formatAMPM(pickupTime);

        return (
          <div style={{ textAlign: "left" }}>
            <br />
            <b>Delivery from: </b>
            {data.street}
            <br />
            <b>Delivery to: </b>
            {data.street_to}
            <br />
            <b>Hawker contact (Pickup): </b>
            {data.contact}
            <br />
            <b>Customer contact (Dropoff): </b>
            {data.contact_to}
            <br />
            <b>Pickup Time: </b>
            {time}
            <br />
            <b>Note: </b>
            {data.note}
            <br />
            <b>Distance: </b>
            {data.distance}
            <br />
            <b>Est. Duration: </b>
            {data.duration}
            <br />
            <b>Est. Arrival Time: </b>
            {data.arrival}
            <br />
            <b>Delivery fee: </b>${data.cost}
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
        );
      });
    }


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
                Driver Dashboard - Manage All Delivery Jobs
              <div
                  class="card shadow row"
                  style={{ width: "100%", padding: "20px", margin: "20px" }}
                >
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
                        Verified your phone number:{" "}
                        {this.state.firebaseUser.phoneNumber}
                      </p>
                    </div>
                  ) : null}
                  <Button
                    onClick={this.handleSubmit.bind(this)}
                    class="shadow-lg"
                    disabled={this.state.firebaseUser === null}
                    style={{
                      backgroundColor: !(this.state.firebaseUser === null)
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
                  >
                    Click to See Your Delivery Jobs
                </Button>
                  <div>{dataToDisplay}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  export default withRouter(Deliveries);
