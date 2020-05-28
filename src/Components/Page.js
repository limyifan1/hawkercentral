// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import "react-multi-carousel/lib/styles.css";
// import queryString from "query-string";
import {
  Button,
  // Spinner,
  Form,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { db } from "./Firestore";
// import ImageGallery from "react-image-gallery";
import Component from "./index";
import Clap from "./Clap";
import Linkify from "react-linkify";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import whatsapp_icon from "../assets/whatsapp_icon.png";
// import whatsapp_button from "../assets/whatsapp_button.png";
// import menu_button from "../assets/menu_button.png";
// import website_button from "../assets/website_button.png";
// import menu_title from "../assets/info_menu.png";
// import orderleh_title from "../assets/orderleh_title.png";
import delivery_title from "../assets/info_delivery.png";
// import gradient from "../assets/gradient.png";
import revieworder from "../assets/info_review_order.png";
import firebase from "./Firestore";
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
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LanguageContext } from "./themeContext";
// import name from "../logo-header-nologo.png";
import logo from "../foodleh.png";
import { CartContext } from "./themeContext";

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

const InfoMenu = (props) => {
  const menu_color = props && props.css ? props.css.menu_color : null;
  const menu_font_color = props && props.css ? props.css.menu_font_color : null;
  return (
    <Navbar
      //   bg="light"
      variant="dark"
      style={{
        position: "fixed",
        width: "100vw",
        zIndex: "100",
        backgroundColor: menu_color,
      }}
    >
      <Navbar.Brand as={Link} to="/" style={{ color: "white" }}>
        <img
          alt=""
          src={logo}
          width="20"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        <div class="d-none d-md-inline-block">
          {/* <img
            alt=""
            src={name}
            width="140"
            height="30"
            className="d-inline-block align-top"
          /> */}
          {props.name}
        </div>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="justify-content-end"
        style={{ marginRight: "60px" }}
      >
        <LanguageContext.Consumer>
          {({ data, language, toggleLanguage }) => (
            <Button
              class="shadow-sm"
              style={{
                backgroundColor: "#B48300",
                borderColor: "#B48300",
                fontSize: "10px",
                width: "50px",
              }}
              onClick={toggleLanguage}
              name="Language"
            >
              {data.menu.language_button}
            </Button>
          )}
        </LanguageContext.Consumer>
        <div class="d-none d-md-inline-block">
          <Nav.Link
            href="#"
            as={Link}
            to="/"
            id="menu-link"
            style={{ color: menu_font_color }}
            // onClick={onClick("home")}
          >
            <LanguageContext.Consumer>
              {({ data }) => data.menu.homelabel}
            </LanguageContext.Consumer>
          </Nav.Link>
        </div>
        <Nav.Item>
          <Nav.Link
            href="#about"
            as={Link}
            to="/about"
            id="menu-link"
            style={{ color: menu_font_color }}
            //   onClick={onClick("about")}
          >
            <LanguageContext.Consumer>
              {({ data }) => data.menu.aboutlabel}
            </LanguageContext.Consumer>
          </Nav.Link>
        </Nav.Item>
      </Navbar.Collapse>
      <Navbar.Brand style={{ color: menu_font_color }}>
        <Component.PageCart />
      </Navbar.Brand>
    </Navbar>
  );
};

