import React, { Component } from "react";
import PropTypes from "prop-types";
import { CartContext } from "./themeContext";
import Thumb from "./Thumb";
// import { formatPrice } from '../../../services/util';

class PageCartProduct extends Component {
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

  handleOnDecrease = (index, cartIndex) => {
    this.context.removeProduct(index, cartIndex);
  };

  render() {
    // const { product, img} = this.state;

    const classes = ["shelf-item"];
    const menu = this.context.pageData.menu_combined;
    if (this.state.isMouseOver) {
      classes.push("shelf-item--mouseover");
    }

    var addons = [];
    var addonsTotal = 0;
    if (this.props.product.addons) {
      this.props.product.addons.forEach((element, index) => {
        addonsTotal += Number(
          menu[this.props.product.index].addon[element].price
        );
        addons.push(
          <React.Fragment>
            <div>
              {menu[this.props.product.index].addon[element].name}
              {" (+$"}
              {menu[this.props.product.index].addon[element].price})
            </div>
          </React.Fragment>
        );
      });
    }

    return (
      <div className={classes.join(" ")}>
        <div
          className="shelf-item__del"
          onMouseOver={() => this.handleMouseOver()}
          onMouseOut={() => this.handleMouseOut()}
          onClick={() => removeProduct(product)}
        />
        <Thumb
          classes="shelf-item__thumb"
          src={this.props.img}
          alt={this.props.product.title}
        />
        <div className="shelf-item__details">
          <p className="title">{menu[this.props.product.index].name}</p>
          <p className="desc">{addons}</p>
          <p className="desc">Quantity: {this.props.product.quantity}</p>
        </div>
        <div className="shelf-item__price">
<<<<<<< HEAD
          {/* <p>{`${product.price}`}</p> */}
          <div>
            <button
<<<<<<< HEAD
              onClick={() => this.handleOnDecrease(product.index)}
              // disabled={product.quantity === 1 ? true : false}
=======
              onClick={() => this.handleOnDecrease(this.props.product.index)}
>>>>>>> feat(page): added privacy policy disclaimer, storing of order info, database rules
=======
          $
          {(
            (Number(menu[this.props.product.index].price) + addonsTotal) *
            Number(this.props.product.quantity)
          ).toFixed(2)}
          <div>
            <button
              onClick={() => this.handleOnDecrease(this.props.product.index, this.props.cartIndex)}
>>>>>>> feat(page): added addon customizations
              className="change-product-button"
            >
              -
            </button>
            <button
              onClick={() => this.handleOnIncrease(this.props.product.index)}
              className="change-product-button"
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
}
PageCartProduct.contextType = CartContext;
export default PageCartProduct;
