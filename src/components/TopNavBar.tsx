import React from 'react';
import { Navbar, NavLeft, Link, NavTitle, NavRight } from 'framework7-react';

const TopNavBar = () => (
  <Navbar className="theme-dark">
    <NavLeft>
      <Link iconF7="cart" />
    </NavLeft>
    <NavTitle className="title">WatchCart</NavTitle>
    <NavRight>
      <Link iconF7="search" />
    </NavRight>
  </Navbar>
);

export default TopNavBar;
