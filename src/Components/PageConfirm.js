import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import "./style.scss";
import { CartContext } from "./themeContext";
import { OverlayTrigger, Popover, Form } from "react-bootstrap";
import { BitlyClient } from "bitly";
const REACT_APP_BITLY_KEY = `${process.env.REACT_APP_BITLY_KEY}`;
const bitly = new BitlyClient(REACT_APP_BITLY_KEY, {});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const shorten = (url) => {
  return bitly.shorten(url).then((d) => {
    return d.link;
  });
};

const popover = (
  <Popover>
    <Popover.Content>
      Your details will only be stored in your browser!
    </Popover.Content>
  </Popover>
);

class FullScreenDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      orderData:
        this.context && this.context.pageData
          ? new Array(this.context.pageData.menu_combined.length).fill(0)
          : [],
      data: [],
      totalPrice: 0.0,
      wantToOrder: false,
      name: "",
      unit: "",
      street: "",
      postal: "",
      notes: "",
      customerNumber: "",
      deliveryTime: "",
      galleryOpened: false,
      retrieved: false,
      activePhoto: 1,
      hasReviewEditMessage: false,
      hasReviewDeleteMessage: false,
      shouldRememberDetails: false,
    };
    this.setOrderText = this.setOrderText.bind(this);
    this.handleCustomerDetails = this.handleCustomerDetails.bind(this);
    this.updateCustomerDetails = this.updateCustomerDetails.bind(this);
    this.toggleShouldRememberDetails = this.toggleShouldRememberDetails.bind(
      this
    );
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  updateCustomerDetails = async (event) => {
    const inputValue = event.target.value;
    const inputField = event.target.name;
    if (inputField === "name") {
      this.setState({
        name: inputValue,
      });
    } else if (inputField === "address") {
      this.setState({
        address: inputValue,
      });
    } else if (inputField === "notes") {
      this.setState({
        notes: inputValue,
      });
    } else if (inputField === "customerNumber") {
      this.setState({
        customerNumber: inputValue,
      });
    } else if (inputField === "deliveryTime") {
      this.setState({
        deliveryTime: inputValue,
      });
    } else if (inputField === "unit") {
      this.setState({
        unit: inputValue,
      });
    } else if (inputField === "street") {
      this.setState({
        street: inputValue, // TODO: autofill
      });
    } else if (inputField === "postal") {
      this.setState({
        postal: inputValue,
      });
      if (inputValue.length === 6) {
        await this.getPostal(inputValue);
      }
    }
  };

  async getPostal(postal) {
    // event.preventDefault();
    let data = await this.callPostal(postal);
    if (data !== undefined) {
      this.setState({
        street: data["ADDRESS"],
      });
    }
  }

  componentWillMount() {
    console.log("run");
    if (localStorage.getItem("userDetails")) {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.setState(userDetails);
      this.setState({ shouldRememberDetails: true });
    }
  }

  callPostal = (postal) => {
    return fetch(
      "https://developers.onemap.sg/commonapi/search?searchVal=" +
        postal +
        "&returnGeom=Y&getAddrDetails=Y"
    )
      .then(function (response) {
        return response.json();
      })
      .then(
        function (jsonResponse) {
          if (
            jsonResponse !== undefined &&
            jsonResponse["results"] !== undefined
          ) {
            return jsonResponse["results"][0];
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  toggleShouldRememberDetails(event) {
    const isChecked = event.target.checked;
    this.setState({ shouldRememberDetails: isChecked });
    this.updateSavedData(isChecked);
  }

  updateSavedData(isChecked) {
    if (!isChecked) {
      localStorage.clear();
    } else {
      const userDetails = {
        name: this.state.name,
        customerNumber: this.state.customerNumber,
        postal: this.state.postal,
        unit: this.state.unit,
        street: this.state.street,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  }

  handleCustomerDetails = async (event) => {
    await this.updateCustomerDetails(event).then(() => {
      this.updateSavedData(this.state.shouldRememberDetails);
    });
  };

  setOrderText = async () => {
    let text = "";
    text = text + "New order from " + this.state.name + "\n";
    console.log(this.context.pageData);

    for (let i = 0; i < this.context.cartProducts.length; i = i + 1) {
      if (
        this.context.cartProducts !== undefined &&
        this.context.cartProducts.length !== 0
      ) {
        // customer ordered this item
        const numItems = parseInt(this.context.cartTotal.productQuantity);
        const thisPrice = parseFloat(
          this.context.pageData.menu_combined[
            this.context.cartProducts[i].index
          ].price
            ? this.context.pageData.menu_combined[
                this.context.cartProducts[i].index
              ].price
            : 0
        );
        text =
          text +
          "*" +
          numItems +
          "x* _" +
          this.context.pageData.menu_combined[
            this.context.cartProducts[i].index
          ].name +
          "_: $" +
          (numItems * thisPrice).toFixed(2) +
          "\n";
      }
    }
    text =
      text +
      "\n\nTotal Price (not including delivery): *$" +
      this.context.cartTotal.totalPrice.toFixed(2) +
      "*";
    text =
      text +
      "\nDelivery address: *" +
      this.state.street +
      " #" +
      this.state.unit +
      " " +
      this.state.postal +
      "*";
    text = text + "\nDelivery Date/Time: *" + this.state.deliveryTime + "*";
    if (this.state.notes !== "") {
      // only display notes if customer added
      text = text + "\nAdditional notes: _" + this.state.notes + "_";
    }
    text =
      text + "\nCustomer phone number: *" + this.state.customerNumber + "*";
    text = text + "\nOrdering from:" + this.context.pageName + ".foodleh.app";

    const storeData = new URLSearchParams();
    storeData.append("postal", this.context.pageData.postal);
    storeData.append("street", this.context.pageData.street);
    storeData.append("unit", this.context.pageData.unit);
    storeData.append("contact", this.context.pageData.contact);
    storeData.append("postal_to", this.state.postal);
    storeData.append("street_to", this.state.street);
    storeData.append("unit_to", this.state.unit);
    storeData.append("contact_to", this.state.customerNumber);
    var shortenedURL = await shorten(
      "https://foodleh.app/driver?" + storeData.toString()
    );
    text =
      text + "\n For F&B Owner, request for a driver here: " + shortenedURL;
    return encodeURIComponent(text);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");
    var text = await this.setOrderText();
    var url =
      "https://wa.me/65" + this.context.pageData.contact + "?text=" + text;
    window.location = url;
  };

  render() {
    // var classes = useStyles();
    var menu_color =
      this.context && this.context.css ? this.context.css.menu_color : null;
    return (
      <div>
        <div onClick={this.handleClickOpen} className="buy-btn">
          Order via WhatsApp
        </div>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar style={{ position: "relative", backgroundColor: menu_color }}>
            <Toolbar>
              <IconButton
                edge="start"
                onClick={this.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{ flex: 1 }}>
                Order via WhatsApp
              </Typography>
              {/* <Button autoFocus color="inherit" onClick={this.handleClose}>
                save
              </Button> */}
            </Toolbar>
          </AppBar>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <div
              class="d-flex justify-content-center align-items-center"
              style={{ padding: "20px" }}
            >
              <div>
                <div class="form-group create-title">
                  <label for="name">Name</label>
                  <input
                    onChange={this.handleCustomerDetails}
                    value={this.state.name}
                    type="text"
                    class="form-control"
                    name="name"
                    style={{ borderColor: "#b48300" }}
                    placeholder="We don't store your info!"
                  ></input>
                </div>

                <div class="form-group create-title">
                  <label for="unit">Mobile Number: </label>
                  <div class="input-group mb-12">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">
                        +65
                      </span>
                    </div>
                    <input
                      onChange={this.handleCustomerDetails}
                      value={this.state.customerNumber}
                      type="tel"
                      class={
                        !this.state.customerNumber
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="customerNumber"
                      placeholder=" 9xxxxxxx"
                      maxLength="8"
                      minlength="8"
                      pattern="[8-9]{1}[0-9]{7}"
                      style={{
                        borderColor: "#b48300",
                        "border-radius": "5px",
                      }}
                      required
                    ></input>
                  </div>
                </div>

                <div class="form-group create-title">
                  <label for="address">Delivery Day/Time</label>
                  <input
                    onChange={this.handleCustomerDetails}
                    value={this.state.deliveryTime}
                    type="text"
                    class="form-control"
                    name="deliveryTime"
                    style={{ borderColor: "#b48300" }}
                    placeholder="Eg Thursday 7 May 12.30pm"
                  ></input>
                </div>

                <div>
                  <div class="row">
                    {" "}
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      {" "}
                      <div class="form-group create-title">
                        <label for="postalcode">Postal Code</label>
                        <div class="input-group">
                          <input
                            onChange={this.handleCustomerDetails}
                            value={this.state.postal}
                            type="text"
                            class={
                              !this.state.postal
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            name="postal"
                            placeholder="Enter Postal Code"
                            maxLength="6"
                            required
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      {" "}
                      <div class="form-group create-title">
                        <label for="unit">Unit #</label>
                        <input
                          onChange={this.handleCustomerDetails}
                          value={this.state.unit}
                          type="text"
                          class="form-control"
                          name="unit"
                          placeholder="E.g. 01-01"
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div class="form-group create-title">
                        <label for="street">
                          Street Name<b> (Auto-Filled)</b>
                        </label>
                        <input
                          onChange={this.handleCustomerDetails}
                          value={this.state.street}
                          type="text"
                          class={
                            !this.state.street
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="street"
                          placeholder="Enter Street Name"
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group create-title">
                  <label for="address">Comments</label>
                  <input
                    onChange={this.handleCustomerDetails}
                    value={this.state.notes}
                    type="text"
                    class="form-control"
                    name="notes"
                    style={{
                      borderColor: "#b48300",
                    }}
                    placeholder="No chilli etc, leave blank if nil"
                  ></input>
                </div>
                <div class="form-group create-title">
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    placement="top"
                    overlay={popover}
                  >
                    <label for="remember">Remember me?</label>
                  </OverlayTrigger>
                  <input
                    name="shouldRememberDetails"
                    type="checkbox"
                    checked={this.state.shouldRememberDetails}
                    onChange={this.toggleShouldRememberDetails}
                    style={{
                      marginLeft: "10px",
                    }}
                  ></input>
                </div>
                <div class="row d-flex justify-content-center, align-items-center">
                  <Button
                    type="submit"
                    variant={"contained"}
                    // variant="outline-secondary"
                    style={{
                      backgroundColor: menu_color,
                      borderColor: menu_color,
                      width: "300px",
                    }}
                    disabled={this.state.loading}
                    color={"secondary"}
                  >
                    Place order via WhatsApp
                  </Button>
                </div>
                <br />
              </div>
            </div>
          </Form>
        </Dialog>
      </div>
    );
  }
}

FullScreenDialog.contextType = CartContext;
export default FullScreenDialog;
