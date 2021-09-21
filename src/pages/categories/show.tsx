import React from 'react';
import { Page, Toolbar, BlockTitle } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getCategory } from '@api';
import ColSwiper from '@components/Swiper/ColSwiper';
import Loading from '@components/Loading';

const CategoryShowPage = ({ f7route }) => {
  const categoryId = f7route.params.id;
  const { data: category, status, error } = useQuery(`categories-${categoryId}`, getCategory(categoryId));

  return (
    <Page className="theme-dark grid-demo">
      <TopNavBar backLink={true} />
      {status === 'loading' && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {status === 'error' && <div>{error}</div>}
      {category && (
        <>
          <BlockTitle id="category-title">{category.title}</BlockTitle>
          <ColSwiper item={category.movies} />
        </>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={1} />
      </Toolbar>
    </Page>
  );
};

export default CategoryShowPage;
