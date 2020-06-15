import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { db, firebase, uiConfig } from "./Firestore";
import Cookies from "universal-cookie";
import "../App.css";

const analytics = firebase.analytics();
const cookies = new Cookies();

function onLoad(name, item) {
  analytics.logEvent(name, { name, item });
}

export class GroupBuyCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseUser: null,
      allGroupBuys: [],
      groupBuy: ""
    }
  }

  componentDidMount() {
    firebase.auth().useDeviceLanguage();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved
        },
      }
    );

    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          this.setState({
            firebaseUser: user
          });
          onLoad("groupbuy customer", user.phoneNumber);
        } else {
          // no user is signed in
        }
      }.bind(this)
    );
  }

  render() {
    const verifiedUser = this.state.firebaseUser;
    return (
      <div
          class="jumbotron"
          style={{
            "padding-top": "70px",
            "padding-bottom": "240px",
            height: "100%",
            "background-color": "white",
          }}
        >
        <div class="container-fluid col-md-10 content col-xs-offset-2">
        { verifiedUser === null ? 
          <div>
            <div>
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            </div>
            <div id="recaptcha-container"></div>
            <br />
          </div>
        :
          <div>
            <p>
              Verified your phone number: { verifiedUser.phoneNumber }
            </p>
            <Select
                isDisabled={this.state.allGroupBuys.length === 0}
                name="groupBuy"
                options={this.state.allGroupBuys}
                value={this.state.groupBuy}
                onChange={this.filterGroupBuy}
                placeholder="Filter By Group Name"
            />
          </div>
        }
        </div>
      </div>
    )
  }

}

export default withRouter(GroupBuyCustomer);
