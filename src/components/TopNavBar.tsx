import React from 'react';
import { Navbar, NavLeft, Link, NavTitle, NavRight } from 'framework7-react';

const TopNavBar = ({ backLink }) => (
  <Navbar className="theme-dark">
    {!backLink && (
      <>
        <NavLeft>
          <Link iconF7="cart" />
        </NavLeft>
        <NavTitle className="title">WatchCart</NavTitle>
        <NavRight>
          <Link iconF7="search" />
        </NavRight>
      </>
    )}
    {backLink && <NavLeft backLink="Back" />}
  </Navbar>
);

export default TopNavBar;
