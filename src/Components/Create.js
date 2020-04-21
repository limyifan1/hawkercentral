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

export class Create extends React.Component {
  render() {
    return <div><Component.ListForm toggle={"create"}/></div>;
  }
}

export default withRouter(Create);
