import React, { useCallback, useState } from 'react';
import { Page } from 'framework7-react';
import { useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import useQueryDebounce from '@hooks/useQueryDebounce';
import { getMoviesByKeyword } from '@api/index';
import Loading from '@components/Loading';
import ColSwiper from '@components/Swiper/ColSwiper';
import { Movie } from '@constants';

const Search = () => {
  const [open, setOpen] = useState(true);
  const [keyword, setKeyword] = useState(null);

  const onChangeKeyword = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  const debouncedSearchKeyword = useQueryDebounce(keyword, 200);
  const { data, status, error } = useQuery<Movie[]>(debouncedSearchKeyword, getMoviesByKeyword(debouncedSearchKeyword));

  return (
    <Page className="theme-dark">
      <TopNavBar backLink />
      {open && (
        <div className="flex flex-col items-end mb-3 px-2.5 bg-black">
          <div className="w-full pt-4 mb-1.5">
            <input
              className="block w-full h-8 pl-2.5 py-1 rounded-sm text-white bg-gray-800"
              value={keyword}
              onChange={(e) => onChangeKeyword(e)}
              placeholder="제목, 감독, 배우로 검색"
            />
          </div>
          <button className="w-10" onClick={() => setOpen(false)}>
            닫기
          </button>
        </div>
      )}
      <div className="mt-4 px-2.5">
        {status === 'loading' && (
          <div className="m-32">
            <Loading />
          </div>
        )}
        {status === 'error' && <div>{error}</div>}
        {data && (
          <>
            <div className="mb-4 font-bold text-lg">
              <span className="text-primary">'{debouncedSearchKeyword}'</span> 검색 결과
            </div>
            {data.length === 0 && <div className="content-null">검색 결과가 없습니다</div>}
            <ColSwiper item={data} />
          </>
        )}
      </div>
    </Page>
  );
};

export default Search;
