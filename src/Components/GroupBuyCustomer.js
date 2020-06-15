import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { db, firebase, uiConfig } from "./Firestore";
import Cookies from "universal-cookie";
import "../App.css";

const analytics = firebase.analytics();
const allGroupBuysOption = {
  label: "All Group Buys",
  value: "All Group Buys"
};

function onLoad(name, item) {
  analytics.logEvent(name, { name, item });
}

export class GroupBuyCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseUser: null,
      allGroupBuys: [],
      filteredGroupBuys: [],
      groupBuy: "",
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
          this.getGroupBuyCustomerData(user);
        } else {
          // no user is signed in
        }
      }.bind(this)
    );
  }

  getGroupBuyCustomerData = () => {
    const data = [
      {
        active: true,
        area: "Tampines",
        items: [
          {
            name: "curry puff",
            quantity: 2,
            price: 3
          },
          {
            name: "sardine puff",
            quantity: 1,
            price: 5
          },
        ]
      },
      {
        active: true,
        area: "Pasir Ris",
        items: [
          {
            name: "curry chicken",
            quantity: 1,
            price: 10
          },
          {
            name: "curry fish",
            quantity: 2,
            price: 8
          },
        ]
      }
    ];

    const allGroupBuys = [allGroupBuysOption];
    data.forEach(group => allGroupBuys.push({ label: group.area, value: group.area }));

    this.setState({
      allGroupBuys: allGroupBuys,
      groupBuy: allGroupBuysOption,
      filteredGroupBuys: allGroupBuys
    });
  }

  filterGroupBuy = async(selectedOption) => {
    let filteredGroupBuys = this.state.allGroupBuys;

    if (selectedOption.value !== "All Group Buys") {
      filteredGroupBuys = this.state.allGroupBuys.filter(groupBuy => {
        return groupBuy.area === selectedOption.value;
      });
    }

    this.setState({ 
      groupBuy: selectedOption,
      filteredGroupBuys: filteredGroupBuys 
    });
  }

  render() {
    const verifiedUser = this.state.firebaseUser;

    return (
      <div
          className="jumbotron"
          style={{
            "paddingTop": "70px",
            "paddingBottom": "240px",
            height: "100%",
            "backgroundColor": "white",
          }}
        >
        <div className="container-fluid col-md-10 content col-xs-offset-2">
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
