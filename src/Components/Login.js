// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import firebase from "./Firestore";

const analytics = firebase.analytics;

function onLoad(name) {
  analytics.logEvent(name);
}

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    onLoad("login_page");
  }

  render() {
    return <div class="container-fluid">
        {/* <SignInFacebook /> */}
    </div>;
  }
}

export default Login;
