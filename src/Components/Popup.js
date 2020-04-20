import React, { Fragment } from "react";
import "../App.css";
import { db, storage } from "./Firestore";
import { Typeahead } from "react-bootstrap-typeahead";
import { InputGroup, Button, FormControl, Modal } from "react-bootstrap";
import logo from "../mrt_logo.png";
import Select from "react-select";
import Item from "./Item";
import placeholder from "../placeholder.png";
import Component from "../Components";
import PopupComp from "reactjs-popup";

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

const addData = async ({
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
  description_detail,
  region,
  islandwide,
  price,
  contact,
  latitude,
  longitude,
  call,
  whatsapp,
  sms,
  inperson,
  opening,
  pickup_option,
  delivery_option,
  website,
  promo,
  condition,
  docid,
  delivery_detail,
}) => {
  let now = new Date();
  let id = await db
    .collection("hawkers")
    .doc(docid)
    .update({
      name: name,
      postal: postal,
      street: street,
      description: description,
      description_detail: description_detail,
      url: url,
      image2: image2,
      image3: image3,
      image4: image4,
      image5: image5,
      image6: image6,
      latitude: latitude,
      longitude: longitude,
      unit: unit,
      cuisine: cuisine,
      region: region,
      price: price,
      contact: contact,
      call: call,
      whatsapp: whatsapp,
      sms: sms,
      inperson: inperson,
      lastmodified: now,
      opening: opening,
      delivery_option: delivery_option,
      pickup_option: pickup_option,
      website: website,
      promo: promo,
      condition: condition,
      delivery_detail: delivery_detail,
    })
    .then(function (d) {
      //   console.log(docRef.id);
      //   return docRef.id;
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
      // alert("Failed")
    });
  return id;
};

