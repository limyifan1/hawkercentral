import React, { Fragment } from "react";
import "../App.css";
import { db, storage } from "./Firestore";
import { Typeahead } from "react-bootstrap-typeahead";
import { InputGroup, Button, FormControl } from "react-bootstrap";
import logo from "../mrt_logo.png";
import Select from "react-select";
import Item from "./Item";
import placeholder from "../placeholder.png";
import Component from "../Components";

import { withRouter } from "react-router-dom";

// const API_KEY = `${process.env.REACT_APP_GKEY}`

const icon = (
  <div>
    <svg
      class="bi bi-square"
      width="85px"
      height="85px"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
        clip-rule="evenodd"
      />
      <svg
        class="bi bi-plus-circle-fill"
        x="5.5"
        y="5.5"
        width="5px"
        height="5px"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.5 4a.5.5 0 00-1 0v3.5H4a.5.5 0 000 1h3.5V12a.5.5 0 001 0V8.5H12a.5.5 0 000-1H8.5V4z"
          clip-rule="evenodd"
        />
      </svg>
    </svg>
  </div>
);
const addData = (
  url,
  image2,
  image3,
  image4,
  image5,
  image6,
  name,
  cuisine,
  postal,
  street,
  unit,
  description,
  description_detailed,
  north,
  south,
  east,
  west,
  islandwide,
  delivery,
  price,
  contact,
  latitude,
  longitude,
  call,
  whatsapp,
  sms,
  inperson,
  opening,
  closing
) => {
  let now = new Date();
  db.collection("hawkers")
    .add({
      name: name,
      postal: postal,
      street: street,
      description: description,
      description_detailed: description_detailed,
      url: url,
      image2: image2,
      image3: image3,
      image4: image4,
      image5: image5,
      image6: image6,
      latitude: latitude,
      longitude: longitude,
      unit: unit,
      delivery: delivery,
      islandwide: islandwide === "false",
      cuisine: cuisine,
      north: north,
      south: south,
      east: east,
      west: west,
      price: price,
      contact: contact,
      call: call,
      whatsapp: whatsapp,
      sms: sms,
      inperson: inperson,
      lastmodified: now,
      opening: opening,
      closing: closing,
    })
    .then(function (docRef) {
      this.setState({ docid: docRef.id });
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
      postal: null,
      street: "",
      price: 0,
      description: "",
      description_detailed: "",
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      image6: "",
      imageFile1: "",
      imageFile2: "",
      imageFile3: "",
      imageFile4: "",
      imageFile5: "",
      imageFile6: "",
      imageName: "Upload Image",
      longitude: -122.3710252,
      latitude: 47.63628904,
      unit: "",
      delivery: [],
      cuisineValue: [],
      islandwide: false,
      north: false,
      south: false,
      east: false,
      west: false,
      call: false,
      whatsapp: false,
      sms: false,
      inperson: false,
      contact: null,
      docid: "",
      opening: "07:00",
      closing: "21:00",
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
    addData({
      url: this.state.image1,
      image2: this.state.image2,
      image3: this.state.image3,
      image4: this.state.image4,
      image5: this.state.image5,
      image6: this.state.image6,
      name: this.state.name,
      cuisine: this.state.cuisineValue,
      postal: this.state.postal,
      street: this.state.street,
      unit: this.state.unit,
      description: this.state.description,
      description_detailed: this.state.description_detailed,
      north: this.state.north,
      south: this.state.south,
      east: this.state.east,
      west: this.state.west,
      islandwide: this.state.islandwide,
      delivery: this.state.delivery,
      price: this.state.price,
      contact: this.state.contact,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      call: this.state.call,
      whatsapp: this.state.whatsapp,
      sms: this.state.sms,
      inperson: this.state.inperson,
      opening: this.state.opening,
      closing: this.state.closing,
    });
    event.preventDefault();
    this.props.history.push("/info" + this.state.docid);
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
    const name = event.target.name;
    this.setState({ [name]: image });
    console.log(name);
    // this.setState({ imageName: image.name });
    this.handleFireBaseUpload(image, name);
  };

  handleFireBaseUpload = (image, name) => {
    // event.preventDefault()
    // alert('start of upload')
    if (image !== undefined) {
      var date = new Date();
      var timestamp = date.getTime();
      var newName = timestamp + "_" + image.name;
      const uploadTask = storage.ref(`/images/${newName}`).put(image);
      name = "image" + name.slice(-1);
      console.log(name);
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
              this.setState({ [name]: fireBaseUrl });
            });
        }
      );
    }
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
        delivery: option,
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
          value={this.state.delivery}
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
      <div
        class="jumbotron"
        style={{
          "padding-top": "70px",
          "padding-bottom": "240px",
          height: "100%",
          "background-color": "white",
        }}
      >
        <h3>Create Hawker Listing</h3>
        <div class="row">
          <div class="col">
            <div
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

                <div class="row">
                  <div class="col-4">
                    <form
                      class="create-title"
                      onSubmit={this.handleFireBaseUpload}
                      style={{ display: "inline" }}
                    >
                      <div
                        class="custom-file"
                        onChange={this.handleImageAsFile}
                        style={{ "margin-top": "10px" }}
                      >
                        {this.state.image1 ? (
                          <label for="imageFile1">
                            <img
                              src={this.state.image1}
                              style={{
                                width: "80px",
                                height: "80px",
                                "object-fit": "cover",
                              }}
                              name="imageFile1"
                            ></img>
                          </label>
                        ) : (
                          <label for="imageFile1">{icon}</label>
                        )}
                        <input
                          type="file"
                          class="custom-file-input"
                          id="imageFile1"
                          name="imageFile1"
                        ></input>
                      </div>
                    </form>
                  </div>
                  <div class="col-4">
                    <form
                      class="create-title"
                      onSubmit={this.handleFireBaseUpload}
                      style={{ display: "inline" }}
                    >
                      <div
                        class="custom-file"
                        onChange={this.handleImageAsFile}
                        style={{ "margin-top": "10px" }}
                      >
                        {this.state.image2 ? (
                          <label for="imageFile2">
                            <img
                              src={this.state.image2}
                              style={{
                                width: "80px",
                                height: "80px",
                                "object-fit": "cover",
                              }}
                              name="imageFile2"
                            ></img>
                          </label>
                        ) : (
                          <label for="imageFile2">{icon}</label>
                        )}
                        <input
                          type="file"
                          class="custom-file-input"
                          id="imageFile2"
                          name="imageFile2"
                        ></input>
                      </div>
                    </form>
                  </div>
                  <div class="col-4">
                    <form
                      class="create-title"
                      onSubmit={this.handleFireBaseUpload}
                      style={{ display: "inline" }}
                    >
                      <div
                        class="custom-file"
                        onChange={this.handleImageAsFile}
                        style={{ "margin-top": "10px" }}
                      >
                        {this.state.image3 ? (
                          <label for="imageFile3">
                            <img
                              src={this.state.image3}
                              style={{
                                width: "80px",
                                height: "80px",
                                "object-fit": "cover",
                              }}
                              name="imageFile3"
                            ></img>
                          </label>
                        ) : (
                          <label for="imageFile3">{icon}</label>
                        )}
                        <input
                          type="file"
                          class="custom-file-input"
                          id="imageFile3"
                          name="imageFile3"
                        ></input>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <form
                      class="create-title"
                      onSubmit={this.handleFireBaseUpload}
                      style={{ display: "inline" }}
                    >
                      <div
                        class="custom-file"
                        onChange={this.handleImageAsFile}
                        style={{ "margin-top": "10px" }}
                      >
                        {this.state.image4 ? (
                          <label for="imageFile4">
                            <img
                              src={this.state.image4}
                              style={{
                                width: "80px",
                                height: "80px",
                                "object-fit": "cover",
                              }}
                              name="imageFile4"
                            ></img>
                          </label>
                        ) : (
                          <label for="imageFile4">{icon}</label>
                        )}
                        <input
                          type="file"
                          class="custom-file-input"
                          id="imageFile4"
                          name="imageFile4"
                        ></input>
                      </div>
                    </form>
                  </div>
                  <div class="col-4">
                    <form
                      class="create-title"
                      onSubmit={this.handleFireBaseUpload}
                      style={{ display: "inline" }}
                    >
                      <div
                        class="custom-file"
                        onChange={this.handleImageAsFile}
                        style={{ "margin-top": "10px" }}
                      >
                        {this.state.image5 ? (
                          <label for="imageFile5">
                            <img
                              src={this.state.image5}
                              style={{
                                width: "80px",
                                height: "80px",
                                "object-fit": "cover",
                              }}
                              name="imageFile5"
                            ></img>
                          </label>
                        ) : (
                          <label for="imageFile5">{icon}</label>
                        )}
                        <input
                          type="file"
                          class="custom-file-input"
                          id="imageFile5"
                          name="imageFile5"
                        ></input>
                      </div>
                    </form>
                  </div>
                  <div class="col-4">
                    <form
                      class="create-title"
                      onSubmit={this.handleFireBaseUpload}
                      style={{ display: "inline" }}
                    >
                      <div
                        class="custom-file"
                        onChange={this.handleImageAsFile}
                        style={{ "margin-top": "10px" }}
                      >
                        {this.state.image6 ? (
                          <label for="imageFile6">
                            <img
                              src={this.state.image6}
                              style={{
                                width: "80px",
                                height: "80px",
                                "object-fit": "cover",
                              }}
                              name="imageFile6"
                            ></img>
                          </label>
                        ) : (
                          <label for="imageFile6">{icon}</label>
                        )}
                        <input
                          type="file"
                          class="custom-file-input"
                          id="imageFile6"
                          name="imageFile6"
                        ></input>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="card shadow d-none d-md-block d-sm-block d-lg-block"
              style={{ width: "100%", "margin-top": "10px" }}
            >
              <div class="card-body">
                <h5 class="card-title create-title"> Live Preview</h5>
                <p class="card-text create-title">
                  This is how your listing will look like to users:{" "}
                </p>
                <p class="center" style={{ width: "220px" }}>
                  <Item
                    name={this.state.name}
                    pic={this.state.image1}
                    summary={this.state.description}
                  />
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-xs-4 col-md-6 col-lg-8">
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
                    <label for="name">Stall Name</label>
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
                    <label for="street">
                      Cuisine Category <b>(select multiple if applicable)</b>
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
                    <label for="street">
                      Street Name<b> (Auto-Filled)</b>
                    </label>
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
                    <label for="description">
                      Brief Description <b>(max 45 characters)</b>
                    </label>
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
                    <label for="description_long">
                      Detailed Description <b>(max 150 words)</b>
                    </label>
                    <textarea
                      onChange={this.handleChange}
                      value={this.state.description_long}
                      type="text"
                      class="form-control"
                      name="description_long"
                      placeholder="Enter Description"
                      rows="3"
                    ></textarea>
                  </div>
                  <div class="form-group create-title">
                    <label for="description">Opening Hours</label>

                    <div class="row">
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <input
                          onChange={this.handleChange}
                          value={this.state.opening}
                          type="time"
                          class="form-control"
                          name="opening"
                          placeholder="Enter Description"
                        ></input>
                      </div>
                      <span>to</span>
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <input
                          onChange={this.handleChange}
                          value={this.state.closing}
                          type="time"
                          class="form-control"
                          name="closing"
                          placeholder="Enter Description"
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div class="form-group create-title">
                    <label for="description">
                      Where do you deliver to? (NSEWC or select island-wide
                      delivery)
                    </label>
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
                        Island-wide
                      </label>
                    </div>
                  </div>
                  <div class="form-group create-title">
                    <label for="street">
                      Where do you deliver to? (Choose nearest MRT station/
                      select Island-wide above)
                    </label>
                    {this.deliverySearch()}
                  </div>
                  <div class="form-group create-title">
                    <label for="price">Delivery Fees: </label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">
                          $
                        </span>
                      </div>
                      <input
                        onChange={this.handleChange}
                        value={this.state.price}
                        type="number"
                        class="form-control"
                        name="price"
                        placeholder="Enter Price"
                      ></input>
                    </div>
                  </div>
                  <div class="form-group create-title">
                    <label for="unit">Contact Number: </label>
                    <input
                      onChange={this.handleChange}
                      value={this.state.contact}
                      type="number"
                      class="form-control"
                      name="contact"
                      placeholder="Enter Contact Number"
                    ></input>
                  </div>
                  <div class="form-group create-title">
                    <label for="unit">Contact Channels: </label>
                    <div class="form-check create-title">
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.call}
                          name="call"
                          class="form-check-input"
                        ></input>
                        Call
                      </label>
                      <br />
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.whatsapp}
                          name="whatsapp"
                          class="form-check-input"
                        ></input>
                        WhatsApp
                      </label>
                      <br />
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.sms}
                          name="sms"
                          class="form-check-input"
                        ></input>
                        SMS
                      </label>
                      <br />
                      <label class="checkbox-inline">
                        <input
                          onChange={this.handleChange}
                          type="checkbox"
                          value={this.state.inperson}
                          name="inperson"
                          class="form-check-input"
                        ></input>
                        In-Person
                      </label>
                      <br />
                    </div>
                  </div>
                  <div
                    class="card shadow d-block d-md-none"
                    style={{ width: "100%", "margin-top": "10px" }}
                  >
                    <div class="card-body">
                      <h5 class="card-title create-title"> Live Preview</h5>
                      <p class="card-text create-title">
                        This is how your listing will look like to users:{" "}
                      </p>
                      <p class="center" style={{ width: "220px" }}>
                        <Item
                          name={this.state.name}
                          pic={this.state.image1}
                          summary={this.state.description}
                        />
                      </p>
                      <p class="card-text create-title">
                        Not satisfied? Just change the fields!{" "}
                      </p>
                    </div>
                  </div>
                  <br />
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
    );
  }
}

export default withRouter(Create);
