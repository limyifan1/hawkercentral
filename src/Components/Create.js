import React, { Fragment } from "react";
import "../App.css";
import { db, storage } from "./Firestore";
import { Typeahead } from "react-bootstrap-typeahead";
import { InputGroup, Button, FormControl } from "react-bootstrap";
import logo from "../mrt_logo.png";
import Select from "react-select";
import Item from "./Item";
import placeholder from "../placeholder.png"
import Component from "../Components";

import { withRouter } from "react-router-dom";

// const API_KEY = `${process.env.REACT_APP_GKEY}`

const addData = (
  name,
  postal,
  street,
  price,
  description,
  url,
  latitude,
  longitude,
  unit,
  delivery,
  islandwide,
  cuisine,
  north,
  south,
  east,
  west,
  whatsapp
) => {
  db.collection("hawkers")
    .add({
      name: name,
      postal: postal,
      street: street,
      description: description,
      url: url,
      latitude: latitude,
      longitude: longitude,
      unit: unit,
      delivery: delivery,
      islandwide: islandwide === "false",
      cuisine: cuisine,
      north:north,
      south:south,
      east:east,
      west:west,
      whatsapp:whatsapp
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      // alert("Sent")
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
      // alert("Failed")
    });
};

export class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      postal: 0,
      street: "",
      price: 0,
      description: "",
      url: "",
      imageFile: placeholder,
      imageName: "Upload Image",
      longitude: -122.3710252,
      latitude: 47.63628904,
      unit: "",
      multiValue: [],
      cuisineValue: [],
      islandwide: false,
      north:false,
      south:false,
      east:false,
      west:false,
      whatsapp:0
    };

    this.handleMultiChange = this.handleMultiChange.bind(this);
    this.handleCuisineChange = this.handleCuisineChange.bind(this);
  }

  componentWillMount() {
    this.getFirestoreData();
  }

  apiHasLoaded(map, maps) {
    if (map && maps) {
      this.setState({
        apiReady: true,
        map: map,
        maps: maps,
      });
    }
  }

  async getPostal(postal) {
    // event.preventDefault();
    let data = await this.callPostal(postal);
    console.log(data["ADDRESS"]);
    this.setState({
      street: data["ADDRESS"],
      longitude: data["LONGITUDE"],
      latitude: data["LATITUDE"],
    });
  }

  callPostal = (postal) => {
    return fetch(
      "https://developers.onemap.sg/commonapi/search?searchVal=" +
        postal +
        "&returnGeom=Y&getAddrDetails=Y"
    )
      .then(function (response) {
        return response.json();
      })
      .then(
        function (jsonResponse) {
          console.log(jsonResponse["results"]);
          console.log(postal);
          return jsonResponse["results"][0];
        },
        (error) => {
          console.log(error);
        }
      );
  };

  handleSubmit = (event) => {
    addData(
      this.state.name,
      this.state.postal,
      this.state.street,
      this.state.price,
      this.state.description,
      this.state.url,
      this.state.latitude,
      this.state.longitude,
      this.state.unit,
      this.state.multiValue,
      this.state.islandwide,
      this.state.cuisineValue,
      this.state.north,
      this.state.south,
      this.state.east,
      this.state.west,
      this.state.whatsapp
    );
    event.preventDefault();
    this.props.history.push("/");
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
    if (name === "postal" && value.toString().length === 6) {
      this.getPostal(value);
    }
  };

  handleImageAsFile = (event) => {
    event.preventDefault();
    const image = event.target.files[0];
    this.setState({ imageFile: image });
    this.setState({ imageName: image.name });
    this.handleFireBaseUpload(image);
  };

  handleFireBaseUpload = (image) => {
    // event.preventDefault()
    // alert('start of upload')
    var date = new Date();
    var timestamp = date.getTime();
    var newName = timestamp + "_" + image.name;
    const uploadTask = storage.ref(`/images/${newName}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(newName)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            this.setState({ url: fireBaseUrl });
          });
      }
    );
  };

  async getFirestoreData() {
    let fireData = await this.retrieveData();
    let data_mrt = [];
    let data_cuisine = [];
    let current = new Set();
    fireData[1].forEach(function (doc) {
      if (doc.exists) {
        var d = doc.data();
        data_cuisine.push(d);
      }
    });
    fireData[0].forEach(function (doc) {
      if (doc.exists) {
        var d = doc.data();
        d.label = d.name;
        d.value = d.name;
        if (!current.has(d.name)) {
          data_mrt.push(d);
          current.add(d.name);
        }
      }
    });

    data_mrt = data_mrt.sort(function (a, b) {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    data_cuisine = data_cuisine.sort(function (a, b) {
      var x = a.label.toLowerCase();
      var y = b.label.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    this.setState({ data: data_mrt, cuisineOptions: data_cuisine });
  }

  retrieveData = async () => {
    try {
      const querySnapshot_mrt = await db.collection("mrt").get();
      const querySnapshot_cuisine = await db.collection("cuisine").get();
      return [querySnapshot_mrt, querySnapshot_cuisine];
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  handleMultiChange(option) {
    this.setState((state) => {
      return {
        multiValue: option,
      };
    });
  }

  handleCuisineChange(option) {
    this.setState((state) => {
      return {
        cuisineValue: option,
      };
    });
  }

  cuisineSearch() {
    return (
      <Fragment>
        <Select
          isMulti
          name="name"
          options={this.state.cuisineOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={this.state.cuisineValue}
          onChange={this.handleCuisineChange}
        />
      </Fragment>
    );
  }

  deliverySearch() {
    return (
      <Fragment>
        <Select
          isMulti
          name="name"
          options={this.state.data}
          className="basic-multi-select"
          classNamePrefix="select"
          value={this.state.multiValue}
          onChange={this.handleMultiChange}
        />

        {/* <Typeahead
    // id="basic-typeahead-example"
    labelKey="name"
    onChange={(selected) => {
      this.setState({selected});
    }}
    options={this.state.data}
    placeholder="Search By MRT"
    selected={this.state.selected}
    renderMenuItemChildren={this._renderMenuItemChildren}
    multiple
    clearButton
    /> */}
      </Fragment>
    );
  }

  _renderMenuItemChildren = (option, props, index) => {
    return (
      <div>
        <div class="row">
          <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            <img style={{ width: "20px" }} src={logo} alt="logo" />
          </div>
          <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
            <div>{option.name}</div>
          </div>
          <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10"></div>
        </div>
      </div>
    );
  };

  render({ apiReady, maps, map } = this.state) {
    return (
      <div class="jumbotron" style={{ "padding-top": "70px", "height":"1300px", "background-color": "white"}}>
        <h3>Create Hawker Listing</h3>
        <div class="row">
          <div class="col">
            <div
              class="card shadow"
              style={{ width: "100%", "margin-top": "10px" }}
            >
              <div class="card-body" >
                <h5 class="card-title create-title"> Live Preview</h5>
                <p class="card-text create-title">
                  This is how your listing will look like to users: {" "}
                </p>
                <p class="center" style={{ width: "220px"}}>
                  <Item
                    name={this.state.name}
                    pic={this.state.url}
                    summary={this.state.description}
                  />
                </p>

                <form onSubmit={this.handleFireBaseUpload}>
                  <div
                    class="custom-file"
                    onChange={this.handleImageAsFile}
                    style={{ "margin-top": "10px" }}
                  >
                    <input
                      type="file"
                      class="custom-file-input"
                      id="customFile"
                    ></input>
                    <label class="custom-file-label" for="customFile">
                      {this.state.imageName}
                    </label>
                  </div>
                </form>
              </div>
            </div>

            {/* <div
              class="card shadow"
              style={{ width: "100%", "margin-top": "10px" }}
            >
              <div class="card-body">
                <h5 class="card-title create-title create-title">
                  Upload Images
                </h5>
                <h6 class="card-subtitle mb-2 text-muted create-title">
                  Upload images of your listed hawker stall below
                </h6>
                <p class="card-text create-title">
                  Listings with images are much more likely to get orders.{" "}
                </p>
                {this.state.url ? (
                  <img src={this.state.url} style={{ width: "100px" }}></img>
                ) : null}
                <form onSubmit={this.handleFireBaseUpload}>
                  <div
                    class="custom-file"
                    onChange={this.handleImageAsFile}
                    style={{ "margin-top": "10px" }}
                  >
                    <input
                      type="file"
                      class="custom-file-input"
                      id="customFile"
                    ></input>
                    <label class="custom-file-label" for="customFile">
                      {this.state.imageName}
                    </label>
                  </div>
                </form>
              </div>
            </div> */}
          </div>
          <div class="col-sm-8">
            <div
              class="card shadow"
              style={{ width: "100%", "margin-top": "10px" }}
            >
              <form onSubmit={this.handleSubmit}>
                <div class="card-body">
                  <h5 class="card-title create-title">Stall Details</h5>
                  <h6 class="card-subtitle mb-2 text-muted create-title">
                    Please enter more details regarding your stall listing.{" "}
                  </h6>
                  <div class="form-group create-title">
                    <label for="name">Stall Name <b>(max 23 characters)</b></label>
                    <div class="input-group">
                      <input
                        onChange={this.handleChange}
                        value={this.state.name}
                        type="text"
                        class="form-control"
                        name="name"
                        placeholder="Enter Stall Name"
                      ></input>
                    </div>
                  </div>
                  <div class="form-group create-title">
                    <label for="description">Description <b>(max 45 characters)</b></label>
                    <input
                      onChange={this.handleChange}
                      value={this.state.description}
                      type="text"
                      class="form-control"
                      name="description"
                      placeholder="Enter Description"
                    ></input>
                  </div>
                  <div class="form-group create-title">
                    <label for="street">
                      Cuisine Category <b>(You can select multiple)</b>
                    </label>
                    {this.cuisineSearch()}
                  </div>
                  <div class="form-group create-title">
                    <label for="postalcode">Postal Code</label>
                    <div class="input-group">
                      <input
                        onChange={this.handleChange.bind(this)}
                        value={this.state.postal}
                        type="number"
                        class="form-control"
                        name="postal"
                        placeholder="Enter Postal Code"
                      ></input>
                    </div>
                  </div>
                  <div class="form-group create-title">
                    <label for="street">Street Name<b> (Auto-Filled from Postal Code)</b></label>
                    <input
                      onChange={this.handleChange}
                      value={this.state.street}
                      type="text"
                      class="form-control"
                      name="street"
                      placeholder="Enter Street Name"
                    ></input>
                  </div>
                  <div class="form-group create-title">
                    <label for="unit">Unit #</label>
                    <input
                      onChange={this.handleChange}
                      value={this.state.unit}
                      type="text"
                      class="form-control"
                      name="unit"
                      placeholder="Enter Unit Number"
                    ></input>
                  </div>
                  <div class="form-group create-title">
                    <label for="description">Where do you deliver to?</label>
                    <div class="form-check create-title">
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.north}
                          name="north"
                          class="form-check-input"
                        ></input>
                        North
                      </label>
                      <br />
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.south}
                          name="south"
                          class="form-check-input"
                        ></input>
                        South
                      </label>
                      <br />
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.east}
                          name="east"
                          class="form-check-input"
                        ></input>
                        East
                      </label>
                      <br />
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.west}
                          name="west"
                          class="form-check-input"
                        ></input>
                        West
                      </label>
                      <br />
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.islandwide}
                          name="islandwide"
                          class="form-check-input"
                        ></input>
                        Islandwide
                      </label>
                    </div>
                  </div>
                  <div class="form-group create-title">
                    <label for="unit">WhatsApp Contact Number</label>
                    <input
                      onChange={this.handleChange}
                      value={this.state.whatsapp}
                      type="number"
                      class="form-control"
                      name="whatsapp"
                      placeholder="Enter WhatsApp Number"
                    ></input>
                  </div>
                  <div class="form-group create-title">
                    <label for="street">
                      (Optional) Which locations do you deliver to?{" "}
                      <b>(Choose the nearest MRT stations)</b>
                    </label>
                    {this.deliverySearch()}
                  </div>
                  <div class="create-title">
                    <input
                      type="submit"
                      value="Submit"
                      class="btn btn-primary"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      //   <div className="search-container">
      //   <GoogleMap
      //   bootstrapURLKeys={{ key: API_KEY, libraries:'places'}}
      //   defaultCenter={[1.3521, 103.8198]}
      //   defaultZoom={15}
      //   yesIWantToUseGoogleMapApiInternals
      //   onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
      //   >
      //     {apiReady && <Component.deliverySearch
      //       map={map}
      //       maps={maps}
      //     />}
      //   </GoogleMap>
      // </div>
    );
  }
}

export default withRouter(Create);
