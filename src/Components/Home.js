// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import Component from "../Components";
import home from "../home (2).png";
import Item from "./Item";
import i_want from "../i_want.jpeg";
import delivery from "../delivery.jpeg";
import self_collect from "../self_collect.jpeg";

import "./Home.css";

const SELF_COLLECT_OPTION = "selfcollect";
const HOME_DELIVERY_OPTION = "delivery";

export class Home extends React.PureComponent {
  state = {
    data: [],
    option: "",
    retrieved: false,
  };

  componentWillMount() {
    // this.retrieveData();
  }

  getData(val) {
    this.setState({ data: val });
  }

  handleCollect = () => {
    this.setState({ option: SELF_COLLECT_OPTION });
  };
  handleDelivery = () => {
    this.setState({ option: HOME_DELIVERY_OPTION });
  };

  render() {
    let result = {
      all: [],
    };
    if (this.state.retrieved) {
      this.state.all.forEach((data) => {
        result.all.push(
          <p style={{ padding: "10px", width: "200px" }} key={data["id"]}>
            <Item
              promo={data["promo"]}
              id={data["id"]}
              name={data["name"]}
              street={data["street"]}
              pic={data["url"]}
              summary={data["description"]}
            />
          </p>
        );
      });
    }
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
            {/* //       <div class="container-fluid pt-4">
//         <div class="row pt-5" style={{ "background-color": "white" }}>
//           <div class="container" style={{ "margin-top": "57px" }}> */}
            <div class="row">
              <div class="col">
                <img
                  alt="Cut the middlemen - Save our local F&amp;B"
                  class="img-fluid"
                  src={home}
                />
              </div>
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 align-items-center">
                <br />
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

                <br />
                <br />
                <div>
                  {renderPostalCodeForm(this.state.option)}
                  <br />
                  <br />
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
          </div>
          <br />
        </div>
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