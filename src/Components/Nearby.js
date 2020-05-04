// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import Item from "./Item";
import "react-multi-carousel/lib/styles.css";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import Select from "react-select";
import firebase, { db, geo, geoToPromise } from "./Firestore";
import Helpers from "../Helpers/helpers";
import { LanguageContext } from "./themeContext";

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

// const responsive = {
//   superLargeDesktop: {
//     breakpoint: { max: 4000, min: 3000 },
//     items: 6,
//     partialVisibilityGutter: 30,
//   },
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 5,
//     partialVisibilityGutter: 30,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 2,
//     partialVisibilityGutter: 30,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 2,
//     partialVisibilityGutter: 10,
//   },
// };

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

export class Nearby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      query: queryString.parse(this.props.location.search).postal,
      longitude: queryString.parse(this.props.location.search).lng,
      latitude: queryString.parse(this.props.location.search).lat,
      distance: queryString.parse(this.props.location.search).distance,
      pickup:
        queryString.parse(this.props.location.search).option === "selfcollect",
      delivery:
        queryString.parse(this.props.location.search).option === "delivery",
      retrieved: false,
      search: "",
      cuisineValue: [],
    };

    this.handleCuisineChange = this.handleCuisineChange.bind(this);
  }

  componentWillMount() {
    onLoad("nearby_load");
    this.retrieveData();
  }

  getData(val) {
    this.setState({ data: val });
  }

  retrieveData = async () => {
    const centre = geo.point(
      Number(this.state.latitude),
      Number(this.state.longitude)
    );

    let data;
    if (this.state.pickup) {
      data = await geoToPromise(
        geo
          .query("hawkers")
          .within(centre, Number(this.state.distance), "location")
      );
    } else if (this.state.delivery) {
      // Find both places within a radius and places that
      // do islandwide delivery, populate an Object keying
      // by doc id to avoid duplicates, then set data to
      // Object's valuess
      const placesById = {};

      const placesWithinReach = await geoToPromise(
        geo.query("hawkers").within(centre, 10, "location")
      );
      placesWithinReach.forEach((d) => (placesById[d.id] = d));

      const islandwide = await db
        .collection("hawkers")
        .where("regions", "array-contains", "Islandwide")
        .get()
        .then(Helpers.mapSnapshotToDocs);
      islandwide.forEach((d) => (placesById[d.id] = d));

      data = Object.values(placesById);
    } else {
      data = await db
        .collection("hawkers")
        .get()
        .then(Helpers.mapSnapshotToDocs);
    }

    this.setState({ data, retrieved: true });
    window.scrollTo(0, this.context.scrollPosition);
    this.context.setScrollPosition(0); // reset scrollPosition
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
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  render() {
    let result = {
      nearby: [],
    };
    if (this.state.data !== undefined && this.state.retrieved) {
      let longitude = this.state.longitude;
      let latitude = this.state.latitude;

      let filtered = [];
      filtered = this.state.data.filter(
        (d) =>
          d["pickup_option"] === this.state.pickup ||
          d["delivery_option"] === this.state.delivery
      );

      if (this.state.pickup) {
        filtered = this.state.data.filter((d) => d.pickup_option);
      } else if (this.state.delivery) {
        filtered = this.state.data.filter((d) => d.delivery_option);
      }

      if (
        this.state.cuisineValue !== null &&
        this.state.cuisineValue.length !== 0
      ) {
        var items = this.state.cuisineValue.map((x) => {
          return Helpers.capitalizeFirstLetter(x.value);
        });

        filtered = filtered.filter((d) => {
          let toggle = false;
          if (d.cuisine !== undefined) {
            let values = d.cuisine.map((x) => {
              return Helpers.capitalizeFirstLetter(x.value);
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

      filtered.forEach((element) => {
        element.distance = distance_calc(
          parseFloat(element["latitude"]),
          parseFloat(element["longitude"]),
          parseFloat(latitude),
          parseFloat(longitude)
        ).toString();
      });

      filtered = filtered.sort((a, b) => a.distance - b.distance);

      result.nearby = filtered.map((data) => {
        return (
          <span>
            <div
            // class="nearby-card col-md-4"
            // class="d-inline-block d-md-none"
            // style={{width:"100%"}}
            >
              <Item
                promo={data["promo"]}
                id={data["id"]}
                name={data["name"]}
                street={data["street"]}
                pic={data["url"]}
                summary={data["description"]}
                distance={data["distance"]}
                claps={data["claps"]}
              />
            </div>
            {/* <div
              class="d-none d-md-inline-block"
              style={{ padding: "6px", width: "220px" }}
            >
              <Item
                promo={data["promo"]}
                id={data["id"]}
                name={data["name"]}
                street={data["street"]}
                pic={data["url"]}
                summary={data["description"]}
                distance={distance_calc(
                  data["latitude"],
                  data["longitude"],
                  latitude,
                  longitude
                ).toString()}
              />
            </div> */}
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
                  <h3>
                    {context.data.search.nearyouat}{" "}
                    <span style={{ color: "#b48300" }}>{this.state.query}</span>
                  </h3>
                </div>
              )}
            </LanguageContext.Consumer>
            {/* 
            <div class="col-12 col-sm-10 col-md-6">
              <h3>
                Near You at{" "}
                <span style={{ color: "#b48300" }}>{this.state.query}</span>
              </h3>
            </div> */}
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

Nearby.contextType = LanguageContext;
export default Nearby;
