// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
// import {Typeahead} from 'react-bootstrap-typeahead';
// import {  Button } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export class Search extends React.Component {
  state = {
    postal: cookies.get("postal_search"),
    loading: false,
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  async getPostal() {
    this.setState({ loading: true });

    try {
      return await this.callPostal();
    } finally {
      this.setState({ loading: false });
    }
  }

  callPostal = async () => {
    try {
      const response = await fetch(
        "https://developers.onemap.sg/commonapi/search?searchVal=" +
          this.state.postal +
          "&returnGeom=Y&getAddrDetails=Y"
      );

      return (await response.json()).results[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    cookies.set("postal_search", this.state.postal, { path: "/" });

    if (this.props.option === "") {
      alert("Please choose either da bao or delivery thank you :)");
      return;
    }

    const postal = await this.getPostal();
    if (!postal || postal.ADDRESS === "") {
      alert("Please enter a valid postal code thank you :)");
      return;
    }

    const search = new URLSearchParams();
    search.append("postal", this.state.postal);
    search.append("street", postal.ADDRESS);
    search.append("lng", postal.LONGITUDE);
    search.append("lat", postal.LATITUDE);
    search.append("option", this.props.option);

    this.props.history.push({
      pathname: "/searchall",
      search: search.toString(),
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div class="row justify-content-center">
          <div class="col-xs-6 col-sm-8 col-md-8">
            <div class="shadow-lg" style={{ width: "100%" }}>
              <input
                onChange={this.handleChange}
                value={this.state.postal}
                type="text"
                pattern="[0-9]{6}"
                maxLength={6}
                minLength={6}
                class="form-control"
                name="postal"
                placeholder="Enter Your Postal Code"
                autoComplete="postal-code"
                autoFocus
                required
              />
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col">
            <Button
              type="submit"
              variant={"contained"}
              // variant="outline-secondary"
              style={{
                backgroundColor: "#b48300",
                borderColor: "#b48300",
                width: "100px",
              }}
              disabled={this.state.loading}
              color={"secondary"}
            >
              <span style={{ color: "white" }}>
                {this.state.loading ? "Searching..." : "Search"}
              </span>
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(Search);
