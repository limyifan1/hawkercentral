// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React, { Fragment } from "react";
import "../App.css";
import Item from "./Item";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import { db } from "./Firestore";
import Select from "react-select";

import firebase from "./Firestore";
import { h } from "../Helpers";

const analytics = firebase.analytics();

function onLoad(name) {
  analytics.logEvent(name);
}

const cuisines = [
  "American",
  "Healthy",
  "Sandwiches",
  "Asian",
  "Indian",
  "Seafood",
  "Bakery and Cakes",
  "Indonesia",
  "Local",
  "Beverages",
  "Italian",
  "Sushi",
  "Burgers",
  "Japanese",
  "Thai",
  "Chicken",
  "Korean",
  "Vegetarian",
  "Vegan",
  "Chinese",
  "Malay",
  "Vietnamese",
  "Dessert",
  "Malaysian",
  "Western",
  "Fast Food",
  "Meat",
  "Halal",
  "Pizza",
  "Mediterranean",
  "Grocery Shopping",
];

function distance_calc(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1.609344;
  }
}

let searchTimer = null

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
    };

    this.handleCuisineChange = this.handleCuisineChange.bind(this);
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
    let data = [];
    let temp;
    await db
      .collection("hawkers")
      .limit(999)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            temp = doc.data();
            temp.id = doc.id;
            data.push(temp);
          }
        });
        console.log("Fetched successfully!");
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ data: data, retrieved: true });
  };

  handleCuisineChange(option) {
    this.setState((state) => {
      return {
        cuisineValue: option,
      };
    });
  }

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
        <span>
          <Select
            isMulti
            name="name"
            options={cuisine_format}
            className="basic-multi-select"
            classNamePrefix="select"
            value={this.state.cuisineValue}
            onChange={this.handleCuisineChange}
            placeholder="Filter By Cuisine"
          />
        </span>
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
    const { target: { value, name } } = event;
    if (this.clearTimeout) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      this.setState({ [name]: value });
    }, 300);
  };

  // handleChange = (event) => {
  // 	const self = this;
  // 	const target = event.target;
  // 	const value = target.value;
  // 	const name = target.name;
  // 	clearTimeout(searchTimer);
  // 	searchTimer = setTimeout(() => {
  // 		self.setState({ [name]: value });
  // 	}, 5000);
  // }

  // retrieveData = async (query) => {
  //   let string = {
  //     longitude: this.state.longitude,
  //     latitude: this.state.latitude,
  //     query: this.state.query,
  //     distance: this.state.distance,
  //     limit: 10
  //   };
  //   let urls = [
  //     "https://us-central1-hawkercentral.cloudfunctions.net/islandwide",
  //     "https://us-central1-hawkercentral.cloudfunctions.net/nearby",
  //   ];
  //   try {
  //     Promise.all(
  //       urls.map((url) =>
  //         fetch(url, {
  //           method: "POST",
  //           mode: "cors",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(string),
  //         })
  //           .then((response) => {
  //             return response.json();
  //           })
  //           .then((data) => {
  //             return data;
  //           })
  //           .catch((error) => {
  //             return error;
  //           })
  //       )
  //     ).then((data) => {
  //       this.setState({
  //         islandwide: data[0],
  //         nearby: data[1],
  //         retrieved: true,
  //       });
  //     });
  //   } catch (error) {
  //     return error;
  //   }
  // };

  render() {
    let result = {
      nearby: [],
    };
    if (this.state.data !== undefined && this.state.retrieved) {
      let filtered = this.state.data;
      // filtered = this.state.data.filter(
      //   (d) =>
      //     d["pickup_option"] === this.state.pickup ||
      //     d["delivery_option"] === this.state.delivery
      // );

      // if (this.state.pickup) {
      //   filtered = this.state.data.filter(
      //     (d) =>
      //       distance_calc(d["latitude"], d["longitude"], latitude, longitude) <
      //       this.state.distance
      //   );
      // } else if (this.state.delivery) {
      //   filtered = this.state.data.filter(
      //     (d) =>
      //       distance_calc(d["latitude"], d["longitude"], latitude, longitude) <=
      //         10 || d.region.filter((f) => f.value === "islandwide").length >= 1
      //   );
      // }

      if (
        this.state.cuisineValue !== null &&
        this.state.cuisineValue.length !== 0
      ) {
        // console.log(this.state.cuisineValue[0] === this.state.data[0].cuisine[0])
        var items = this.state.cuisineValue.map((x) => {
          return h.general.ucFirstAllWords(x.value);
        });

        filtered = filtered.filter((d) => {
          let toggle = false;
          if (d.cuisine !== undefined) {
            let values = d.cuisine.map((x) => {
              return h.general.ucFirstAllWords(x.value);
            });
            values.forEach((element) => {
              if (items.includes(element)) {
                toggle = true;
              }
            });
          }
          return toggle;
        });
      }

      if (this.state.search.length !== 0) {
        filtered = filtered.filter((d) => {
          return (
            d.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
            d.description
              .toLowerCase()
              .includes(this.state.search.toLowerCase()) ||
            d.description_detail
              .toLowerCase()
              .includes(this.state.search.toLowerCase())
          );
        });
      }

      filtered = filtered.filter((d) => {
        return !d.url.includes("thesmartlocal");
      });

      filtered = filtered.sort((a, b) => b.lastmodified - a.lastmodified);

      // filtered.forEach((element) => {
      //   element.distance = distance_calc(
      //     element["latitude"],
      //     element["longitude"],
      //     latitude,
      //     longitude
      //   ).toString();
      // });

      // filtered = filtered.sort((a, b) => a.distance - b.distance);

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
      <div>
        {this.state.retrieved ? (
          <div>
            <div
              class="container"
              style={{ paddingTop: "56px", width: "100%" }}
            >
              <div class="container" style={{ paddingTop: "27px" }}>
                <div class="row justify-content-center">
                  <div class="col-12 col-sm-10 col-md-6">
                    <h3>All Listings</h3>
                  </div>
                </div>
                <div class="row justify-content-center mt-4">
                  <div class="col-12 col-sm-10 col-md-6">
                    <input
                      class="form-control"
                      type="text"
                      // value={this.state.search}
                      name="search"
                      placeholder="   Search by Name, Category, Food, Items e.g. Chicken Rice"
                      style={{
                        width: "100%",
                        height: "38px",
                        "border-radius": "1rem",
                      }}
                      onChange={this.handleChange}
                    ></input>
                  </div>
                  <div class="col-12 col-sm-10 col-md-5">
                    {this.cuisineSearch()}
                  </div>
                </div>
                <div className="row justify-content-center mt-4">
                  {result.nearby.length > 0 ? (
                    result.nearby
                  ) : (
                    <span class="mt-5">No Results Found</span>
                  )}
                </div>
              </div>
              <div></div>
            </div>
          </div>
        ) : (
          <div class="row h-100 page-container">
            <div class="col-sm-12 my-auto">
              <h3>Loading</h3>
              <Spinner class="" animation="grow" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SearchAll;
