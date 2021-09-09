import React, { useState, useEffect } from 'react';
import { BlockTitle, Page, Toolbar } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getActor } from '@api';
import ColSwiper from '@components/Swiper/ColSwiper';

const ActorShowPage = ({ f7route }) => {
  const actorId = f7route.params.id;
  const { data: actor, status, error } = useQuery(`actor-${actorId}`, getActor(actorId));

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>{error}</div>}
      {actor && <BlockTitle id="category-title">{actor.name}</BlockTitle>}
      {actor && <ColSwiper item={actor.played_movies} />}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default ActorShowPage;
