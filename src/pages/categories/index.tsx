import React from 'react';
import { Page, Toolbar } from 'framework7-react';
import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';

const CategoryIndexPage = () => (
  <Page className="theme-dark">
    <TopNavBar backLink={true} />
    <div className="py-10">This is CategoryPage</div>
    <Toolbar tabbar labels position="bottom">
      <BottomToolBarContent currentIdx={1} />
    </Toolbar>
  </Page>
);

export default CategoryIndexPage;
