import React, { Component } from "react";
import PropTypes from "prop-types";
import { CartContext } from "./themeContext";
// import { formatPrice } from '../../../services/util';
import motor from "../assets/motor-delivery.png";
import bag from "../assets/styrofoam-dabao.png";
import Button from "@material-ui/core/Button";

const dayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

class PageCartChannel extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    removeProduct: PropTypes.func.isRequired,
    changeProductQuantity: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMouseOver: false,
    };
  }

  handleMouseOver = () => {
    this.setState({ isMouseOver: true });
  };

  handleMouseOut = () => {
    this.setState({ isMouseOver: false });
  };

  handleOnIncrease = (index) => {
    this.context.addProduct(index);
  };

  handleOnDecrease = (index) => {
    this.context.removeProduct(index);
  };

  render() {
    // const { product, img} = this.state;

    const classes = ["shelf-channel"];

    return (
      <div className={classes.join(" ")}>
        <div className="shelf-item__details">
          {this.context.channel === "delivery" && (
            <span>
              <img
                src={motor}
                style={{
                  flexShrink: "0",
                  maxWidth: "10%",
                  marginRight: "10px",
                }}
                alt="delivery"
              />
              <b>Delivery</b>
            </span>
          )}
          {this.context.channel === "collect" && (
            <span>
              <img
                src={bag}
                style={{
                  flexShrink: "0",
                  maxWidth: "10%",
                  marginRight: "10px",
                }}
                alt="delivery"
              />
              <b>Self-Collect</b>
            </span>
          )}
          {this.context.customerDetails.datetime ? (
            <div>
              <small>
                {dayName[this.context.customerDetails.datetime.getDay()] +
                  " " +
                  this.context.customerDetails.datetime.getDate() +
                  " " +
                  monthNames[this.context.customerDetails.datetime.getMonth()] +
                  " " +
                  formatAMPM(this.context.customerDetails.datetime)}
              </small>
            </div>
          ) : null}
          <Button size={"small"} variant={"contained"} onClick={()=>this.context.toggleDialog()}>Change Option</Button>
          {/* <p className="title">{menu[this.props.product.index].name}</p> */}
          {/* <p className="desc">Quantity: {this.props.product.quantity}</p> */}
        </div>
      </div>
    );
  }
}
PageCartChannel.contextType = CartContext;
export default PageCartChannel;
