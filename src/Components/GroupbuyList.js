import React from "react";
import "../App.css";
import { useParams, withRouter } from "react-router-dom";
import { firebase, uiConfig } from "./Firestore";
import { Button } from "react-bootstrap";
import { db } from "./Firestore";
import queryString from "query-string";
import Cookies from "universal-cookie";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const cookies = new Cookies();

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name: item });
}

// This is an individual area's groupbuys. Redirected from Groupbuy.js with area name in URL params
// Retrieve separately from db instead of passing area data from Groupbuy.js
// This is to allow users accessing link directly to also have access to information
export class GroupbuyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryData: null,
    };
    this.getDoc.bind(this)
  }

  componentWillMount() {
    this.getDoc();
  }

  getDoc = () => {
    return db
      .collection("groupbuy")
      .where(
        "area",
        "==",
        this.props.match.params.area
      )
      .get()
      .then(async (snapshot) => {
        var dataToReturn = [];
        snapshot.forEach((d) => {
          console.log(d.data());
          dataToReturn.push(d.data())
        });
        this.setState({ deliveryData: dataToReturn });
        return dataToReturn;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleExpand = async (event) => {
    event.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    let dataToDisplay = []
    if (this.state.deliveryData !== null) {
      dataToDisplay = this.state.deliveryData.map((data) => {
        return (
          <div
            onClick={this.handleExpand.bind(this)}
            style={{ cursor: "pointer" }}>
            {data.name} {data.active === false ? (<b>(Not Active)</b>) : null}
            <br />
            {/* Display menu items available */}
            {(this.state.expanded && data.menuitem !== undefined) ? (
              data.menuitem.map(item =>
                <div>
                  <div>{item.name}: ${item.price}</div>
                  <div>Buyers: {item.numBuyers}</div>
                  <br/>
                </div>
              )
            ) : null}
            {/* Display total buyers */}
            {(this.state.expanded && data.menuitem !== undefined && data.buyers !== undefined) ? (
              <div>
                Total Number of buyers: {data.buyers.length}
                <br/>
                Total Groupbuy Size: ??
              </div>
            ) : null}
            <hr
              style={{
                color: "#b48300",
                backgroundColor: "#b48300",
                height: "1px",
                borderColor: "#b48300",
                width: "100%",
                alignItems: "center",
              }}
            />
          </div>
        );
      });
    }
    return (
      <div
        style={{
          "padding-top": "80px",
        }}>
        {/* Back button */}
        <Button
          onClick={() => this.props.history.push('/groupbuy')}
          style={{
            cursor: "pointer",
          }}>
          Back to All Groupbuys
          </Button>
        <h1>{this.props.match.params.area}</h1>
        <hr
          style={{
            color: "#b48300",
            backgroundColor: "#b48300",
            height: "1px",
            borderColor: "#b48300",
            width: "100%",
            alignItems: "center",
          }}
        />
        {dataToDisplay}
      </div>
    );
  }
}



export default withRouter(GroupbuyList);
