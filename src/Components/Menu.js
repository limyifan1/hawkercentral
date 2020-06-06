// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../foodleh.png";
import name from "../logo-header-nologo.png";
import firebase from "./Firestore";
import Cookies from "universal-cookie";
import { Button } from "react-bootstrap";
import en from "../assets/translations/en.json";
import zh from "../assets/translations/zh.json";
import { LanguageContext } from "./themeContext";

const cookies = new Cookies();
const analytics = firebase.analytics();

function onClick(button) {
  analytics.logEvent(button);
}

export class Menu extends React.Component {
  constructor(props) {
    super(props);

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      language: cookies.get("language"),
      toggleLanguage: this.toggleLanguage,
      data: cookies.get("language") === "en" ? en : zh,
    };
  }

  render() {
    return (
      <Navbar
        bg="light"
        variant="light"
        style={{ position: "fixed", width: "100%", zIndex: "100" }}
      >
        <Navbar.Brand as={Link} to="/" style={{ color: "#B48300" }}>
          <img
            alt=""
            src={logo}
            width="20"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          <div className="d-none d-md-inline-block">
            <img
              alt=""
              src={name}
              width="140"
              height="30"
              className="d-inline-block align-top"
            />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <LanguageContext.Consumer>
            {({ data, language, toggleLanguage }) => (
              <Button
                className="shadow-sm"
                style={{
                  backgroundColor: "#B48300",
                  borderColor: "#B48300",
                  fontSize: "10px",
                  width: "50px"
                }}
                onClick={toggleLanguage}
                name="Language"
              >
                {data.menu.language_button}
              </Button>
            )}
          </LanguageContext.Consumer>
          <div className="d-none d-md-inline-block">
            <Nav.Link
              href="#"
              as={Link}
              to="/"
              id="menu-link"
              style={{ color: "grey" }}
              onClick={onClick("home")}
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
            style={{ color: "grey" }}
            onClick={onClick("search")}
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
            style={{ color: "grey" }}
            onClick={onClick("create")}
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
            style={{ color: "grey" }}
            onClick={onClick("about")}
          >
            <LanguageContext.Consumer>
              {({ data }) => data.menu.aboutlabel}
            </LanguageContext.Consumer>
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Menu;
