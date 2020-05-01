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
  analytics.logEvent(button)
}

export class Menu extends React.Component {
  constructor(props) {
    super(props);

    // this.toggleLanguage = () => {
    //   console.log("toggleLanguage")
    //   console.log(this.state.language)
    //   if (this.state.language === "en") {
    //     cookies.set("language", "zh", { path: '/' });
    //     // update data for itself and state so other components know as well
    //     this.setState({ 
    //       data: zh,
    //       language: "zh",
    //       toggleLanguage: this.toggleLanguage,
    //     });
    //   } else {
    //     cookies.set("language", "en", { path: '/' });
    //     // update data for itself and state so other components know as well
    //     this.setState({ 
    //       data: en,
    //       language: "en",
    //       toggleLanguage: this.toggleLanguage,
    //     });
    //   }
    // };

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      language: cookies.get('language'), // TODO: check why this is hardcoded
      toggleLanguage: this.toggleLanguage,
      data: (cookies.get('language') === 'en') ? en : zh,
    };
  }
  // Set text to language saved in cookie


  // handleLanguageFlag = () => {
  //   // When user clicks on Language button, check cookie and swop language
  //   console.log("language button clicked")
  //   if (cookies.get('language') === 'en') {
  //     cookies.set("language", 'zh', { path: '/' });
  //     this.setState({ data: zh });
  //   } else {
  //     (cookies.set("language", 'en', { path: '/' }));
  //     this.setState({ data: en });
  //   }
  // }


  render() {
    return (
      <Navbar
        bg="light"
        variant="light"
        style={{ position: "fixed", width: "100%", zIndex: "9999" }}
      >
        <Navbar.Brand as={Link} to="/" style={{ color: "#B48300" }}>
          <img
            alt=""
            src={logo}
            width="20"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          <div class="d-none d-md-inline-block">
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
            {({ language, toggleLanguage }) => (
              <Button
                class="shadow-sm"
                style={{
                  backgroundColor: "blue",
                  borderColor: "blue",
                }}
                onClick={toggleLanguage}
                name="Language"
              >
                {language}

              </Button>
            )}
          </LanguageContext.Consumer>
          <Nav.Link href="#" as={Link} to="/" id="menu-link" style={{ "color": "grey" }} onClick={onClick("home")}>
            <LanguageContext.Consumer>
              {({ data }) => (
                 data.homelabel
              )}
            </LanguageContext.Consumer>
          </Nav.Link>
          {/* <Nav.Link href="#listing" as={Link} to="/listing" id="menu-link" style={{"color":"grey"}}>
            Listings
          </Nav.Link> */}
          <Nav.Link href="#searchall" as={Link} to="/searchall" id="menu-link" style={{ "color": "grey" }} onClick={onClick("search")}>
          <LanguageContext.Consumer>
              {({ data }) => (
                 data.searchlabel
              )}
            </LanguageContext.Consumer>
          </Nav.Link>
          <Nav.Link href="#create" as={Link} to="/create" id="menu-link" style={{ "color": "grey" }} onClick={onClick("create")}>
          <LanguageContext.Consumer>
              {({ data }) => (
                 data.createlabel
              )}
            </LanguageContext.Consumer>
          </Nav.Link>

          <Nav.Link href="#about" as={Link} to="/about" id="menu-link" style={{ "color": "grey" }} onClick={onClick("about")}>
          <LanguageContext.Consumer>
              {({ data }) => (
                 data.aboutlabel
              )}
            </LanguageContext.Consumer>
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
      // <Navbar
      //   bg="light"
      //   variant="light"
      //   style={{ position: "fixed", width: "100%", zIndex: "9999" }}
      // >
      // <Navbar.Brand as={Link} to="/" style={{ color: "#B48300" }}>
      //   <img
      //     alt=""
      //     src={logo}
      //     width="20"
      //     height="30"
      //     className="d-inline-block align-top"
      //   />{' '}
      //    Foodleh
      //  </Navbar.Brand>
      //   <Navbar.Toggle />
      //   <Navbar.Collapse id="basic-navbar-nav justify-content-end">
      //     <Nav className="mr-auto">
      // <Nav.Link href="#" as={Link} to="/">
      //   Home
      // </Nav.Link>
      // <Nav.Link href="#listing" as={Link} to="/listing">
      //   Listings
      // </Nav.Link>
      // <Nav.Link href="#create" as={Link} to="/create">
      //   Create
      // </Nav.Link>
      //     </Nav>
      //    </Navbar.Collapse>
      // </Navbar>
    );
  }
}

export default Menu;
