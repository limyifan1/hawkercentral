// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import "../App.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { db, uiConfigPage } from "./Firestore";
import InputAdornment from "@material-ui/core/InputAdornment";
import firebase from "./Firestore";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import custom from "../assets/custom.png";
const analytics = firebase.analytics();
const admin = `${process.env.REACT_APP_ADMIN}`;

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

export class Custom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      open: false,
      options: [],
      id: "",
      available: null,
      name: null,
      fullname: null,
      creating: false,
      created: false,
      invalid: false,
      firebaseUser: null,
      login: false,
    };
  }

  increaseStep = () => {
    this.setState({ step: this.state.step + 1 });
  };

  decreaseStep = () => {
    this.setState({ step: this.state.step - 1 });
  };

  getSteps = () => {
    return [
      "Step 1: Create Account",
      "Step 2: Select Your Listing",
      "Step 3: Create Your Unique Link!",
      "Step 4: Create Your Website",
    ];
  };

  setOpen = () => {
    this.retrieveData();
    this.setState({ open: true });
  };

  setClose = () => {
    this.setState({ open: false });
  };

  retrieveData = async () => {
    let data = [];
    await db
      .collection("hawkers")
      .get()
      .then((snapshot) => {
        var data = [];
        snapshot.forEach((element) => {
          if (!element.data().custom)
            data.push({
              name: element.data().name,
              id: element.id,
              cover: element.data().url ? element.data().url : null,
            });
        });
        this.setState({ options: data });
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ data: data, retrieved: true });
  };

  createDomain = async () => {
    this.setState({ creating: true });
    await db
      .collection("pages")
      .doc(this.state.name)
      .set({
        css: { menu_color: "", menu_font_color: "" },
        docid: this.state.id,
        logo: "",
        cover: this.state.cover,
        delivery_option: "none",
      })
      .then(async (d) => {
        await db
          .collection("pages")
          .doc(this.state.name)
          .collection("users")
          .doc(this.state.firebaseUser.uid)
          .set({
            role: "admin",
          });
        await db
          .collection("pages")
          .doc(this.state.name)
          .collection("users")
          .doc(admin)
          .set({
            role: "admin",
          });
        await db.collection("hawkers").doc(this.state.id).update({
          custom: true,
          takesg: false,
        });
        this.setState({ creating: false, created: true });
      });
  };

  checkAvailable = async () => {
    if (
      this.state.name !== "" &&
      this.state.name !== null &&
      /[^\w]|_|\s/g.test(this.state.name) !== true
    ) {
      this.setState({ invalid: false });
      await db
        .collection("pages")
        .doc(this.state.name)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            this.setState({ available: false });
          } else {
            this.setState({ available: true });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({ invalid: true });
    }
  };

  handleChange = (event) => {
    this.setState({ name: event.target.value.toLowerCase(), available: null });
  };

  componentDidMount() {
    firebase.auth().useDeviceLanguage();
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //   "recaptcha-container",
    //   {
    //     size: "invisible",
    //     callback: function (response) {
    //       // reCAPTCHA solved
    //     },
    //   }
    // );

    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          // User is signed in, set state
          // More auth information can be obtained here but for verification purposes, we just need to know user signed in
          console.log(user);
          this.setState({
            firebaseUser: user,
            displayName: user.displayName,
            email: user.email ? user.email : null,
            contact: user.phoneNumber ? user.phoneNumber.slice(3) : null,
          });
          onLoad("custom_domain", user.uid);
        } else {
          // No user is signed in.
        }
      }.bind(this)
    );
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
            {this.state.firebaseUser ? (
              <div style={{ color: "green" }}>
                <p>
                  <b>
                    Verified: <br />
                    {this.state.firebaseUser.phoneNumber}
                    <br />
                    {this.state.firebaseUser.displayName}
                    <br />
                    {this.state.firebaseUser.email}
                    <br />
                    <br />
                    <Button
                      variant="contained"
                      onClick={() => {
                        firebase.auth().signOut();
                        this.setState({ firebaseUser: null });
                      }}
                    >
                      Sign-out
                    </Button>
                  </b>
                </p>
              </div>
            ) : (
              <div>
                {!this.state.login && (
                  <div>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => this.setState({ login: true })}
                    >
                      Create Account/ Login
                    </Button>
                  </div>
                )}
                {this.state.login && (
                  <StyledFirebaseAuth
                    uiConfig={uiConfigPage}
                    firebaseAuth={firebase.auth()}
                  />
                )}
                <br />
              </div>
            )}
          </React.Fragment>
        );
      case 1:
        return (
          <div>
            <div>
              If you have not created a listing, please go to<span> </span>
              <a href="/create" target="blank">
                {" "}
                www.foodleh.app/create{" "}
              </a>{" "}
              first!
              <br />
            </div>
            <div
              class="d-flex row justify-content-center"
              style={{ margin: "15px" }}
            >
              <Autocomplete
                id="asynchronous-demo"
                style={{ width: "250px" }}
                open={this.state.open}
                onOpen={() => {
                  this.setOpen();
                }}
                onClose={() => {
                  this.setClose();
                }}
                getOptionSelected={(option, value) =>
                  option.name === value.name
                }
                getOptionLabel={(option) => option.name}
                options={this.state.options}
                loading={this.state.open && this.state.options.length === 0}
                onChange={(event, newValue) => {
                  newValue
                    ? this.setState({
                        id: newValue.id,
                        fullname: newValue.name,
                        cover: newValue.cover,
                      })
                    : this.setState({ id: null, fullname: null, cover: null });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Your Listing"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {this.state.open &&
                          this.state.options.length === 0 ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </div>
            <br />
            {this.state.id ? (
              <div style={{ wordWrap: "break-word" }}>
                You selected{" "}
                <a target="blank" href={"/info?id=" + this.state.id}>
                  this
                </a>{" "}
                listing
                <br />
                <br />
              </div>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div>
            <TextField
              label="Name"
              name="name"
              placeholder="e.g. huathuat"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">.foodleh.app</InputAdornment>
                ),
              }}
              value={this.state.name}
              onChange={this.handleChange}
            />
            <br />
            {this.state.invalid ? (
              <div style={{ color: "red" }}>
                Must not be empty, contain spaces, or contain punctuation.
              </div>
            ) : null}

            <br />
            <Button
              onClick={this.checkAvailable}
              variant="contained"
              color="secondary"
            >
              Check Availability
            </Button>
            <br />
            <br />
            {this.state.available !== null ? (
              <div>
                {this.state.available ? (
                  <div style={{ color: "green" }}>
                    {this.state.name}.foodleh.app is <b>Available</b>
                    <br />
                    <br />
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    {this.state.name}.foodleh.app is <b>Not Available</b>
                    <br />
                    <br />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        );
      case 3:
        return (
          <div>
            You're ready to create your subdomain!
            <br />
            <br />
            <Button
              onClick={() => this.createDomain()}
              variant="contained"
              color="secondary"
              disabled={this.state.created || this.state.creating}
              style={{ margin: "10px" }}
            >
              Create Custom Website
            </Button>
            <br />
            <br />
            {this.state.created ? (
              <div>
                <h4 style={{ color: "green" }}>Success! </h4>
                <h5>
                  Website created at{" "}
                  <a
                    href={"https://" + this.state.name + ".foodleh.app"}
                    target="blank"
                  >
                    https://{this.state.name}.foodleh.app
                  </a>
                </h5>
                <h5>
                  Edit website at:{" "}
                  <a
                    href={
                      "https://" + this.state.name + ".foodleh.app/dashboard"
                    }
                    target="blank"
                  >
                    https://{this.state.name}.foodleh.app/dashboard
                  </a>
                </h5>
              </div>
            ) : null}
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  render() {
    var steps = this.getSteps();
    return (
      <div class="container" style={{ paddingTop: "56px", width: "100%" }}>
        <div class="d-flex justify-content-center">
          <div class="col-md-8 col-xs-12">
            <img src={custom} style={{ width: "100%" }} alt="header" />
          </div>
        </div>
        <Stepper activeStep={this.state.step} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <h4>{label}</h4>
              </StepLabel>
              <StepContent>
                <div class="d-flex justify-content-center">
                  {this.getStepContent(index)}
                </div>
                <div>
                  <div>
                    {this.state.step !== 3 ? (
                      <div>
                        <Button
                          disabled={
                            this.state.step === 0 || this.state.step === 3
                          }
                          onClick={this.decreaseStep}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.increaseStep}
                          disabled={
                            this.state.step === 0
                              ? !this.state.firebaseUser
                              : (this.state.step === 1 ? this.state.id : true)
                              ? this.state.step === 2
                                ? !this.state.available
                                : false
                              : true
                          }
                        >
                          Next
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    );
  }
}

export default Custom;
