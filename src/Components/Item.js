import React, { PropTypes } from "react";
import "../App.css";
import placeholder from "../placeholder.png";
import { withRouter } from "react-router-dom";

export class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = async (event) => {
    event.preventDefault();
    if (this.props.name) {
      this.props.history.push({
        pathname: "/info",
        search: "?id=" + this.props.id,
      });
    }
  };

  render() {
    return (
      <div>
        {this.props.name !== undefined ? (
          <figure
            class="card shadow effect-bubba"
            style={{ width: "100%", height: "240px" }}
            onClick={this.handleClick}
          >
            {this.props.pic ? (
              <div>
                {this.props.distance ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "105px",
                      right: "5px",
                      zIndex:"100"
                    }}
                  >
                    <span class="badge badge-info" style={{backgroundColor:"#b48300"}}>{this.props.distance.slice(0,4)+" km away"}</span>
                    
                  </div>
                ) : null}
                <img
                  src={this.props.pic}
                  class="card-img card-img-top"
                  style={{ height: "120px", maxHeight: "160px" }}
                  alt=""
                />
              </div>
            ) : (
              <img
                src={placeholder}
                class="card-img card-img-top"
                style={{ height: "120px", maxHeight: "160px" }}
                alt=""
              />
            )}
            <figcaption>
              <div class="card-body" style={{ width: "100%", height: "100%" }}>
                {this.props.name ? (
                  <h6 class="card-title" style={{ height: "25px" }}>
                    {this.props.name.length > 23
                      ? this.props.name.slice(0, 23) + "..."
                      : this.props.name}
                  </h6>
                ) : (
                  <h6 class="card-title" style={{ height: "25px" }}>
                    Sample Stall Name
                  </h6>
                )}

                {this.props.summary ? (
                  <p class="card-text" style={{ lineHeight: "1.0" }}>
                    <small>
                      {this.props.summary.length > 45
                        ? this.props.summary.slice(0, 45) + "..."
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
      </div>
    );
  }
}

export default withRouter(Item);
