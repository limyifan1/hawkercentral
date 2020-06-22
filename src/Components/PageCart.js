import React from "react";
import PropTypes from "prop-types";

import CartProduct from "./PageCartProduct";
import { CartContext } from "./themeContext";
import "./style.scss";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Component from "./index";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

class PageCart extends React.Component {
  static propTypes = {
    loadCart: PropTypes.func.isRequired,
    updateCart: PropTypes.func.isRequired,
    cartProducts: PropTypes.array.isRequired,
    newProduct: PropTypes.object,
    removeProduct: PropTypes.func,
    productToRemove: PropTypes.object,
    changeProductQuantity: PropTypes.func,
    productToChange: PropTypes.object,
  };

  state = {
    isOpen: false,
  };

  openFloatCart = () => {
    if (!this.context.channel) {
      this.context.toggleDialog();
    }
    this.setState({ isOpen: true });
  };

  closeFloatCart = () => {
    this.setState({ isOpen: false });
  };

  changeProductQuantity = (changedProduct) => {
    const { cartProducts, updateCart } = this.props;

    const product = cartProducts.find((p) => p.id === changedProduct.id);
    product.quantity = changedProduct.quantity;
    if (product.quantity <= 0) {
      this.removeProduct(product);
    }
    updateCart(cartProducts);
  };

