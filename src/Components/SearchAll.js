// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import Item from "./Item";
// import { Spinner } from "react-bootstrap";
import { db } from "./Firestore";
import Select from "react-select";

import firebase, { geo, geoToPromise } from "./Firestore";
import Helpers from "../Helpers/helpers";
import { values as cuisines } from "../Helpers/categories";
import { LanguageContext } from "./themeContext";
import Zoom from "@material-ui/core/Zoom";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import motor from "../assets/motor-delivery.png";
import bag from "../assets/styrofoam-dabao.png";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Skeleton from "@material-ui/lab/Skeleton";

const analytics = firebase.analytics();

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent) && /version/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
}

// function openNewWindow() {
//   window.open("https://foodleh.app", "_system");
// }

function onLoad(name) {
  analytics.logEvent(name);
}
function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelectorAll(
      "#back-to-top-anchor"
    )[0];

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        style={{ position: "fixed", bottom: "50px", right: "30px" }}
      >
        {children}
      </div>
    </Zoom>
  );
}

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

let searchTimer = null;

const searchInitialState = {
  data: [],
  query: "",
  longitude: "",
  latitude: "",
  distance: 5,
  pickup: false,
  delivery: false,
  retrieved: false,
  search: "",
  searchPostal: false,
  cuisineValue: [],
  isCuisineMenuOpen: false,
};

export class SearchAll extends React.Component {
  constructor(props) {
    super(props);

    const queryParams = new URLSearchParams(props.location.search);

    const state = {
      ...searchInitialState,
      pickup: queryParams.get("option") === "selfcollect",
      delivery: queryParams.get("option") === "delivery",
      open: true,
    };

    if (queryParams.get("lng") && queryParams.get("lat")) {
      state.longitude = queryParams.get("lng");
      state.latitude = queryParams.get("lat");
    }

    if (queryParams.get("postal")) {
      state.postal = queryParams.get("postal");
      state.searchPostal = true;
    }

    this.state = state;
  }

  componentWillMount() {
    onLoad("searchall_load");
    if (
      this.state.searchPostal &&
      this.state.latitude &&
      this.state.longitude
    ) {
      this.findDataByPostal();
    } else {
      this.retrieveData();
    }
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
    data = data.map((d) => {
      if (d.tagsValue !== undefined) {
        d.tags = d.tagsValue.map((v) => v.trim().toLowerCase());
        d.menu_list = d.menu_combined.map((v) => v.name.trim().toLowerCase());
      } else {
        d.menu_list = [];
        d.tags = [];
      }
      return d;
    });

    this.setState({ data, retrieved: true });
    window.scrollTo(0, this.context.scrollPosition);
    this.context.setScrollPosition(0); // reset scrollPosition
  };

