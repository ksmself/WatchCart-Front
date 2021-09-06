import React from 'react';
import { Page, Toolbar } from 'framework7-react';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';

const StarPage = () => (
  <Page className="theme-dark">
    <TopNavBar backLink={true} />
    <div className="py-10">This is StarPage</div>
    <Toolbar tabbar labels position="bottom">
      <BottomToolBarContent currentIdx={2} />
    </Toolbar>
  </Page>
);

export default StarPage;
