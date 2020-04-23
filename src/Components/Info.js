import React from "react";
import "../App.css";
import "react-multi-carousel/lib/styles.css";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import { db } from "./Firestore";
import whatsapp from "../WhatsApp.svg";
import ImageGallery from "react-image-gallery";
import Component from "./index";
import placeholder from "../placeholder.png";
import ClapButton from "react-clap-button";
import Clap from "./Clap";

import firebase from "./Firestore";

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

export class Nearby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      id: queryString.parse(this.props.location.search).id,
      galleryOpened: false,
      retrieved: false,
      activePhoto: 1,
    };
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
          this.setState({ data: snapshot.data(), retrieved: true });
        }
        onLoad("info_load", snapshot.data().name);
        console.log("Fetched successfully!");
        return true;
      })
      .catch((error) => {
        console.log(error);
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
            </div>
          );
        }
      }
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

    const onCountChange = ({ count, countTotal }) => {};

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
                  <Component.Popup data={this.state.data} id={this.state.id} />
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
                      "https://maps.google.com/?ll=" +
                      this.state.data.latitude +
                      "," +
                      this.state.data.longitude
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
                      {this.state.data.whatsapp ? (
                        <a href={link}>
                          <span
                            class="card shadow-lg"
                            style={{
                              width: "110px",
                              height: "30px",
                              backgroundColor: "grey",
                              margin: "5px 5px 5px 5px",
                            }}
                          >
                            <card>
                              {" "}
                              <img
                                src={whatsapp}
                                style={{
                                  height: "28px",
                                  padding: "3px 3px 3px",
                                }}
                                alt=""
                              />
                              <span style={{ color: "white" }}> Message</span>
                            </card>
                          </span>
                        </a>
                      ) : null}
                    </span>
                  ) : null}
                  {this.state.data.lastmodified ? (
                    <div style={{ color: "grey" }}>
                      <small>
                        Last Modified:{" "}
                        {new Date(
                          this.state.data.lastmodified.toDate()
                        ).toDateString()}
                      </small>
                    </div>
                  ) : null}
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
                  <p style={{ marginBottom: "20px" }}>
                    {this.state.data.description}
                  </p>
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Detailed Description</b>
                  </h6>
                  <p
                    style={{ "white-space": "pre-line", marginBottom: "20px" }}
                  >
                    {this.state.data.description_detail}
                  </p>
                  {this.state.data.menu ? (
                    <div>
                      <h6 style={{ marginBottom: "0px" }}>
                        <b>Menu Items</b>
                      </h6>
                      <p>{this.getMenu()} </p>
                    </div>
                  ) : null}
                  <h6 style={{ marginBottom: "0px" }}>
                    <b>Details Regarding Delivery</b>
                  </h6>
                  <p
                    style={{ "white-space": "pre-line", marginBottom: "20px" }}
                  >
                    {this.state.data.delivery_detail}
                  </p>
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
                  <h6 style={{ marginBottom: "0px" }}>
                    <b> Link </b>
                  </h6>
                  <p style={{ marginBottom: "20px" }}>
                    {this.state.data.website ? (
                      <a href={this.state.data.website}>Website Link</a>
                    ) : null}
                  </p>
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

export default Nearby;
