import React, { useEffect, useState } from 'react';
import { BlockTitle, Page } from 'framework7-react';
import { useInfiniteQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import ColSwiper from '@components/Swiper/ColSwiper';
import Loading from '@components/Loading';
import { Listbox } from '@headlessui/react';
import SortSelect from '@components/SortSelect';
import { API } from '@api/api.config';
import useIntersectionObserver from '@hooks/useIntersectionObserver';

const DirectorShowPage = ({ f7route }) => {
  const directorId = f7route.params.id;
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

  const fetchRange = 4;
  const fetchDirector = async ({ pageParam = 1 }) => {
    const data = await API.get(`/directors/${directorId}/page/${pageParam}${url}`);
    return { data, nextPage: pageParam + 1 };
  };

  const {
    data: directorItem,
    error,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(`categories-${directorId}-${url}`, fetchDirector, {
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.data?.movies?.length < fetchRange) return undefined;
      return lastPage.nextPage ?? false;
    },
  });

  useEffect(() => {
    fetchDirector(1);
  }, []);

  const loadMoreButtonRef = React.useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <Page className="theme-dark grid-demo">
      <TopNavBar backLink />
      {isFetching && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {error && <div>{error}</div>}
      {directorItem && (
        <>
          {isSuccess && (
            <>
              <BlockTitle className="pt-9 pb-6 px-3 font-bold text-lg text-center text-primary">
                {directorItem?.pages[0].data.data.name}
              </BlockTitle>
              <div className="flex justify-end pr-6 mb-5">
                <Listbox value={selected} onChange={setSelected}>
                  {({ open }) => <SortSelect open={open} selected={selected} />}
                </Listbox>
              </div>
            </>
          )}
          {isSuccess && directorItem.pages.map((page) => <ColSwiper item={page.data.data.movies} />)}
        </>
      )}
      <div className="flex justify-center mb-10">
        <button
          ref={loadMoreButtonRef}
          className="font-bold text-primary"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? <Loading /> : hasNextPage ? 'Load More' : null}
        </button>
      </div>
    </Page>
  );
};

export default DirectorShowPage;
