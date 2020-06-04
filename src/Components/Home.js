// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import Component from "../Components";
import home from "../home-bs.png";
import i_want from "../i_want.jpeg";
import fb from "../fb.png";
import insta from "../insta.png";
import email from "../email.png";
import Cookies from "universal-cookie";
import delivery from "../delivery_2.png";
import self_collect from "../dabao_2.png";
import chinese_i_want from "../chinese-iwant.png";
import chinese_delivery from "../chinese_delivery_2.png";
import chinese_self_collect from "../chinese_dabao_2.png";
import { LanguageContext } from "./themeContext";
import { TelegramIcon } from "react-share";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import "./Home.css";
import { Line } from "rc-progress";
import { db } from "./Firestore";

const cookies = new Cookies();
const SELF_COLLECT_OPTION = "selfcollect";
const HOME_DELIVERY_OPTION = "delivery";

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent) && /version/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
}

export class Home extends React.PureComponent {
  state = {
    data: [],
    option: "",
    retrieved: false,
    count: 500,
    open: true,
  };

  componentWillMount() {
    this.retrieveData();
  }

  getData(val) {
    this.setState({ data: val });
  }

  retrieveData = async () => {
    let data = [];
    await db
      .collection("hawkers")
      .get()
      .then((snapshot) => {
        this.setState({ count: snapshot.docs.length });
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ data: data, retrieved: true });
  };

  handleCollect = () => {
    this.setState({ option: SELF_COLLECT_OPTION });
  };
  handleDelivery = () => {
    this.setState({ option: HOME_DELIVERY_OPTION });
  };

  handleClose = (event) => {
    event.preventDefault();
    this.setState({ open: false });
  };

