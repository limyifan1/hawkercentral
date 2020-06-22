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

export class Item extends React.Component {
  handleClick = async (event) => {
    event.preventDefault();
    this.context.setScrollPosition(window.pageYOffset);
    if (this.props.name) {
      this.props.history.push({
        pathname: "/info",
        search: "?id=" + this.props.id,
      });
    }
  };

  thumbnail = () => {
    return `https://images.weserv.nl/?w=250&url=${encodeURIComponent(
      this.props.pic
    )}`;
  };

  render() {
    return (
      <div>
        <a
          href={this.props.name ? "/info?id=" + this.props.id : null}
          style={{ color: "inherit" }}
        >
          {this.props.name !== undefined ? (
            <figure
              class="card shadow effect-bubba item-card"
              style={{ margin: "5px" }}
              onClick={this.handleClick}
            >
              {this.props.distance ? (
                <div
                  style={{
                    position: "absolute",
                    top: "105px",
                    right: "5px",
                    zIndex: "1",
                  }}
                >
                  <span
                    class="badge badge-info"
                    style={{ backgroundColor: "#b48300" }}
                  >
                    {this.props.distance.slice(0, 4) + " km away"}
                  </span>
                </div>
              ) : null}
              <LazyLoadImage
                src={this.props.pic ? this.thumbnail() : placeholder}
                placeholderSrc={placeholder}
                style={{ height: "120px" }}
                class="card-img-top"
                height="120"
                alt=""
              />
              {this.props.promo ? (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "3px",
                    zIndex: "0",
                  }}
                >
                  <span
                    class="badge badge-danger"
                    style={{ backgroundColor: "red", fontSize: "16px" }}
                  >
                    {this.props.promo}
                  </span>
                </div>
              ) : null}

              {this.props.claps !== undefined ? (
                <div
                  class="row no-gutters bg-light"
                  style={{
                    borderRadius: ".25rem",
                    position: "absolute",
                    top: "10px",
                    left: "3px",
                    zIndex: "0",
                    opacity: "0.8",
                  }}
                >
                  <div class="col-4 text-right pl-2 pr-1">
                    <svg
                      id="clap--icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-549 338 100.1 125"
                      width={"20px"}
                    >
                      <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
                      <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
                    </svg>
                  </div>
                  <div class="col-8 text-left pl-2">
                    <span
                      style={{
                        fontSize: "16px",
                        color: "black",
                        paddingLeft: "5px",
                        fontWeight: "700",
                      }}
                    >
                      {" "}
                      {+this.props.claps}
                    </span>
                  </div>
                </div>
              ) : null}

              <figcaption>
                <div
                  class="card-body"
                  style={{ width: "100%", height: "100%" }}
                >
                  {this.props.name ? (
                    <h7
                      class="item-title card-title d-flex justify-content-center"
                      style={{ textAlign: "center", width: "100%" }}
                    >
                      {this.props.name.length > 25
                        ? this.props.name.slice(0, 25) + "..."
                        : this.props.name}
                    </h7>
                  ) : (
                    <h6 class="card-title">Sample Name</h6>
                  )}

                  {this.props.summary ? (
                    <p
                      class="card-text d-flex justify-content-center"
                      style={{ lineHeight: "1.0" }}
                    >
                      <small>
                        {this.props.summary.length > 35
                          ? this.props.summary.slice(0, 35) + "..."
                          : this.props.summary}
                      </small>
                    </p>
                  ) : (
                    <p class="card-text" style={{ lineHeight: "1.0" }}>
                      <small>Sample Stall Brief Description</small>
                    </p>
                  )}
                </div>
              </figcaption>
            </figure>
          ) : null}
        </a>
      </div>
    );
  }
}
Item.contextType = LanguageContext;
export default withRouter(Item);
