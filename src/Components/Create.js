import React, { Fragment } from "react";
import "../App.css";
import { db, storage } from "./Firestore";
import { Typeahead } from "react-bootstrap-typeahead";
import { InputGroup, Button, Form } from "react-bootstrap";
import logo from "../mrt_logo.png";
import Select from "react-select";
import Item from "./Item";
import placeholder from "../placeholder.png";
import Component from "../Components";
import { withRouter } from "react-router-dom";



// const API_KEY = `${process.env.REACT_APP_GKEY}`

import firebase from "./Firestore";

const analytics = firebase.analytics();

function onLoad(name){
  analytics.logEvent(name)
}

export class Create extends React.Component {
  componentWillMount(){
    onLoad("create_load")
  }
  render() {
    return (
      <div>
        {" "}
        <div
        class="jumbotron"
        style={{
          "padding-top": "70px",
          "padding-bottom": "240px",
          height: "100%",
          "background-color": "white",
        }}
      >

        <h3>Create Listing</h3>
        <Component.ListForm toggle={"create"} />
        </div>
      </div>
    );
  }
}

export default withRouter(Create);
