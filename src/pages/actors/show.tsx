import React, { useState, useEffect } from 'react';
import { BlockTitle, Page, Toolbar } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getActor } from '@api';
import ColSwiper from '@components/Swiper/ColSwiper';
import Loading from '@components/Loading';
import { Listbox } from '@headlessui/react';
import SortSelect from '@components/SortSelect';

const ActorShowPage = ({ f7route }) => {
  const actorId = f7route.params.id;
  const { data: actor, status, error } = useQuery(`actor-${actorId}`, getActor(actorId));

  const options = [
    { id: 0, name: '전체' },
    { id: 1, name: '별점높은순' },
    { id: 2, name: '별점낮은순' },
  ];
  const [selected, setSelected] = useState(options[0].name);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      {status === 'loading' && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {status === 'error' && <div>{error}</div>}
      {actor && (
        <>
          <BlockTitle className="pt-9 pb-6 px-3 font-bold text-lg text-center text-primary">{actor.name}</BlockTitle>
          <div className="flex justify-end pr-6 mb-5">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => <SortSelect open={open} selected={selected} />}
            </Listbox>
          </div>
          <ColSwiper item={actor.movies} />
        </>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default ActorShowPage;
