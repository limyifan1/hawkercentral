import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import logo from "../foodleh.png";
import name from "../logo-brown.png";


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
            width="15"
            height="25"
            className="d-inline-block align-top"
          />{" "}
          <img
            alt=""
            src={name}
            width="80"
            height="25"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav.Link href="#" as={Link} to="/" id="menu-link" style={{"color":"grey"}}>
            Home
          </Nav.Link>
          <Nav.Link href="#listing" as={Link} to="/listing" id="menu-link" style={{"color":"grey"}}>
            Listings
          </Nav.Link>
          <Nav.Link href="#create" as={Link} to="/create" id="menu-link" style={{"color":"grey"}}>
            Create
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
