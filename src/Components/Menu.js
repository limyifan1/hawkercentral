// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../foodleh.png";
import name from "../logo-header-nologo.png";

// const analytics = firebase.analytics();

function onClick(button){
  // analytics.logEvent(button)
}

export class Menu extends React.Component {
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
          <Nav.Link href="#" as={Link} to="/" id="menu-link" style={{"color":"grey"}} onClick={onClick("home")}>
            Home
          </Nav.Link>
          {/* <Nav.Link href="#listing" as={Link} to="/listing" id="menu-link" style={{"color":"grey"}}>
            Listings
          </Nav.Link> */}
          <Nav.Link href="#searchall" as={Link} to="/searchall" id="menu-link" style={{"color":"grey"}} onClick={onClick("search")}>
            Search
          </Nav.Link>
          <Nav.Link href="#create" as={Link} to="/create" id="menu-link" style={{"color":"grey"}} onClick={onClick("create")}>
            Create
          </Nav.Link>

          <Nav.Link href="#about" as={Link} to="/about" id="menu-link" style={{"color":"grey"}} onClick={onClick("about")}>
            About
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
