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

// const addData = async ({
//   url,
//   image2,
//   image3,
//   image4,
//   image5,
//   image6,
//   name,
//   cuisine,
//   postal,
//   street,
//   unit,
//   description,
//   description_detail,
//   region,
//   islandwide,
//   price,
//   contact,
//   latitude,
//   longitude,
//   call,
//   whatsapp,
//   sms,
//   inperson,
//   opening,
//   pickup_option,
//   delivery_option,
//   website,
//   promo,
//   condition,
//   docid,
//   delivery_detail,
//   menu,
//   menuitem,
//   menuprice
// }) => {
//   let now = new Date();
//   let id = await db
//     .collection("hawkers")
//     .doc(docid)
//     .update({
//       name: name,
//       postal: postal,
//       street: street,
//       description: description,
//       description_detail: description_detail,
//       url: url,
//       image2: image2,
//       image3: image3,
//       image4: image4,
//       image5: image5,
//       image6: image6,
//       latitude: latitude,
//       longitude: longitude,
//       unit: unit,
//       cuisine: cuisine,
//       region: region,
//       price: price,
//       contact: contact,
//       call: call,
//       whatsapp: whatsapp,
//       sms: sms,
//       inperson: inperson,
//       lastmodified: now,
//       opening: opening,
//       delivery_option: delivery_option,
//       pickup_option: pickup_option,
//       website: website,
//       promo: promo,
//       condition: condition,
//       delivery_detail: delivery_detail,
//       menu: menu,
//       menuitem: menuitem,
//       menuprice: menuprice
//     })
//     .then(function (d) {
//       //   console.log(docRef.id);
//       //   return docRef.id;
//     })
//     .catch(function (error) {
//       console.error("Error adding document: ", error);
//       // alert("Failed")
//     });
//   return id;
// };

export class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // name: this.props.data.name,
      // postal: this.props.data.postal,
      // street: this.props.data.street,
      // price: this.props.data.price,
      // description: this.props.data.description,
      // description_detail: this.props.data.description_detail,
      // image1: this.props.data.url,
      // image2: this.props.data.image2,
      // image3: this.props.data.image3,
      // image4: this.props.data.image4,
      // image5: this.props.data.image5,
      // image6: this.props.data.image6,
      // imageFile1: this.props.data.imageFile1,
      // imageFile2: this.props.data.imageFile2,
      // imageFile3: this.props.data.imageFile3,
      // imageFile4: this.props.data.imageFile4,
      // imageFile5: this.props.data.imageFile5,
      // imageFile6: this.props.data.imageFile6,
      // imageName: "Upload Image",
      // longitude: this.props.data.longitude,
      // latitude: this.props.data.latitude,
      // unit: this.props.data.unit,
      // delivery_option: this.props.data.delivery_option,
      // pickup_option: this.props.data.pickup_option,
      // cuisineValue: this.props.data.cuisine,
      // call: this.props.data.call,
      // whatsapp: this.props.data.whatsapp,
      // sms: this.props.data.sms,
      // inperson: this.props.data.inperson,
      // contact: this.props.data.contact,
      // docid: this.props.data.docid,
      // opening: this.props.data.opening,
      // region: this.props.data.region,
      // website: this.props.data.website,
      // promo: this.props.data.promo,
      // condition: this.props.data.condition,
      show: false,
      setShow: false,
      // delivery_detail: this.props.data.delivery_detail,
      // menu: this.props.data.menu,
      // menuitem: this.props.data.menuitem,
      // menuprice: this.props.data.menuprice,
    };
    // this.handleRegionChange = this.handleRegionChange.bind(this);
    // this.handleMultiChange = this.handleMultiChange.bind(this);
    // this.handleCuisineChange = this.handleCuisineChange.bind(this);
  }

  setShow = () => {
    this.setState({ show: true });
  };

  setHide = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div>
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
            <Component.ListForm
              toggle="edit"
              id={this.props.id}
              data={this.props.data}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Popup);
