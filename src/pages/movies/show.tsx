import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
// import { PageRouteProps } from '@constants';
import { Page, Toolbar } from 'framework7-react';
import React from 'react';

const MovieShowPage = () => (
  <Page className="theme-dark">
    <TopNavBar backLink={true} />
    <Toolbar tabbar labels position="bottom">
      <BottomToolBarContent />
    </Toolbar>
  </Page>
);

export default MovieShowPage;
