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
  menu,
  menuitem,
  menuprice
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
      menu: menu,
      menuitem: menuitem,
      menuprice: menuprice
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
      longitude: this.props.data.longitude,
      latitude: this.props.data.latitude,
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
      menu: this.props.data.menu,
      menuitem: this.props.data.menuitem,
      menuprice: this.props.data.menuprice,
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
    await this.getPostal(this.state.postal);
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
      menu: this.state.menu,
      menuitem: this.state.menuitem,
      menuprice: this.state.menuprice,
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
    } else if (name.slice(0, 8) === "menuitem") {
      let current = this.state.menuitem;
      current[parseInt(name.slice(8, 9))] = target.value;
      this.setState({
        menuitem: current,
      });
    } else if (name.slice(0, 9) === "menuprice") {
      let current = this.state.menuprice;
      current[parseInt(name.slice(9, 10))] = target.value;
      this.setState({
        menuprice: current,
      });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleMenu = () => {
    if (this.state.menu) {
      this.setState({ menu: false });
    } else {
      this.setState({ menu: true });
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
            fontSize: "10px",
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
            <Component.ListForm toggle="edit" id={this.props.id} data={this.props.data}/>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Popup);
