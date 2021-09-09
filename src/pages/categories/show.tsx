import React, { useEffect } from 'react';
import { Page, Toolbar, BlockTitle, Block, Row, Col } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getCategory, getMovies } from '@api';
import ColSwiper from '@components/Swiper/ColSwiper';

const CategoryShowPage = ({ f7route }) => {
  const categoryId = f7route.params.id;
  const { data: category, status, error } = useQuery(`categories-${categoryId}`, getCategory(categoryId));
  // const { data: movie, status: movieStatus, error: movieError } = useQuery(
  //   `movies-${categoryId}`,
  //   getMovies(categoryId),
  // );
  // const movie = category.map((c) => )

  return (
    <Page className="theme-dark grid-demo">
      <TopNavBar backLink={true} />
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>{error}</div>}
      {category && <BlockTitle id="category-title">{category.title}</BlockTitle>}
      {category && <ColSwiper item={category.movies} />}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={1} />
      </Toolbar>
    </Page>
  );
};

export default CategoryShowPage;
