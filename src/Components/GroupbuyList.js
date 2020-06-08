import React from "react";
import "../App.css";
import { useParams, withRouter } from "react-router-dom";
import { firebase, uiConfig } from "./Firestore";
import { Button } from "react-bootstrap";
import { db } from "./Firestore";
import queryString from "query-string";
import Cookies from "universal-cookie";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import update from "immutability-helper";

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
      orderData: [],
      firebaseUser: true // temporarily set to true, TODO: implement verification
    };
    this.getDoc.bind(this)
  }

  componentWillMount() {
    this.getDoc();
  }

  addItem = async (event) => {
    console.log("addItem");
    const idx = event.target.name;
    this.setState({
      totalPrice:
        parseFloat(this.state.totalPrice) +
        parseFloat(
          this.state.deliveryData[idx].price
            ? this.state.deliveryData[idx].price
            : 0
        ),
      orderData: update(this.state.orderData, {
        [idx]: { $set: parseInt(this.state.orderData[idx]) + 1 },
      }),
    });
  };

  minusItem = async (event) => {
    console.log("minusItem");
    const idx = event.target.name;
    this.setState({
      // if customer did not order this item previously, do not change total price, keep # item at 0
      totalPrice:
        this.state.orderData[idx] === 0.0
          ? this.state.totalPrice
          : parseFloat(this.state.totalPrice) -
          parseFloat(
            this.state.deliveryData[idx].price
              ? this.state.deliveryData[idx].price
              : 0
          ),
      orderData: update(this.state.orderData, {
        [idx]: {
          $set:
            this.state.orderData[idx] === 0
              ? 0
              : parseInt(this.state.orderData[idx]) - 1,
        },
      }),
    });
  };

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
        this.setState({
          deliveryData: dataToReturn,
          orderData: new Array(dataToReturn.length).fill(0)
        });
        return dataToReturn;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleExpand = async (event) => {
    event.preventDefault();
    console.log("handleExpand");
    const idx = event.currentTarget.dataset.idx
    // Get current groupbuy and reverse expanded status
    let newGroupbuy = this.state.deliveryData[idx];
    newGroupbuy.expanded = !newGroupbuy.expanded;
    // Set state to update this groupbuy's expanded status
    this.setState({
      deliveryData: update(this.state.deliveryData, {
        [idx]: { $set: newGroupbuy },
      }),
    });
    //this.setState({ expanded: !this.state.expanded });
  };

  render() {
    let dataToDisplay = []
    if (this.state.deliveryData !== null) {
      dataToDisplay = this.state.deliveryData.map((data, index) => {
        return (
          <div>
            <div>
              <div
                onClick={this.handleExpand.bind(this)}
                data-idx={index}
                style={{ cursor: "pointer" }}>
                {data.name} {data.active === false ? (<b>(Not Active)</b>) : null}
                <br />
              </div>
              {/* Display menu items available */}
              <div class="row">
              {(data.expanded === true && data.menuitem !== undefined) ? (
                data.menuitem.map((item, menuIndex) =>
                  <div>
                    {/* <div>{item.name}: ${item.price}</div>
                    <div>Buyers: {item.numBuyers}</div>
                    <br /> */}
                    {/* // Nice display of menu items */}
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <figure
                        class="shadow row"
                        style={{
                          margin: "20px",
                          minHeight: "100px",
                          backgroundColor: "#f1f1f1",
                          "border-radius": "5px",
                          position: "relative",
                          display: "flex",
                          padding: "10px 40px 40px",
                          width: "300px",
                        }}
                      >
                        <div class="row">
                          <span
                            style={{
                              alignContent: "right",
                              fontSize: "110%",
                              display: "flex",
                            }}
                          >
                            <b>
                              {item.name !== "" && item.price !== "" ? (
                                <span>
                                  {item.name}
                                  {/* {element && element.description ? (
                                      <span> ({element.description})</span>
                                    ) : null} */}
                                  <span style={{fontSize: "60%"}}> <br/>({item.numBuyers} people buying)</span>
                                </span>
                              ) : null}
                            </b>
                          </span>
                          <div class="row">
                            <div
                              class="col"
                              style={{
                                position: "absolute",
                                left: "5px",
                                bottom: "13px",
                              }}
                            >
                              <span
                                class="shadow badge badge-info m-2"
                                style={{
                                  backgroundColor: "#b48300",
                                  alignContent: "left",
                                  fontSize: "110%",
                                }}
                              >
                                ${item.price ? item.price : "TBD"}
                              </span>
                            </div>
                            <div
                              class="col"
                              style={{
                                position: "absolute",
                                left: "10px",
                                bottom: "10px",
                              }}
                            >
                              <div
                                class="btn-group float-right"
                                role="group"
                                aria-label="Basic example"
                              >
                                <br />
                                {this.state.firebaseUser ? (
                                  <div>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      onClick={this.minusItem}
                                      name={menuIndex}
                                      className="shadow-sm"
                                      style={{
                                        backgroundColor: "white",
                                        color: "black",
                                        "border-radius": "3px",
                                        margin: "10px",
                                      }}
                                    >
                                      -
                          </Button>
                                    <span
                                      style={{
                                        margin: "10px",
                                      }}
                                    >
                                      <b>
                                        {this.state.orderData[menuIndex] !== undefined
                                          ? this.state.orderData[
                                          JSON.parse(JSON.stringify(menuIndex))
                                          ]
                                          : 0}
                                      </b>
                                    </span>
                                    <Button
                                      variant="dark"
                                      size="sm"
                                      onClick={this.addItem}
                                      name={menuIndex}
                                      className="shadow-sm"
                                      style={{
                                        backgroundColor: "black",
                                        color: "white",
                                        "border-radius": "3px",
                                        margin: "10px",
                                      }}
                                    >
                                      +
                          </Button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <br />
                        </div>
                      </figure>
                    </div>
                  </div>
                )
              ) : null}
              </div>
              {/* Display total buyers */}
              {(data.expanded === true && data.menuitem !== undefined && data.buyers !== undefined) ? (
                <div>
                  Total Number of buyers: {data.buyers.length}
                  <br />
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
            <br />

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
