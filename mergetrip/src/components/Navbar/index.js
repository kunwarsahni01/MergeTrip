import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavBtn,
  NavBtnLink
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <NavLink to='/'>
          MERGETRIP
        </NavLink>
        <Bars />
        <NavBtn>
          <NavBtnLink to='/account'>Sign Up</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