function ScrollTop(props) {
  const { children, window } = props;
  // const menu_color = props && props.css ? props.css.menu_color : null;
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

export class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      orderData: [],
      totalPrice: 0.0,
      wantToOrder: false,
      name: "",
      unit: "",
      street: "",
      postal: "",
      notes: "",
      customerNumber: "",
      deliveryTime: "",
      id: "",
      galleryOpened: false,
      retrieved: true,
      activePhoto: 1,
      hasReviewEditMessage: false,
      hasReviewDeleteMessage: false,
      shouldRememberDetails: false,
      css: { menu_color: "", menu_font_color: "" },
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
    console.log("run");
    this.setState({ data: this.context.data });
    if (localStorage.getItem("userDetails")) {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.setState(userDetails);
      this.setState({ shouldRememberDetails: true });
    }
  }

  getDoc = async () => {
    await db
      .collection("pages")
      .doc(this.props.pageName)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // After querying db for data, initialize orderData if menu info is available
          this.setState(snapshot.data());
          console.log(this.state);
        }
        //   onLoad("info_load", snapshot.data().name);
        return true;
      })
      .catch((error) => {
        window.location.reload(true);
        console.log(error);
      });

    await db
      .collection("hawkers")
      .doc(this.state.docid)
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
        // window.location.reload(true);
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
    const inputValue = event.target.value;
    const inputField = event.target.name;
    if (inputField === "name") {
      this.setState({
        name: inputValue,
      });
    } else if (inputField === "address") {
      this.setState({
        address: inputValue,
      });
    } else if (inputField === "notes") {
      this.setState({
        notes: inputValue,
      });
    } else if (inputField === "customerNumber") {
      this.setState({
        customerNumber: inputValue,
      });
    } else if (inputField === "deliveryTime") {
      this.setState({
        deliveryTime: inputValue,
      });
    } else if (inputField === "unit") {
      this.setState({
        unit: inputValue,
      });
    } else if (inputField === "street") {
      this.setState({
        street: inputValue, // TODO: autofill
      });
    } else if (inputField === "postal") {
      this.setState({
        postal: inputValue,
      });
      if (inputValue.length === 6) {
        await this.getPostal(inputValue);
      }
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

  getSocialSharing = () => {
    return (
      <div>
        Share this with friends!
        <br />
        <FacebookShareButton
          url={"www.foodleh.app/info?id=" + this.state.id}
          quote={"Hungry? Try out " + this.context.pageData.name + " now!"}
          hashtag={"#saveourFnB"}
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>{" "}
        <span class="" style={{ marginRight: "5px" }}>
          <a
            href={
              "whatsapp://send?text=" +
              encodeURIComponent(
                "Hungry? Try out " +
                  this.context.pageData.name +
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
        {/* <WhatsappShareButton
                    url={"www.foodleh.app/info?id=" + this.state.id}
                    title={"Hungry? Try out " + this.context.pageData.name + " now!"}
                  >
                    <WhatsappIcon size={32} round={true} />
                  </WhatsappShareButton>{" "} */}
        <TelegramShareButton
          url={"www.foodleh.app/info?id=" + this.state.id}
          title={"Hungry? Try out " + this.context.pageData.name + " now!"}
        >
          <TelegramIcon size={32} round={true} />
        </TelegramShareButton>{" "}
        <TwitterShareButton
          url={"www.foodleh.app/info?id=" + this.state.id}
          title={"Hungry? Try out " + this.context.pageData.name + " now!"}
        >
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>{" "}
      </div>
    );
  };

  getDeliveryDetail = () => {
    return (
      <div>
        {/* Display the menu */}
        <div>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <div>
              <br />
              <img alt="" src={revieworder} style={{ width: "60%" }} />
            </div>
            <div>
              <figure
                class="shadow"
                style={{
                  margin: "20px",
                  paddingLeft: "10px",
                  paddingTop: "10px",
                  backgroundColor: "#f1f1f1",
                  "border-radius": "5px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
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
              <img alt="" src={delivery_title} style={{ width: "60%" }} />
              <div class="form-group create-title">
                <label for="name">Name</label>
                <input
                  onChange={this.handleCustomerDetails}
                  value={this.state.name}
                  type="text"
                  class="form-control"
                  name="name"
                  style={{ borderColor: "#b48300" }}
                  placeholder="We don't store your info!"
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
                    value={this.state.customerNumber}
                    type="tel"
                    class={
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
                      "border-radius": "5px",
                    }}
                    required
                  ></input>
                </div>
              </div>

              <div class="form-group create-title">
                <label for="address">Delivery Day/Time</label>
                <input
                  onChange={this.handleCustomerDetails}
                  value={this.state.deliveryTime}
                  type="text"
                  class="form-control"
                  name="deliveryTime"
                  style={{ borderColor: "#b48300" }}
                  placeholder="Eg Thursday 7 May 12.30pm"
                ></input>
              </div>

              <div>
                <div class="row">
                  {" "}
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    {" "}
                    <div class="form-group create-title">
                      <label for="postalcode">Postal Code</label>
                      <div class="input-group">
                        <input
                          onChange={this.handleCustomerDetails}
                          value={this.state.postal}
                          type="text"
                          class={
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
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    {" "}
                    <div class="form-group create-title">
                      <label for="unit">Unit #</label>
                      <input
                        onChange={this.handleCustomerDetails}
                        value={this.state.unit}
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
                        value={this.state.street}
                        type="text"
                        class={
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
              <div class="form-group create-title">
                <label for="address">Comments</label>
                <input
                  onChange={this.handleCustomerDetails}
                  value={this.state.notes}
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
              <Button
                class="shadow-sm"
                // href={
                //   "https://wa.me/65" +
                //   this.context.pageData.contact +
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
                  onLoad("place_order", this.context.pageData.name)
                }
              >
                Place order via WhatsApp
              </Button>
              <br />
            </div>
          </Form>
        </div>
      </div>
    );
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

  formatSummary() {
    let text = "";
    text = text + "New order from " + this.state.name + "\n";
    for (let i = 0; i < this.context.pageData.menu_combined.length; i = i + 1) {
      if (
        this.context.pageData.menu_combined !== undefined &&
        this.context.pageData.menu_combined[i].name !== "" &&
        this.state.orderData[i] !== 0
      ) {
        // customer ordered this item
        const numItems = parseInt(this.state.orderData[i]);
        const thisPrice = parseFloat(
          this.context.pageData.menu_combined[i].price
            ? this.context.pageData.menu_combined[i].price
            : 0
        );
        text =
          text +
          "*" +
          numItems +
          "x* _" +
          this.context.pageData.menu_combined[i].name +
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
    for (let i = 0; i < this.context.pageData.menu_combined.length; i = i + 1) {
      if (
        this.context.pageData.menu_combined !== undefined &&
        this.context.pageData.menu_combined[i].name !== "" &&
        this.state.orderData[i] !== 0
      ) {
        // customer ordered this item
        const numItems = parseInt(this.state.orderData[i]);
        const thisPrice = parseFloat(
          this.context.pageData.menu_combined[i].price
            ? this.context.pageData.menu_combined[i].price
            : 0
        );
        text =
          text +
          "*" +
          numItems +
          "x* _" +
          this.context.pageData.menu_combined[i].name +
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
    text = text + "\nDelivery Date/Time: *" + this.state.deliveryTime + "*";
    if (this.state.notes !== "") {
      // only display notes if customer added
      text = text + "\nAdditional notes: _" + this.state.notes + "_";
    }
    text =
      text + "\nCustomer phone number: *" + this.state.customerNumber + "*";
    text = text + "\nOrdering from: www.foodleh.app/info?id=" + this.state.id;

    const storeData = new URLSearchParams();
    storeData.append("postal", this.context.pageData.postal);
    storeData.append("street", this.context.pageData.street);
    storeData.append("unit", this.context.pageData.unit);
    storeData.append("contact", this.context.pageData.contact);
    storeData.append("postal_to", this.state.postal);
    storeData.append("street_to", this.state.street);
    storeData.append("unit_to", this.state.unit);
    storeData.append("contact_to", this.state.customerNumber);
    var shortenedURL = await shorten(
      "https://foodleh.app/driver?" + storeData.toString()
    );
    text =
      text + "\n For F&B Owner, request for a driver here: " + shortenedURL;
    return encodeURIComponent(text);
  };

  enterDetails() {
    console.log("enterDetails");
    onLoad("view_menu", this.context.pageData.name);
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
          this.context.pageData.menu_combined[idx].price
            ? this.context.pageData.menu_combined[idx].price
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
              this.context.pageData.menu_combined[idx].price
                ? this.context.pageData.menu_combined[idx].price
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
    if (this.context.pageData.menu_combined) {
      let data = [];
      this.context.pageData.menu_combined.forEach((element, i) => {
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
            <Component.PageItem
              name={element["name"]}
              price={element["price"]}
              pic={element["image"]}
              summary={element["description"]}
              css={this.context.css}
            />
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
            class="bi bi-x-circle-fill"
            width="100%"
            height="100%"
            viewBox="0 0 16 16"
            fill="#b48300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-4.146-3.146a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z"
              clip-rule="evenodd"
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
    setTimeout(() => {
      this.setState({ hasReviewEditMessage: false });
    }, 10000);
  };

  showReviewDeleteMessage = () => {
    this.setState({
      hasReviewDeleteMessage: true,
      hasReviewEditMessage: false,
    });
    setTimeout(() => {
      this.setState({ hasReviewDeleteMessage: false });
    }, 10000);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");
    var text = await this.setOrderText();
    var url =
      "https://wa.me/65" + this.context.pageData.contact + "?text=" + text;
    window.location = url;
  };

  render() {
    let cuisine = [];
    let regions = [];
    let photos = [];
    console.log(this.context.pageData);
    // let link = "https://wa.me/65" + this.context.pageData.contact;
    if (this.state.retrieved) {
      if (this.context.pageData.categories) {
        this.context.pageData.categories.forEach((element) => {
          cuisine.push(<span class="badge badge-info">{element}</span>);
        });
      }
      if (this.context.pageData.tagsValue) {
        this.context.pageData.tagsValue.forEach((element) => {
          cuisine.push(<span class="badge badge-secondary">{element}</span>);
        });
      }
      if (this.context.pageData.regions) {
        this.context.pageData.regions.forEach((element) => {
          regions.push(<span class="badge badge-warning">{element}</span>);
        });
      }
      if (this.context.pageData.url) {
        photos.push({
          original: this.context.pageData.url,
          thumbnail: this.context.pageData.url,
        });
      }
      if (this.context.pageData.image1) {
        photos.push({
          original: this.context.pageData.url,
          thumbnail: this.context.pageData.url,
        });
      }
      if (this.context.pageData.image2) {
        photos.push({
          original: this.context.pageData.image2,
          thumbnail: this.context.pageData.image2,
        });
      }
      if (this.context.pageData.image3) {
        photos.push({
          original: this.context.pageData.image3,
          thumbnail: this.context.pageData.image3,
        });
      }
      if (this.context.pageData.image4) {
        photos.push({
          original: this.context.pageData.image4,
          thumbnail: this.context.pageData.image4,
        });
      }
      if (this.context.pageData.image5) {
        photos.push({
          original: this.context.pageData.image5,
          thumbnail: this.context.pageData.image5,
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

    return (
      <div>
        {InfoMenu(this.context)}
        <div
          class="container-fluid"
          style={{
            paddingTop: "56px",
            width: "100vw",
            paddingLeft: "15px",
            paddingRight: "15px",
          }}
        >
          {this.state.hasReviewEditMessage ||
          this.state.hasReviewDeleteMessage ? (
            <div
              class="row"
              style={{
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <div
                class="card shadow"
                style={{
                  color: "black",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <span class="card-body">
                  <div
                    class="card-title"
                    style={{
                      fontSize: "13px",
                      margin: "0px",
                    }}
                  >
                    {this.state.hasReviewEditMessage ? (
                      <p style={{ margin: "0px" }}>
                        Your edit(s) will be reflected once they have been
                        reviewed. Thank you for your patience!
                      </p>
                    ) : (
                      <p style={{ margin: "0px" }}>
                        This listing will be deleted once your request has been
                        reviewed. Thank you for your patience!
                      </p>
                    )}
                  </div>
                </span>
              </div>
            </div>
          ) : null}
          <div>
            {this.context.pageData.url ? (
              <div
                class="container-fluid row align-items-center"
                style={{
                  background:
                    "linear-gradient(rgba(0,0,0,0.5), rgba(255,255,255,0.3)), url(" +
                    this.context.pageData.url +
                    ") no-repeat center center",
                  backgroundSize: "cover",
                  minHeight: "300px",
                  width: "100vw",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div class="center">
                  <div
                    style={{
                      color: "white",
                      fontSize: "50px",
                      fontWeight: "bold",
                    }}
                    id="back-to-top-anchor"
                  >
                    {this.context.pageData.name}
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "15px",
                    }}
                  >
                    {this.context.pageData.description}
                  </div>
                  <br />
                  {regions.length > 0 ? (
                    <span style={{ margin: "5px" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-truck"
                      >
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>{" "}
                      {regions}
                    </span>
                  ) : null}
                  {cuisine.length > 0 ? (
                    <span style={{ margin: "5px" }}>
                      <svg
                        class="bi bi-tag-fill"
                        width="0.88em"
                        height="1em"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2 1a1 1 0 00-1 1v4.586a1 1 0 00.293.707l7 7a1 1 0 001.414 0l4.586-4.586a1 1 0 000-1.414l-7-7A1 1 0 006.586 1H2zm4 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                          clip-rule="evenodd"
                        />
                      </svg>{" "}
                      {cuisine}
                    </span>
                  ) : null}
                  {this.context.pageData.pickup_option ||
                  this.context.pageData.delivery_option ? (
                    <span style={{ margin: "5px" }}>
                      <svg
                        class="bi bi-bag"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        stroke="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14 5H2v9a1 1 0 001 1h10a1 1 0 001-1V5zM1 4v10a2 2 0 002 2h10a2 2 0 002-2V4H1z"
                          clip-rule="evenodd"
                        />
                        <path d="M8 1.5A2.5 2.5 0 005.5 4h-1a3.5 3.5 0 117 0h-1A2.5 2.5 0 008 1.5z" />
                      </svg>{" "}
                      {this.context.pageData.pickup_option ? (
                        <span class="badge badge-success">Da Bao</span>
                      ) : null}
                      {this.context.pageData.delivery_option ? (
                        <span class="badge badge-success">Delivery</span>
                      ) : null}{" "}
                      <br />
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: "300px",
                }}
              ></div>
            )}
            <div className="row justify-content-center mt-4">
              {this.getMenu(0)}
            </div>
            <div class="row">
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div
                  class="container"
                  style={{ textAlign: "left", paddingTop: "10px" }}
                >
                  <br />
                  {/* Custom button display: menu, website, message */}
                  <div></div>
                  <br />
                  <br />
                  <Component.Popup
                    data={this.context.pageData}
                    id={this.state.id}
                    onSubmitEdit={this.showReviewEditMessage}
                    onSubmitDelete={this.showReviewDeleteMessage}
                  />
                  <br />
                  {this.context.pageData.promo ? (
                    <div
                      class="card shadow"
                      style={{
                        color: "black",
                        backgroundColor: "white",
                        height: "35px",
                      }}
                    >
                      <span class="card-body">
                        <div
                          class="card-title"
                          style={{
                            position: "absolute",
                            top: "6px",
                            fontSize: "13px",
                          }}
                        >
                          <b>{this.context.pageData.promo}</b>:{" "}
                          {this.context.pageData.condition &&
                          this.context.pageData.condition.length > 40
                            ? this.context.pageData.condition.slice(0, 40) +
                              "..."
                            : this.context.pageData.condition}
                        </div>
                      </span>
                    </div>
                  ) : null}
                  <br />
                  <Clap
                    collection={"hawkers"}
                    id={this.state.id}
                    claps={this.context.pageData.claps}
                  />
                  {this.context.pageData.description ? (
                    <div>
                      <br />
                      <h6 style={{ marginBottom: "0px" }}>
                        <b>Brief Description</b>
                      </h6>
                    </div>
                  ) : null}
                  <Linkify>
                    {this.context.pageData.description ? (
                      <p style={{ marginBottom: "20px" }}>
                        {this.context.pageData.description}
                      </p>
                    ) : null}
                    {this.context.pageData.description_detail &&
                    this.context.pageData.description_detail !== "" &&
                    this.context.pageData.description_detail !== undefined ? (
                      <div>
                        <h6 style={{ marginBottom: "0px" }}>
                          <b>Detailed Description</b>
                        </h6>
                        <p
                          style={{
                            "white-space": "pre-line",
                            marginBottom: "20px",
                          }}
                        >
                          {this.context.pageData.description_detail}
                        </p>
                      </div>
                    ) : null}
                  </Linkify>
                  {/* {Menu appears if menu data is present and whatsapp is not present} */}
                  {this.context.pageData.menu &&
                  !this.context.pageData.whatsapp ? (
                    <div>
                      <h6 style={{ marginBottom: "0px" }}>
                        <b>Menu Items</b>
                      </h6>
                      <p>{this.getMenu(false)} </p>
                      <br></br>
                    </div>
                  ) : null}
                  {this.context.pageData.delivery_detail ? (
                    <div>
                      <h6 style={{ marginBottom: "0px" }}>
                        <b>Details Regarding Delivery</b>
                      </h6>
                      <Linkify>
                        <p
                          style={{
                            "white-space": "pre-line",
                            marginBottom: "20px",
                          }}
                        >
                          {this.context.pageData.delivery_detail}
                        </p>
                      </Linkify>
                    </div>
                  ) : null}
                  {this.context.pageData.price ? (
                    <div>
                      <h6 style={{ marginBottom: "0px" }}>
                        <b>Delivery Fees</b>
                      </h6>
                      <p
                        style={{
                          "white-space": "pre-line",
                          marginBottom: "20px",
                        }}
                      >
                        {this.context.pageData.price}
                      </p>
                    </div>
                  ) : null}
                  {this.context.pageData.opening ? (
                    <div>
                      <h6 style={{ marginBottom: "0px" }}>
                        <b>Opening Hours</b>
                      </h6>
                      <p
                        style={{
                          "white-space": "pre-line",
                          marginBottom: "20px",
                        }}
                      >
                        {this.context.pageData.opening}
                      </p>
                    </div>
                  ) : null}
                  {/* <p style={{ marginBottom: "20px" }}>
                    {this.context.pageData.website ? (
                      this.context.pageData.website.slice(0, 4) === "http" ? (
                        <a href={this.context.pageData.website}>Website Link</a>
                      ) : (
                        <a href={"https://" + this.context.pageData.website}>
                          Website Link
                        </a>
                      )
                    ) : null}
                  </p> */}
                  <p style={{ color: "grey" }}>
                    <small>
                      Are you the owner? Email foodleh@outlook.com for
                      enquiries.{" "}
                    </small>
                  </p>
                  <ScrollTop>
                    <Fab
                      color="primary"
                      size="small"
                      aria-label="scroll back to top"
                    >
                      <KeyboardArrowUpIcon />
                    </Fab>
                  </ScrollTop>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Page.contextType = CartContext;
export default withRouter(Page);
