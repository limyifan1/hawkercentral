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

const analytics = firebase.analytics();

function onLoad(name){
  analytics.logEvent(name)
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
    onLoad("about_load")
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
                About Us
              </h3>
              <div>
                <p
                  class="row justify-content-center"
                  style={{ textAlign: "center", padding: "30px 30px 30px" }}
                >
                  <div>
                    <img src={logo} alt="FoodLeh?" style={{ height: "20px" }} /> is an
                    easy-to-use web application designed to bridge hawker stalls
                    and restaurant owners in Singapore with all Singaporeans via
                    a free online platform.
                    <br />
                    <br />
                    Sounds too good to be true? What's the catch? Boh leh...{" "}
                    <img src={logo} alt="" style={{ height: "20px" }} /> is a
                    purely non-profit initiative devised to help local F&B stall
                    owners to be seen online. It’s also a community-based
                    platform where listings can be created and edited by members
                    of the public.
                    <br />
                    <br />
                    "If we don't give discounts, we're pretty much invisible on
                    the delivery platform" While that is true of other
                    applications,{" "}
                    <img src={logo} alt="" style={{ height: "20px" }} /> doesn't
                    discriminates, with each listing given an equal opportunity
                    to shine based on their proximity to each User. There's no
                    need to eat into profit margins, and best of all, no more
                    steep commissions!
                    <br />
                    <br />
                    Steady lah, time to dabao and save our local F&B stall
                    owners!
                    <hr />
                    <b>How to Use</b>
                    <br />
                    <b>(for App Users)</b> At the “Home” page, select either
                    "dabao" or "delivery", and key in your postal code. Start
                    browsing listings! Encourage your favourite businesses
                    during this tough period by giving them a virtual “clap”
                    too! <br />
                    <br />
                    <b>(for Local F&B businesses)</b> Go to the “Create” page
                    and fill in the form. Voila! All done in a matter of
                    minutes!
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
                    Disclaimer: FoodLeh? is a crowdsourced hawker directory relying on Singaporeans to share information about our local F&B places. While we hope to keep the information on this platform as accurate as possible, there might be inaccuracies due to user entries from time to time. FoodLeh? will not be held liable for any inaccuracies or misrepresentation here, but we continue striving to improve this platform. Contact us at foodleh@outlook.com if you have any suggestions or notice anything we could improve!
                    <br />
                    <br />
                    <a href="https://github.com/limyifan1/hawkercentral">Github Link</a> 
                    <br />
                    (Feel free to send pull requests)
                    <br />
                    <br />
                    &copy; 2020 Foodleh? by Yi Fan and Cheeps
                    <br />
                    <br />
                    <br />
                  </div>
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
