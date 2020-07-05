import React from "react";
import PropTypes from "prop-types";

import CartProduct from "./PageCartProduct";
import CartProgress from "./CartProgress";
import { CartContext } from "./themeContext";
import "./style.scss";
import Slide from "@material-ui/core/Slide";
import Component from "./index";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PromoCodeDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const context = React.useContext(CartContext);

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.promoDialog}
        onClose={props.closeFloatPromo}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Enter Your Promo Code"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              label={"Enter Promo Code"}
              type="text"
              value={context.promo_code_input}
              style={{ width: "100%" }}
              onChange={context.changePromocode}
            />
          </DialogContentText>
          {context.promo_code_valid ? (
            <p style={{ color: "green" }}>Promo Code Successfully Applied</p>
          ) : (
            <p style={{ color: "red" }}>Please Enter A Valid Code</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.closeFloatPromo}
            color="primary"
            variant={"contained"}
          >
            Done
          </Button>
          {/* <Button onClick={props.closeFloatPromo} color="primary">
            Cancel
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

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
    promoDialog: false,
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

  openFloatPromo = () => {
    this.setState({ promoDialog: true });
  };

  closeFloatPromo = () => {
    this.setState({ promoDialog: false });
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

    const menu_color =
      this.context && this.context.css && this.context.css.menu_color
        ? this.context.css.menu_color
        : "#b48300";

    const products = cartProducts.map((p, index) => {
      if (p.quantity > 0) {
        return (
          <CartProduct
            cartIndex={index}
            product={p}
            img={pageData.menu_combined[p.index].pic}
          />
        );
      }
      return <div></div>;
    });

    let classes = ["float-cart"];

    if (this.state.isOpen) {
      classes.push("float-cart--open");
    }

    const deliveryFee =
      (cartTotal.totalPrice <= this.context.pageData.free_delivery ||
      this.context.pageData.free_delivery === "0") && this.context.delivery_fee
        ? Number(this.context.delivery_fee)
        : 0;

    var discount = 0;
    if (this.context.promo_code) {
      if (this.context.promo_code_valid)
        discount = this.context.all_promo
          ? (Number(this.context.all_promo) / 100) *
            Number(cartTotal.totalPrice)
          : 0;
    } else {
      discount = this.context.all_promo
        ? (Number(this.context.all_promo) / 100) * Number(cartTotal.totalPrice)
        : 0;
    }

    if (this.context.channel === "collect") {
      discount =
        discount +
        (Number(this.context.selfcollect_promo) / 100) *
          Number(cartTotal.totalPrice);
    }

    discount = discount.toFixed(2);

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
            <CartProgress context={this.context} deliveryFee={deliveryFee} discount={discount}/>
            {this.context.promo_code ? (
              <Button
                onClick={this.openFloatPromo}
                color={"inherit"}
                variant={"contained"}
                style={{ color: "black" }}
              >
                Enter Promo Code
              </Button>
            ) : null}
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
            <PromoCodeDialog
              promoDialog={this.state.promoDialog}
              openFloatPromo={this.openFloatPromo}
              closeFloatPromo={this.closeFloatPromo}
            />
          </div>
        </div>
      </span>
    );
  }
}

PageCart.contextType = CartContext;

export default PageCart;
