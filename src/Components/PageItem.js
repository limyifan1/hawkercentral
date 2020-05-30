// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import { withRouter } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

// import { LanguageContext } from "./themeContext";

import "../App.css";
import placeholder from "../placeholder.png";
import { CartContext } from "./themeContext";

export class PageItem extends React.Component {
  handleClick = async (event) => {
    event.preventDefault();
    this.context.addProduct(this.props.index);
  };

  thumbnail = () => {
    return `https://images.weserv.nl/?w=400&url=${encodeURIComponent(
      this.props.pic
    )}`;
  };

  render() {
    var menu_color = this.props ? this.props.css.menu_color : null;

    return (
      <div class="page-card">
        <div
          class="card shadow"
          style={{
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
          }}
        >
          <div
            class="row no-gutters"
            style={{
              paddingLeft: "0px !important",
              paddingRight: "0px !important",
              marginLeft: "0px !important",
              marginRight: "0px !important",
            }}
          >
            <div class="col-5 col-xs-3 col-sm-3 col-md-5 fill">
              <LazyLoadImage
                src={this.props.pic ? this.thumbnail() : placeholder}
                placeholderSrc={placeholder}
                class="card-img-left"
                alt=""
              />
            </div>
            <div
              class="col-7 col-xs-9 col-sm-9 col-md-7 card-text"
              style={{
                padding: "10px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div class="card-block">
                <h4
                  class="card-page-title d-flex align-items-center"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>
                    <span style={{ color: menu_color }}>
                      {this.props.quantity ? this.props.quantity + " x " : null}
                    </span>
                    {this.props.name}
                  </span>
                </h4>
                {this.props.summary ? (
                  <h6
                    class="card-page-subtitle mb-2 text-muted small d-flex justify-content-center"
                    style={{ marginBottom: "0px" }}
                  >
                    {this.props.summary}
                  </h6>
                ) : null}
                <p
                  class="card-text item-title d-flex align-items-center justify-content-center"
                  style={{ marginBottom: "5px", fontSize: "20px" }}
                >
                  ${this.props.price}
                </p>
                <div
                  class="btn btn-primary"
                  style={{
                    backgroundColor: menu_color,
                    borderColor: menu_color,
                  }}
                  onClick={this.handleClick}
                >
                  Add To Cart
                </div>
                {this.context.cartProducts}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
PageItem.contextType = CartContext;
export default withRouter(PageItem);
