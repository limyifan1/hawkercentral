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


export class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: queryString.parse(this.props.location.search).id,
      submitted: false,
      hawker_contact: cookies.get("hawker_contact")
        ? cookies.get("hawker_contact")
        : "",
    };
  }

  componentDidMount() {
    // Set up Firebase reCAPTCHA 
    // To apply the default browser preference instead of explicitly setting it.
    firebase.auth().useDeviceLanguage();
    console.log(firebase.auth().languageCode);
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      //'size': 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        //this.handleSubmit.bind(this);
        console.log("callback called");
      }
    });
    console.log(window.recaptchaVerifier);
  }


  componentWillMount() {
    // onLoad("find_delivery");
    // if (this.state.cancel) {
    //   this.cancelDoc();
    // }
  }


  handleSubmit = async (event) => {
    event.preventDefault();
    //this.setState({ submitted: true });
    cookies.set("hawker_contact", this.state.hawker_contact, { path: "/" });
    // Handle Firebase phone number-OTP verification
    var phoneNumber = this.state.hawker_contact;
    var appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        console.log("inside confirmation chunk");
        window.confirmationResult = confirmationResult;
        console.log(window.confirmationResult);
        
      }).catch(function (error) {
        // Error; SMS not sent
        // Reset reCAPTCHA so user can try again
        console.log("error, sms not sent");
        // window.recaptchaVerifier.render().then(widgetId => {
        //   window.recaptchaVerifier.reset(widgetId);
        // });
      });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
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
              Hawker Dashboard - Manage All Orders
              <div
                class="card shadow row"
                style={{ width: "100%", padding: "20px", margin: "20px" }}
              >
                <div>
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
                        value={this.state.hawker_contact}
                        type="number"
                        class="form-control"
                        name="hawker_contact"
                        placeholder="9xxxxxxx"
                        required
                      ></input>
                    </div>
                    <br />

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
                      View Your Orders
                        </Button>
                  </Form>
                  <div id="recaptcha-container"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Orders);
