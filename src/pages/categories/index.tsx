import React from 'react';
import { Page, Toolbar, List, ListItem } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getCategories } from '@api';
import Loading from '@components/Loading';

const CategoryIndexPage = () => {
  const { data: categories, status, error } = useQuery('categoriesTitle', getCategories());

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} optionName="Category" />
      {status === 'loading' && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {status === 'error' && <div>{error}</div>}
      <List id="category-list">
        {categories &&
          categories?.map(
            (category) =>
              category.movies.length > 0 && (
                <ListItem key={category.id} title={category.title} link={`/categories/${category.id}`} />
              ),
          )}
      </List>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={1} />
      </Toolbar>
    </Page>
  );
};

export default CategoryIndexPage;
