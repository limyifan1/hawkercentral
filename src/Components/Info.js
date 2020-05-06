// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import "react-multi-carousel/lib/styles.css";
import queryString from "query-string";
import { Button, Spinner } from "react-bootstrap";
import { db } from "./Firestore";
import whatsapp from "../WhatsApp.svg";
import ImageGallery from "react-image-gallery";
import Component from "./index";
import Clap from "./Clap";
import Linkify from "react-linkify";
import { withRouter } from "react-router-dom";
import update from 'immutability-helper';
import whatsapp_button from "../assets/whatsapp_button.png";
import orderleh from "../assets/orderleh.png";
import menu_title from "../assets/info_menu.png";
import delivery_title from "../assets/info_delivery.png";
import revieworder from "../assets/info_review_order.png";


import firebase from "./Firestore";

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

export class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      orderData: [],
      totalPrice: 0.0,
      wantToOrder: false,
      name: "",
      address: "",
      notes: "",
      customerNumber: "",
      deliveryTime: "",
      id: queryString.parse(this.props.location.search).id,
      galleryOpened: false,
      retrieved: false,
      activePhoto: 1,
    };
    this.enterDetails = this.enterDetails.bind(this);
    this.handleCustomerDetails = this.handleCustomerDetails.bind(this);
    this.setOrderText = this.setOrderText.bind(this);
  }

  componentWillMount() {
    this.getDoc();
    console.log("run");
  }

  getDoc = async () => {
    await db
      .collection("hawkers")
      .doc(this.state.id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // After querying db for data, initialize orderData if menu info is available
          this.setState({ data: snapshot.data(), retrieved: true, orderData: new Array(snapshot.data().menuitem.length).fill(0) });
        }
        onLoad("info_load", snapshot.data().name);
        console.log("Fetched successfully!");
        return true;
      })
      .catch((error) => {
        window.location.reload(true)
        console.log(error);
      });
  };

  handleCustomerDetails = (event) => {
    const inputValue = event.target.value;
    const inputField = event.target.name;
    if (inputField === "name") {
      this.setState({
        name: inputValue,
      })
    } else if (inputField === "address") {
      this.setState({
        address: inputValue,
      })
    } else if (inputField === "notes") {
      this.setState({
        notes: inputValue,
      })
    } else if (inputField === "customerNumber") {
      this.setState({
        customerNumber: inputValue,
      })
    } else if (inputField === "deliveryTime") {
      this.setState({
        deliveryTime: inputValue,
      })
    }
  }

  setOrderText() {
    let text = "";
    text = text + "New order from " + this.state.name + "\n";
    for (let i = 0; i < this.state.data.menuitem.length; i = i + 1) {
      if (
        this.state.data.menuitem[i] !== "" &&
        this.state.data.menuitem !== undefined &&
        this.state.orderData[i] !== 0
      ) {
        // customer ordered this item
        const numItems = parseInt(this.state.orderData[i]);
        const thisPrice = parseFloat(this.state.data.menuprice[i]);
        text = text + "*" + numItems + "x* _" + this.state.data.menuitem[i] + "_: $" + (numItems * thisPrice).toFixed(2) + "\n";
      }
    }
    text = text + "\n\nTotal Price (not including delivery): *$" + this.state.totalPrice.toFixed(2) + "*"
    text = text + "\nDelivery address: *" + this.state.address + "*";
    text = text + "\nDelivery Date/Time: *" + this.state.deliveryTime + "*";
    if (this.state.notes !== "") {
      // only display notes if customer added
      text = text + "\nAdditional notes: _" + this.state.notes + "_";
    }
    text = text + "\nCustomer phone number: *" + this.state.customerNumber + "*";
    text = text + "\nOrdering from: www.foodleh.app/info?id=" + this.state.id;
    console.log(text);
    console.log(encodeURIComponent(text))
    return encodeURIComponent(text);
  }

  enterDetails() {
    console.log("enterDetails");
    if (this.state.wantToOrder) {
      this.setState({ wantToOrder: false });
    } else {
      this.setState({ wantToOrder: true });
    }
  }


  addItem = async (event) => {
    const idx = event.target.name;
    this.setState({
      totalPrice: parseFloat(this.state.totalPrice) + parseFloat(this.state.data.menuprice[idx]),
      orderData: update(this.state.orderData, { [idx]: { $set: parseInt(this.state.orderData[idx]) + 1 } }),
    });
  };

  minusItem = async (event) => {
    const idx = event.target.name;
    this.setState({
      // if customer did not order this item previously, do not change total price, keep # item at 0
      totalPrice: this.state.orderData[idx] === 0.0 ? this.state.totalPrice : (parseFloat(this.state.totalPrice) - parseFloat(this.state.data.menuprice[idx])),
      orderData: update(this.state.orderData, { [idx]: { $set: this.state.orderData[idx] === 0 ? 0 : parseInt(this.state.orderData[idx]) - 1 } }),
    });
  };

  getMenu = () => {
    if (this.state.data.menuitem) {
      let data = [];
      for (let i = 0; i < this.state.data.menuitem.length; i = i + 1) {
        if (
          this.state.data.menuitem[i] !== "" &&
          this.state.data.menuitem !== undefined
        ) {
          data.push(
            <div>
              {this.state.data.menuitem ? this.state.data.menuitem[i] : null} -
              ${this.state.data.menuprice ? this.state.data.menuprice[i] : null}
              {" "}

              {this.state.data.whatsapp ? (
                <div>
                  <button
                    onClick={this.addItem}
                    name={i}
                    class="shadow-lg"
                    style={{
                      backgroundColor: "#b48300",
                      color: "white",
                    }}
                  >
                    +
                </button>
                  {" "}
                  {this.state.orderData[i] !== undefined ? this.state.orderData[JSON.parse(JSON.stringify(i))] : 0}
                  {" "}
                  <button
                    onClick={this.minusItem}
                    name={i}
                    class="shadow-lg"
                    style={{
                      backgroundColor: "#b48300",
                      color: "white",
                    }}
                  >
                    -
              </button>
                </div>
              ) : null}

            </div>
          );
        }

      }
      data.push(
        <div>
          Total Price: ${this.state.totalPrice.toFixed(2)}
        </div>
      )
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

  render() {
    let cuisine = [];
    let regions = [];
    let photos = [];

    let link = "https://wa.me/65" + this.state.data.contact;
    if (this.state.retrieved) {
      if (this.state.data.cuisine) {
        this.state.data.cuisine.forEach((element) => {
          cuisine.push(<span class="badge badge-info">{element.label}</span>);
        });
      }
      if (this.state.data.region) {
        this.state.data.region.forEach((element) => {
          regions.push(
            <span class="badge badge-warning">{element.label}</span>
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

    return (
      <div>
        {this.state.retrieved ? (
          <div class="container" style={{ paddingTop: "56px", width: "100%" }}>
            <div class="row">
              <div
                class="jumbotron col-xs-6 col-sm-6 col-md-6 col-lg-6"
                style={{ height: "320px", backgroundColor: "white" }}
              >
                {/* <img src={this.state.data.url} /> */}
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
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div
                  class="container"
                  style={{ textAlign: "left", paddingTop: "10px" }}
                >
                  <div class="">
                    <h2>{this.state.data.name}</h2>
                  </div>
                  <link rel="stylesheet" href="applause-button.css" />
                  <svg
                    class="bi bi-house-fill"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 3.293l6 6V13.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M7.293 1.5a1 1 0 011.414 0l6.647 6.646a.5.5 0 01-.708.708L8 2.207 1.354 8.854a.5.5 0 11-.708-.708L7.293 1.5z"
                      clip-rule="evenodd"
                    />
                  </svg>{" "}
                  <a
                    href={
                      "https://maps.google.com/?q=" + this.state.data.street
                    }
                  >
                    {this.state.data.unit} {this.state.data.street}
                  </a>
                  <br />
                  <svg
                    class="bi bi-tag-fill"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 1a1 1 0 00-1 1v4.586a1 1 0 00.293.707l7 7a1 1 0 001.414 0l4.586-4.586a1 1 0 000-1.414l-7-7A1 1 0 006.586 1H2zm4 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      clip-rule="evenodd"
                    />
                  </svg>{" "}
                  {cuisine}
                  <br />
                  <svg
                    class="bi bi-bag"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 5H2v9a1 1 0 001 1h10a1 1 0 001-1V5zM1 4v10a2 2 0 002 2h10a2 2 0 002-2V4H1z"
                      clip-rule="evenodd"
                    />
                    <path d="M8 1.5A2.5 2.5 0 005.5 4h-1a3.5 3.5 0 117 0h-1A2.5 2.5 0 008 1.5z" />
                  </svg>{" "}
                  {this.state.data.pickup_option ? (
                    <span class="badge badge-success">Da Bao</span>
                  ) : null}
                  {this.state.data.delivery_option ? (
                    <span class="badge badge-success">Delivery</span>
                  ) : null}{" "}
                  <br />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
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
                  <br />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-globe"
                    style={{ marginRight: "5px" }}
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  {this.state.data.website ? (
                    this.state.data.website.slice(0, 4) === "http" ? (
                      <a href={this.state.data.website}>Website Link</a>
                    ) : (
                        <a href={"https://" + this.state.data.website}>
                          Website Link
                        </a>
                      )
                  ) : null}
                  <br />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-phone"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>{" "}
                  {this.state.data.contact ? (
                    <span>
                      {this.state.data.contact} {" ("}
                      {this.state.data.whatsapp ? <span>WhatsApp </span> : null}
                      {this.state.data.sms ? <span>SMS </span> : null}
                      {this.state.data.call ? <span>Call </span> : null}
                      {") "} <br />
                      {this.state.data.wechatid ? (
                        <span style={{ color: "green" }}>
                          <b>WeChat ID: {this.state.data.wechatid}</b>
                        </span>
                      ) : null}
                      <br />
                      {this.state.data.whatsapp ? (
                        <span>
                          <a href={link}>
                            <span class="col">
                              <img
                                alt=""
                                src={
                                  whatsapp_button
                                }
                                style={{ width: "30%" }}
                              />
                            </span>
                          </a>
                          {this.state.data.menu ? (

                            <span class="col">
                              <img
                                alt=""
                                onClick={this.enterDetails}
                                src={
                                  orderleh
                                }
                                style={{ width: "30%", cursor: 'pointer' }}
                              />
                            </span>
                          ) : null}

                          {this.state.wantToOrder ? (

                            <div>
                              <br /><br />

                              <span class="col">
                                <img
                                  alt=""
                                  src={
                                    menu_title
                                  }
                                  style={{ width: "30%" }}
                                />
                              </span>
                              <br></br>

                              <p>{this.getMenu()} </p>
                              <div>
                                <br />
                                <img
                                  alt=""
                                  src={
                                    delivery_title
                                  }
                                  style={{ width: "30%" }}
                                />
                                <div class="form-group create-title">
                                  <label for="name">Name</label>
                                  <input
                                    onChange={this.handleCustomerDetails}
                                    value={this.state.name}
                                    type="text"
                                    class="form-control"
                                    name="name"
                                    style={{ borderColor: "#b48300", }}
                                    placeholder="We don't store your info!"
                                  ></input>
                                </div>

                                <div class="form-group create-title">
                                  <label for="unit">Mobile Number: </label>
                                  <div class="input-group">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text" id="basic-addon1">
                                        +65
                              </span>
                                    </div>
                                    <input
                                      onChange={this.handleCustomerDetails}
                                      value={this.state.customerNumber}
                                      type="number"
                                      name="customerNumber"
                                      placeholder=" 9xxxxxxx"
                                      maxLength="8"
                                      minlength="8"
                                      pattern="[8-9]{1}[0-9]{7}"
                                      style={{
                                        borderColor: "#b48300",
                                        "border-radius": "5px",
                                        "border-width": "1px",
                                      }}
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
                                    style={{ borderColor: "#b48300", }}
                                    placeholder="Eg Thursday 7 May 12.30pm"
                                  ></input>
                                </div>

                                <div class="form-group create-title">
                                  <label for="address">Address</label>
                                  <input
                                    onChange={this.handleCustomerDetails}
                                    value={this.state.address}
                                    type="text"
                                    class="form-control"
                                    name="address"
                                    style={{ borderColor: "#b48300", }}
                                    placeholder=""
                                  ></input>
                                </div>
                                <div class="form-group create-title">
                                  <label for="address">Comments</label>
                                  <input
                                    onChange={this.handleCustomerDetails}
                                    value={this.state.notes}
                                    type="text"
                                    class="form-control"
                                    name="notes"
                                    style={{ borderColor: "#b48300", }}
                                    placeholder="No chilli etc, leave blank if nil"
                                  ></input>
                                </div>
                                <Button
                                  class="shadow-sm"
                                  href={
                                    "https://api.whatsapp.com/send?phone=65" + this.state.data.contact + "&text=" + this.setOrderText()
                                  }
                                  style={{
                                    backgroundColor: "#B48300",
                                    borderColor: "#B48300",
                                    fontSize: "20px",
                                    width: "300px"
                                  }}
                                  name="Language"
                                >
                                  Place order via WhatsApp
                      </Button>
                                <br />

                              </div>
                            </div>
                          ) : null}

                        </span>
                      ) : null}
                      <br />
                      <Component.Popup
                        data={this.state.data}
                        id={this.state.id}
                      />
                    </span>
                  ) : null}
                  <br />
                  {this.state.data.promo ? (
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
                          <b>{this.state.data.promo}</b>:{" "}
                          {this.state.data.condition &&
                            this.state.data.condition.length > 40
                            ? this.state.data.condition.slice(0, 40) + "..."
                            : this.state.data.condition}
                        </div>
                      </span>
                    </div>
                  ) : null}
                  <br />
                  <Clap
                    collection={"hawkers"}
                    id={this.state.id}
                    claps={this.state.data.claps}
                  />
                  <br />
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Brief Description</b>
                  </h6>
                  <Linkify>
                    <p style={{ marginBottom: "20px" }}>
                      {this.state.data.description}
                    </p>
                    <h6 style={{ marginBottom: "0px" }}>
                      <b>Detailed Description</b>
                    </h6>
                    <p
                      style={{
                        "white-space": "pre-line",
                        marginBottom: "20px",
                      }}
                    >
                      {this.state.data.description_detail}
                    </p>
                  </Linkify>
                  {/* {Menu appears if menu data is present and whatsapp is not present} */}
                  {this.state.data.menu && !this.state.data.whatsapp ? (
                    <div>
                      <h6 style={{ marginBottom: "0px" }}>
                        <b>Menu Items</b>
                      </h6>
                      <p>{this.getMenu()} </p>

                    </div>
                  ) : null}
                  <br></br>
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
                      {this.state.data.delivery_detail}
                    </p>
                  </Linkify>
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Delivery Fees</b>
                  </h6>
                  <p
                    style={{ "white-space": "pre-line", marginBottom: "20px" }}
                  >
                    {this.state.data.price}
                  </p>
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Opening Hours</b>
                  </h6>
                  <p
                    style={{ "white-space": "pre-line", marginBottom: "20px" }}
                  >
                    {this.state.data.opening}
                  </p>
                  {/* <p style={{ marginBottom: "20px" }}>
                    {this.state.data.website ? (
                      this.state.data.website.slice(0, 4) === "http" ? (
                        <a href={this.state.data.website}>Website Link</a>
                      ) : (
                        <a href={"https://" + this.state.data.website}>
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
                </div>
              </div>
            </div>
          </div>
        ) : (
            <div class="row h-100 page-container">
              <div class="col-sm-12 my-auto">
                <h3>Loading</h3>
                <Spinner class="" animation="grow" />
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default withRouter(Info);
