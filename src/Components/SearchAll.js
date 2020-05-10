// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import Item from "./Item";
import { Spinner } from "react-bootstrap";
import { db } from "./Firestore";
import Select from "react-select";

import firebase from "./Firestore";
import Helpers from "../Helpers/helpers";
import { values as cuisines } from "../Helpers/categories";
import { LanguageContext } from "./themeContext";

const analytics = firebase.analytics();

function onLoad(name) {
  analytics.logEvent(name);
}

let searchTimer = null;

export class SearchAll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      query: "",
      longitude: "",
      latitude: "",
      distance: "",
      pickup: "",
      delivery: "",
      retrieved: false,
      search: "",
      cuisineValue: [],
      isCuisineMenuOpen: false,
    };
  }

  componentWillMount() {
    onLoad("searchall_load");
    this.retrieveData();
    console.log("run");
  }

  getData(val) {
    this.setState({ data: val });
  }

  retrieveData = async () => {
    this.setState({ retrieved: false });
    let query = db.collection("hawkers");
    if (this.state.cuisineValue && this.state.cuisineValue.length > 0) {
      const categories = this.state.cuisineValue.map((c) => c.label);
      query = query.where("categories", "array-contains-any", categories);
    }
    var data = await query.get().then(Helpers.mapSnapshotToDocs);
    data = data.map(d=>{
      if (d.tagsValue !== undefined) {
        d.tags = d.tagsValue.map((v) => v.trim().toLowerCase());
        d.menu_list = d.menu_combined.map((v) => v.name.trim().toLowerCase());
      }
      else{
        d.menu_list = []
        d.tags = []
      }
      return d
    })
    
    this.setState({ data, retrieved: true });
    window.scrollTo(0, this.context.scrollPosition);
    this.context.setScrollPosition(0); // reset scrollPosition
  };

  handleCuisineChange = async (cuisineValue) => {
    await this.setState({ cuisineValue });
    if (!this.state.isCuisineMenuOpen) {
      this.retrieveData();
    }
  };

  handleCuisineMenuOpen = () => {
    this.setState({ isCuisineMenuOpen: true });
  };

  handleCuisineMenuClose = () => {
    if (this.state.isCuisineMenuOpen) {
      this.setState({ isCuisineMenuOpen: false });
      this.retrieveData();
    }
  };

  cuisineSearch() {
    let cuisine_format = [];
    cuisines.forEach((element) => {
      cuisine_format.push({
        label: element,
        value: element,
      });
    });
    const select = () => {
      return (
        <LanguageContext.Consumer>
          {(context) => (
            <span>
              <Select
                isMulti
                closeMenuOnSelect={false}
                isDisabled={!this.state.retrieved}
                name="name"
                options={cuisine_format}
                className="basic-multi-select"
                classNamePrefix="select"
                value={this.state.cuisineValue}
                onChange={this.handleCuisineChange}
                onMenuOpen={this.handleCuisineMenuOpen}
                onMenuClose={this.handleCuisineMenuClose}
                placeholder={context.data.search.filterby}
              />
            </span>
          )}
        </LanguageContext.Consumer>
      );
    };
    return (
      <span>
        <span class="d-none d-md-block">{select()}</span>
        <span class="d-block d-md-none" style={{ margin: "5px" }}>
          {select()}
        </span>
      </span>
    );
  }

  handleChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (this.clearTimeout) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      this.setState({ [name]: value });
    }, 300);
  };

  render() {
    let result = {
      nearby: [],
    };
    if (this.state.data !== undefined && this.state.retrieved) {
      let filtered = this.state.data;

      if (this.state.search.length !== 0) {
        filtered = filtered.filter((d) => {
          return (
            d.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
            d.description
              .toLowerCase()
              .includes(this.state.search.toLowerCase()) ||
            d.description_detail
              .toLowerCase()
              .includes(this.state.search.toLowerCase()) ||
            d.tags.includes(this.state.search.toLowerCase()) || 
            d.menu_list.includes(this.state.search.toLowerCase())
          );
        });
      }

      filtered = filtered.sort((a, b) => b.lastmodified - a.lastmodified);

      result.nearby = filtered.map((data) => {
        return (
          <span>
            <div>
              <Item
                promo={data["promo"]}
                id={data["id"]}
                name={data["name"]}
                street={data["street"]}
                pic={data["url"]}
                summary={data["description"]}
                claps={data["claps"]}
                // distance={data["distance"]}
              />
            </div>
          </span>
        );
      });
    }

    return (
      <div class="container" style={{ paddingTop: "56px", width: "100%" }}>
        <div class="container" style={{ paddingTop: "27px" }}>
          <div class="row justify-content-center">
            <LanguageContext.Consumer>
              {(context) => (
                <div class="col-12 col-sm-10 col-md-6">
                  <h3>{context.data.search.alllistings}</h3>
                </div>
              )}
            </LanguageContext.Consumer>
          </div>
          <div class="row justify-content-center mt-4">
            {
              <LanguageContext.Consumer>
                {(context) => (
                  <div class="col-12 col-sm-10 col-md-6">
                    <input
                      disabled={!this.state.retrieved}
                      class="form-control"
                      type="text"
                      // value={this.state.search}
                      name="search"
                      placeholder={context.data.search.prompt}
                      style={{
                        width: "100%",
                        height: "38px",
                        "border-radius": "1rem",
                      }}
                      onChange={this.handleChange}
                    ></input>
                  </div>
                )}
              </LanguageContext.Consumer>
            }

            <div class="col-12 col-sm-10 col-md-5">{this.cuisineSearch()}</div>
          </div>
          <div className="row justify-content-center mt-4">
            {this.state.retrieved ? (
              result.nearby.length > 0 ? (
                result.nearby
              ) : (
                <span class="mt-5">No Results Found</span>
              )
            ) : (
              <div class="row h-100 page-container">
                <div class="col-sm-12 my-auto">
                  <h3>Loading</h3>
                  <Spinner class="" animation="grow" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
SearchAll.contextType = LanguageContext;
export default SearchAll;
