// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import Component from "../Components";
import { withRouter } from "react-router-dom";
import Cookies from "universal-cookie";
import firebase from "./Firestore";
import list_en from "../assets/list_en.png";
import website_en from "../assets/website_en.png";
import list_cn from "../assets/list_cn.png";
import website_cn from "../assets/website_cn.png";
import i_want from "../i_want.jpeg";
import chinese_i_want from "../chinese-iwant.png";
import { LanguageContext } from "./themeContext";

const analytics = firebase.analytics();
const cookies = new Cookies();

function onLoad(name) {
  analytics.logEvent(name);
}

export class Create extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  state = {
    create: "",
  };

  componentWillMount() {
    onLoad("create_load");
  }
  changeCreate = async (change) => {
    await this.setState({ create: change });
    this.scrollToMyRef();
  };

  scrollToMyRef = () => window.scrollTo(0, this.myRef.offsetTop - 60);

  render() {
    return (
      <div>
        <div
          class="jumbotron"
          style={{
            "padding-top": "80px",
            "padding-bottom": "240px",
            height: "100%",
            "background-color": "white",
          }}
        >
          <div
            class="d-flex col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 justify-content-center align-items-center"
            style={{ marginTop: "40px" }}
          >
            <h4>
              <b>{this.context.data.create.createfree}</b>
            </h4>
          </div>
          <div class="row" style={{ margin: "50px 0px" }}>
            <div class="d-flex col-xs-12 col-sm-12 col-md-12 col-lg-12 justify-content-center align-items-center">
              <img
                alt=""
                src={cookies.get("language") === "en" ? i_want : chinese_i_want}
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
                  this.state.create === "listing"
                    ? "home-option-clicked"
                    : "home-option"
                }
                onClick={() => this.changeCreate("listing")}
                src={cookies.get("language") === "en" ? list_en : list_cn}
                style={{ flexShrink: "0", minWidth: "50%" }}
              />
            </div>
            <div class="d-flex col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 justify-content-start align-items-center">
              <img
                alt=""
                onClick={() => this.changeCreate("website")}
                class={
                  this.state.create === "website"
                    ? "home-option-clicked"
                    : "home-option"
                }
                src={cookies.get("language") === "en" ? website_en : website_cn}
                style={{ flexShrink: "0", minWidth: "50%" }}
              />
            </div>
            <div
              class="d-flex col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 justify-content-center align-items-center"
              style={{ marginTop: "40px" }}
            >
              <h6>
                <b>
                  {this.context.data.create.existing}{" "}
                  <a href="https://www.foodleh.app/custom">
                    www.foodleh.app/custom
                  </a>
                </b>
              </h6>
            </div>
          </div>

          {this.state.create && (
            <React.Fragment>
              <h3 ref={(ref) => (this.myRef = ref)}>
                <div>
                  {this.state.create === "listing" &&
                    this.context.data.create.createlisting}
                </div>
                <div>
                  {this.state.create === "website" &&
                    this.context.data.create.createwebsite}
                </div>
              </h3>
              <Component.ListForm
                toggle={"create"}
                option={this.state.create}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

Create.contextType = LanguageContext;
export default withRouter(Create);
