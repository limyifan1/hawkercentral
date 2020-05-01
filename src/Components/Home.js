// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import Component from "../Components";
import home from "../home-bs.png";
import i_want from "../i_want.jpeg";
import delivery from "../delivery.jpeg";
import self_collect from "../self_collect.jpeg";
import fb from "../fb.png";
import insta from "../insta.png";
import email from "../email.png";
import "./Home.css";
import { Line } from "rc-progress";
import { db } from "./Firestore";

const SELF_COLLECT_OPTION = "selfcollect";
const HOME_DELIVERY_OPTION = "delivery";

export class Home extends React.PureComponent {
  state = {
    data: [],
    option: "",
    retrieved: false,
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

  render() {
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
                </div>
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 align-items-center justify-content-center">
                <br />
                <img alt="I want..." class="home-iwant" src={i_want} />
                <br />
                <br />
                <span class="row d-none d-md-inline-block">
                  <span class="col">
                    <img
                      onClick={this.handleCollect}
                      alt=""
                      class={selfcollect}
                      src={self_collect}
                      style={{ width: "30%" }}
                    />
                  </span>
                  <span class="col">
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
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
                      src={self_collect}
                    />
                  </button>
                  <button style={{ backgroundColor: "white" }}>
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
                    />
                  </button>
                </span>

                {/* <div class="row justify-content-center collect-options">
                  <div className="col-sm-12 col-md-auto">
                    <button
                      type="button"
                      onClick={this.handleCollect}
                      className={classnames({
                        clicked: this.state.option === SELF_COLLECT_OPTION,
                      })}
                    >
                      <img alt="Self Collect" src={self_collect} />
                    </button>
                  </div>

                  <div className="col-sm-12 col-md-auto">
                    <button
                      type="button"
                      onClick={this.handleDelivery}
                      className={classnames({
                        clicked: this.state.option === HOME_DELIVERY_OPTION,
                      })}
                    >
                      <img alt="Home Delivery" src={delivery} />
                    </button>
                  </div>
                </div> */}
                <br />
                <br />
                <div>
                  {renderPostalCodeForm(this.state.option)}
                  {/* {this.state.option === "" ? (
                    <span class=" main-caption">
                      choose <b>da bao</b> or <b>delivery</b>
                    </span>
                  ) : this.state.option === "delivery" ? (
                    <span class=" main-caption">
                      now enter your <b>postal code</b>
                      <br />
                      <br />
                      <Component.Search option={this.state.option} />
                    </span>
                  ) : (
                    <span class="label label-default main-caption">
                      <span class=" main-caption">
                        now enter your <b>postal code</b>
                        <br />
                        <br />
                        <Component.Search option={this.state.option} />
                      </span>
                    </span>
                  )} */}
                  <br />
                  <br />
                  <br />
                  <div style={{ fontSize: "12px" }}>
                    We have <b>{this.state.count}</b> listings. Help us reach
                    500! <br/> Go to <a href="/create">Create</a> now to add a listing! 
                  </div>
                  <span style={{ fontSize: "12px" }}>0 </span>
                  <Line
                    percent={this.state.count / 5}
                    strokeWidth="2"
                    strokeColor="#b48300"
                    style={{ width: "50%" }}
                  />
                  <span style={{ fontSize: "12px" }}> 500</span>
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
                    <br />
                    <br />
                  </div>
                  <div class="container-fluid">
                    <p style={{ fontSize: "14px" }}>
                      We would like to acknowledge the data and images we
                      obtained from{" "}
                      <a href="https://thesmartlocal.com/delivery">
                        The Smart Local (TSL){" "}
                      </a>
                      when building the initial version of our app and assure
                      that all current data in the listing are obtained with the
                      consent from the originators themselves.
                    </p>
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
        {/* <Carousel
          responsive={responsive}
          ssr={true}
          infinite={true}
          // partialVisible={true}
          swipeable={true}
          draggable={true}
          minimumTouchDrag={0}
          transitionDuration={0}
          slidesToSlide={1}
          arrows={false}
          autoPlay={true}
          centerMode={true}
          autoPlaySpeed={2000}
        >
          {result.all}
        </Carousel> */}
      </div>
    );
  }
}

function renderPostalCodeForm(option) {
  switch (option) {
    case "":
      return (
        <span class=" main-caption">
          choose <b>da bao</b> or <b>delivery</b>
        </span>
      );

    case HOME_DELIVERY_OPTION:
    case SELF_COLLECT_OPTION:
      return (
        <span class="label label-default main-caption">
          <span class="main-caption">
            now enter your <strong>postal code</strong>
            <br />
            <br />
            <Component.Search option={option} />
          </span>
        </span>
      );
    default:
  }
}

export default Home;
