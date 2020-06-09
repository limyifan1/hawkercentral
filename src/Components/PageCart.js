import React, { Component } from "react";
import PropTypes from "prop-types";

// import { connect } from 'react-redux';
// import {
//   loadCart,
//   removeProduct,
//   changeProductQuantity,
// } from '../../services/cart/actions';
// import { updateCart } from '../../services/total/actions';
import CartProduct from "./PageCartProduct";
// import { formatPrice } from '../../services/util';
import { CartContext } from "./themeContext";
import PageConfirm from "./PageConfirm";
import "./style.scss";

class PageCart extends Component {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.newProduct !== this.props.newProduct) {
      this.addProduct(nextProps.newProduct);
    }

    if (nextProps.productToRemove !== this.props.productToRemove) {
      this.removeProduct(nextProps.productToRemove);
    }

    if (nextProps.productToChange !== this.props.productToChange) {
      this.changeProductQuantity(nextProps.productToChange);
    }
  }

  openFloatCart = () => {
    this.setState({ isOpen: true });
  };

  closeFloatCart = () => {
    this.setState({ isOpen: false });
  };

  addProduct = (product) => {
    const { cartProducts, updateCart } = this.props;
    let productAlreadyInCart = false;

    cartProducts.forEach((cp) => {
      if (cp.id === product.id) {
        cp.quantity += product.quantity;
        productAlreadyInCart = true;
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }

    updateCart(cartProducts);
    this.openFloatCart();
  };

  removeProduct = (product) => {
    const { cartProducts, updateCart } = this.props;

    const index = cartProducts.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      cartProducts.splice(index, 1);
      updateCart(cartProducts);
    }
  };

  proceedToCheckout = () => {
    // const {
    //   totalPrice,
    //   productQuantity,
    //   currencyFormat,
    //   currencyId,
    // } = this.props.cartTotal;
    alert("Add some product in the cart!");

    // if (!productQuantity) {
    //   alert("Add some product in the cart!");
    // } else {
    //   //   alert(
    //   //     `Checkout - Subtotal: ${currencyFormat} ${formatPrice(
    //   //       totalPrice,
    //   //       currencyId
    //   //     )}`
    //   //   );
    // }
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

  render() {
    const { cartTotal, cartProducts, pageData } = this.context;

    const products = cartProducts.map((p) => {
      if (p.quantity > 0) {
        return (
          <CartProduct
            product={p}
            img={pageData.menu_combined[p.index].image}
          />
        );
      }
      return <div></div>;
    });

    let classes = ["float-cart"];

    if (this.state.isOpen) {
      classes.push("float-cart--open");
    }

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
              <div className="sub">SUBTOTAL</div>
              <div className="sub-price">
                <p className="sub-price__val">${`${cartTotal.totalPrice}`}</p>
              </div>
            </div>
            <div class="row">
              <div className="sub">DELIVERY FEES NOT INCLUDED</div>
            </div>
            {/* <div onClick={() => this.proceedToCheckout()} className="buy-btn">
              Checkout
            </div> */}
            <PageConfirm />
          </div>
        </div>
      </span>
    );
  }
}

PageCart.contextType = CartContext;

export default PageCart;
