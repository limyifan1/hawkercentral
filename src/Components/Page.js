// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import "react-multi-carousel/lib/styles.css";
// import queryString from "query-string";
import // Button,
// Spinner,
// Form,
// Popover,
// OverlayTrigger,
"react-bootstrap";
import { db } from "./Firestore";
// import ImageGallery from "react-image-gallery";
import Component from "./index";
import { withRouter } from "react-router-dom";
import update from "immutability-helper";
import whatsapp_icon from "../assets/whatsapp_icon.png";
// import whatsapp_button from "../assets/whatsapp_button.png";
// import menu_button from "../assets/menu_button.png";
// import website_button from "../assets/website_button.png";
// import menu_title from "../assets/info_menu.png";
// import orderleh_title from "../assets/orderleh_title.png";
// import delivery_title from "../assets/info_delivery.png";
// import gradient from "../assets/gradient.png";
// import revieworder from "../assets/info_review_order.png";
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
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
// import { LanguageContext } from "./themeContext";
// import name from "../logo-header-nologo.png";
import logo from "../foodleh.png";
import { CartContext } from "./themeContext";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import delivery from "../delivery_2.png";
import self_collect from "../dabao_2.png";
import i_want from "../i_want.jpeg";

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
  const menu_color =
    props.data && props.data.css && props.data.css.menu_color
      ? props.data.css.menu_color
      : "#b48300";
  const menu_font_color =
    props.data && props.data.css ? props.data.css.menu_font_color : "#ffffff";
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
      <Navbar.Brand as={Link} to="/" style={{ color: menu_font_color }}>
        <img
          alt=""
          src={props.data.logo ? props.data.logo : logo}
          width="auto"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        <div class="d-none d-md-inline-block">{props.data.pageData.name}</div>
      </Navbar.Brand>
      <Navbar.Toggle />
      {props.data.pageData.whatsapp ? (
        <Navbar.Brand style={{ color: menu_font_color }}>
          <Component.PageCart toggleDialog={props.toggleDialog} />
        </Navbar.Brand>
      ) : null}
    </Navbar>
  );
};

const ResponsiveDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const context = React.useContext(CartContext);

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={context.channelDialog}
        onClose={context.toggleDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Which dining method would you like?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div class="row">
              <div class="d-flex col-xs-12 col-sm-12 col-md-12 col-lg-12 justify-content-center align-items-center">
                <img
                  alt=""
                  src={i_want}
                  style={{
                    flexShrink: "0",
                    minWidth: "5vw",
                    maxWidth: "15vw",
                    marginBottom: "20px",
                  }}
                />
              </div>
              <div class="d-flex col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 justify-content-end align-items-center">
                <img
                  alt=""
                  class={
                    context.channel === "collect"
                      ? "home-option-clicked"
                      : "home-option"
                  }
                  onClick={() => context.changeChannel("collect")}
                  src={self_collect}
                  style={{ flexShrink: "0", minWidth: "100%" }}
                />
              </div>
              <div class="d-flex col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 justify-content-start align-items-center">
                <img
                  alt=""
                  onClick={() => context.changeChannel("delivery")}
                  class={
                    context.channel === "delivery"
                      ? "home-option-clicked"
                      : "home-option"
                  }
                  src={delivery}
                  style={{ flexShrink: "0", minWidth: "100%" }}
                />
              </div>
            </div>
            {context.channel ? (
              <Component.PageConfirm toggle="channel" />
            ) : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={context.toggleDialog}
            color="primary"
            variant={"contained"}
          >
            Save
          </Button>
          <Button onClick={context.toggleDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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
      channelDialog: false,
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

  getMenu = () => {
    if (this.context.pageData.menu_combined) {
      let data = [];
      this.context.pageData.menu_combined.forEach((element, i) => {
        // If without_first_item, condition should be (element.name && element.price && i !== 0)) [1]
        // Else condition should only be (element.name && element.price) [2]
        let toPush = true;
        element.name ? (toPush = true) : (toPush = false);
        if (toPush) {
          data.push(
            <Component.PageItem
              quantity={element["quantity"]}
              name={element["name"]}
              price={element["price"]}
              pic={element["pic"]}
              summary={element["description"]}
              css={this.context.css}
              index={i}
              addon={element["addon"]}
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
        <InfoMenu
          data={this.context}
          toggleDialog={this.context.toggleDialog}
        />
        <div
          class="container-fluid"
          style={{
            paddingTop: "56px",
            width: "100%",
            paddingLeft: "0px",
            paddingRight: "0px",
            margin: "0px 0px",
            marginBottom: "50px",
          }}
        >
          <div>
            {this.context.cover ? (
              <div
                class="container-fluid row align-items-center justify-content-center no-gutters"
                style={{
                  background:
                    "linear-gradient(rgba(0,0,0,0.5), rgba(255,255,255,0.3)), url(" +
                    this.context.cover +
                    ") no-repeat center center",
                  backgroundSize: "cover",
                  minHeight: "300px",
                  width: "100vw",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "50px",
                      fontWeight: "bold",
                    }}
                    class="d-none d-md-inline-block"
                    id="back-to-top-anchor"
                  >
                    {this.context.pageData.name}
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "30px",
                      fontWeight: "bold",
                    }}
                    class="d-inline-block d-md-none"
                    id="back-to-top-anchor"
                  >
                    {this.context.pageData.name}
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "15px",
                    }}
                    id="back-to-top-anchor"
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
            <div
              className="justify-content-center"
              style={{ margin: "0px 5%" }}
            >
              <ResponsiveDialog
                channelDialog={this.state.channelDialog}
                closeChannelDialog={this.closeChannelDialog}
              />
              <div className="row justify-content-center align-items-center mt-4">
                <ExpansionPanel
                  // expanded={expanded === "panel1"}
                  // onChange={handleChange("panel1")}
                  style={{ width: "100%" }}
                >
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    style={{ backgroundColor: "#FFFAFA" }}
                  >
                    <Typography
                      style={{
                        flexBasis: "33.33%",
                        flexShrink: 0,
                        color: "black",
                      }}
                    >
                      About
                    </Typography>
                    <Typography
                      style={{
                        flexBasis: "66.66%",
                        flexShrink: 0,
                        color: "grey",
                        textAlign: "right",
                      }}
                    >
                      See More
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      {this.context.pageData.description_detail}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel
                  // expanded={expanded === "panel1"}
                  // onChange={handleChange("panel1")}
                  style={{ width: "100%" }}
                >
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    style={{ backgroundColor: "#FFFAFA" }}
                  >
                    <Typography
                      style={{
                        flexBasis: "33.33%",
                        flexShrink: 0,
                        color: "black",
                      }}
                    >
                      Delivery
                    </Typography>
                    <Typography
                      style={{
                        flexBasis: "66.66%",
                        flexShrink: 0,
                        color: "grey",
                        textAlign: "right",
                      }}
                    >
                      See More
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      {this.context.pageData.delivery_detail}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
              <div className="row justify-content-center align-items-center mt-4">
                {this.getMenu()}
              </div>
            </div>
          </div>
          <ScrollTop>
            <Fab color="primary" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </div>
      </div>
    );
  }
}
Page.contextType = CartContext;
export default withRouter(Page);
