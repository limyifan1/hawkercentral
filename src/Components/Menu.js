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


const cookies = new Cookies();
const analytics = firebase.analytics();

function onClick(button) {
  analytics.logEvent(button)
}

export class Menu extends React.Component {
  // Set text to language saved in cookie
  state = {
    data: (cookies.get('language') === 'en') ? en : zh,
  }

  handleLanguageFlag = () => {
    // When user clicks on Language button, check cookie and swop language
    console.log("language button clicked")
    if (cookies.get('language') === 'en') {
      cookies.set("language", 'zh', { path: '/' }); 
      this.setState({ data: zh });
    } else {
      (cookies.set("language", 'en', { path: '/' }));
      this.setState({ data: en });
    }
  }
      

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
          <Button
            class="shadow-sm"
            style={{
              backgroundColor: "blue",
              borderColor: "blue",
            }}
            onClick={this.handleLanguageFlag}
            name="Language"
          >
            Language
                      </Button>
          <Nav.Link href="#" as={Link} to="/" id="menu-link" style={{ "color": "grey" }} onClick={onClick("home")}>
            {this.state.data.homelabel}
          </Nav.Link>
          {/* <Nav.Link href="#listing" as={Link} to="/listing" id="menu-link" style={{"color":"grey"}}>
            Listings
          </Nav.Link> */}
          <Nav.Link href="#searchall" as={Link} to="/searchall" id="menu-link" style={{ "color": "grey" }} onClick={onClick("search")}>
          {this.state.data.searchlabel}
          </Nav.Link>
          <Nav.Link href="#create" as={Link} to="/create" id="menu-link" style={{ "color": "grey" }} onClick={onClick("create")}>
          {this.state.data.createlabel}
          </Nav.Link>

          <Nav.Link href="#about" as={Link} to="/about" id="menu-link" style={{ "color": "grey" }} onClick={onClick("about")}>
          {this.state.data.aboutlabel}
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
