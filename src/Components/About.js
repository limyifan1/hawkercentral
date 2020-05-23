// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import logo from "../logo-black.png";
import hashtag from "../hashtag.jpeg";
import Clap from "./Clap";
import { db } from "./Firestore";

import firebase from "./Firestore";
import { LanguageContext } from "./themeContext";

const analytics = firebase.analytics();

function onLoad(name) {
  analytics.logEvent(name);
}

export class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      retrieved: false,
      data: [],
      id: "h0xRqDdHmIPV2jQhUXnc",
    };
    this.getDoc = this.getDoc.bind(this);
  }

  componentWillMount() {
    onLoad("about_load");
    this.getDoc();
  }

  getDoc = async () => {
    await db
      .collection("etc")
      .doc("h0xRqDdHmIPV2jQhUXnc")
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.setState({
            data: snapshot.data(),
            retrieved: true,
          });
        }
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div class="container-fluid">
        <div class="jumbotron row" style={{ "background-color": "white" }}>
          <div class="row " style={{ "margin-top": "57px" }}>
            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
            <div
              class="col-xs-8 col-sm-8 col-md-8 col-lg-8"
              style={{ textAlign: "center" }}
            >
              <h3
                class="row card-title justify-content-center"
                style={{ textAlign: "center", padding: "10px 10px 10px" }}
              >
                <LanguageContext.Consumer>
                  {(context) => (
                    <div>
                    { context.data.about.aboutus }
                    </div>
                  )}
                </LanguageContext.Consumer>
              </h3>
              <div>
                <p
                  class="row justify-content-center"
                  style={{ textAlign: "center", padding: "30px 30px 30px" }}
                >
                  <LanguageContext.Consumer>
                    {(context) => (
                      <div>
                        <img src={logo} alt="FoodLeh?" style={{ height: "20px" }} />
                        {context.data.about.para_one}
                        <br />
                        <br />
                        {context.data.about.para_two}
                        <br />
                        <br />
                        {context.data.about.para_three}
                        <br />
                        <br />
                        {context.data.about.para_four}
                        <hr />
                        <b>{context.data.about.howtouse}</b>
                        <br />
                        <b>{context.data.about.forappusers}</b> {context.data.about.appusers}<br />
                        <br />
                        <b>{context.data.about.forfnb}</b> {context.data.about.fnb}
                        <br />
                        <br />
                        <div class="row d-flex justify-content-center">
                          {this.state.retrieved ? (
                            <Clap
                              toggle="about"
                              collection={"etc"}
                              id={this.state.id}
                              claps={this.state.data.claps}
                            />
                          ) : null}
                          <br />
                          <br />
                        </div>
                        <br />
                        <br />
                        <b>
                          <img src={hashtag} alt="" class="hashtag" />
                        </b>
                        <br />
                        <br />
                        {context.data.about.disclaimer}
                        <br />
                        <br />
                        <a href="https://github.com/limyifan1/hawkercentral">
                          Github Link 
                        </a>
                         {" | "}
                         <a href="https://creativecommons.org/licenses/by-nc/4.0/">
                          CC BY-NC 4.0
                        </a>
                        <br />
                        (Feel free to send pull requests)
                        <br />
                        <br />
                        &copy; 2020 Foodleh? by Yi Fan and Cheeps. 
                        <br />
                        <br />
                        <br />
                      </div>
                    )}
                  </LanguageContext.Consumer>
                </p>
              </div>
            </div>
            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
