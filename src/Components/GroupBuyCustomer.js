import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { db, firebase, uiConfig } from "./Firestore";
import "../App.css";

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name, item });
}

const allGroupBuysOption =   { label: "All", value: "All" };
const activeGroupBuysOption = { label: "Active", value: "Active" };
const inactiveGroupBuysOption = { label: "Inactive", value: "Inactive" };


const filterOptions = [
  allGroupBuysOption,
  activeGroupBuysOption,
  inactiveGroupBuysOption
];

// function GroupBuyList(props) {
//   const groupBuys = props.groupBuys;
//   const cards = groupBuys.map(groupBuy => 
    
//   );
// }

export class GroupBuyCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseUser: null,
      allGroupBuys: [],
      filteredGroupBuys: [],
      filterOption: allGroupBuysOption,
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

    const allGroupBuys = [];
    data.forEach(group => allGroupBuys.push({ label: group.area, value: group.area }));

    this.setState({
      allGroupBuys: allGroupBuys,
      filteredGroupBuys: allGroupBuys
    });
  }

  filterGroupBuy = async(selectedOption) => {
    let filteredGroupBuys = this.state.allGroupBuys;

    if (selectedOption.value !== allGroupBuysOption.value) {
      filteredGroupBuys = this.state.allGroupBuys.filter(groupBuy => {
        return groupBuy.area === selectedOption.value;
      });
    }

    this.setState({ 
      filterOption: selectedOption,
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
                options={filterOptions}
                value={this.state.filterOption}
                onChange={this.filterGroupBuy}
            />
            {/* <GroupBuyList groupbuys={this.state.filteredGroupBuys}/> */}
          </div>
        }
        </div>
      </div>
    )
  }

}

export default withRouter(GroupBuyCustomer);
