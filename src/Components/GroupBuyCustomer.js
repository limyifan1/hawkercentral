import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { db, firebase, uiConfig } from "./Firestore";
import "../App.css";
import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

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

function GroupBuyList(props) {
  const groupBuys = props.groupBuys;

  const cards = groupBuys.map(groupBuy => 
    <Card
      key={groupBuy.hawker}
      className="card shadow col-sm-6"
      style={{ 
        margin: "5px" 
      }}
    >
      <CardContent>
        <p className="card-title">{ groupBuy.hawker }</p>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="right">Price&nbsp;(S$)</TableCell>
              <TableCell align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupBuy.items.map(item => (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.price}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div
      className="col-sm-12 groupbuy-container mt-4"
      style={{
        display: "inline-flex",
        paddingLeft: "0px"
      }}
    >
      { cards }
    </div>
  );
}

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
    // TODO: dummy data to be removed after configuring Firebase
    const data = [
      {
        hawker: "Tampines",
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
        hawker: "3",
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
        <div className="row justify-content-center">
          <div className="col-12 col-sm-6 col-md-6">
            <h3 id="back-to-top-anchor">
              Your Group Buys
            </h3>
          </div>
        </div>
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
          <React.Fragment>
            <div className="row justify-content-center mt-4">
              Verified your phone number: { verifiedUser.phoneNumber }
            </div>
            <div className="row justify-content-center mt-4">
              <div className="col-12 col-sm-6 col-md-6">
                <input
                  disabled={this.state.allGroupBuys.length === 0}
                  className="form-control"
                  type="text"
                  name="search"
                  value={this.state.search}
                  placeholder="Search For Group Buy"
                  style={{
                    width: "100%",
                    height: "38px",
                    "borderRadius": "1rem",
                  }}
                  onChange={this.updateFilteredGroupBuys}
                ></input>
              </div>
              <div className="col-12 col-sm-6 col-md-6">
                <Select
                    isDisabled={this.state.allGroupBuys.length === 0}
                    name="filterOption"
                    options={filterOptions}
                    value={this.state.filterOption}
                    onChange={this.updateFilteredGroupBuys}
                />
              </div>
            </div>
            { this.state.filteredGroupBuys &&
              <GroupBuyList groupBuys={this.state.filteredGroupBuys}/> }
          </React.Fragment>
        }
        </div>
      </div>
    )
  }

}

export default withRouter(GroupBuyCustomer);
