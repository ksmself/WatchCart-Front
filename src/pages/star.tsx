import React from 'react';
import { Page, Navbar, NavTitle, BlockTitle, List, ListItem } from 'framework7-react';

const StarPage = ({ f7route }) => {
  return (
    <Page name="starpage">
      <Navbar>
        <NavTitle>Star 페이지</NavTitle>
      </Navbar>
      <div className="py-10">This is StarPage</div>
    </Page>
  );
};

export default StarPage;