  render() {
    let languageContext = this.context;
    console.log("home is rendering");
    console.log(languageContext.language);
    let delivery_option =
      this.state.option === "delivery" ? "home-option-clicked" : "home-option";
    let selfcollect =
      this.state.option === "selfcollect"
        ? "home-option-clicked"
        : "home-option";

    return (
      <div class="container-fluid" className="home">
        <div class="jumbotron row">
          <div class="container">
            {getMobileOperatingSystem() === "Android" ? (
              <Snackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                open={this.state.open}
                // autoHideDuration={10000}
                // onClose={this.handleClose}
                message={
                  <div style={{ fontSize: "30px" }}>
                    Android App is no longer working. Please use browser and
                    visit <b>www.foodleh.app</b> instead.
                  </div>
                }
                action={
                  <React.Fragment>
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={this.handleClose}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </React.Fragment>
                }
              />
            ) : null}
            <div class="row">
              <div class="col">
                <img
                  alt="Cut the middlemen - Save our local F&amp;B"
                  class="img-fluid"
                  src={home}
                  style={{ width: "80%" }}
                />
                <br />
                <br />
                <div class="d-none d-md-inline-block">
                  <span style={{ fontSize: "10px" }}>Connect with us:</span>
                  <br />
                  <a href="https://www.facebook.com/foodlehsg/" target="blank">
                    <img
                      class="img-fluid"
                      style={{ width: "30px", margin: "10px" }}
                      alt="fb"
                      src={fb}
                    />
                  </a>
                  <a href="https://instagram.com/foodleh.sg" target="blank">
                    <img
                      class="img-fluid"
                      style={{ width: "30px", margin: "10px" }}
                      alt="insta"
                      src={insta}
                    />
                  </a>
                  <a href="mailto:foodleh@outlook.com" target="blank">
                    <img
                      class="img-fluid"
                      style={{ width: "30px", margin: "10px" }}
                      alt="email"
                      src={email}
                    />
                  </a>
                  <a href="https://t.me/foodleh" target="blank">
                    <TelegramIcon
                      size={32}
                      round={true}
                      style={{ margin: "10px" }}
                    />
                    {/* <img
                      class="img-fluid"
                      style={{ width: "30px", margin: "10px" }}
                      alt="telegram"
                      src={TelegramIcon}
                    /> */}
                  </a>
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 align-items-center justify-content-center">
                <br />
                <img
                  alt="I want..."
                  class="home-iwant"
                  src={
                    cookies.get("language") === "en" ? i_want : chinese_i_want
                  }
                />
                <br />
                <br />
                <span class="row d-none d-md-inline-block">
                  <span class="col">
                    <img
                      onClick={this.handleCollect}
                      alt=""
                      class={selfcollect}
                      src={
                        cookies.get("language") === "en"
                          ? self_collect
                          : chinese_self_collect
                      }
                      style={{ width: "30%" }}
                    />
                  </span>
                  <span class="col">
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={
                        cookies.get("language") === "en"
                          ? delivery
                          : chinese_delivery
                      }
                      style={{ width: "30%" }}
                    />
                  </span>
                </span>
                <span class="row d-inline-block d-md-none">
                  <button style={{ backgroundColor: "white" }}>
                    <img
                      alt=""
                      onClick={this.handleCollect}
                      class={selfcollect}
                      src={
                        cookies.get("language") === "en"
                          ? self_collect
                          : chinese_self_collect
                      }
                    />
                  </button>
                  <button style={{ backgroundColor: "white" }}>
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={
                        cookies.get("language") === "en"
                          ? delivery
                          : chinese_delivery
                      }
                    />
                  </button>
                </span>
                <br />
                <br />
                <div>
                  <LanguageContext.Consumer>
                    {(context) =>
                      renderPostalCodeForm(this.state.option, context)
                    }
                  </LanguageContext.Consumer>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  {this.state.retrieved ? (
                    <div>
                      <LanguageContext.Consumer>
                        {(context) => (
                          <div style={{ fontSize: "12px" }}>
                            {context.data.home.wehave}
                            <b>{this.state.count}</b>
                            {context.data.home.listings}
                            <br />
                            {context.data.home.goto}
                            <a href="/create">{context.data.home.createlink}</a>
                            {context.data.home.nowtoadd}
                          </div>
                        )}
                      </LanguageContext.Consumer>
                      <span style={{ fontSize: "12px" }}>0 </span>
                      <Line
                        percent={this.state.count / 8}
                        strokeWidth="2"
                        strokeColor="#b48300"
                        style={{ width: "50%" }}
                      />
                      <span style={{ fontSize: "12px" }}> 800</span>
                    </div>
                  ) : null}

                  <br />
                  <br />
                  <div class="d-inline-block d-md-none">
                    <span style={{ fontSize: "10px" }}>Connect with us:</span>
                    <br />
                    <a
                      href="https://www.facebook.com/foodlehsg/"
                      target="blank"
                    >
                      <img
                        class="img-fluid"
                        style={{ width: "30px", margin: "10px" }}
                        alt="fb"
                        src={fb}
                      />
                    </a>
                    <a href="https://instagram.com/foodleh.sg" target="blank">
                      <img
                        class="img-fluid"
                        style={{ width: "30px", margin: "10px" }}
                        alt="insta"
                        src={insta}
                      />
                    </a>
                    <a href="mailto:foodleh@outlook.com" target="blank">
                      <img
                        class="img-fluid"
                        style={{ width: "30px", margin: "10px" }}
                        alt="email"
                        src={email}
                      />
                    </a>
                    <a href="https://t.me/foodleh" target="blank">
                      <TelegramIcon
                        size={32}
                        round={true}
                        style={{ margin: "10px" }}
                      />
                      {/* <img
                      class="img-fluid"
                      style={{ width: "30px", margin: "10px" }}
                      alt="telegram"
                      src={TelegramIcon}
                    /> */}
                    </a>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
            {/*

              <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"> </div>
              <div
                class="col-xs-10 col-sm-10 col-md-10 col-lg-10"
                style={{ textAlign: "center" }}
              >
                <div class="col-6">
                  <img alt="" class="home-banner" src={home} />
                </div>
                <br />
                <br />
                <img alt="" class="home-iwant" src={i_want} />
                <br />
                <br />
                <span class="row d-none d-md-inline-block">
                  <span class="col-sm-2 col-md-2 col-lg-2"></span>
                  <span class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <img
                      onClick={this.handleCollect}
                      alt=""
                      class={selfcollect}
                      src={self_collect}
                    />
                  </span>
                  <span class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
                    />
                  </span>
                  <span class="col-sm-2 col-md-2 col-lg-2"></span>
                </span>
                <span class="row d-inline-block d-md-none">
                  <span>
                    <img
                      alt=""
                      onClick={this.handleCollect}
                      class={selfcollect}
                      src={self_collect}
                    />
                  </span>
                  <span>
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
                    />
                  </span>
                </span>
                <br />
                <br />
                <div>
                  {this.state.option === "" ? (
                    <span class=" main-caption">Choose Da Bao Or Delivery</span>
                  ) : this.state.option === "delivery" ? (
                    <span class=" main-caption">Living the lazy life?</span>
                  ) : (
                    <span class="label label-default main-caption">
                      Living the hardworking life?
                    </span>
                  )}
                </div>
                <br />
                <Component.Search option={this.state.option} />
              </div>
              <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div> */}
          </div>
          <br />
        </div>
      </div>
    );
  }
}

function renderPostalCodeForm(option, context) {
  console.log("renderpostalcodeform", context);
  switch (option) {
    case "":
      return (
        <span class=" main-caption">
          <div>
            {" "}
            {context.data.home.choose} <b>{context.data.home.dabao} </b>{" "}
            {context.data.home.or} <b> {context.data.home.delivery_word}</b>
          </div>
          {/*(context.language === 'en') ? <div>choose <b>da bao</b> or <b>delivery</b> </div> : <div>选 <b>打包</b> 或 <b>送餐</b></div>*/}
        </span>
      );

    case HOME_DELIVERY_OPTION:
    case SELF_COLLECT_OPTION:
      return (
        <span class="label label-default main-caption">
          <span class="main-caption">
            {
              <LanguageContext.Consumer>
                {(context) => (
                  <div>
                    {context.data.home.now_enter}{" "}
                    <strong>{context.data.home.postalcode}</strong>
                  </div>
                )}
              </LanguageContext.Consumer>
            }
            <br />
            <Component.Search option={option} />
          </span>
        </span>
      );
    default:
  }
}

export default Home;
