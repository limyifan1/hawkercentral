// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React, { Fragment } from "react";
import "../App.css";
import { db, storage, geo, uiConfigPage } from "./Firestore";
import { Button, Form, Spinner } from "react-bootstrap";
import logo from "../mrt_logo.png";
import Select from "react-select";
import Item from "./Item";
import Jimp from "jimp";
import Helpers from "../Helpers/helpers";
import CreatableSelect from "react-select/creatable";
import firebase from "./Firestore";
import { withRouter } from "react-router-dom";
import { LanguageContext } from "./themeContext";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// const API_KEY = `${process.env.REACT_APP_GKEY}`

import _ from "lodash";
const admin = `${process.env.REACT_APP_ADMIN}`;
const analytics = firebase.analytics();

function onClick(name) {
  analytics.logEvent(name);
}

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

const createDomain = async (name, id, cover, uid) => {
  return db
    .collection("pages")
    .doc(name)
    .set({
      css: { menu_color: "", menu_font_color: "" },
      docid: id,
      logo: "",
      cover: cover,
      delivery_option: "none"
    })
    .then(async () => {
      await db
        .collection("pages")
        .doc(name)
        .collection("users")
        .doc(uid)
        .set({
          role: "admin",
        })
        .catch((e) => {
          console.log(e);
        });
      await db
        .collection("pages")
        .doc(name)
        .collection("users")
        .doc(admin)
        .set({
          role: "admin",
        })
        .catch((e) => {
          console.log(e);
        });
      await db
        .collection("hawkers")
        .doc(id)
        .update({
          custom: true,
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};

const handleData = async ({
  url,
  image2,
  image3,
  image4,
  image5,
  image6,
  name,
  cuisine,
  categories,
  postal,
  street,
  unit,
  description,
  description_detail,
  region,
  regions,
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
  pickup_option,
  delivery_option,
  website,
  promo,
  condition,
  delivery_detail,
  menu,
  toggle,
  docid,
  wechatid,
  location,
  menu_combined,
  tagsValue,
  editedFields,
  originalName,
  takesg,
  option,
  uid,
  minimum_order,
  free_delivery,
  website_name,
}) => {
  let now = new Date();
  var field = {
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
    delivery: delivery,
    cuisine: cuisine,
    categories: categories,
    region: region,
    regions: regions,
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
    docid: docid,
    wechatid: wechatid,
    location: location,
    menu_combined: menu_combined,
    tagsValue: tagsValue,
    takesg: takesg,
    minimum_order: minimum_order,
    free_delivery: free_delivery,
  };
  if (toggle === "create") {
    console.log(field);
    let id = await db
      .collection("hawkers")
      .add({
        ...field,
        claps: 0,
        custom: false,
      })
      .then(async (docRef) => {
        console.log(docRef.id);
        if (option === "website") {
          await createDomain(website_name, docRef.id, url, uid);
        }
        return docRef.id;
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    return id;
  } else if (toggle === "edit") {
    if (editedFields.length > 0) {
      let editedFieldsAndValues = _.pick(field, editedFields);
      await Helpers.sendEmailToUpdateListing(
        docid,
        originalName,
        "edit",
        editedFieldsAndValues
      )
        .then((result) => {
          console.log(result);
        })
        .catch(function (error) {
          console.error("Error sending email: ", error);
        });
    }

    return docid;
  }
};

export class ListForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      postal: "",
      street: "",
      price: "",
      description: "",
      description_detail: "",
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
      longitude: 103.8198,
      latitude: 1.3521,
      unit: "",
      delivery_option: false,
      pickup_option: true,
      delivery: [],
      cuisineValue: [],
      call: false,
      whatsapp: false,
      sms: false,
      inperson: false,
      contact: "",
      docid: "",
      opening: "",
      region: [],
      website: "",
      promo: "",
      condition: "",
      delivery_detail: "",
      menu: false,
      menu_combined: [
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
        { name: "", price: "" },
      ],
      wechatid: "",
      tagsValue: [],
      tags: [],
      isLoading: false,
      takesg: false,
      dialogOpen: false,
      website_name: "",
      available: null,
      firebaseUser: "",
      minimum_order: 0,
      free_delivery: 0,
    };

    this.initialState = {};

    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);
    this.handleCuisineChange = this.handleCuisineChange.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    // this.handleImageAsFile = this.handleImageAsFile.bind(this);
    this.handleFireBaseUpload = this.handleFireBaseUpload.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentDidMount() {
    firebase.auth().useDeviceLanguage();
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //   "recaptcha-container",
    //   {
    //     size: "invisible",
    //     callback: function (response) {
    //       // reCAPTCHA solved
    //     },
    //   }
    // );

    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          // User is signed in, set state
          // More auth information can be obtained here but for verification purposes, we just need to know user signed in
          console.log(user);
          this.setState({
            firebaseUser: user,
            displayName: user.displayName,
            email: user.email ? user.email : null,
          });
        } else {
          // No user is signed in.
        }
      }.bind(this)
    );
  }

  getInitialState() {
    console.log("getinitialstate");
    const initialState = {
      name: this.props.data.name,
      postal: this.props.data.postal,
      street: this.props.data.street,
      price: this.props.data.price,
      description: this.props.data.description,
      description_detail: this.props.data.description_detail,
      image1: this.props.data.url ? this.props.data.url : "",
      image2: this.props.data.image2 ? this.props.data.image2 : "",
      image3: this.props.data.image3 ? this.props.data.image3 : "",
      image4: this.props.data.image4 ? this.props.data.image4 : "",
      image5: this.props.data.image5 ? this.props.data.image5 : "",
      image6: this.props.data.image6 ? this.props.data.image6 : "",
      imageName: "Upload Image",
      longitude: this.props.data.longitude,
      latitude: this.props.data.latitude,
      unit: this.props.data.unit,
      delivery_option: this.props.data.delivery_option,
      pickup_option: this.props.data.pickup_option,
      cuisineValue: this.props.data.categories.map((v) => {
        return {
          label: v,
          value: v,
        };
      }),
      categories: this.props.data.cuisine,
      call: this.props.data.call,
      whatsapp: this.props.data.whatsapp,
      sms: this.props.data.sms,
      inperson: this.props.data.inperson,
      contact: this.props.data.contact,
      docid: this.props.id,
      opening: this.props.data.opening,
      region: this.props.data.regions.map((v) => {
        return {
          label: v,
          value: v,
        };
      }),
      regions: this.props.data.region,
      website: this.props.data.website,
      promo: this.props.data.promo,
      condition: this.props.data.condition,
      delivery_detail: this.props.data.delivery_detail,
      menu: this.props.data.menu,
      menu_combined: this.props.data.menu_combined,
      wechatid: this.props.data.wechatid ? this.props.data.wechatid : "",
      takesg: this.props.data.takesg ? this.props.data.takesg : false,
      newId: "",
    };

    return _.cloneDeep(initialState);
  }

  componentWillMount() {
    this.getFirestoreData();
    this.getTags();
    this.initialState = _.cloneDeep(this.state);

    if (this.props.toggle === "create") {
      if (localStorage.getItem("createFormData")) {
        this.setState(JSON.parse(localStorage.getItem("createFormData")));
      } else {
        localStorage.setItem("createFormData", JSON.stringify(this.state));
      }
    } else if (this.props.toggle === "edit") {
      this.setState(this.getInitialState());
      const initialState = this.getInitialState();
      this.initialState = { ...this.initialState, ...initialState };
    }
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

  saveStateToLocalStorage(name, value) {
    if (this.props.toggle === "create") {
      const storedData = JSON.parse(localStorage.getItem("createFormData"));
      storedData[name] = value;
      localStorage.setItem("createFormData", JSON.stringify(storedData));
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
      this.saveStateToLocalStorage("street", data["ADDRESS"]);
      this.saveStateToLocalStorage("longitude", data["LONGITUDE"]);
      this.saveStateToLocalStorage("latitude", data["LATITUDE"]);
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
          if (
            jsonResponse !== undefined &&
            jsonResponse["results"] !== undefined
          ) {
            return jsonResponse["results"][0];
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getEditedFields = () => {
    const specialKeys = {
      image1: ["url"],
      cuisineValue: ["cuisine", "categories"],
      region: ["region", "regions"],
      latitude: ["latitude", "location"],
      // menuitem: ["menuitem", "menu_combined"],
      // menuprice: ["menuprice", "menu_combined"],
      menu_combined: ["menu_combined"],
    };

    let edited_fields = [];

    Object.keys(this.state).forEach((key) => {
      const initialVal = this.initialState[key];
      const currentVal = this.state[key];

      if (!_.isEqual(initialVal, currentVal)) {
        if (Object.prototype.hasOwnProperty.call(specialKeys, key)) {
          const relatedKeys = specialKeys[key];
          relatedKeys.forEach((relatedKey) => {
            edited_fields.push(relatedKey);
          });
        } else {
          edited_fields.push(key);
        }
      }
    });

    return edited_fields;
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    // Early exit if no account created and no website name
    if (this.props.option === "website" && !this.state.firebaseUser) {
      alert("Please create account");
      return;
    }
    if (
      this.props.option === "website" &&
      !this.state.website_name &&
      !this.state.available &&
      this.state.available === null
    ) {
      alert("Please enter a valid website name");
      return;
    }

    this.getPostal(this.state.postal);
    // removing since menu_combined should be ground truth instead of menuitem, menuprice
    // let menu_combined = this.state.menuitem.map((item, index) => {
    //   return {
    //     name: this.state.menuitem[index],
    //     price: this.state.menuprice[index],
    //   };
    // });
    //
    // Clean empty fields from menu_combined, menuitem and menuprice before creating/editing, fills up to 10
    // Guards against blank fields from users clicking "More Menu Items" multiple times and not filling it in
    let newMenucombined = [];
    for (let i = 0; i < this.state.menu_combined.length; i = i + 1) {
      if (this.state.menu_combined[i].name !== "") {
        newMenucombined.push({
          name: this.state.menu_combined[i].name,
          price: this.state.menu_combined[i].price,
        });
      }
    }
    while (newMenucombined.length < 10) {
      newMenucombined.push({
        name: "",
        price: "",
      });
    }
    this.setState({ isLoading: true });
    let edited_fields = [];
    if (this.props.toggle === "create") {
      onClick("create_submit_click");
    } else {
      onClick("edit_submit_click");
      edited_fields = this.getEditedFields();
    }

    await handleData({
      url: this.state.image1,
      image2: this.state.image2,
      image3: this.state.image3,
      image4: this.state.image4,
      image5: this.state.image5,
      image6: this.state.image6,
      name: this.state.name,
      cuisine: this.state.cuisineValue,
      categories: this.state.cuisineValue.map((v) => v.label.trim()),
      postal: this.state.postal,
      street: this.state.street,
      unit: this.state.unit,
      description: this.state.description,
      description_detail: this.state.description_detail,
      region: this.state.region,
      regions: this.state.region.map((v) => v.label.trim()),
      islandwide: this.state.islandwide,
      delivery: this.state.delivery,
      price: this.state.price,
      contact: this.state.contact,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      location: geo.point(
        Number(this.state.latitude),
        Number(this.state.longitude)
      ),
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
      delivery_detail: this.state.delivery_detail,
      menu: this.state.menu,
      menu_combined: newMenucombined,
      toggle: this.props.toggle,
      docid: this.state.docid,
      wechatid: this.state.wechatid,
      tagsValue: this.state.tagsValue.map((v) => v.label.trim()),
      editedFields: edited_fields,
      originalName: this.initialState.name,
      takesg: this.state.takesg,
      option: this.props.option,
      uid: this.state.firebaseUser.uid,
      free_delivery: this.state.free_delivery,
      minimum_order: this.state.minimum_order,
      website_name: this.state.website_name,
    }).then((id) => {
      if (this.props.toggle === "create") {
        // this.props.history.push({
        //   pathname: "/info",
        //   search: "?id=" + id,
        // });
        this.setState({ newId: id, dialogOpen: true, isLoading: false });
      } else if (this.props.toggle === "edit") {
        this.setState({ isLoading: false });

        if (edited_fields.length === 0) {
          this.props.onSubmitEdit(false);
        } else {
          this.props.onSubmitEdit(true);
        }
      }
    });
  };

  handleClear() {
    localStorage.setItem("createFormData", JSON.stringify(this.initialState));
    this.setState(_.cloneDeep(this.initialState));
    window.scrollTo(0, 0);
  }

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
      this.saveStateToLocalStorage(name, checked);
    } else if (name.slice(0, 8) === "menuitem") {
      // Check if menu_combined already has index to change in case user adds more items, else push it
      let current = this.state.menu_combined;
      let idxToChange = parseInt(name.slice(8));
      while (current.length < idxToChange + 1) {
        current.push({
          name: "",
          price: "",
        });
      }
      current[idxToChange].name = target.value;
      this.setState({
        menu_combined: current,
      });
      this.saveStateToLocalStorage("menu_combined", current);
    } else if (name.slice(0, 9) === "menuprice") {
      let current = this.state.menu_combined;
      let idxToChange = parseInt(name.slice(9));
      while (current.length < idxToChange + 1) {
        current.push({
          name: "",
          price: "",
        });
      }
      current[idxToChange].price = target.value;
      this.setState({
        menu_combined: current,
      });
      this.saveStateToLocalStorage("menu_combined", current);
    } else if (name === "website_name") {
      this.setState({
        website_name: event.target.value.toLowerCase(),
        available: null,
      });
      this.saveStateToLocalStorage(name, value);
    } else {
      this.setState({ [name]: value });
      this.saveStateToLocalStorage(name, value);
    }
  };

  checkAvailable = async () => {
    if (
      this.state.website_name !== "" &&
      this.state.website_name !== null &&
      /[^\w]|_|\s/g.test(this.state.website_name) !== true
    ) {
      this.setState({ invalid: false });
      await db
        .collection("pages")
        .doc(this.state.website_name)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            this.setState({ available: false });
          } else {
            this.setState({ available: true });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({ invalid: true });
    }
  };

  handleMenu = (event) => {
    const name = event.target.name;
    // User is displaying first 10 menu item rows
    if (name === "menu") {
      if (this.state.menu) {
        this.setState({ menu: false });
        this.saveStateToLocalStorage("menu", false);
      } else {
        this.setState({ menu: true });
        this.saveStateToLocalStorage("menu", true);
      }
    } else if (name === "moreMenuItems") {
      // User adds more menu_combined rows, 5 at a time
      let newMenucombined = this.state.menu_combined;
      for (var i = 0; i < 5; i++) {
        newMenucombined.push({
          name: "",
          price: "",
        });
      }
      this.setState({
        menu_combined: newMenucombined,
      });
      this.saveStateToLocalStorage("menu_combined", newMenucombined);
    }
  };

  handleMenuDisplay = (context) => {
    let data = [];
    console.log(this.state.menu_combined.length);
    // Push Menu and Price headers
    data.push(
      <div class="form-row">
        <div class="col-7">
          <small>{context.data.create.menuitem}</small>
        </div>
        <div class="col-5">
          <small>{context.data.create.price}</small>
        </div>
      </div>
    );
    // Push the number of rows corresponding to number of menu items
    for (var i = 0; i < this.state.menu_combined.length; i++) {
      data.push(
        <div>
          <div class="form-row">
            <div class="col-7">
              <input
                onChange={this.handleChange}
                value={this.state.menu_combined[i].name}
                name={"menuitem" + i.toString()}
                type="text"
                class="form-control"
                placeholder="E.g. Chicken Rice"
                maxlength="60"
              />
            </div>
            <div class="col-5">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">
                    $
                  </span>
                </div>
                <input
                  onChange={this.handleChange}
                  value={this.state.menu_combined[i].price}
                  name={"menuprice" + i.toString()}
                  type="number"
                  class="form-control"
                  placeholder="e.g. 4.00"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return data;
  };

  handleImageAsFile = (event) => {
    event.preventDefault();
    const image = event.target.files[0];
    const name = event.target.name;
    this.setState({ [name]: image });
    if (image !== undefined) {
      var date = new Date();
      var timestamp = date.getTime();
      var newName = timestamp + "_" + image.name;
      var reader = new FileReader();
      reader.readAsArrayBuffer(image);
      reader.onload = (event) => {
        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL

        // helper Image object
        var image = new Image();
        image.src = blobURL;
        //preview.appendChild(image); // preview commented out, I am using the canvas instead
        this.handleFireBaseUpload(image, newName, name);
      };
    }
  };

  handleFireBaseUpload = (image, newName, name) => {
    image.onload = () => {
      // have to wait till it's loaded
      Jimp.read(image.src).then((image) => {
        image.quality(50);
        image.resize(Jimp.AUTO, 750);
        console.log(image);
        image.getBase64(Jimp.AUTO, (err, res) => {
          // console.log(res);
          const uploadTask = storage
            .ref(`/images/${newName}`)
            .putString(res, "data_url");
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
              name = "image" + name.slice(-1);
              storage
                .ref("images")
                .child(newName)
                .getDownloadURL()
                .then((fireBaseUrl) => {
                  // console.log(fireBaseUrl);
                  this.setState({ [name]: fireBaseUrl });
                  this.saveStateToLocalStorage(name, fireBaseUrl);
                });
            }
          );
        });
      });
    };
  };

  async getFirestoreData() {
    let fireData = await this.retrieveData();
    let data_mrt = [];
    let data_cuisine = [];
    // let current = new Set();
    fireData.forEach(function (doc) {
      if (doc.exists) {
        var d = doc.data();
        data_cuisine.push(d);
      }
    });
    // fireData[0].forEach(function (doc) {
    //   if (doc.exists) {
    //     var d = doc.data();
    //     d.label = d.name;
    //     d.value = d.name;
    //     if (!current.has(d.name)) {
    //       data_mrt.push(d);
    //       current.add(d.name);
    //     }
    //   }
    // });

    // data_mrt = data_mrt.sort(function (a, b) {
    //   var x = a.name.toLowerCase();
    //   var y = b.name.toLowerCase();
    //   return x < y ? -1 : x > y ? 1 : 0;
    // });
    data_cuisine = data_cuisine.sort(function (a, b) {
      var x = a.label.toLowerCase();
      var y = b.label.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    this.setState({ data: data_mrt, cuisineOptions: data_cuisine });
    this.initialState["data"] = _.cloneDeep(data_mrt);
    this.initialState["cuisineOptions"] = _.cloneDeep(data_cuisine);
  }

  retrieveData = async () => {
    try {
      // const querySnapshot_mrt = await db.collection("mrt").get();
      const querySnapshot_cuisine = await db.collection("cuisine").get();
      return querySnapshot_cuisine;
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  getTags = async () => {
    try {
      const tags = await db
        .collection("tags")
        .get()
        .then(Helpers.mapSnapshotToDocs);
      this.setState({ tags: tags });
      this.initialState["tags"] = _.cloneDeep(tags);
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  handleMultiChange(option) {
    this.setState((state) => {
      this.saveStateToLocalStorage("delivery", option);
      return {
        delivery: option,
      };
    });
  }

  handleRegionChange(option) {
    this.setState((state) => {
      const newRegion = option ? option : [];
      this.saveStateToLocalStorage("region", newRegion);

      return {
        region: newRegion,
      };
    });
  }

  handleCuisineChange(option) {
    this.setState((state) => {
      const newCuisineValue = option ? option : [];
      this.saveStateToLocalStorage("cuisineValue", newCuisineValue);

      return {
        cuisineValue: newCuisineValue,
      };
    });
  }

  handleTagsChange(option) {
    const newTagsValue = option ? option : [];
    this.saveStateToLocalStorage("tagsValue", newTagsValue);

    this.setState((state) => {
      return {
        tagsValue: newTagsValue,
      };
    });
  }

  handleCreate = async (inputValue) => {
    const { tags, tagsValue } = this.state;
    var newOption = {
      label: inputValue,
      value: inputValue,
    };
    db.collection("tags")
      .add(newOption)
      .then(function (docRef) {
        return docRef.id;
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    var newTagsValue = tagsValue;
    newTagsValue.push(newOption);
    this.setState({ tags: [...tags, newOption], tagsValue: newTagsValue });
  };

  tagsSearch(context) {
    return (
      <Fragment>
        <CreatableSelect
          isClearable
          isMulti
          closeMenuOnSelect={false}
          name="name"
          options={this.state.tags}
          className="basic-multi-select"
          classNamePrefix="select"
          value={this.state.tagsValue}
          onChange={this.handleTagsChange}
          onCreateOption={this.handleCreate}
          placeholder={context.data.create.placeholdertags}
        />
      </Fragment>
    );
  }

  cuisineSearch(context) {
    return (
      <Fragment>
        <Select
          isMulti
          closeMenuOnSelect={false}
          name="name"
          options={this.state.cuisineOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={this.state.cuisineValue}
          onChange={this.handleCuisineChange}
          placeholder={context.data.create.placeholdercuisine}
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
              label: "Northeast",
              value: "northeast",
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
  //         placeholder="e.g. Woodlands, Bishan, Jurong East"
  //       />

  //     </Fragment>
  //   );
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

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  render({ apiReady, maps, map } = this.state) {
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Dialog
            open={this.state.dialogOpen}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Listing Successfully Created! "}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <h4 style={{ color: "green" }}>Success! </h4>
                <h5>
                  Your listing can be found here:{" "}
                  <a href={"/info?id=" + this.state.newId} target="blank">
                    www.foodleh.app/info?id={this.state.newId}
                  </a>
                </h5>
              </DialogContentText>
              {this.props.option === "website" ? (
                <DialogContentText id="alert-dialog-description">
                  <div style={{ wordWrap: "break-word" }}>
                    <h5>
                      Website created at{" "}
                      <a
                        href={
                          "https://" + this.state.website_name + ".foodleh.app"
                        }
                        target="blank"
                      >
                        https://{this.state.website_name}.foodleh.app
                      </a>
                    </h5>
                    <h5>
                      Edit website at:{" "}
                      <a
                        href={
                          "https://" +
                          this.state.website_name +
                          ".foodleh.app/dashboard"
                        }
                        target="blank"
                      >
                        https://{this.state.website_name}.foodleh.app/dashboard
                      </a>
                    </h5>
                  </div>
                </DialogContentText>
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <div class="row">
            <div class="col">
              <div
                class="card shadow"
                style={{ width: "100%", "margin-top": "10px" }}
              >
                <div class="card-body">
                  {
                    <LanguageContext.Consumer>
                      {(context) => (
                        <div>
                          <h5 class="card-title create-title create-title">
                            {context.data.create.uploadimages}{" "}
                          </h5>
                          <h6 class="card-subtitle mb-2 text-muted create-title">
                            {context.data.create.uploadimagedescription}
                          </h6>
                          <p class="card-text create-title">
                            <b>{context.data.create.uploadmenu}</b>
                          </p>
                        </div>
                      )}
                    </LanguageContext.Consumer>
                  }
                  <div class="row">
                    <div class="col-4">
                      <form
                        class="create-title"
                        onSubmit={this.handleFireBaseUpload}
                        style={{ display: "inline" }}
                      >
                        <div
                          class="custom-file"
                          onChange={(event) => this.handleImageAsFile(event)}
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
                          ) : this.state.imageFile1 ? (
                            <span
                              style={{
                                alignContent: "center",
                                position: "relative",
                                top: "25px",
                                left: "25px",
                              }}
                            >
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>
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
                          ) : this.state.imageFile2 ? (
                            <span
                              style={{
                                alignContent: "center",
                                position: "relative",
                                top: "25px",
                                left: "25px",
                              }}
                            >
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>
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
                          ) : this.state.imageFile3 ? (
                            <span
                              style={{
                                alignContent: "center",
                                position: "relative",
                                top: "25px",
                                left: "25px",
                              }}
                            >
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>
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
                          ) : this.state.imageFile4 ? (
                            <span
                              style={{
                                alignContent: "center",
                                position: "relative",
                                top: "25px",
                                left: "25px",
                              }}
                            >
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>
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
                          ) : this.state.imageFile5 ? (
                            <span
                              style={{
                                alignContent: "center",
                                position: "relative",
                                top: "25px",
                                left: "25px",
                              }}
                            >
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>
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
                          ) : this.state.imageFile6 ? (
                            <span
                              style={{
                                alignContent: "center",
                                position: "relative",
                                top: "25px",
                                left: "25px",
                              }}
                            >
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>
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
                  {
                    <LanguageContext.Consumer>
                      {(context) => (
                        <div>
                          <h5 class="card-title create-title">
                            {" "}
                            {context.data.create.preview}
                          </h5>
                          <p class="card-text create-title">
                            {context.data.create.previewdescription}{" "}
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
                            {context.data.create.notsatisfied}{" "}
                          </p>
                        </div>
                      )}
                    </LanguageContext.Consumer>
                  }
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-xs-4 col-md-6 col-lg-8">
              {
                <LanguageContext.Consumer>
                  {(context) => (
                    <div
                      class="card shadow"
                      style={{ width: "100%", "margin-top": "10px" }}
                    >
                      <form>
                        <div class="card-body">
                          <hr
                            style={{
                              color: "black",
                              backgroundColor: "black",
                              height: 3,
                            }}
                          />{" "}
                          <h5 class="card-title create-title">
                            {context.data.create.step1}
                          </h5>
                          <h6 class="card-subtitle mb-2 text-muted create-title">
                            {context.data.create.pleaseenter}{" "}
                          </h6>
                          <div class="form-group create-title">
                            <label for="name">
                              {context.data.create.stallname}
                            </label>
                            <div class="input-group">
                              <input
                                onChange={this.handleChange}
                                value={this.state.name}
                                type="text"
                                class="form-control"
                                name="name"
                                placeholder={
                                  context.data.create.placeholderstallname
                                }
                                required
                              ></input>
                            </div>
                          </div>
                          <div class="form-group create-title">
                            <label for="street">
                              {context.data.create.cuisinecategory}{" "}
                              <b>{context.data.create.selectmultiple}</b>
                            </label>
                            {this.cuisineSearch(context)}
                          </div>
                          <div class="form-group create-title">
                            <label for="unit">
                              {context.data.create.contactnumber}
                            </label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span
                                  class="input-group-text"
                                  id="basic-addon1"
                                >
                                  +65
                                </span>
                              </div>
                              <input
                                onChange={this.handleChange}
                                value={this.state.contact}
                                type="tel"
                                class="form-control"
                                name="contact"
                                placeholder="9xxxxxxx"
                                maxLength="8"
                                // minlength="8"
                                // pattern="[6-9]{1}[0-9]{7}"
                                required
                              ></input>
                            </div>
                          </div>
                          <div class="form-group create-title">
                            <label for="postalcode">
                              {context.data.create.postalcode}
                            </label>
                            <div class="input-group">
                              <input
                                onChange={this.handleChange.bind(this)}
                                value={this.state.postal}
                                type="text"
                                class="form-control"
                                name="postal"
                                placeholder={
                                  context.data.create.placeholderpostalcode
                                }
                                maxLength="6"
                                required
                              ></input>
                            </div>
                          </div>
                          <div class="form-group create-title">
                            <label for="street">
                              {context.data.create.streetname}
                              <b> {context.data.create.autofill}</b>
                            </label>
                            <input
                              onChange={this.handleChange}
                              value={this.state.street}
                              type="text"
                              class="form-control"
                              name="street"
                              placeholder={
                                context.data.create.placeholderstreetname
                              }
                            ></input>
                          </div>
                          <div class="form-group create-title">
                            <label for="unit">{context.data.create.unit}</label>
                            <input
                              onChange={this.handleChange}
                              value={this.state.unit}
                              type="text"
                              class="form-control"
                              name="unit"
                              placeholder={context.data.create.placeholderunit}
                            ></input>
                          </div>
                          <div class="form-group create-title">
                            <label for="description">
                              {context.data.create.briefdescription}{" "}
                              <b>{context.data.create.max45chars}</b>
                            </label>
                            <input
                              onChange={this.handleChange}
                              value={this.state.description}
                              type="text"
                              class="form-control"
                              name="description"
                              placeholder={
                                context.data.create.placeholderbriefdescription
                              }
                            ></input>
                          </div>
                          <div class="form-group create-title">
                            <label for="description">
                              {context.data.create.selfcollectordelivery}{" "}
                              <b>{context.data.create.important}</b>
                            </label>
                            <div class="form-check create-title">
                              <label class="checkbox-inline">
                                <input
                                  onChange={this.handleChange}
                                  type="checkbox"
                                  checked={this.state.pickup_option}
                                  value={this.state.pickup_option}
                                  name="pickup_option"
                                  class="form-check-input"
                                ></input>
                                {context.data.create.selfcollection}
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
                                {context.data.create.delivery}
                              </label>
                              <br />
                            </div>
                            {this.state.delivery_option === false ? null : (
                              <div>
                                <div class="card shadow">
                                  <div class="card-body">
                                    <h5 class="card-title create-title">
                                      {" "}
                                      {context.data.create.deliveryoptions}
                                    </h5>
                                    <div class=" form-group create-title">
                                      <label for="description">
                                        {context.data.create.whichregion}
                                      </label>
                                      {this.regionSearch()}
                                      {/* <div class="form-check create-title">
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
                        </div> */}
                                    </div>
                                    {/* <div class="form-group create-title ">
                            <label for="street">
                              Which nearest MRT do you deliver to? (Can select
                              multiple)
                            </label>
                            {this.deliverySearch()}
                          </div> */}
                                    <div class="form-group create-title ">
                                      <label for="price">
                                        {context.data.create.deliveryfees}
                                      </label>
                                      <div class="input-group">
                                        <input
                                          onChange={this.handleChange}
                                          value={this.state.price}
                                          type="text"
                                          class="form-control"
                                          name="price"
                                          placeholder={
                                            context.data.create.placeholderfees
                                          }
                                        ></input>
                                      </div>
                                    </div>
                                    <div class="form-group create-title">
                                      <label for="unit">
                                        {context.data.create.free_delivery}
                                      </label>
                                      <div class="input-group">
                                        <div class="input-group-prepend">
                                          <span
                                            class="input-group-text"
                                            id="basic-addon1"
                                          >
                                            $
                                          </span>
                                        </div>
                                        <input
                                          onChange={this.handleChange}
                                          value={this.state.free_delivery}
                                          type="number"
                                          class="form-control"
                                          name="free_delivery"
                                          placeholder="e.g. 20"
                                        ></input>
                                      </div>
                                    </div>
                                    <div class="form-group create-title">
                                      <label for="unit">
                                        {context.data.create.minumum_order}
                                      </label>
                                      <div class="input-group">
                                        <div class="input-group-prepend">
                                          <span
                                            class="input-group-text"
                                            id="basic-addon1"
                                          >
                                            $
                                          </span>
                                        </div>
                                        <input
                                          onChange={this.handleChange}
                                          value={this.state.minumum_order}
                                          type="number"
                                          class="form-control"
                                          name="minumum_order"
                                          placeholder="e.g. 20"
                                        ></input>
                                      </div>
                                    </div>

                                    <div class="form-group create-title">
                                      <label for="delivery_detail">
                                        {context.data.create.deliverydetails}{" "}
                                      </label>
                                      <textarea
                                        onChange={this.handleChange}
                                        value={this.state.delivery_detail}
                                        type="text"
                                        class="form-control"
                                        name="delivery_detail"
                                        placeholder={
                                          context.data.create
                                            .placeholderdeliverydetails
                                        }
                                        rows="3"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                                <br />
                              </div>
                            )}
                            <div class="create-title">
                              <Button
                                class="shadow-sm"
                                style={{
                                  backgroundColor: "blue",
                                  borderColor: "blue",
                                }}
                                onClick={this.handleMenu}
                                name="menu"
                              >
                                {context.data.create.additem}
                              </Button>
                              <br />
                            </div>
                            {this.state.menu ? (
                              <div>
                                <p>{this.handleMenuDisplay(context)} </p>
                                {/* Option to add additional menu items, display only if menu is already shown */}
                                <div class="create-title">
                                  <Button
                                    class="shadow-sm"
                                    style={{
                                      backgroundColor: "blue",
                                      borderColor: "blue",
                                    }}
                                    onClick={this.handleMenu}
                                    name="moreMenuItems"
                                  >
                                    {context.data.create.addmoreitem}
                                  </Button>
                                  <br />
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <hr
                            style={{
                              color: "black",
                              backgroundColor: "black",
                              height: 3,
                            }}
                          />{" "}
                          <h5 class="card-title create-title">
                            {context.data.create.step2}
                          </h5>
                          <div class="form-group create-title">
                            <label for="description_detail">
                              {context.data.create.additional}{" "}
                            </label>
                            <textarea
                              onChange={this.handleChange}
                              value={this.state.description_detail}
                              type="text"
                              class="form-control"
                              name="description_detail"
                              placeholder={
                                context.data.create.placeholderadditional
                              }
                              rows="3"
                            ></textarea>
                          </div>
                          <div class="form-group create-title">
                            <label for="street">
                              {context.data.create.tags}{" "}
                              <b>{context.data.create.entermultiple}</b>
                            </label>
                            {this.tagsSearch(context)}
                          </div>
                          <div class="form-group create-title">
                            <label for="website">
                              {context.data.create.generalpromo}{" "}
                            </label>
                            <div class="form-row">
                              <div class="col-5">
                                <small>
                                  {context.data.create.discount}{" "}
                                  <b>{context.data.create.eightchars}</b>
                                </small>
                                <input
                                  onChange={this.handleChange}
                                  value={this.state.promo}
                                  name="promo"
                                  type="text"
                                  class="form-control"
                                  placeholder={
                                    context.data.create.placeholderdiscount
                                  }
                                  maxlength="8"
                                />
                              </div>
                              <div class="col-7">
                                <small>{context.data.create.condition}</small>
                                <input
                                  onChange={this.handleChange}
                                  value={this.state.condition}
                                  name="condition"
                                  type="text"
                                  class="form-control"
                                  placeholder={
                                    context.data.create.placeholdercondition
                                  }
                                  maxlength="40"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="form-group create-title">
                            <label for="website">
                              {context.data.create.website}
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
                            <label for="description">
                              {context.data.create.hours}
                            </label>
                            <textarea
                              onChange={this.handleChange}
                              value={this.state.opening}
                              type="text"
                              class="form-control"
                              name="opening"
                              placeholder={context.data.create.placeholderhours}
                              rows="3"
                            ></textarea>
                          </div>
                          <br />
                          <div class="form-group create-title">
                            <label for="unit">WeChat ID(微信号): </label>
                            <div class="input-group">
                              <input
                                onChange={this.handleChange}
                                value={this.state.wechatid}
                                type="text"
                                class="form-control"
                                name="wechatid"
                                placeholder="e.g. abc123"
                              ></input>
                            </div>
                          </div>
                          <div class="form-group create-title">
                            <label for="unit">
                              {context.data.create.contact}
                            </label>
                            <div class="form-check create-title">
                              <label class="checkbox-inline">
                                <input
                                  onChange={this.handleChange}
                                  type="checkbox"
                                  checked={this.state.call}
                                  value={this.state.call}
                                  name="call"
                                  class="form-check-input"
                                ></input>
                                {context.data.create.call}
                              </label>
                              <br />
                              <label class="checkbox-inline">
                                <input
                                  onChange={this.handleChange}
                                  type="checkbox"
                                  checked={this.state.whatsapp}
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
                                  checked={this.state.sms}
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
                                  checked={this.state.inperson}
                                  value={this.state.inperson}
                                  name="inperson"
                                  class="form-check-input"
                                ></input>
                                {context.data.create.inperson}
                              </label>
                              <br />
                            </div>
                          </div>
                          <hr
                            style={{
                              color: "black",
                              backgroundColor: "black",
                              height: 3,
                            }}
                          />{" "}
                          {this.props.option === "website" ? (
                            <React.Fragment>
                              <h5 class="card-title create-title">
                                Step 3: Create website (required)
                              </h5>
                              <div class="form-group create-title">
                                <div>
                                  <label for="website">
                                    What your website can look like:{" "}
                                    <a
                                      target="blank"
                                      href="https://shidefu.foodleh.app"
                                    >
                                      shidefu.foodleh.app
                                    </a>
                                  </label>
                                </div>
                              </div>
                              <div class="form-group create-title">
                                <div>
                                  <label for="website">
                                    Choose your website link name
                                  </label>
                                </div>
                                <div>
                                  <TextField
                                    label="Name"
                                    name="website_name"
                                    placeholder="e.g. huathuat"
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          .foodleh.app
                                        </InputAdornment>
                                      ),
                                    }}
                                    value={this.state.website_name}
                                    onChange={this.handleChange}
                                  />
                                  <Button
                                    onClick={this.checkAvailable}
                                    variant="contained"
                                    color={"primary"}
                                    style={{
                                      backgroundColor: "#b48300",
                                      borderColor: "#b48300",
                                      color: "white",
                                      margin: "10px",
                                    }}
                                  >
                                    Check Availability
                                  </Button>
                                  {this.state.invalid ? (
                                    <div style={{ color: "red" }}>
                                      Must not be empty, contain spaces, or
                                      contain punctuation.
                                    </div>
                                  ) : null}
                                  {this.state.available !== null ? (
                                    <div>
                                      {this.state.available ? (
                                        <div style={{ color: "green" }}>
                                          {this.state.website_name}.foodleh.app
                                          is <b>Available</b>
                                        </div>
                                      ) : (
                                        <div style={{ color: "red" }}>
                                          {this.state.website_name}.foodleh.app
                                          is <b>Not Available</b>
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div class="form-group create-title">
                                <label>
                                  Create your account to modify your website
                                </label>
                                {this.state.firebaseUser ? (
                                  <div style={{ color: "green" }}>
                                    <p>
                                      <b>
                                        Verified: <br />
                                        {this.state.firebaseUser.displayName}
                                        <br />
                                        {this.state.firebaseUser.email}
                                        <br />
                                        <Button
                                          variant="contained"
                                          onClick={() => {
                                            firebase.auth().signOut();
                                            this.setState({
                                              firebaseUser: null,
                                            });
                                          }}
                                          style={{
                                            backgroundColor: "grey",
                                            borderColor: "grey",
                                            color: "white",
                                            margin: "10px",
                                          }}
                                        >
                                          Sign-out
                                        </Button>
                                      </b>
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    {!this.state.login && (
                                      <div>
                                        <Button
                                          color="primary"
                                          variant="contained"
                                          onClick={() =>
                                            this.setState({ login: true })
                                          }
                                          style={{
                                            backgroundColor: "#b48300",
                                            borderColor: "#b48300",
                                            color: "white",
                                            margin: "10px",
                                          }}
                                        >
                                          Create Account/ Login
                                        </Button>
                                      </div>
                                    )}
                                    {this.state.login && (
                                      <StyledFirebaseAuth
                                        uiConfig={uiConfigPage}
                                        firebaseAuth={firebase.auth()}
                                      />
                                    )}
                                    <br />
                                  </div>
                                )}
                              </div>
                            </React.Fragment>
                          ) : null}
                          <div
                            class="card shadow d-block d-md-none"
                            style={{ width: "100%", "margin-top": "10px" }}
                          >
                            <div class="card-body">
                              <h5 class="card-title create-title">
                                {" "}
                                {context.data.create.preview}
                              </h5>
                              <p class="card-text create-title">
                                {context.data.create.previewdescription}{" "}
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
                                {context.data.create.notsatisfied}{" "}
                              </p>
                            </div>
                          </div>
                          <br />
                          <div class="create-title">
                            {this.props.toggle === "edit" ? (
                              <span>
                                <b>
                                  To protect our owners, edits will be manually
                                  reviewed and implemented within 24 hours.
                                </b>
                                <br />
                              </span>
                            ) : null}
                            <div>
                              By listing via this platform, you agree to our{" "}
                              <a href="https://foodleh.app/privacy">
                                Privacy Policy
                              </a>
                            </div>
                            <br />
                            <Button
                              class="shadow-sm"
                              style={{
                                backgroundColor: "#b48300",
                                borderColor: "#b48300",
                              }}
                              type="Submit"
                              // onClick={this.handleSubmit}
                              disabled={this.state.isLoading}
                            >
                              {this.state.isLoading ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              ) : (
                                context.data.create.submit
                              )}
                            </Button>
                            <Button
                              class="shadow-sm"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#b48300",
                                color: "#b48300",
                                marginLeft: "10px",
                              }}
                              onClick={this.handleClear}
                              disabled={this.state.isLoading}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </LanguageContext.Consumer>
              }
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default withRouter(ListForm);
