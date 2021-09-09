import { f7ready, Page, Toolbar, BlockTitle, Swiper, SwiperSlide, Block } from 'framework7-react';
import { sampleSize, zip } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
// import sanitizeHtml from '../js/utils/sanitizeHtml';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getCategories } from '@api';
import RowSwiper from '@components/Swiper/RowSwiper';

const IntroPage = (props) => {
  const { data: categories, status, error } = useQuery('categories', getCategories());

  return (
    <Page className="theme-dark">
      <TopNavBar />
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>{error}</div>}
      {categories && (
        <div className="container-box">
          {categories.map((category) => (
            <div className="category-box" key={category?.id}>
              <BlockTitle className="block-title">{category?.title}</BlockTitle>
              <RowSwiper movies={category.movies} />
            </div>
          ))}
          <Block />
        </div>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};
export default React.memo(IntroPage);
