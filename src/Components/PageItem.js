// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import { withRouter } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { LanguageContext } from "./themeContext";

import "../App.css";
import placeholder from "../placeholder.png";

export class PageItem extends React.Component {
  handleClick = async (event) => {
    event.preventDefault();
    console.log(window.pageYOffset);
    this.context.setScrollPosition(window.pageYOffset);
    if (this.props.name) {
      this.props.history.push({
        pathname: "/info",
        search: "?id=" + this.props.id,
      });
    }
  };

  thumbnail = () => {
    return `https://images.weserv.nl/?w=400&url=${encodeURIComponent(
      this.props.pic
    )}`;
  };

  render() {
    var menu_color = this.props ? this.props.css.menu_color : null;

    return (
      <div class="page-card" style={{ margin: "10px" }}>
        <div class="card shadow page-card">
          <div class="row page-card" style={{ padding: "0px 15px" }}>
            <div class="col-5 col-xs-3 col-sm-3 col-md-5 fill page-card">
              <LazyLoadImage
                src={this.props.pic ? this.thumbnail() : placeholder}
                placeholderSrc={placeholder}
                class="card-img-left"
                alt=""
              />
            </div>
            <div
              class="col-7 col-xs-9 col-sm-9 col-md-7 card-text page-card"
              style={{ padding: "10px" }}
            >
              <div class="card-block">
                <h4 class="card-title">{this.props.name} </h4>
                <h6 class="card-subtitle mb-2 text-muted">
                  {this.props.summary}
                </h6>
                <p class="card-text item-title">${this.props.price}</p>
                <a
                  href="#"
                  class="btn btn-primary"
                  style={{ backgroundColor: menu_color, borderColor: menu_color}}
                >
                  Add To Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(PageItem);
