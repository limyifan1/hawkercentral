// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React, { Fragment } from "react";
import "../App.css";
import Item from "./Item";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import { db } from "./Firestore";
import Select from "react-select";
import firebase from "./Firestore";

const analytics = firebase.analytics();

function onLoad(name){
  analytics.logEvent(name)
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
  "Grocery Shopping"
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
    onLoad("nearby_load")
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
      .limit(100)
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
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

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
      let longitude = this.state.longitude;
      let latitude = this.state.latitude;

      let filtered = [];
      filtered = this.state.data.filter(
        (d) =>
          d["pickup_option"] === this.state.pickup ||
          d["delivery_option"] === this.state.delivery
      );

      if (this.state.pickup) {
        filtered = this.state.data.filter(
          (d) =>
            distance_calc(parseFloat(d["latitude"]), parseFloat(d["longitude"]), parseFloat(latitude), parseFloat(longitude)) <
            this.state.distance
        );
      } else if (this.state.delivery) {
        console.log(this.state.data)
        filtered = this.state.data.filter(
          (d) =>
            distance_calc(d["latitude"], d["longitude"], parseFloat(latitude), parseFloat(longitude)) <=
              10 || (d.region? d.region.filter((f) => f.value === "islandwide").length >= 1:false)
        );
      }

      if (
        this.state.cuisineValue !== null &&
        this.state.cuisineValue.length !== 0
      ) {
        // console.log(this.state.cuisineValue[0] === this.state.data[0].cuisine[0])
        var items = this.state.cuisineValue.map((x) => {
          return x.value;
        });

        filtered = filtered.filter((d) => {
          let toggle = false;
          if (d.cuisine !== undefined) {
            let values = d.cuisine.map((x) => {
              return x.value;
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
        console.log(parseFloat(element["latitude"]),
        parseFloat(element["longitude"]),
        parseFloat(latitude),
        parseFloat(longitude))
        element.distance = distance_calc(
          parseFloat(element["latitude"]),
          parseFloat(element["longitude"]),
          parseFloat(latitude),
          parseFloat(longitude)
        ).toString();
        console.log(element.distance)
      });

      filtered = filtered.filter(
        (d) => {
          return !d.url.includes("thesmartlocal")}
      );

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
      <div>
        {this.state.retrieved ? (
          <div>
            <div
              class="container"
              style={{ paddingTop: "56px", width: "100%" }}
            >
              <div class="container" style={{ paddingTop: "27px" }}>
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-left">
                    {this.state.pickup ? (
                      <h3>
                        Near You at{" "}
                        <span style={{ color: "#b48300" }}>
                          {this.state.query}
                        </span>
                      </h3>
                    ) : (
                      <h3>
                        Delivers to You at{" "}
                        <span style={{ color: "#b48300" }}>
                          {this.state.query}
                        </span>
                      </h3>
                    )}
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-7 col-sm-7 col-md-7 col-lg-7 d-flex justify-content-left">
                    <input
                      class="form-control"
                      type="text"
                      value={this.state.search}
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
                  <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                    {this.cuisineSearch()}
                  </div>
                </div>
                {result.nearby.length > 0 ? (
                  <div class="row float-left d-flex justify-content-center justify-content-md-start justify-content-lg-start">
                    {result.nearby}
                  </div>
                ) : (
                  <div class="row float-left">
                    <br /> No Results Found
                  </div>
                )}
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

export default Nearby;