  findDataByPostal = async () => {
    this.setState({ retrieved: false });
    const centre = geo.point(
      Number(this.state.latitude),
      Number(this.state.longitude)
    );
    let data;
    if (this.state.pickup && !this.state.delivery) {
      data = await geoToPromise(
        geo
          .query("hawkers")
          .within(centre, Number(this.state.distance), "location")
      );
    } else if (!this.state.pickup && this.state.delivery) {
      // Find both places within a radius and places that
      // do islandwide delivery, populate an Object keying
      // by doc id to avoid duplicates, then set data to
      // Object's valuess
      const placesById = {};

      // const placesWithinReach = await geoToPromise(
      //   geo.query("hawkers").within(centre, 10, "location")
      // );
      // placesWithinReach.forEach((d) => (placesById[d.id] = d));

      const userRegion = await Helpers.postalPlanningRegion(
        this.state.query,
        this.state.latitude,
        this.state.longitude
      );
      const regions = await db
        .collection("hawkers")
        .where("regions", "array-contains-any", ["Islandwide", userRegion])
        .get()
        .then(Helpers.mapSnapshotToDocs);
      regions.forEach((d) => (placesById[d.id] = d));
      data = Object.values(placesById);
    } else {
      data = await db
        .collection("hawkers")
        .get()
        .then(Helpers.mapSnapshotToDocs);
    }

    data = data.map((d) => {
      if (d.tagsValue !== undefined) {
        d.tags = d.tagsValue.map((v) => v.trim().toLowerCase());
        d.menu_list = d.menu_combined.map((v) => v.name.trim().toLowerCase());
      } else {
        d.menu_list = [];
        d.tags = [];
      }
      return d;
    });
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

  handleClose = (event) => {
    event.preventDefault();
    this.setState({ open: false });
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

  handleChange = async (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "search") {
      if (this.clearTimeout) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        this.setState({ [name]: value });
      }, 300);
    } else {
      if (value.length === 0) {
        this.retrieveData();
      }
      this.setState({ [name]: value, searchPostal: false });
      if (name === "postal" && value.length === 6) {
        const latlng = await Helpers.getLatLng(this.state.postal);
        this.setState({
          searchPostal: true,
          latitude: latlng.LATITUDE,
          longitude: latlng.LONGITUDE,
        });
        if (latlng && latlng.LATITUDE && latlng.LONGITUDE) {
          await this.findDataByPostal();
        }
      }
    }
  };

  handleToggle = async (event) => {
    var name = event.currentTarget.name;
    if (name === "delivery") this.setState({ delivery: true, pickup: false });
    if (name === "pickup") this.setState({ delivery: false, pickup: true });
    if (this.state.delivery && name === "delivery")
      this.setState({ delivery: false });
    if (this.state.pickup && name === "pickup")
      this.setState({ pickup: false });
    if (this.state.searchPostal && this.state.postal.length === 6) {
      const latlng = await Helpers.getLatLng(this.state.postal);
      this.setState({
        searchPostal: true,
        latitude: latlng.LATITUDE,
        longitude: latlng.LONGITUDE,
      });
      if (latlng && latlng.LATITUDE && latlng.LONGITUDE) {
        await this.findDataByPostal();
      }
    }
  };

  render() {
    let result = {
      nearby: [],
    };
    let skeletons = [];
    for (let index = 0; index < 12; index++) {
      skeletons.push(
        <figure
          class="card shadow effect-bubba item-card"
          style={{ margin: "5px", height: "200px" }}
          onClick={this.handleClick}
        >
          <Skeleton width="100%">
            <div style={{ height: "100px" }} class="card-img-top" alt=""></div>
          </Skeleton>
          <Skeleton width="80%">
            <h3>.</h3>
          </Skeleton>
          <Skeleton width="50%">
            <h3>.</h3>
          </Skeleton>
        </figure>
      );
    }
    if (this.state.data !== undefined && this.state.retrieved) {
      let filtered = this.state.data;

      if (this.state.search.length !== 0) {
        filtered = filtered.filter((d) => {
          if (d && d.name && d.description && d.description_detail && d.tags && d.menu_list) {
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
          }
          else{
            return false
          }
        });
      }

      filtered = filtered.sort((a, b) => b.lastmodified - a.lastmodified);
      if (this.state.pickup && !this.state.delivery) {
        filtered = filtered.filter((d) => d.pickup_option);
      } else if (!this.state.pickup && this.state.delivery) {
        filtered = filtered.filter((d) => d.delivery_option);
      }

      if (this.state.searchPostal) {
        filtered.forEach((element) => {
          element.distance = distance_calc(
            parseFloat(element["latitude"]),
            parseFloat(element["longitude"]),
            parseFloat(this.state.latitude),
            parseFloat(this.state.longitude)
          ).toString();
        });

        filtered = filtered.sort((a, b) => a.distance - b.distance);

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
                  distance={data["distance"]}
                  claps={data["claps"]}
                />
              </div>
            </span>
          );
        });
      } else {
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
                />
              </div>
            </span>
          );
        });
      }
    }

    return (
      <div class="container" style={{ paddingTop: "56px", width: "100%" }}>
        <div class="container" style={{ paddingTop: "27px" }}>
          <div class="row justify-content-center">
            <LanguageContext.Consumer>
              {(context) => (
                <div class="col-12 col-sm-6 col-md-6">
                  <h3 id="back-to-top-anchor">
                    {context.data.search.alllistings}
                  </h3>
                </div>
              )}
            </LanguageContext.Consumer>
          </div>
          <div class="row justify-content-center mt-4">
            {
              <LanguageContext.Consumer>
                {(context) => (
                  <div class="col-12 col-sm-6 col-md-6">
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

            <div class="col-12 col-sm-10 col-md-6">{this.cuisineSearch()}</div>
          </div>
          <div class="row justify-content-center mt-4">
            <LanguageContext.Consumer>
              {(context) => (
                <div class="col-6 col-sm-6 col-md-6">
                  <input
                    onChange={this.handleChange}
                    value={this.state.postal}
                    type="text"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    minLength={6}
                    class="form-control"
                    name="postal"
                    placeholder={context.data.search.postalcode}
                    autoComplete="postal-code"
                    autoFocus
                    required
                    disabled={!this.state.retrieved}
                    style={{
                      width: "100%",
                      height: "38px",
                      "border-radius": "1rem",
                    }}
                  ></input>
                </div>
              )}
            </LanguageContext.Consumer>
            <div class="col-3 col-xs-3 col-sm-3 col-md-3">
              <div name="pickup">
                <LanguageContext.Consumer>
                  {(context) => (
                    <Button
                      variant={"contained"}
                      // variant="outline-secondary"
                      onClick={this.handleToggle}
                      name="pickup"
                      disabled={!this.state.retrieved}
                      style={
                        !this.state.pickup
                          ? {
                              backgroundColor: "white",
                              borderColor: "#b48300",
                              width: "100%",
                              height: "38px",
                              textTransform: "none",
                            }
                          : {
                              backgroundColor: "#b48300",
                              borderColor: "#b48300",
                              width: "100%",
                              height: "38px",
                              textTransform: "none",
                            }
                      }
                      color={"secondary"}
                    >
                      <img
                        name="pickup"
                        src={bag}
                        alt="bag"
                        style={{ height: "20px" }}
                      ></img>
                      <div
                        name="pickup"
                        class="d-none d-md-inline-block"
                        style={
                          !this.state.pickup
                            ? { marginLeft: "10px", color: "black" }
                            : { marginLeft: "10px", color: "white" }
                        }
                      >
                        {context.data.search.self_collect}
                      </div>
                    </Button>
                  )}
                </LanguageContext.Consumer>
              </div>
            </div>
            <div class="col-3 col-xs-3 col-sm-3 col-md-3">
              <div name="delivery">
                <LanguageContext.Consumer>
                  {(context) => (
                    <Button
                      type="submit"
                      variant={"contained"}
                      disabled={!this.state.retrieved}
                      style={
                        !this.state.delivery
                          ? {
                              backgroundColor: "white",
                              borderColor: "#b48300",
                              width: "100%",
                              height: "38px",
                              textTransform: "none",
                            }
                          : {
                              backgroundColor: "#b48300",
                              borderColor: "#b48300",
                              width: "100%",
                              height: "38px",
                              textTransform: "none",
                            }
                      }
                      name="delivery"
                      color={"secondary"}
                      onClick={this.handleToggle}
                    >
                      <img
                        name="delivery"
                        src={motor}
                        alt="motor"
                        style={{ height: "20px" }}
                      ></img>{" "}
                      <div
                        name="delivery"
                        class="d-none d-md-inline-block"
                        style={
                          !this.state.delivery
                            ? { marginLeft: "10px", color: "black" }
                            : { marginLeft: "10px", color: "white" }
                        }
                      >
                        {context.data.search.delivery}
                      </div>
                    </Button>
                  )}
                </LanguageContext.Consumer>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            {this.state.retrieved ? (
              result.nearby.length > 0 ? (
                result.nearby
              ) : (
                <span class="mt-5">No Results Found</span>
              )
            ) : (
              <div class="row justify-content-center mt-4">
                {/* <h3>Loading</h3> */}
                {/* <Spinner class="" animation="grow" /> */}
                {skeletons}
              </div>
            )}
            <ScrollTop>
              <Fab color="primary" size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
            {getMobileOperatingSystem() === "Android" ? (
              <Snackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                open={this.state.open}
                // autoHideDuration={10000}
                // onClose={this.handleClose}
                message={
                  <div style={{ fontSize: "30px" }}>
                    Android App is no longer working. Please use browser and
                    visit <b>www.foodleh.app</b> instead.
                  </div>
                }
                action={
                  <React.Fragment>
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={this.handleClose}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </React.Fragment>
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
SearchAll.contextType = LanguageContext;
export default SearchAll;
