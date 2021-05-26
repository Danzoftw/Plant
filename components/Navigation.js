import React, {useState, Component, Fragment} from 'react';
import Link from 'next/link'
import { Navbar,Nav,NavDropdown,Form,FormControl,Button} from 'react-bootstrap';

import  logo from '../images/plantisserie-black.png';
import search from '../images/search.svg';
import cart from '../images/cart.svg';
import like from '../images/like.svg';

const Navigation = () => {
  return (
       <div>
        <div className="covid-msg theme bg-covid-color">
            <p className="py-3 mb-0 text-center theme color-white font-weight-normal font-hk small-font">Check out our current COVID - 19 policies regarding deliveries</p>
        </div>
      
<Navbar expand="lg" className="px-3 px-sm-2 px-xl-5 header-brand">
    <Nav.Link href="/" className="navbar-brand font-weight-600 big-font">plantisserie</Nav.Link>
    <Navbar>
        <Nav.Link href="/" className="d-flex">
            <img
                src={logo}
                className="d-inline-block"
            />
        </Nav.Link>
    </Navbar>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
        <Nav className="header-nav">
        <Nav.Link href="/home" className="px-0 px-sm-2 text-decoration-none medium-font">Store</Nav.Link>
        <Nav.Link href="/" className="px-0 px-sm-2 text-decoration-none medium-font">Gardenia</Nav.Link>
        <Nav.Link href="/" className="px-0 px-sm-2 text-decoration-none medium-font">About Us</Nav.Link>
        <Nav.Link href="/" className="px-0 px-sm-2 text-decoration-none medium-font">Green Thumb</Nav.Link>
        </Nav>
        <Nav className="header-nav header-nav-2">
        <div className="d-flex align-items-center">
            <p className="px-0 px-sm-2 mb-0 theme color-color-1 font-weight-600 medium-font">hello@plantisserie.in</p>
        </div>
        <img
            src=""
            className="px-0 px-sm-2"
        />
        <img
            src=""
            className="px-0 px-sm-2"
        />
        <img
            src=""
            className="px-0 px-sm-2"
        />
        <div className="logreg px-0 px-sm-3 d-flex align-items-center">
            <Nav.Link href="/" className="text-decoration-none login small-font theme color-color-2">login</Nav.Link><span className="px-0 px-sm-1 mb-1">|</span>
            <Nav.Link href="/" className="text-decoration-none register small-font theme color-color-1">register</Nav.Link>
        </div>
        <div className="create-gift py-sm-3 px-sm-4 theme bg-sm-color-2 cursor-pointer">
            <p className="mb-0 theme color-white very-small-font">CREATE YOUR GIFT</p>
        </div>
        </Nav>
    </Navbar.Collapse>
</Navbar>
       </div>
  );
}

export default Navigation;
