// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import "react-multi-carousel/lib/styles.css";
import queryString from "query-string";
import {
  Button,
  Spinner,
  Form,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import firebase, { db } from "./Firestore";
import ImageGallery from "react-image-gallery";
import Component from "./index";
import Clap from "./Clap";
import Linkify from "react-linkify";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import whatsapp_icon from "../assets/whatsapp_icon.png";
import menu_title from "../assets/info_menu.png";
import orderleh_title from "../assets/orderleh_title.png";
import delivery_title from "../assets/info_delivery.png";
import gradient from "../assets/gradient.png";
import revieworder from "../assets/info_review_order.png";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  // WhatsappShareButton,
  // WhatsappIcon,
} from "react-share";
import Zoom from "@material-ui/core/Zoom";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { BitlyClient } from "bitly";
const REACT_APP_BITLY_KEY = `${process.env.REACT_APP_BITLY_KEY}`;
const bitly = new BitlyClient(REACT_APP_BITLY_KEY, {});
const analytics = firebase.analytics();
const time_now = new Date();
time_now.setMinutes(time_now.getMinutes());
function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

const shorten = (url) => {
  return bitly.shorten(url).then((d) => {
    return d.link;
  });
};

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelectorAll(
      "#back-to-top-anchor"
    )[0];

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        style={{ position: "fixed", bottom: "50px", right: "30px" }}
      >
        {children}
      </div>
    </Zoom>
  );
}

const popover = (
  <Popover>
    <Popover.Content>
      Your details will only be stored in your browser!
    </Popover.Content>
  </Popover>
);

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

