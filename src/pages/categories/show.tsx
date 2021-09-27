import React, { useEffect, useState } from 'react';
import { Page, Toolbar, BlockTitle } from 'framework7-react';
import { useQuery } from 'react-query';
import { Listbox } from '@headlessui/react';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getCategory } from '@api';
import ColSwiper from '@components/Swiper/ColSwiper';
import Loading from '@components/Loading';
import SortSelect from '@components/SortSelect';

const CategoryShowPage = ({ f7route }) => {
  const categoryId = f7route.params.id;
  const options = [
    { id: 0, name: '기본순' },
    { id: 1, name: '별점높은순' },
    { id: 2, name: '별점낮은순' },
  ];
  const [selected, setSelected] = useState(options[0].name);
  const [url, setUrl] = useState('');

  useEffect(() => {
    switch (selected) {
      case '기본순':
        setUrl('');
        break;
      case '별점높은순':
        setUrl('?q[s]=stars desc');
        break;
      case '별점낮은순':
        setUrl('?q[s]=stars asc');
        break;
      default:
        break;
    }
  }, [selected]);

  const { data: category, status, error } = useQuery(`categories-${categoryId}-${url}`, getCategory(categoryId, url));

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
          <BlockTitle className="pt-9 pb-6 px-3 font-bold text-lg text-center text-primary">
            {category.title}
          </BlockTitle>
          <div className="flex justify-end pr-6 mb-5">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => <SortSelect open={open} selected={selected} />}
            </Listbox>
          </div>
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
