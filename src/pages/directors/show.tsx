import React, { useState, useEffect } from 'react';
import { BlockTitle, Page, Toolbar } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getDirector } from '@api';
import ColSwiper from '@components/Swiper/ColSwiper';

const DirectorShowPage = ({ f7route }) => {
  const directorId = f7route.params.id;
  const { data: director, status, error } = useQuery(`director-${directorId}`, getDirector(directorId));

  return (
    <Page className="theme-dark grid-demo">
      <TopNavBar backLink={true} />
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>{error}</div>}
      {director && <BlockTitle id="category-title">{director.name}</BlockTitle>}
      {director && <ColSwiper item={director.movies} />}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default DirectorShowPage;
