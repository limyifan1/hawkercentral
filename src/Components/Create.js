// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import Component from "../Components";
import { withRouter } from "react-router-dom";

import firebase from "./Firestore";
import { LanguageContext } from "./themeContext";

const analytics = firebase.analytics();

function onLoad(name) {
  analytics.logEvent(name)
}

export class Create extends React.Component {
  componentWillMount() {
    onLoad("create_load")
  }
  render() {
    return (
      <div>
        {" "}
        <div
          class="jumbotron"
          style={{
            "padding-top": "110px",
            "padding-bottom": "240px",
            height: "100%",
            "background-color": "white",
          }}
        >

          <h3>
            <LanguageContext.Consumer>
              {context => (
                <div>
                { context.data.create.createlisting }
                </div>
              )}
            </LanguageContext.Consumer>
          </h3>
          <Component.ListForm toggle={"create"} />
        </div>
      </div>
    );
  }
}

export default withRouter(Create);