export class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.data.name,
      postal: this.props.data.postal,
      street: this.props.data.street,
      price: this.props.data.price,
      description: this.props.data.description,
      description_detail: this.props.data.description_detail,
      image1: this.props.data.url,
      image2: this.props.data.image2,
      image3: this.props.data.image3,
      image4: this.props.data.image4,
      image5: this.props.data.image5,
      image6: this.props.data.image6,
      imageFile1: this.props.data.imageFile1,
      imageFile2: this.props.data.imageFile2,
      imageFile3: this.props.data.imageFile3,
      imageFile4: this.props.data.imageFile4,
      imageFile5: this.props.data.imageFile5,
      imageFile6: this.props.data.imageFile6,
      imageName: "Upload Image",
      longitude: -122.3710252,
      latitude: 47.63628904,
      unit: this.props.data.unit,
      delivery_option: this.props.data.delivery_option,
      pickup_option: this.props.data.pickup_option,
      cuisineValue: this.props.data.cuisine,
      call: this.props.data.call,
      whatsapp: this.props.data.whatsapp,
      sms: this.props.data.sms,
      inperson: this.props.data.inperson,
      contact: this.props.data.contact,
      docid: this.props.data.docid,
      opening: this.props.data.opening,
      region: this.props.data.region,
      website: this.props.data.website,
      promo: this.props.data.promo,
      condition: this.props.data.condition,
      show: false,
      setShow: false,
      delivery_detail: this.props.data.delivery_detail,
    };
    this.handleRegionChange = this.handleRegionChange.bind(this);
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
    if (data !== undefined) {
      this.setState({
        street: data["ADDRESS"],
        longitude: data["LONGITUDE"],
        latitude: data["LATITUDE"],
      });
    }
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

  handleSubmit = async (event) => {
    this.setHide();
    await addData({
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
      description_detail: this.state.description_detail,
      region: this.state.region,
      islandwide: this.state.islandwide,
      price: this.state.price,
      contact: this.state.contact,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      call: this.state.call,
      whatsapp: this.state.whatsapp,
      sms: this.state.sms,
      inperson: this.state.inperson,
      opening: this.state.opening,
      pickup_option: this.state.pickup_option,
      delivery_option: this.state.delivery_option,
      website: this.state.website,
      promo: this.state.promo,
      condition: this.state.condition,
      docid: this.props.id,
      delivery_detail: this.state.delivery_detail,
    }).then((id) => {
      window.location.reload();
      //   this.props.history.push({
      //     pathname: "/info",
      //     search: "?id=" + id,
      //   });
    });
    event.preventDefault();
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
    if (name === "postal" && value.toString().length === 6) {
      this.getPostal(value);
    }
    if (
      name === "delivery_option" ||
      name === "pickup_option" ||
      name === "call" ||
      name === "whatsapp" ||
      name === "sms" ||
      name === "inperson"
    ) {
      const checked = target.checked;
      this.setState({ [name]: checked });
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

  handleRegionChange(option) {
    this.setState((state) => {
      return {
        region: option,
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
          placeholder="E.g. Asian, Local, Beverages"
        />
      </Fragment>
    );
  }

  regionSearch() {
    return (
      <Fragment>
        <Select
          isMulti
          name="name"
          options={[
            {
              label: "Islandwide",
              value: "islandwide",
            },
            {
              label: "North",
              value: "north",
            },
            {
              label: "South",
              value: "south",
            },
            {
              label: "East",
              value: "east",
            },
            {
              label: "West",
              value: "west",
            },
            {
              label: "Central",
              value: "central",
            },
          ]}
          className="basic-multi-select"
          classNamePrefix="select"
          value={this.state.region}
          onChange={this.handleRegionChange}
          placeholder="e.g. Islandwide, North, South, East, West"
        />
      </Fragment>
    );
  }

  // deliverySearch() {
  //   return (
  //     <Fragment>
  //       <Select
  //         isMulti
  //         name="name"
  //         options={this.state.data}
  //         // className="basic-multi-select"
  //         classNamePrefix="select"
  //         value={this.state.delivery}
  //         onChange={this.handleMultiChange}
  //       />

  //   </Fragment>
  // );
  // }

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

  setShow = () => {
    this.setState({ show: true });
  };

  setHide = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div
      // class="jumbotron"
      // style={{
      //   "padding-top": "70px",
      //   "padding-bottom": "240px",
      //   height: "100%",
      //   "background-color": "white",
      // }}
      >
        <div
          onClick={() => this.setShow()}
          class="d-flex justify-content-center"
          style={{
            border: "2px solid",
            "border-color": "grey",
            color: "black",
            width: "50px",
            alignText: "center",
          }}
        >
          Edit
        </div>

        <Modal
          onHide={this.setHide}
          show={this.state.show}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          style={{ "margin-top": "50px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Edit Hawker Listing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                "max-height": "800vh",
                "overflow-y": "auto",
              }}
            >
              <h5>
                <b>Trust you hor, don't anyhow change</b>
              </h5>

              <div class="row">
                <div class="col">
                  <div
                    class="card shadow"
                    style={{ width: "100%", "margin-top": "10px" }}
                  >
                    <div class="card-body">
                      <h5 class="card-title create-title create-title">
                        Upload Images{" "}
                      </h5>
                      <h6 class="card-subtitle mb-2 text-muted create-title">
                        Upload images of your listed hawker stall below
                      </h6>
                      <p class="card-text create-title">
                        <b>Click on image to change to another</b>
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
                                    alt=""
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
                                    alt=""
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
                                    alt=""
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
                                    alt=""
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
                                    alt=""
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
                                    alt=""
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
                </div>
                <div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                  <div
                    class="card shadow"
                    style={{ width: "100%", "margin-top": "10px" }}
                  >
                    <form>
                      <div class="card-body">
                        <h5 class="card-title create-title">Stall Details</h5>
                        <h6 class="card-subtitle mb-2 text-muted create-title">
                          Please enter more details regarding your stall
                          listing.{" "}
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
                            Cuisine Category{" "}
                            <b>(select multiple if applicable)</b>
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
                            placeholder="E.g. #01-01"
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
                            placeholder="E.g. Best Chicken Rice in town"
                          ></input>
                        </div>
                        <div class="form-group create-title">
                          <label for="description_detail">
                            Menu, Price List, and additional details{" "}
                          </label>
                          <textarea
                            onChange={this.handleChange}
                            value={this.state.description_detail}
                            type="text"
                            class="form-control"
                            name="description_detail"
                            placeholder="E.g. Soy Sauce Chicken Rice: $4.00 (limited to 500 per day)"
                            rows="3"
                          ></textarea>
                        </div>
                        <div class="form-group create-title">
                          <label for="website">
                            General Promotion (if any){" "}
                          </label>
                          <div class="form-row">
                            <div class="col-5">
                              <small>
                                Discount <b>(8 chars)</b>
                              </small>
                              <input
                                onChange={this.handleChange}
                                value={this.state.promo}
                                name="promo"
                                type="text"
                                class="form-control"
                                placeholder="e.g. 10% or $5 off"
                                maxlength="8"
                              />
                            </div>
                            <div class="col-7">
                              <small>Condition (if any)</small>
                              <input
                                onChange={this.handleChange}
                                value={this.state.condition}
                                name="condition"
                                type="text"
                                class="form-control"
                                placeholder="e.g. any order / above $20 order size"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="form-group create-title">
                          <label for="website">
                            Website / Facebook/ Google Listing Link
                          </label>
                          <input
                            onChange={this.handleChange}
                            value={this.state.website}
                            type="text"
                            class="form-control"
                            name="website"
                            placeholder="www.example.com"
                            rows="3"
                          ></input>
                        </div>
                        <div class="form-group create-title">
                          <label for="description">Opening Hours</label>
                          <textarea
                            onChange={this.handleChange}
                            value={this.state.opening}
                            type="text"
                            class="form-control"
                            name="opening"
                            placeholder="E.g. Monday: 7:00 to 20:00"
                            rows="3"
                          ></textarea>
                        </div>
                        <div class="form-group create-title">
                          <label for="description">
                            Do you offer self-collection, delivery, or both?
                          </label>
                          <div class="form-check create-title">
                            <label class="checkbox-inline">
                              <input
                                onChange={this.handleChange}
                                type="checkbox"
                                value={this.state.pickup_option}
                                checked={this.state.pickup_option}
                                name="pickup_option"
                                class="form-check-input"
                              ></input>
                              Self-Collection
                            </label>
                            <br />
                            <label class="checkbox-inline">
                              <input
                                onChange={this.handleChange}
                                type="checkbox"
                                checked={this.state.delivery_option}
                                name="delivery_option"
                                class="form-check-input"
                              ></input>
                              Delivery
                            </label>
                            <br />
                          </div>
                        </div>
                        {this.state.delivery_option === false ? null : (
                          <div>
                            <div class="card shadow">
                              <div class="card-body">
                                <h5 class="card-title create-title">
                                  {" "}
                                  Delivery Options
                                </h5>
                                <div class=" form-group create-title">
                                  <label for="description">
                                    Which regions do you deliver to? (Select
                                    Island-wide Delivery or NSEWC)
                                  </label>
                                  {this.regionSearch()}
                                </div>
                                <div class="form-group create-title ">
                                  <label for="price">Delivery Fees: </label>
                                  <div class="input-group">
                                    <input
                                      onChange={this.handleChange}
                                      value={this.state.price}
                                      type="text"
                                      class="form-control"
                                      name="price"
                                      placeholder="e.g. $2.99 for below $30"
                                    ></input>
                                  </div>
                                </div>
                                <div class="form-group create-title">
                                  <label for="delivery_detail">
                                    Details regarding delivery:{" "}
                                  </label>
                                  <textarea
                                    onChange={this.handleChange}
                                    value={this.state.delivery_detail}
                                    type="text"
                                    class="form-control"
                                    name="delivery_detail"
                                    placeholder="E.g. Only deliver to Bukit Batok for orders above $30"
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <br />
                          </div>
                        )}
                        <div class="form-group create-title">
                          <label for="unit">Contact Number: </label>

                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">
                                +65
                              </span>
                            </div>
                            <input
                              onChange={this.handleChange}
                              value={this.state.contact}
                              type="number"
                              class="form-control"
                              name="contact"
                              placeholder="9xxxxxxx"
                            ></input>
                          </div>
                        </div>
                        <div class="form-group create-title">
                          <label for="unit">Contact Channels: </label>
                          <div class="form-check create-title">
                            <label class="checkbox-inline">
                              <input
                                onChange={this.handleChange}
                                type="checkbox"
                                checked={this.state.call}
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
                                checked={this.state.whatsapp}
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
                                checked={this.state.sms}
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
                                checked={this.state.inperson}
                                name="inperson"
                                class="form-check-input"
                              ></input>
                              In-Person
                            </label>
                            <br />
                          </div>
                        </div>
                        <div
                          class="card shadow"
                          style={{ width: "100%", "margin-top": "10px" }}
                        >
                          <div class="card-body">
                            <h5 class="card-title create-title">
                              {" "}
                              Live Preview
                            </h5>
                            <p class="card-text create-title">
                              This is how your listing will look like to users:{" "}
                            </p>
                            <p class="d-flex justify-content-center">
                              <Item
                                promo={this.state.promo}
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
                          <Button
                            class="shadow-sm"
                            style={{
                              backgroundColor: "#b48300",
                              borderColor: "#b48300",
                            }}
                            onClick={this.handleSubmit}
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Popup);
