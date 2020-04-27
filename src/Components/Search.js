// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
// import {Typeahead} from 'react-bootstrap-typeahead';
import {  Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

export class Search extends React.Component {
  state = {
    postal: '',
    loading: false,
  };

  _renderMenuItemChildren = (option, props, index) => {
    return (
      <div>
        <div class="row">
          <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            {/* <img style={{"width":"20px"}} src={logo} alt="logo"/> */}
          </div>
          <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            <div>{option.name}</div>
          </div>
          <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10"></div>
        </div>
      </div>
    );
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

    if (this.props.option === "") {
      alert("Please choose either da bao or delivery thank you :)");
      return;
    }

    const postal = await this.getPostal();
    if (postal.ADDRESS === "") {
      alert("Please enter a valid postal code thank you :)");
      return;
    }

    const search = new URLSearchParams();
    search.append('postal', this.state.postal);
    search.append('street', postal.ADDRESS);
    search.append('lng', postal.LONGITUDE);
    search.append('lat', postal.LATITUDE);
    search.append('distance', '5');
    search.append('option', this.props.option);

    this.props.history.push({
      pathname: "/nearby",
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
              class="shadow-sm"
              type="submit"
              variant="outline-secondary"
              style={{ backgroundColor: "#b48300", borderColor: "#b48300" }}
              disabled={this.state.loading}
            >
              <span style={{ color: "white" }}>{this.state.loading ? 'Searching...' : 'Search'}</span>
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(Search);
