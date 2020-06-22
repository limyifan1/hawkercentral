// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "../App.css";
import "react-multi-carousel/lib/styles.css";
// import queryString from "query-string";
import {
  Button,
  Spinner,
} from "react-bootstrap";
import { db } from "./Firestore";
import { withRouter } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LanguageContext } from "./themeContext";
import Info from "./Info";
import logo from "../foodleh.png";

const InfoMenu = (props) => {
  const menu_color = props && props.css ? props.css.menu_color : null;
  const menu_font_color = props && props.css ? props.css.menu_font_color : null;
  return (
    <Navbar
      //   bg="light"
      variant="dark"
      style={{
        position: "fixed",
        width: "100%",
        zIndex: "9999",
        backgroundColor: menu_color,
      }}
    >
      <Navbar.Brand as={Link} to="/" style={{ color: "white" }}>
        <img
          alt=""
          src={logo}
          width="20"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        <div class="d-none d-md-inline-block">
          {/* <img
            alt=""
            src={name}
            width="140"
            height="30"
            className="d-inline-block align-top"
          /> */}
          {props.name}
        </div>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <LanguageContext.Consumer>
          {({ data, language, toggleLanguage }) => (
            <Button
              class="shadow-sm"
              style={{
                backgroundColor: "#B48300",
                borderColor: "#B48300",
                fontSize: "10px",
                width: "50px",
              }}
              onClick={toggleLanguage}
              name="Language"
            >
              {data.menu.language_button}
            </Button>
          )}
        </LanguageContext.Consumer>
        <div class="d-none d-md-inline-block">
          <Nav.Link
            href="#"
            as={Link}
            to="/"
            id="menu-link"
            style={{ color: menu_font_color }}
            // onClick={onClick("home")}
          >
            <LanguageContext.Consumer>
              {({ data }) => data.menu.homelabel}
            </LanguageContext.Consumer>
          </Nav.Link>
        </div>

        {/* <Nav.Link href="#listing" as={Link} to="/listing" id="menu-link" style={{"color":"grey"}}>
            Listings
          </Nav.Link> */}
        <Nav.Link
          href="#searchall"
          as={Link}
          to="/searchall"
          id="menu-link"
          style={{ color: menu_font_color }}
          //   onClick={onClick("search")}
        >
          <LanguageContext.Consumer>
            {({ data }) => data.menu.searchlabel}
          </LanguageContext.Consumer>
        </Nav.Link>
        <Nav.Link
          href="#create"
          as={Link}
          to="/create"
          id="menu-link"
          style={{ color: menu_font_color }}
          //   onClick={onClick("create")}
        >
          <LanguageContext.Consumer>
            {({ data }) => data.menu.createlabel}
          </LanguageContext.Consumer>
        </Nav.Link>

        <Nav.Link
          href="#about"
          as={Link}
          to="/about"
          id="menu-link"
          style={{ color: menu_font_color }}
          //   onClick={onClick("about")}
        >
          <LanguageContext.Consumer>
            {({ data }) => data.menu.aboutlabel}
          </LanguageContext.Consumer>
        </Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export class PageAbout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      orderData: [],
      totalPrice: 0.0,
      wantToOrder: false,
      name: "",
      unit: "",
      street: "",
      postal: "",
      notes: "",
      customerNumber: "",
      deliveryTime: "",
      id: "",
      galleryOpened: false,
      retrieved: false,
      activePhoto: 1,
      hasReviewEditMessage: false,
      hasReviewDeleteMessage: false,
      shouldRememberDetails: false,
      css: { menu_color: "", menu_font_color: "" },
    };
  }

  componentWillMount() {
    this.getDoc();
  }

  getDoc = async () => {
    await db
      .collection("pages")
      .doc(this.props.pageName)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // After querying db for data, initialize orderData if menu info is available
          this.setState({...snapshot.data(), retrieved: true });
          console.log(this.state);
        }
        //   onLoad("info_load", snapshot.data().name);
        return true;
      })
      .catch((error) => {
        window.location.reload(true);
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        {this.state.retrieved ? (
          <div>
            {InfoMenu(this.state)}
            <Info className="" hero={true} id={this.state.docid}/>
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

export default withRouter(PageAbout);
