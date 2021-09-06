import React from 'react';
import { Page, Navbar, NavTitle, BlockTitle, List, ListItem } from 'framework7-react';

const CategoryIndexPage = ({ f7route }) => {
  return (
    <Page name="categorypage">
      <Navbar>
        <NavTitle>Category 페이지</NavTitle>
      </Navbar>
      <div className="py-10">This is CategoryPage</div>
    </Page>
  );
};

export default CategoryIndexPage;
