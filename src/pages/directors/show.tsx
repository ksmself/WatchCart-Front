import React, { useState } from 'react';
import { BlockTitle, Page, Toolbar } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getDirector } from '@api';
import ColSwiper from '@components/Swiper/ColSwiper';
import Loading from '@components/Loading';
import { Listbox } from '@headlessui/react';
import SortSelect from '@components/SortSelect';

const DirectorShowPage = ({ f7route }) => {
  const directorId = f7route.params.id;
  const { data: director, status, error } = useQuery(`director-${directorId}`, getDirector(directorId));

  const options = [
    { id: 0, name: '전체' },
    { id: 1, name: '별점높은순' },
    { id: 2, name: '별점낮은순' },
  ];
  const [selected, setSelected] = useState(options[0].name);

  return (
    <Page className="theme-dark grid-demo">
      <TopNavBar backLink={true} />
      {status === 'loading' && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {status === 'error' && <div>{error}</div>}
      {director && (
        <>
          <BlockTitle className="pt-9 pb-6 px-3 font-bold text-lg text-center text-primary">{director.name}</BlockTitle>
          <div className="flex justify-end pr-6 mb-5">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => <SortSelect open={open} selected={selected} />}
            </Listbox>
          </div>
          <ColSwiper item={director.movies} />
        </>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default DirectorShowPage;
