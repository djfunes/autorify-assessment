import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="../">
       Survival Nexus App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="../survivor-list">
            Survival List
          </Nav.Link>
          <Nav.Link as={Link} to="../new-survivor">
            New Survivor
          </Nav.Link>
          <Nav.Link as={Link} to="../item-list">
            Item List
          </Nav.Link>
          <Nav.Link as={Link} to="../new-item">
            New Item
          </Nav.Link>
          <Nav.Link as={Link} to="../reports">
            Reports
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;