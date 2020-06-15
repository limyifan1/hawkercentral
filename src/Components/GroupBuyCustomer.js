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
      search: ""
    }

    this.updateFilteredGroupBuys = this.updateFilteredGroupBuys.bind(this);
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
        hawker: "Tiong Bahru Bakery",
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
        hawker: "Hup Siong Chicken Rice",
        active: false,
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

    this.setState({
      allGroupBuys: data,
      filteredGroupBuys: data
    });
  }

  updateFilteredGroupBuys = async(event, meta=null) => {
    let name = "";
    let value = "";
    
    if (event.target) {
      name = event.target.name;
      value = event.target.value;
    } else {
      // this is for the react-select which does not return name directly
      name = meta.name;
      value = event;
    }

    this.setState({ [name]: value }, () => {
      this.filterGroupBuys();
    });
  }

  filterGroupBuys = () => {
    let filteredGroupBuys = this.state.allGroupBuys;
    const status = this.state.filterOption;
    const searchTerm = this.state.search;

    const isActive = status === activeGroupBuysOption;
    if (status.value !== allGroupBuysOption.value) {
      filteredGroupBuys = this.state.allGroupBuys.filter(groupBuy => {
        return groupBuy.active === isActive;
      });
    }

    if (searchTerm) {
      filteredGroupBuys = filteredGroupBuys.filter(groupBuy => {
        return groupBuy.hawker.toLowerCase().includes(searchTerm.toLowerCase())
          || groupBuy.area.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    this.setState({ filteredGroupBuys: filteredGroupBuys });
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
            <div class="row justify-content-center mt-4">
              <div class="col-12 col-sm-6 col-md-6">
                <input
                  disabled={this.state.allGroupBuys.length === 0}
                  class="form-control"
                  type="text"
                  name="search"
                  value={this.state.search}
                  placeholder="Search For Group Buy"
                  style={{
                    width: "100%",
                    height: "38px",
                    "border-radius": "1rem",
                  }}
                  onChange={this.updateFilteredGroupBuys}
                ></input>
              </div>
              <div class="col-12 col-sm-6 col-md-6">
                <Select
                    isDisabled={this.state.allGroupBuys.length === 0}
                    name="filterOption"
                    options={filterOptions}
                    value={this.state.filterOption}
                    onChange={this.updateFilteredGroupBuys}
                />
              </div>
            </div>
            {/* <GroupBuyList groupbuys={this.state.filteredGroupBuys}/> */}
          </div>
        }
        </div>
      </div>
    )
  }

}

export default withRouter(GroupBuyCustomer);
