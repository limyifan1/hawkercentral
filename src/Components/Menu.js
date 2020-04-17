import React from 'react';
import { Link} from 'react-router-dom';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

export class Menu extends React.Component {
    render() {
      return (
        <Navbar bg="light" expand="lg" variant="light" style={{position:"fixed",width:"100%","zIndex":"9999"}}>
          <Navbar.Brand as={Link} to="/" style={{"color":"#B22222"}}>HawkerCentral</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/listing">Listings</Nav.Link>
              <Nav.Link as={Link} to="/create">Create</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {/* <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-success">Search</Button>
            </Form> */}
          </Navbar.Collapse>
        </Navbar>
      );
    }
  }

  export default Menu