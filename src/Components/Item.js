import React, { PropTypes } from "react";
import "../App.css";
import placeholder from "../placeholder.png";
import {
	withRouter
} from 'react-router-dom';

export class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = async (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/info",
      search: "?id=" + this.props.id,
    });
    // this.props.history.push('/listing')
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
              <img
                src={this.props.pic}
                class="card-img card-img-top"
                style={{ height: "120px", maxHeight: "160px" }}
                alt=""
              />
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
                  <small>Sample Stall Summary</small>
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

export default withRouter(Item)