export class Info extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      className:
        typeof this.props.className === "string"
          ? this.props.className
          : "container",
      data: [],
      orderData: [],
      totalPrice: 0.0,
      wantToOrder: false,
      name: "",
      unit: "",
      street: "",
      postal: "",
      notes: "",
      customerNumber: "",
      time: time_now.getHours() + ":" + time_now.getMinutes(),
      date: time_now,
      datetime: time_now,
      id: this.props.id || queryString.parse(this.props.location.search).id,
      galleryOpened: false,
      retrieved: false,
      hero: this.props.hero,
      activePhoto: 1,
      hasReviewEditMessage: false,
      hasReviewDeleteMessage: false,
      shouldRememberDetails: false,
    };
    this.enterDetails = this.enterDetails.bind(this);
    this.handleCustomerDetails = this.handleCustomerDetails.bind(this);
    this.updateCustomerDetails = this.updateCustomerDetails.bind(this);
    this.setOrderText = this.setOrderText.bind(this);
    this.formatSummary = this.formatSummary.bind(this);
    this.toggleShouldRememberDetails = this.toggleShouldRememberDetails.bind(
      this
    );
  }

  componentWillMount() {
    this.getDoc();
    console.log("run");

    if (localStorage.getItem("userDetails")) {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.setState(userDetails);
      this.setState({ shouldRememberDetails: true });
    }
  }

  getDoc = async () => {
    await db
      .collection("hawkers")
      .doc(this.state.id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // After querying db for data, initialize orderData if menu info is available
          this.setState({
            data: snapshot.data(),
            retrieved: true,
            orderData: new Array(snapshot.data().menu_combined.length).fill(0),
          });
        }
        onLoad("info_load", snapshot.data().name);
        console.log("Fetched successfully!");
        return true;
      })
      .catch((error) => {
        window.location.reload(true);
        console.log(error);
      });
  };

  updateSavedData(isChecked) {
    if (!isChecked) {
      localStorage.clear();
    } else {
      const userDetails = {
        name: this.state.name,
        customerNumber: this.state.customerNumber,
        postal: this.state.postal,
        unit: this.state.unit,
        street: this.state.street,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  }

  toggleShouldRememberDetails(event) {
    const isChecked = event.target.checked;
    this.setState({ shouldRememberDetails: isChecked });
    this.updateSavedData(isChecked);
  }

  updateCustomerDetails = async (event) => {
    const { name: inputField, value: inputValue } = event.target;
    const inputFields = [
      "name",
      "address",
      "notes",
      "customerNumber",
      "unit",
      "street",
      "postal",
    ];
    if (inputFields.includes(inputField)) {
      this.setState({
        [inputField]: inputValue,
      });
    }
    if (inputField === "postal" && inputValue.length === 6) {
      await this.getPostal(inputValue);
    }
  };

  handleCustomerDetails = async (event) => {
    await this.updateCustomerDetails(event).then(() => {
      this.updateSavedData(this.state.shouldRememberDetails);
    });
  };

  async getPostal(postal) {
    // event.preventDefault();
    let data = await this.callPostal(postal);
    if (data !== undefined) {
      this.setState({
        street: data["ADDRESS"],
      });
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

  formatSummary() {
    let text = "";
    text = text + "New order from " + this.state.name + "\n";
    for (let i = 0; i < this.state.data.menu_combined.length; i = i + 1) {
      if (
        this.state.data.menu_combined !== undefined &&
        this.state.data.menu_combined[i].name !== "" &&
        this.state.orderData[i] !== 0
      ) {
        // customer ordered this item
        const numItems = parseInt(this.state.orderData[i]);
        const thisPrice = parseFloat(
          this.state.data.menu_combined[i].price
            ? this.state.data.menu_combined[i].price
            : 0
        );
        text =
          text +
          "*" +
          numItems +
          "x* _" +
          this.state.data.menu_combined[i].name +
          "_: $" +
          (numItems * thisPrice).toFixed(2) +
          "\n";
      }
    }
    return text;
  }

  setOrderText = async () => {
    let text = "";
    text = text + "New order from " + this.state.name + "\n";
    for (let i = 0; i < this.state.data.menu_combined.length; i = i + 1) {
      if (
        this.state.data.menu_combined !== undefined &&
        this.state.data.menu_combined[i].name !== "" &&
        this.state.orderData[i] !== 0
      ) {
        // customer ordered this item
        const numItems = parseInt(this.state.orderData[i]);
        const thisPrice = parseFloat(
          this.state.data.menu_combined[i].price
            ? this.state.data.menu_combined[i].price
            : 0
        );
        text =
          text +
          "*" +
          numItems +
          "x* _" +
          this.state.data.menu_combined[i].name +
          "_: $" +
          (numItems * thisPrice).toFixed(2) +
          "\n";
      }
    }
    text =
      text +
      "\n\nTotal Price (not including delivery): *$" +
      this.state.totalPrice.toFixed(2) +
      "*";
    text =
      text +
      "\nDelivery address: *" +
      this.state.street +
      " #" +
      this.state.unit +
      " " +
      this.state.postal +
      "*";
    let time_text =
      dayName[this.state.datetime.getDay()] +
      " " +
      this.state.datetime.getDate() +
      " " +
      monthNames[this.state.datetime.getMonth()] +
      " " +
      formatAMPM(this.state.datetime);
    text = text + "\nDelivery Date/Time: *" + time_text + "*";
    if (this.state.notes !== "") {
      // only display notes if customer added
      text = text + "\nAdditional notes: _" + this.state.notes + "_";
    }
    text =
      text + "\nCustomer phone number: *" + this.state.customerNumber + "*";
    text = text + "\nOrdering from: www.foodleh.app/info?id=" + this.state.id;

    const storeData = new URLSearchParams();
    storeData.append("postal", this.state.data.postal);
    storeData.append("street", this.state.data.street);
    storeData.append("unit", this.state.data.unit);
    storeData.append("contact", this.state.data.contact);
    storeData.append("postal_to", this.state.postal);
    storeData.append("street_to", this.state.street);
    storeData.append("unit_to", this.state.unit);
    storeData.append("contact_to", this.state.customerNumber);
    var shortenedURL = await shorten(
      "https://foodleh.app/driver?" + storeData.toString()
    );
    text =
      text + "\n For F&B Owner, request for a driver here: " + shortenedURL;
    if (this.state.data.additional_text) {
      text = text + "\n" + this.state.data.additional_text;
    }

    return encodeURIComponent(text);
  };

  enterDetails() {
    console.log("enterDetails");
    onLoad("view_menu", this.state.data.name);
    this.scrollToMyRef();
    if (this.state.wantToOrder) {
      this.setState({ wantToOrder: false });
    } else {
      this.setState({ wantToOrder: true });
    }
  }

  addItem = async (event) => {
    console.log("addItem");
    const idx = event.target.name;
    this.setState({
      totalPrice:
        parseFloat(this.state.totalPrice) +
        parseFloat(
          this.state.data.menu_combined[idx].price
            ? this.state.data.menu_combined[idx].price
            : 0
        ),
      orderData: update(this.state.orderData, {
        [idx]: { $set: parseInt(this.state.orderData[idx]) + 1 },
      }),
    });
  };

  minusItem = async (event) => {
    console.log("minusItem");
    const idx = event.target.name;
    this.setState({
      // if customer did not order this item previously, do not change total price, keep # item at 0
      totalPrice:
        this.state.orderData[idx] === 0.0
          ? this.state.totalPrice
          : parseFloat(this.state.totalPrice) -
            parseFloat(
              this.state.data.menu_combined[idx].price
                ? this.state.data.menu_combined[idx].price
                : 0
            ),
      orderData: update(this.state.orderData, {
        [idx]: {
          $set:
            this.state.orderData[idx] === 0
              ? 0
              : parseInt(this.state.orderData[idx]) - 1,
        },
      }),
    });
  };

  getMenu = (without_first_item) => {
    if (this.state.data.menu_combined) {
      let data = [];
      this.state.data.menu_combined.forEach((element, i) => {
        console.log(without_first_item);
        // If without_first_item, condition should be (element.name && element.price && i !== 0)) [1]
        // Else condition should only be (element.name && element.price) [2]
        let toPush = true;
        without_first_item
          ? element.name && element.price && i !== 0
            ? (toPush = true)
            : (toPush = false)
          : element.name && element.price
          ? (toPush = true)
          : (toPush = false);
        if (toPush) {
          data.push(
            <div>
              <figure
                className="shadow row"
                style={{
                  margin: "20px",
                  minHeight: "100px",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "5px",
                  position: "relative",
                  display: "flex",
                  padding: "10px 40px 40px",
                }}
              >
                <div className="row">
                  <span
                    style={{
                      alignContent: "right",
                      fontSize: "110%",
                      display: "flex",
                    }}
                  >
                    {/* <b>{element ? element.name : null}</b> */}
                    <b>
                      {element ? (
                        <span>
                          {element.name}
                          {element && element.description ? (
                            <span> ({element.description})</span>
                          ) : null}
                        </span>
                      ) : null}
                    </b>
                  </span>
                </div>
                <div className="row">
                  <div
                    className="col"
                    style={{
                      position: "absolute",
                      left: "5px",
                      bottom: "13px",
                    }}
                  >
                    <span
                      className="shadow badge badge-info m-2"
                      style={{
                        backgroundColor: "#b48300",
                        alignContent: "left",
                        fontSize: "110%",
                      }}
                    >
                      ${element.price ? element.price : "TBD"}
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      position: "absolute",
                      left: "10px",
                      bottom: "10px",
                    }}
                  >
                    <div
                      className="btn-group float-right"
                      role="group"
                      aria-label="Basic example"
                    >
                      <br />
                      {this.state.data.whatsapp ? (
                        <div>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={this.minusItem}
                            name={i}
                            className="shadow-sm"
                            style={{
                              backgroundColor: "white",
                              color: "black",
                              borderRadius: "3px",
                              margin: "10px",
                            }}
                          >
                            -
                          </Button>
                          <span
                            style={{
                              margin: "10px",
                            }}
                          >
                            <b>
                              {this.state.orderData[i] !== undefined
                                ? this.state.orderData[
                                    JSON.parse(JSON.stringify(i))
                                  ]
                                : 0}
                            </b>
                          </span>
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={this.addItem}
                            name={i}
                            className="shadow-sm"
                            style={{
                              backgroundColor: "black",
                              color: "white",
                              borderRadius: "3px",
                              margin: "10px",
                            }}
                          >
                            +
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <br />
              </figure>
            </div>
          );
        }
      });
      return data;
    }
  };

  renderFullscreenButton = (onClick, isFullscreen) => {
    if (!isFullscreen) {
      return (
        <button
          type="button"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            position: "absolute",
            opacity: "0",
          }}
          value="click"
          className={`image-gallery-fullscreen-button${
            isFullscreen ? " active" : ""
          }`}
          onClick={onClick}
        />
      );
    } else if (isFullscreen) {
      return (
        <div
          style={{
            width: "15%",
            height: "15%",
            top: "10%",
            right: "10%",
            position: "absolute",
            opacity: "0.8",
          }}
          onClick={onClick}
          value="click"
        >
          <svg
            className="bi bi-x-circle-fill"
            width="100%"
            height="100%"
            viewBox="0 0 16 16"
            fill="#b48300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-4.146-3.146a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
  };

  showReviewEditMessage = () => {
    this.setState({
      hasReviewEditMessage: true,
      hasReviewDeleteMessage: false,
    });
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.setState({ hasReviewEditMessage: false });
    }, 10000);
  };

  showReviewDeleteMessage = () => {
    this.setState({
      hasReviewDeleteMessage: true,
      hasReviewEditMessage: false,
    });
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.setState({ hasReviewDeleteMessage: false });
    }, 10000);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");
    if (time_now > this.state.datetime) {
      alert("Time cannot be earlier than now");
    } else {
      var text = await this.setOrderText();
      var url = "https://wa.me/65" + this.state.data.contact + "?text=" + text;
      window.location = url;
    }
  };

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

  scrollToMyRef = () => window.scrollTo(0, this.myRef.offsetTop - 60);

  render() {
    let cuisine = [];
    let regions = [];
    let photos = [];
    let whatsAppLink = "https://wa.me/65" + this.state.data.contact;
    if (this.state.retrieved) {
      if (this.state.data.categories) {
        this.state.data.categories.forEach((element) => {
          cuisine.push(
            <span key={element} className="badge badge-info">
              {element}
            </span>
          );
        });
      }
      console.log(this.state.data.tagsValue);
      if (this.state.data.tagsValue) {
        this.state.data.tagsValue.forEach((element) => {
          cuisine.push(
            <span key={element} className="badge badge-secondary">
              {element}
            </span>
          );
        });
      }
      if (this.state.data.regions) {
        this.state.data.regions.forEach((element) => {
          regions.push(
            <span key={element} className="badge badge-warning">
              {element}
            </span>
          );
        });
      }
      if (this.state.data.url) {
        photos.push({
          original: this.state.data.url,
          thumbnail: this.state.data.url,
        });
      }
      if (this.state.data.image1) {
        photos.push({
          original: this.state.data.url,
          thumbnail: this.state.data.url,
        });
      }
      if (this.state.data.image2) {
        photos.push({
          original: this.state.data.image2,
          thumbnail: this.state.data.image2,
        });
      }
      if (this.state.data.image3) {
        photos.push({
          original: this.state.data.image3,
          thumbnail: this.state.data.image3,
        });
      }
      if (this.state.data.image4) {
        photos.push({
          original: this.state.data.image4,
          thumbnail: this.state.data.image4,
        });
      }
      if (this.state.data.image5) {
        photos.push({
          original: this.state.data.image5,
          thumbnail: this.state.data.image5,
        });
      }
      if (photos.length === 0) {
        photos.push({
          original:
            "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/images%2Fplaceholder.png?alt=media&token=29588604-3e5f-4c15-b109-89115227b19a",
          thumbnail:
            "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/images%2Fplaceholder.png?alt=media&token=29588604-3e5f-4c15-b109-89115227b19a",
        });
      }
    }

    return this.state.retrieved ? (
      <div
        className={this.state.className}
        style={{ paddingTop: "56px", width: "100%" }}
      >
        {this.state.hasReviewEditMessage ||
        this.state.hasReviewDeleteMessage ? (
          <div
            className="row"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              className="card shadow"
              style={{
                color: "black",
                backgroundColor: "red",
                width: "100%",
              }}
            >
              <span className="card-body">
                <div
                  style={{
                    fontSize: "13px",
                    margin: "10px",
                  }}
                >
                  {this.state.hasReviewEditMessage ? (
                    <p
                      style={{
                        margin: "10px",
                        fontSize: "30px",
                        color: "white",
                        lineHeight: "25px",
                      }}
                    >
                      Your edit(s) will be reflected once they have been
                      reviewed. Thank you for your patience!
                    </p>
                  ) : (
                    <p
                      style={{
                        margin: "10px",
                        fontSize: "30px",
                        color: "white",
                        lineHeight: "25px",
                      }}
                    >
                      This listing will be deleted once your request has been
                      reviewed. Thank you for your patience!
                    </p>
                  )}
                </div>
              </span>
            </div>
          </div>
        ) : null}
        {this.state.hero ? (
          <div
            className="jumbotron"
            style={{
              background:
                "linear-gradient(rgba(0,0,0,0.5), rgba(255,255,255,0.3)), url(" +
                this.state.data.url +
                ") no-repeat center center",
              backgroundSize: "cover",
              height: "300px",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: "50px",
                fontWeight: "bold",
              }}
            >
              {this.state.name || this.state.data.name}
            </div>
            <div
              style={{
                color: "white",
                fontSize: "15px",
              }}
            >
              {this.state.data.description}
            </div>
          </div>
        ) : null}
        <div className="row">
          <div
            className="d-md-none d-inline-block col-xs-6 col-sm-6 col-md-6 col-lg-6"
            style={{
              padding: "0rem 1rem",
              marginBottom: "0.5rem",
              marginTop: "0rem",
              height: "320px",
              backgroundColor: "white",
            }}
          >
            <div style={{ alignItems: "center" }}>
              {photos.length !== 0 ? (
                <ImageGallery
                  items={photos}
                  renderFullscreenButton={this.renderFullscreenButton}
                  // lazyLoad={false}
                  useBrowserFullscreen={false}
                  showPlayButton={false}
                  useTranslate3D={false}
                  slideDuration={100}
                  // isRTL={false}
                  slideInterval={2000}
                  slideOnThumbnailOver={false}
                  thumbnailPosition={"bottom"}
                />
              ) : null}
            </div>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div
              className="container"
              style={{ textAlign: "left", paddingTop: "10px" }}
            >
              {this.state.hero ? null : (
                <div id="back-to-top-anchor">
                  <h2 style={{ marginBottom: "0" }}>
                    {this.state.data.name}
                  </h2>
                  {cuisine.length > 0 ? (
                    <div>
                      <svg
                        className="bi bi-tag-fill"
                        width="0.88em"
                        height="1em"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 1a1 1 0 00-1 1v4.586a1 1 0 00.293.707l7 7a1 1 0 001.414 0l4.586-4.586a1 1 0 000-1.414l-7-7A1 1 0 006.586 1H2zm4 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                          clipRule="evenodd"
                        />
                      </svg>{" "}
                      {cuisine}
                      <br />
                    </div>
                  ) : null}
                </div>
              )}
              <div style={{ marginTop: "0.75rem" }}>
                <svg
                  className="bi bi-house-fill"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3.293l6 6V13.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M7.293 1.5a1 1 0 011.414 0l6.647 6.646a.5.5 0 01-.708.708L8 2.207 1.354 8.854a.5.5 0 11-.708-.708L7.293 1.5z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
                <a href={"https://maps.google.com/?q=" + this.state.data.street} style={{ color: 'black', textTransform: 'capitalize' }}>
                  {(this.state.data.unit + ' ' + this.state.data.street).toLowerCase()}
                </a>
                {this.state.data.website ? (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-globe"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>{" "}
                    <a
                      href={
                        this.state.data.website.slice(0, 4) === "http"
                          ? this.state.data.website
                          : "https://" + this.state.data.website
                      }
                      onClick={() =>
                        onLoad("website_click", this.state.data.name)
                      }
                      target="blank"
                    >
                      {this.state.data.website.replace(/https?:\/\//,'')}
                    </a>
                  </div>
                ) : null}
                {this.state.data.contact !== "0" ? (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-phone"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>{" "}
                    <span>
                      {this.state.data.contact} {" ("}
                      {this.state.data.whatsapp ? (
                        <span>
                          <a
                            href={whatsAppLink}
                            target="blank"
                            onClick={() => onLoad("message", this.state.data.name)}
                          >
                            WhatsApp
                          </a>
                          {this.state.data.sms || this.state.data.call ? ', ' : null}
                        </span>
                      ) : null}
                      {this.state.data.sms ? (
                        <span>
                          <a href={'sms:+65' + this.state.data.contact}>SMS</a>
                          {this.state.data.call ? ', ' : null}
                        </span>
                      ) : null}
                      {this.state.data.call ? <a href={'tel:+65' + this.state.data.contact}>Call</a> : null}
                      {") "} <br />
                      {this.state.data.wechatid ? (
                        <span style={{ color: "green" }}>
                          <b>WeChat ID: {this.state.data.wechatid}</b>
                        </span>
                      ) : null}
                    </span>
                  </div>
                ) : null}
              </div>
              {this.state.data.pickup_option ||
              this.state.data.delivery_option ? (
                <div style={{ marginTop: "0.75rem" }}>
                  <svg
                    className="bi bi-bag"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 5H2v9a1 1 0 001 1h10a1 1 0 001-1V5zM1 4v10a2 2 0 002 2h10a2 2 0 002-2V4H1z"
                      clipRule="evenodd"
                    />
                    <path d="M8 1.5A2.5 2.5 0 005.5 4h-1a3.5 3.5 0 117 0h-1A2.5 2.5 0 008 1.5z" />
                  </svg>{" "}
                  {this.state.data.pickup_option ? (
                    <span className="badge badge-success">Da Bao</span>
                  ) : null}
                  {this.state.data.delivery_option ? (
                    <span className="badge badge-success">Delivery</span>
                  ) : null}
                  {regions.length > 0 ? (
                    <span style={{ marginLeft: "1rem" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-truck"
                      >
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>{" "}
                      {regions}
                      <br />
                    </span>
                  ) : null}
                </div>
              ) : null}
              {this.state.data.delivery_detail ||
              this.state.data.minimum_order ||
              this.state.data.free_delivery ? (
                <div style={{ marginTop: "0.5rem" }}>
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Details Regarding Delivery</b>
                  </h6>
                  <Linkify>
                    <p
                      style={{
                        whiteSpace: "pre-line",
                        marginBottom: "20px",
                      }}
                    >
                      {this.state.data.delivery_detail}
                    </p>
                    {this.state.data.minimum_order ? (
                      <span>
                        Minimum Order: ${this.state.data.minimum_order}
                        <br />
                      </span>
                    ) : null}
                    {this.state.data.free_delivery ? (
                      <span>Free Delivery: ${this.state.data.free_delivery}</span>
                    ) : null}
                  </Linkify>
                </div>
              ) : null}
              {this.state.data.price ? (
                <div>
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Delivery Fees</b>
                  </h6>
                  <p
                    style={{
                      whiteSpace: "pre-line",
                      marginBottom: "20px",
                    }}
                  >
                    {this.state.data.price}
                  </p>
                </div>
              ) : null}
              {this.state.data.opening ? (
                <div>
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Opening Hours</b>
                  </h6>
                  <p
                    style={{
                      whiteSpace: "pre-line",
                      marginBottom: "20px",
                    }}
                  >
                    {this.state.data.opening}
                  </p>
                </div>
              ) : null}
              {this.state.data.promo ? (
                <div
                  className="card shadow"
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    height: "35px",
                  }}
                >
                  <span className="card-body">
                    <div
                      className="card-title"
                      style={{
                        position: "absolute",
                        top: "6px",
                        fontSize: "13px",
                      }}
                    >
                      <b>{this.state.data.promo}</b>:{" "}
                      {this.state.data.condition &&
                      this.state.data.condition.length > 40
                        ? this.state.data.condition.slice(0, 40) + "..."
                        : this.state.data.condition}
                    </div>
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div
            className="d-none d-md-inline-block col-xs-6 col-sm-6 col-md-6 col-lg-6"
            style={{
              padding: "2.5rem 1rem",
              height: "320px",
              backgroundColor: "white",
            }}
          >
            <div style={{ alignItems: "center" }}>
              {photos.length !== 0 ? (
                <ImageGallery
                  items={photos}
                  renderFullscreenButton={this.renderFullscreenButton}
                  // lazyLoad={false}
                  useBrowserFullscreen={false}
                  showPlayButton={false}
                  useTranslate3D={false}
                  slideDuration={100}
                  // isRTL={false}
                  slideInterval={2000}
                  slideOnThumbnailOver={false}
                  thumbnailPosition={"bottom"}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="row">
          <div
            className="container"
            style={{ textAlign: "left", paddingTop: "10px" }}
          >
            {this.state.data.whatsapp ? (
              <div>
                {/* Display appropriate header - menu / menu with Whatsapp ordering */}
                {this.state.data.menu &&
                this.state.data.menu_combined.length > 0 &&
                this.state.data.menu_combined[0].name !== "" ? (
                  <img
                    alt=""
                    src={this.state.data.whatsapp ? orderleh_title : menu_title}
                    style={{ width: "310px" }}
                    ref={(ref) => (this.myRef = ref)}
                  />
                ) : null}
                {/* Display the first item of the menu with a see more button - TODO: boilerplate code */}
                {this.state.data.menu &&
                this.state.data.menu_combined.length > 0 &&
                this.state.data.menu_combined[0].name !== "" ? (
                  <div style={{ zIndex: -999 }}>
                    <figure
                      className="shadow row"
                      style={{
                        margin: "20px",
                        minHeight: "100px",
                        backgroundColor: "#f1f1f1",
                        borderRadius: "5px",
                        position: "relative",
                        display: "flex",
                        padding: "10px 40px 40px",
                        zIndex: 1,
                      }}
                    >
                      {/* gradient overlay shows if only 1 item OR >1 item && customer hasn't clicked Menu / see more */}
                      {(!this.state.wantToOrder &&
                        this.state.data.menu &&
                        this.state.data.menu_combined.length > 1 &&
                        this.state.data.menu_combined[1] &&
                        this.state.data.menu_combined[1].name !== "") ||
                      // addresses case where >1 item and customer hasnt clicked
                      (!this.state.wantToOrder &&
                        this.state.data.menu_combined[1] &&
                        this.state.data.menu_combined[1].name === "") ||
                      // addresses case where there are multiple items in menu_combined but only 1 non-empty item
                      (!this.state.wantToOrder &&
                        this.state.data.menu_combined.length === 1) ? (
                        // addresses case where there is only 1 item in menu_combined
                        <span style={{ height: "0px" }}>
                          <img
                            src={gradient}
                            alt=""
                            style={{
                              width: "130%",
                              height: "150px",
                              borderRadius: "5px",
                              position: "absolute",
                              bottom: "-30px",
                              left: "-15px",
                              zIndex: "999",
                            }}
                          />
                        </span>
                      ) : null}
                      <div className="row">
                        <span
                          style={{
                            alignContent: "right",
                            fontSize: "110%",
                            display: "flex",
                          }}
                        >
                          <b>
                            {this.state.data.menu_combined[0] ? (
                              <span>
                                {this.state.data.menu_combined[0].name}
                                {this.state.data.menu_combined[0] &&
                                this.state.data.menu_combined[0].description ? (
                                  <span>
                                    {" "}
                                    (
                                    {
                                      this.state.data.menu_combined[0]
                                        .description
                                    }
                                    )
                                  </span>
                                ) : null}
                              </span>
                            ) : null}
                          </b>
                        </span>
                      </div>
                      <div className="row">
                        <div
                          className="col"
                          style={{
                            position: "absolute",
                            left: "5px",
                            bottom: "13px",
                          }}
                        >
                          <span
                            className="shadow badge badge-info m-2"
                            style={{
                              backgroundColor: "#b48300",
                              alignContent: "left",
                              fontSize: "110%",
                            }}
                          >
                            $
                            {this.state.data.menu_combined[0].price
                              ? this.state.data.menu_combined[0].price
                              : "TBD"}
                          </span>
                        </div>
                        <div
                          className="col"
                          style={{
                            position: "absolute",
                            left: "10px",
                            bottom: "10px",
                          }}
                        >
                          <div
                            className="btn-group float-right"
                            role="group"
                            aria-label="Basic example"
                          >
                            <br />
                            {this.state.data.whatsapp ? (
                              <div>
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={this.minusItem}
                                  name={0}
                                  className="shadow-sm"
                                  style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    borderRadius: "3px",
                                    margin: "10px",
                                  }}
                                >
                                  -
                                </Button>
                                <span
                                  style={{
                                    margin: "10px",
                                  }}
                                >
                                  <b>
                                    {this.state.orderData[0] !== undefined
                                      ? this.state.orderData[0] // hardcode 0 to display first menu item
                                      : 0}
                                  </b>
                                </span>
                                <Button
                                  variant="dark"
                                  size="sm"
                                  onClick={this.addItem}
                                  name={0} // hardcode 0 to display first menu item
                                  className="shadow-sm"
                                  style={{
                                    backgroundColor: "black",
                                    color: "white",
                                    borderRadius: "3px",
                                    margin: "10px",
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <br />
                    </figure>
                  </div>
                ) : null}

                {/* Display the rest of the menu if customer clicks Menu / see more */}
                {this.state.wantToOrder ? (
                  <div>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                      <p>{this.getMenu(true)} </p>
                      <div>
                        <br />
                        <img
                          alt=""
                          src={revieworder}
                          style={{ width: "310px" }}
                        />
                      </div>

                      <div>
                        <figure
                          className="shadow"
                          style={{
                            margin: "20px",
                            paddingLeft: "10px",
                            paddingTop: "10px",
                            backgroundColor: "#f1f1f1",
                            borderRadius: "5px",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "110%",
                            }}
                          >
                            <b>Item Summary</b>
                            <br />
                            <br />
                          </span>

                          {/* Item represents object with properties name and price */}
                          {this.state.data.menu_combined.map((item, i) => {
                            if (
                              item !== undefined &&
                              this.state.orderData[i] !== 0
                            ) {
                              return (
                                <div
                                  style={{
                                    position: "relative",
                                    padding: "5px",
                                  }}
                                >
                                  <span
                                    style={{
                                      alignContent: "right",
                                      fontSize: "110%",
                                    }}
                                  >
                                    <b>{item.name ? item.name : null}</b>
                                  </span>
                                  <div
                                    className="btn-group float-right"
                                    role="group"
                                    aria-label="Basic example"
                                  >
                                    <br />
                                    {this.state.data.whatsapp ? (
                                      <div>
                                        <Button
                                          variant="light"
                                          size="sm"
                                          onClick={this.minusItem}
                                          name={i}
                                          className="shadow-sm"
                                          style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            borderRadius: "3px",
                                            margin: "10px",
                                          }}
                                        >
                                          -
                                        </Button>
                                        <span
                                          style={{
                                            margin: "10px",
                                          }}
                                        >
                                          <b>
                                            {this.state.orderData[i] !==
                                            undefined
                                              ? this.state.orderData[
                                                  JSON.parse(JSON.stringify(i))
                                                ]
                                              : 0}
                                          </b>
                                        </span>
                                        <Button
                                          variant="dark"
                                          size="sm"
                                          onClick={this.addItem}
                                          name={i}
                                          className="shadow-sm"
                                          style={{
                                            backgroundColor: "black",
                                            color: "white",
                                            borderRadius: "3px",
                                            margin: "10px",
                                          }}
                                        >
                                          +
                                        </Button>
                                      </div>
                                    ) : null}
                                  </div>
                                  <br />
                                  <span
                                    className="shadow badge badge-info m-2"
                                    style={{
                                      backgroundColor: "#b48300",
                                      alignContent: "left",
                                      fontSize: "110%",
                                    }}
                                  >
                                    ${item.price ? item.price : "TBD"}
                                  </span>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}

                          <figcaption>
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
                            <div
                              style={{
                                textAlign: "right",
                                paddingBottom: "10px",
                                paddingRight: "15px",
                                fontSize: "110%",
                              }}
                            >
                              <b>
                                $
                                {this.state.totalPrice !== undefined
                                  ? this.state.totalPrice.toFixed(2)
                                  : "0.00"}
                              </b>
                            </div>
                            <div
                              style={{
                                color: "red",
                                paddingBottom: "10px",
                                paddingRight: "15px",
                              }}
                            >
                              <b>*Delivery fees may apply</b>
                            </div>
                          </figcaption>
                        </figure>
                      </div>
                      <br />
                      <div>
                        <img
                          alt=""
                          src={delivery_title}
                          style={{ width: "310px" }}
                        />

                        <div className="form-group create-title">
                          <label for="name">Name</label>
                          <input
                            onChange={this.handleCustomerDetails}
                            value={this.state.name}
                            type="text"
                            className="form-control"
                            name="name"
                            style={{ borderColor: "#b48300" }}
                            placeholder="We don't store your info!"
                          ></input>
                        </div>

                        <div className="form-group create-title">
                          <label for="unit">Mobile Number: </label>
                          <div className="input-group mb-12">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                +65
                              </span>
                            </div>
                            <input
                              onChange={this.handleCustomerDetails}
                              value={this.state.customerNumber}
                              type="tel"
                              className={
                                !this.state.customerNumber
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
                                borderRadius: "5px",
                              }}
                              required
                            ></input>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            <div class="form-group create-title">
                              <label for="time">Delivery Date</label>
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
                          <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                            <div class="form-group create-title">
                              <label for="time">Delivery Time</label>
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
                                  Time cannot be earlier than now
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="row">
                            {" "}
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                              {" "}
                              <div className="form-group create-title">
                                <label for="postalcode">Postal Code</label>
                                <div className="input-group">
                                  <input
                                    onChange={this.handleCustomerDetails}
                                    value={this.state.postal}
                                    type="text"
                                    className={
                                      !this.state.postal
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
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                              {" "}
                              <div className="form-group create-title">
                                <label for="unit">Unit #</label>
                                <input
                                  onChange={this.handleCustomerDetails}
                                  value={this.state.unit}
                                  type="text"
                                  className="form-control"
                                  name="unit"
                                  placeholder="E.g. 01-01"
                                ></input>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                              <div className="form-group create-title">
                                <label for="street">
                                  Street Name<b> (Auto-Filled)</b>
                                </label>
                                <input
                                  onChange={this.handleCustomerDetails}
                                  value={this.state.street}
                                  type="text"
                                  className={
                                    !this.state.street
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

                        {/* 
                            <div className="form-group create-title">
                              <label for="address">Address</label>
                              <input
                                onChange={this.handleCustomerDetails}
                                value={this.state.address}
                                type="text"
                                className="form-control"
                                name="address"
                                style={{ borderColor: "#b48300" }}
                                placeholder=""
                              ></input>
                            </div> */}
                        <div className="form-group create-title">
                          <label for="address">Comments</label>
                          <input
                            onChange={this.handleCustomerDetails}
                            value={this.state.notes}
                            type="text"
                            className="form-control"
                            name="notes"
                            style={{
                              borderColor: "#b48300",
                            }}
                            placeholder="No chilli etc, leave blank if nil"
                          ></input>
                        </div>
                        <div className="form-group create-title">
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
                        <Button
                          className="shadow-sm"
                          // href={
                          //   "https://wa.me/65" +
                          //   this.state.data.contact +
                          //   "?text=" +
                          //   this.setOrderText()
                          // }
                          // target="blank"
                          type="Submit"
                          style={{
                            backgroundColor: "#B48300",
                            borderColor: "#B48300",
                            fontSize: "20px",
                            width: "300px",
                          }}
                          name="Language"
                          onClick={() =>
                            onLoad("place_order", this.state.data.name)
                          }
                        >
                          Place order via WhatsApp
                        </Button>
                        <br />
                      </div>
                    </Form>
                  </div>
                ) : null}

                {/* See more button shows if only 1 item OR >1 item && customer hasn't clicked Menu / see more */}
                {
                  this.state.data.menu && (
                    (this.state.data.menu_combined.length > 1 &&
                      this.state.data.menu_combined[1] &&
                      this.state.data.menu_combined[1].name !== "") ||
                    (this.state.data.menu_combined[0] &&
                      this.state.data.menu_combined[0].name !== "" &&
                      this.state.data.menu_combined[1] &&
                      this.state.data.menu_combined[1].name === "") ||
                    (this.state.data.menu_combined.length === 1 &&
                      this.state.data.menu_combined[0] &&
                      this.state.data.menu_combined[0].name !== "") 
                  ) 
                    ? <div style={{ marginTop: "30px" }}>
                      <hr
                        style={{
                          color: "grey",
                          backgroundColor: "grey",
                          height: "1px",
                          borderColor: "grey",
                          width: "100%",
                          alignItems: "center",
                          marginBottom: "0px", // aligns See More to divider
                        }}
                      />
                      <div
                        style={{
                          textAlign: "center",
                          paddingRight: "15px",
                          fontSize: "110%",
                          cursor: "pointer",
                          color: "grey",
                        }}
                        onClick={this.enterDetails}
                      >
                        {!this.state.wantToOrder ? <b>see more ↓</b> : <b>see less ↑</b>}
                      </div>
                    </div>
                    : null
                }
              </div>
            ) : null}
            <span className="d-inline-block d-md-none">
              <Component.Popup
                data={this.state.data}
                id={this.state.id}
                onSubmitEdit={this.showReviewEditMessage}
                onSubmitDelete={this.showReviewDeleteMessage}
              />
            </span>

            <div
              className="d-inline-block d-md-none col-xs-6 col-sm-6 col-md-6 col-lg-6"
              style={{ padding: "0" }}
            >
              Share this with friends!
              <br />
              <FacebookShareButton
                url={"www.foodleh.app/info?id=" + this.state.id}
                quote={"Hungry? Try out " + this.state.data.name + " now!"}
                hashtag={"#saveourFnB"}
              >
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>{" "}
              <span className="" style={{ marginRight: "5px" }}>
                <a
                  href={
                    "whatsapp://send?text=" +
                    encodeURIComponent(
                      "Hungry? Try out " +
                        this.state.data.name +
                        " now! Order form / more information at www.foodleh.app/info?id=" +
                        this.state.id
                    )
                  }
                >
                  <img
                    alt=""
                    src={whatsapp_icon}
                    style={{ width: "32px", cursor: "pointer" }}
                  />
                </a>
              </span>
              <TelegramShareButton
                url={"www.foodleh.app/info?id=" + this.state.id}
                title={"Hungry? Try out " + this.state.data.name + " now!"}
              >
                <TelegramIcon size={32} round={true} />
              </TelegramShareButton>{" "}
              <TwitterShareButton
                url={"www.foodleh.app/info?id=" + this.state.id}
                title={"Hungry? Try out " + this.state.data.name + " now!"}
              >
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>{" "}
            </div>

            {this.state.data.description ? (
              <div>
                <br />
                <h6 style={{ marginBottom: "0px" }}>
                  <b>Brief Description</b>
                </h6>
              </div>
            ) : null}
            <Linkify>
              {this.state.data.description ? (
                <p style={{ marginBottom: "20px" }}>
                  {this.state.data.description}
                </p>
              ) : null}
              {this.state.data.description_detail &&
              this.state.data.description_detail !== "" &&
              this.state.data.description_detail !== undefined ? (
                <div>
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Detailed Description</b>
                  </h6>
                  <p
                    style={{
                      whiteSpace: "pre-line",
                      marginBottom: "20px",
                    }}
                  >
                    {this.state.data.description_detail}
                  </p>
                </div>
              ) : null}
            </Linkify>
            {/* {Menu appears if menu data is present and whatsapp is not present} */}
            {this.state.data.menu && !this.state.data.whatsapp ? (
              <div>
                <h6 style={{ marginBottom: "0px" }}>
                  <b>Menu Items</b>
                </h6>
                <p>{this.getMenu(false)} </p>
                <br></br>
              </div>
            ) : null}            
            <div className="row" style={{ margin: "1rem 0" }}>
              <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-6"
                style={{ padding: "0" }}
              >
                <Clap
                  collection={"hawkers"}
                  id={this.state.id}
                  claps={this.state.data.claps}
                />
              </div>
              <div
                className="d-none d-md-inline-block col-xs-6 col-sm-6 col-md-6 col-lg-6"
                style={{ padding: "0" }}
              >
                <div style={{ fontSize: "12px" }}>
                  {" "}
                  Share this with friends!
                </div>
                <FacebookShareButton
                  url={"www.foodleh.app/info?id=" + this.state.id}
                  quote={"Hungry? Try out " + this.state.data.name + " now!"}
                  hashtag={"#saveourFnB"}
                >
                  <FacebookIcon size={32} round={true} />
                </FacebookShareButton>{" "}
                <span className="" style={{ marginRight: "5px" }}>
                  <a
                    href={
                      "whatsapp://send?text=" +
                      encodeURIComponent(
                        "Hungry? Try out " +
                          this.state.data.name +
                          " now! Order form / more information at www.foodleh.app/info?id=" +
                          this.state.id
                      )
                    }
                  >
                    <img
                      alt=""
                      src={whatsapp_icon}
                      style={{ width: "32px", cursor: "pointer" }}
                    />
                  </a>
                </span>
                <TelegramShareButton
                  url={"www.foodleh.app/info?id=" + this.state.id}
                  title={"Hungry? Try out " + this.state.data.name + " now!"}
                >
                  <TelegramIcon size={32} round={true} />
                </TelegramShareButton>{" "}
                <TwitterShareButton
                  url={"www.foodleh.app/info?id=" + this.state.id}
                  title={"Hungry? Try out " + this.state.data.name + " now!"}
                >
                  <TwitterIcon size={32} round={true} />
                </TwitterShareButton>{" "}
              </div>
            </div>
            <Component.Popup
              data={this.state.data}
              id={this.state.id}
              onSubmitEdit={this.showReviewEditMessage}
              onSubmitDelete={this.showReviewDeleteMessage}
            />
            <p style={{ color: "grey" }}>
              <small>
                Are you the owner? Email foodleh@outlook.com for enquiries.{" "}
              </small>
            </p>
            <ScrollTop>
              <Fab color="primary" size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </div>
        </div>
      </div>
    ) : (
      <div className="row h-100 page-container">
        <div className="col-sm-12 my-auto">
          <h3>Loading</h3>
          <Spinner className="" animation="grow" />
        </div>
      </div>
    );
  }
}

export default withRouter(Info);
