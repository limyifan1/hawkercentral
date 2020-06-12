import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import "./style.scss";
import { CartContext } from "./themeContext";
import { OverlayTrigger, Popover, Form } from "react-bootstrap";
import { BitlyClient } from "bitly";
import firebase from "./Firestore";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import { db } from "./Firestore";

const time_now = new Date();
time_now.setMinutes(time_now.getMinutes());
const REACT_APP_BITLY_KEY = `${process.env.REACT_APP_BITLY_KEY}`;
const bitly = new BitlyClient(REACT_APP_BITLY_KEY, {});
const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

const shorten = (url) => {
  return bitly.shorten(url).then((d) => {
    return d.link;
  });
};

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

const popover = (
  <Popover>
    <Popover.Content>
      Your details will only be stored in your browser!
    </Popover.Content>
  </Popover>
);

class FullScreenDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      orderData:
        this.context && this.context.pageData
          ? new Array(this.context.pageData.menu_combined.length).fill(0)
          : [],
      data: [],
      totalPrice: 0.0,
      wantToOrder: false,
      name: "",
      unit: "",
      street: "",
      postal: "",
      notes: "",
      customerNumber: "",
      deliveryTime: "",
      galleryOpened: false,
      retrieved: false,
      activePhoto: 1,
      hasReviewEditMessage: false,
      hasReviewDeleteMessage: false,
      shouldRememberDetails: false,
      time: time_now.getHours() + ":" + time_now.getMinutes(),
      date: time_now,
      datetime: time_now,
    };
    this.setOrderText = this.setOrderText.bind(this);
    this.handleCustomerDetails = this.handleCustomerDetails.bind(this);
    this.updateCustomerDetails = this.updateCustomerDetails.bind(this);
    this.toggleShouldRememberDetails = this.toggleShouldRememberDetails.bind(
      this
    );
  }

  updateCustomerDetails = async (event) => {
    const inputValue = event.target.value;
    const inputField = event.target.name;
    if (inputField === "postal") {
      this.setState({
        postal: inputValue,
      });
      if (inputValue.length === 6) {
        await this.getPostal(inputValue);
      }
    }
    this.context.addCustomerDetails(inputField, inputValue);
  };

  async getPostal(postal) {
    // event.preventDefault();
    let data = await this.callPostal(postal);
    if (data !== undefined) {
      this.context.addCustomerDetails("street", data["ADDRESS"]);
    }
  }

  componentWillMount() {
    console.log("run");
    if (localStorage.getItem("userDetails")) {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.context.addCustomerDetails("name", userDetails.name);
      this.context.addCustomerDetails(
        "customerNumber",
        userDetails.customerNumber
      );
      this.context.addCustomerDetails("postal", userDetails.postal);
      this.context.addCustomerDetails("unit", userDetails.unit);
      this.context.addCustomerDetails("street", userDetails.street);
      // this.setState(userDetails);
      this.setState({ shouldRememberDetails: true });
    }
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

  toggleShouldRememberDetails(event) {
    const isChecked = event.target.checked;
    this.setState({ shouldRememberDetails: isChecked });
    this.updateSavedData(isChecked);
  }

  updateSavedData(isChecked) {
    if (!isChecked) {
      localStorage.clear();
    } else {
      const userDetails = {
        name: this.context.customerDetails.name,
        customerNumber: this.context.customerDetails.customerNumber,
        postal: this.context.customerDetails.postal,
        unit: this.context.customerDetails.unit,
        street: this.context.customerDetails.street,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  }

  handleCustomerDetails = async (event) => {
    await this.updateCustomerDetails(event).then(() => {
      this.updateSavedData(this.state.shouldRememberDetails);
    });
  };

  handleTime = async (time) => {
    this.context.addCustomerDetails("time", time);
    this.context.addCustomerDetails(
      "datetime",
      new Date(
        this.context.customerDetails.date.getMonth() +
          1 +
          "/" +
          this.context.customerDetails.date.getDate() +
          "/" +
          this.context.customerDetails.date.getFullYear() +
          " " +
          time
      )
    );
    // this.setState({
    //   time: time,
    //   datetime: new Date(
    //     this.state.date.getMonth() +
    //       1 +
    //       "/" +
    //       this.state.date.getDate() +
    //       "/" +
    //       this.state.date.getFullYear() +
    //       " " +
    //       time
    //   ),
    // });
  };

  handleDate = async (date) => {
    this.context.addCustomerDetails("date", date);
    this.context.addCustomerDetails(
      "datetime",
      new Date(
        date.getMonth() +
          1 +
          "/" +
          date.getDate() +
          "/" +
          date.getFullYear() +
          " " +
          this.context.customerDetails.time
      )
    );

    // this.setState({
    //   date: date,
    //   datetime: new Date(
    //     date.getMonth() +
    //       1 +
    //       "/" +
    //       date.getDate() +
    //       "/" +
    //       date.getFullYear() +
    //       " " +
    //       this.state.time
    //   ),
    // });
  };

  setOrderText = async () => {
    let text = "";
    if (this.context.channel === "delivery") {
      text =
        text +
        "New Delivery Order from " +
        this.context.customerDetails.name +
        "\n";
    } else {
      text =
        text +
        "New Pick-Up Order from " +
        this.context.customerDetails.name +
        "\n";
    }
    for (let i = 0; i < this.context.cartProducts.length; i = i + 1) {
      if (
        this.context.cartProducts !== undefined &&
        this.context.cartProducts.length !== 0 &&
        this.context.cartProducts[i].quantity !== 0
      ) {
        text =
          text +
          "*" +
          this.context.cartProducts[i].quantity +
          "x* _" +
          this.context.pageData.menu_combined[
            this.context.cartProducts[i].index
          ].name +
          "_: $" +
          (
            this.context.cartProducts[i].quantity *
            this.context.pageData.menu_combined[
              this.context.cartProducts[i].index
            ].price
          ).toFixed(2) +
          "\n";
      }
    }
    text =
      text +
      "\n\nTotal Price (not including delivery): *$" +
      this.context.cartTotal.totalPrice.toFixed(2) +
      "*";

    if (this.context.channel === "delivery") {
      text =
        text +
        "\nDelivery address: *" +
        this.context.customerDetails.street +
        " #" +
        this.context.customerDetails.unit +
        " " +
        this.context.customerDetails.postal +
        "*";
    }

    let time_text =
      dayName[this.context.customerDetails.datetime.getDay()] +
      " " +
      this.context.customerDetails.datetime.getDate() +
      " " +
      monthNames[this.context.customerDetails.datetime.getMonth()] +
      " " +
      formatAMPM(this.context.customerDetails.datetime);
    text = text + "\nDate/Time: *" + time_text + "*";

    if (this.context.customerDetails.notes !== "") {
      // only display notes if customer added
      text =
        text +
        "\nAdditional notes: _" +
        this.context.customerDetails.notes +
        "_";
    }
    text =
      text +
      "\nCustomer phone number: *" +
      this.context.customerDetails.customerNumber +
      "*";
    text = text + "\nOrdering from:" + this.context.pageName + ".foodleh.app";

    const storeData = new URLSearchParams();
    storeData.append("postal", this.context.pageData.postal);
    storeData.append("street", this.context.pageData.street);
    storeData.append("unit", this.context.pageData.unit);
    storeData.append("contact", this.context.pageData.contact);
    storeData.append("postal_to", this.context.customerDetails.postal);
    storeData.append("street_to", this.context.customerDetails.street);
    storeData.append("unit_to", this.context.customerDetails.unit);
    storeData.append("contact_to", this.context.customerDetails.customerNumber);
    var shortenedURL = await shorten(
      "https://foodleh.app/driver?" + storeData.toString()
    );
    text =
      text + "\n For F&B Owner, request for a driver here: " + shortenedURL;
    return encodeURIComponent(text);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");
    this.setState({
      loading: true,
    });
    // await this.addOrder();
    var text = await this.setOrderText();
    var url =
      "https://wa.me/65" + this.context.pageData.contact + "?text=" + text;
    window.location = url;
  };

  addOrder = () => {
    var orderItems = [];
    for (let i = 0; i < this.context.cartProducts.length; i = i + 1) {
      if (
        this.context.cartProducts !== undefined &&
        this.context.cartProducts.length !== 0 &&
        this.context.cartProducts[i].quantity !== 0
      ) {
        orderItems.push({
          name: this.context.pageData.menu_combined[
            this.context.cartProducts[i].index
          ].name,
          quantity: this.context.cartProducts[i].quantity,
          price: (
            this.context.cartProducts[i].quantity *
            this.context.pageData.menu_combined[
              this.context.cartProducts[i].index
            ].price
          ).toFixed(2),
        });
      }
    }
    return db
      .collection("pages")
      .doc(this.context.pageName)
      .collection("orders")
      .add({
        orderItems: orderItems,
        address:
          this.state.street + " #" + this.state.unit + " " + this.state.postal,
        contact: this.state.customerNumber,
        deliveryTime:
          dayName[this.state.datetime.getDay()] +
          " " +
          this.state.datetime.getDate() +
          " " +
          monthNames[this.state.datetime.getMonth()] +
          " " +
          formatAMPM(this.state.datetime),
        notes: this.state.notes,
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    // var classes = useStyles();
    const menu_color =
      this.context && this.context.css && this.context.css.menu_color
        ? this.context.css.menu_color
        : "#b48300";
    const menu_font_color =
      this.context && this.context.css && this.context.css.menu_font_color
        ? this.context.css.menu_font_color
        : "#ffffff";

    return (
      <div>
        {/* <div onClick={this.handleClickOpen} className="buy-btn">
          Order via WhatsApp
        </div>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        > */}
        {this.props.toggle === "cart" ? (
          <AppBar style={{ position: "relative", backgroundColor: menu_color }}>
            <Toolbar>
              <IconButton
                edge="start"
                onClick={this.props.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{ flex: 1 }}>
                Confirm Details
              </Typography>
              {/* <Button autoFocus color="inherit" onClick={this.handleClose}>
              save
            </Button> */}
            </Toolbar>
          </AppBar>
        ) : null}
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div
            class="d-flex justify-content-center align-items-center"
            style={{ padding: "20px" }}
          >
            <div>
              <div class="form-group create-title">
                <label for="name">Name</label>
                <input
                  onChange={this.handleCustomerDetails}
                  value={this.context.customerDetails.name}
                  type="text"
                  class="form-control"
                  name="name"
                  style={{ borderColor: "#b48300" }}
                  placeholder="E.g. Xiao Ming"
                ></input>
              </div>
              <div class="form-group create-title">
                <label for="unit">Mobile Number: </label>
                <div class="input-group mb-12">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      +65
                    </span>
                  </div>
                  <input
                    onChange={this.handleCustomerDetails}
                    value={this.context.customerDetails.customerNumber}
                    type="tel"
                    class={
                      !this.context.customerDetails.customerNumber
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="customerNumber"
                    placeholder=" 9xxxxxxx"
                    maxLength="8"
                    minlength="8"
                    pattern="[8-9]{1}[0-9]{7}"
                    style={{
                      borderColor: "#b48300",
                      "border-radius": "5px",
                    }}
                    required
                  ></input>
                </div>
              </div>
              <div class="row">
                <div class="flex" style={{ marginLeft: "14px" }}>
                  <div class="form-group create-title">
                    <label for="time">Delivery/Pickup Date</label>
                    {/* {this.context.customerDetails.date.toISOString()} */}
                    <div class="input-group">
                      <DatePicker
                        class="form-control is-invalid"
                        dayPlaceholder="dd"
                        monthPlaceholder="mm"
                        yearPlaceholder="yyyy"
                        onChange={this.handleDate}
                        value={this.context.customerDetails.date}
                        format="dd/MMM/yyyy"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="flex" style={{ marginLeft: "14px" }}>
                  <div class="form-group create-title">
                    <label for="time">Delivery/Pickup Time</label>{" "}
                    <div class="input-group">
                      <TimePicker
                        class="form-control is-invalid"
                        dayPlaceholder="dd"
                        monthPlaceholder="mm"
                        yearPlaceholder="yyyy"
                        hourPlaceholder="hh"
                        minutePlaceholder="mm"
                        onChange={this.handleTime}
                        value={this.context.customerDetails.time}
                        format="hh:mma"
                        disableClock
                        required
                      />
                      {time_now > this.context.customerDetails.datetime ? (
                        <span class="badge badge-danger">
                          Time cannot be earlier than now
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display:
                    this.context.channel === "delivery" ? "inline" : "none",
                }}
              >
                <div class="row">
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <div class="form-group create-title">
                      <label for="postalcode">Postal Code</label>
                      <div class="input-group">
                        <input
                          onChange={this.handleCustomerDetails}
                          value={this.context.customerDetails.postal}
                          type="text"
                          class={
                            !this.context.customerDetails.postal
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="postal"
                          placeholder="Enter Postal Code"
                          maxLength="6"
                          required
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <div class="form-group create-title">
                      <label for="unit">Unit #</label>
                      <input
                        onChange={this.handleCustomerDetails}
                        value={this.context.customerDetails.unit}
                        type="text"
                        class="form-control"
                        name="unit"
                        placeholder="E.g. 01-01"
                      ></input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="form-group create-title">
                      <label for="street">
                        Street Name<b> (Auto-Filled)</b>
                      </label>
                      <input
                        onChange={this.handleCustomerDetails}
                        value={this.context.customerDetails.street}
                        type="text"
                        class={
                          !this.context.customerDetails.street
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="street"
                        placeholder="Enter Street Name"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group create-title">
                <label for="address">Comments</label>
                <input
                  onChange={this.handleCustomerDetails}
                  value={this.context.customerDetails.notes}
                  type="text"
                  class="form-control"
                  name="notes"
                  style={{
                    borderColor: "#b48300",
                  }}
                  placeholder="No chilli etc, leave blank if nil"
                ></input>
              </div>
              <div class="form-group create-title">
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="top"
                  overlay={popover}
                >
                  <label for="remember">Remember me?</label>
                </OverlayTrigger>
                <input
                  name="shouldRememberDetails"
                  type="checkbox"
                  checked={this.state.shouldRememberDetails}
                  onChange={this.toggleShouldRememberDetails}
                  style={{
                    marginLeft: "10px",
                  }}
                ></input>
              </div>
              {this.props.toggle === "cart" ? (
                <React.Fragment>
                  <div class="row d-flex justify-content-center">
                    <Button
                      type="submit"
                      variant={"contained"}
                      style={{
                        backgroundColor: menu_color,
                        borderColor: menu_color,
                        width: "300px",
                        color: menu_font_color,
                      }}
                      disabled={this.state.loading}
                      onClick={() =>
                        onLoad("place_order_custom", this.state.name)
                      }
                    >
                      Place order via WhatsApp
                    </Button>
                  </div>
                  <div class="row d-flex">
                    By placing order via this platform, you agree to our{" "}
                    <a href="https://foodleh.app/privacy"> Privacy Policy</a>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </Form>
        {/* </Dialog> */}
      </div>
    );
  }
}

FullScreenDialog.contextType = CartContext;
export default FullScreenDialog;
