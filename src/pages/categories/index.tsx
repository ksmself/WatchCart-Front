import React from 'react';
import { Page, Toolbar, List, ListItem, BlockTitle } from 'framework7-react';
import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { useQuery } from 'react-query';
import { getCategories } from '@api';

const CategoryIndexPage = () => {
  const { data: categories, status, error } = useQuery('categories', getCategories());

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} optionName="Category" />
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>{error}</div>}
      <List id="category-list">
        {categories &&
          categories.map((category) => (
            <ListItem key={category.id} title={category.title} link={`/categories/${category.id}`} />
          ))}
      </List>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={1} />
      </Toolbar>
    </Page>
  );
};

export default CategoryIndexPage;