  handleClickOpen = () => {
    if (this.context.channel) {
      this.setState({ open: true });
    } else {
      this.context.toggleDialog();
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { cartTotal, cartProducts, pageData } = this.context;

<<<<<<< HEAD
    const products = cartProducts.map((p) => {
      if (p.quantity > 0) {
        return (
          <CartProduct
            product={p}
            img={pageData.menu_combined[p.index].image}
          />
=======
    const menu_color =
      this.context && this.context.css && this.context.css.menu_color
        ? this.context.css.menu_color
        : "#b48300";

    const products = cartProducts.map((p, index) => {
      if (p.quantity > 0) {
        return (
          <CartProduct cartIndex={index} product={p} img={pageData.menu_combined[p.index].pic} />
>>>>>>> feat(page): added addon customizations
        );
      }
      return <div></div>;
    });

    let classes = ["float-cart"];

    if (this.state.isOpen) {
      classes.push("float-cart--open");
    }

    const delivery_fee =
      cartTotal.totalPrice <= this.context.pageData.free_delivery ||
      this.context.pageData.free_delivery === "0"
        ? Number(this.context.delivery_fee)
        : 0;

    var discount =
      this.context.all_promo || this.context.selfcollect_promo
        ? (Number(this.context.all_promo) / 100) * Number(cartTotal.totalPrice)
        : 0;

    if (this.context.channel === "collect") {
      discount =
        discount +
        (Number(this.context.selfcollect_promo) / 100) *
          Number(cartTotal.totalPrice);
    }

    discount = discount.toFixed(2);

    var totalPrice =
      Number(this.context.cartTotal.totalPrice) +
      Number(delivery_fee) -
      Number(discount);

    totalPrice = totalPrice.toFixed(2);

    return (
      <span className={classes.join(" ")}>
        {/* If cart open, show close (x) button */}
        {this.state.isOpen && (
          <div
            onClick={() => this.closeFloatCart()}
            className="float-cart__close-btn"
          >
            X
          </div>
        )}

        {/* If cart is closed, show bag with quantity of product and open cart action */}
        {!this.state.isOpen && (
          <span
            onClick={() => this.openFloatCart()}
            className="bag bag--float-cart-closed"
          >
            <span className="bag__quantity">
              {this.context.cartTotal.productQuantity}
            </span>
          </span>
        )}

<<<<<<< HEAD
=======
        {!this.state.isOpen && (
          <div
            class="d-flex align-items-center justify-content-center"
            style={{
              position: "fixed",
              bottom: "0px",
              width: "100%",
              backgroundColor: menu_color,
              right: "0px",
              height: "45px",
              cursor: "pointer",
            }}
            onClick={() => this.openFloatCart()}
          >
            {/* <span
              onClick={() => this.openFloatCart()}
              className="bag bag--float-cart-closed"
              style={{ width: "100px" }}
            >
              <span className="bag__quantity">
                {this.context.cartTotal.productQuantity}
              </span>
            </span> */}
            <span
              style={{
                width: "40px",
                height: "40px",
                position: "relative",
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: "15px",
              }}
            >
              View Cart
              <span
                className="bag__quantity"
                style={{ right: "-80px", bottom: "15px" }}
              >
                {this.context.cartTotal.productQuantity}
              </span>
            </span>
          </div>
        )}

        {/* <div
          style={{
            position: "fixed",
            bottom: "-100px",
            width: "100%",
            height: "50px",
            zIndex: 99999999,
            backgroundColor: menu_color,
            color: "white",
          }}
          // class="d-flex align-items-center"
        >
          View Cart
        </div> */}

>>>>>>> feat(page): added new option for pickup and delivery
        <div className="float-cart__content">
          <div className="float-cart__header">
            <span className="bag">
              <span className="bag__quantity">
                {this.context.cartTotal.productQuantity}
              </span>
            </span>
            <span className="header-title">Cart</span>
          </div>

          <div className="float-cart__shelf-container">
            <Component.PageCartChannel />
            {products}
            {!products.length && (
              <p className="shelf-empty">
                Add some products in the cart <br />
                :)
              </p>
            )}
          </div>
          <div className="float-cart__footer">
            <div class="row">
              {this.context.pageData.minimum_order &&
              this.context.pageData.minimum_order !== "0" &&
              this.context.channel === "delivery" ? (
                <React.Fragment>
                  {this.context.pageData.minimum_order - cartTotal.totalPrice >
                  0 ? (
                    <div className="progress">
                      <Grid container direction={"row"}>
                        <Grid
                          style={{
                            color: "black",
                            width: "100%",
                            marginBottom: "20px",
                            fontSize: "18px",
                          }}
                        >
                          $
                          {this.context.pageData.minimum_order -
                            cartTotal.totalPrice}{" "}
                          to minimum amount
                        </Grid>
                        <Grid style={{ width: "100%" }}>
                          <LinearProgressWithLabel
                            value={
                              (100 * cartTotal.totalPrice) /
                              this.context.pageData.minimum_order
                            }
                          />
                        </Grid>
                      </Grid>
                    </div>
                  ) : (
                    <React.Fragment>
                      <div className="progress">
                        <h5 style={{ color: "green" }}>Minimum Amount Met! </h5>
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              ) : null}
            </div>
            <div class="row">
              {this.context.pageData.free_delivery &&
              this.context.pageData.free_delivery !== "0" &&
              this.context.channel === "delivery" ? (
                <React.Fragment>
                  {this.context.pageData.free_delivery - cartTotal.totalPrice >
                  0 ? (
                    <div className="progress">
                      <Grid container direction={"row"}>
                        <Grid
                          style={{
                            color: "black",
                            width: "100%",
                            marginBottom: "20px",
                            fontSize: "18px",
                          }}
                        >
                          $
                          {this.context.pageData.free_delivery -
                            cartTotal.totalPrice}{" "}
                          to free delivery
                        </Grid>
                        <Grid style={{ width: "100%" }}>
                          <LinearProgressWithLabel
                            value={
                              (100 * cartTotal.totalPrice) /
                              this.context.pageData.free_delivery
                            }
                          />
                        </Grid>
                      </Grid>
                    </div>
                  ) : (
                    <React.Fragment>
                      <div className="progress">
                        <h5 style={{ color: "green" }}>Free Delivery Met! </h5>
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              ) : null}
            </div>
            {this.context.channel === "delivery" ? (
              <div class="row">
                {(this.context.delivery_option === "none" ||
                  !this.context.delivery_option) && (
                  <div className="sub">DELIVERY FEES NOT INCLUDED</div>
                )}
                {(this.context.delivery_option === "fixed" ||
                  this.context.delivery_option === "distance") &&
                  this.context.delivery_option &&
                  this.context.delivery_fee !== undefined && (
                    <React.Fragment>
                      <div className="sub">DELIVERY FEES: </div>
                      <div className="sub-price">
                        <p className="sub-price__val">${delivery_fee}</p>
                      </div>
                    </React.Fragment>
                  )}
              </div>
            ) : null}
            {this.context.all_promo || this.context.selfcollect_promo ? (
              <div class="row">
                {(this.context.delivery_option === "fixed" ||
                  this.context.delivery_option === "distance") &&
                  this.context.delivery_option &&
                  this.context.delivery_fee !== undefined && (
                    <React.Fragment>
                      <div className="sub">DISCOUNT: </div>
                      <div className="sub-price">
                        <p className="sub-price__val">- ${discount}</p>
                      </div>
                    </React.Fragment>
                  )}
              </div>
            ) : null}
            <div class="row">
              <div className="sub">SUBTOTAL</div>
              <div className="sub-price">
                {(this.context.delivery_option === "none" ||
                  this.context.channel === "collect") && (
                  <p className="sub-price__val">${totalPrice}</p>
                )}
                {(this.context.delivery_option === "fixed" ||
                  this.context.delivery_option === "distance") &&
                  this.context.channel === "delivery" &&
                  this.context.delivery_fee !== undefined && (
                    <p className="sub-price__val">${totalPrice}</p>
                  )}
              </div>
            </div>
            <div>
              <div onClick={this.handleClickOpen} className="buy-btn">
                {this.context.channel ? (
                  <span>Order via WhatsApp</span>
                ) : (
                  <span>Choose Delivery/Pick-up</span>
                )}
              </div>
            </div>
            <Dialog
              fullScreen
              open={this.state.open}
              onClose={this.handleClose}
              TransitionComponent={Transition}
            >
              <Component.PageConfirm
                handleClose={this.handleClose}
                toggle="cart"
              />
            </Dialog>
          </div>
        </div>
      </span>
    );
  }
}

PageCart.contextType = CartContext;

export default PageCart;
