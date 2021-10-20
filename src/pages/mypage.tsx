import { Page, Toolbar, Icon, Tabs, Tab, Link } from 'framework7-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { logoutAPI } from '@api/index';
import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
import useAuth from '@hooks/useAuth';
import LoginForm from '@pages/users/sessions/new';
import UserInfoEdit from '@components/user/UserInfoEdit';
import UserOrderList from '@components/user/UserOrderList';
import { Observer } from '@constants';
import { API } from '@api/api.config';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import Loading from '@components/Loading';
import ColSwiper from '@components/Swiper/ColSwiper';

const MyPage = ({ f7router }) => {
  const { currentUser, isAuthenticated, unAuthenticateUser } = useAuth();

  const fetchRange = 6;
  const fetchLiked = async ({ pageParam = 1 }) => {
    const data = await API.get(`/users/${currentUser.id}/liked_movies/page/${pageParam}`);
    return { data, nextPage: pageParam + 1 };
  };

  const {
    data: likedMovies,
    error,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(`users-${currentUser.id}-rated`, fetchLiked, {
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.data?.liked_movies?.length < fetchRange) return undefined;
      return lastPage.nextPage ?? false;
    },
  });

  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (e) {
      console.log(e);
    } finally {
      unAuthenticateUser();
    }
  }, [unAuthenticateUser]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const loadMoreButtonRef = React.useRef();

  const obj: Observer = {
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  };
  useIntersectionObserver(obj);

  useEffect(() => {
    fetchLiked(1);
  }, []);

  return (
    <Page className="theme-dark">
      <TopNavBar optionName="My Page" />
      {!isAuthenticated && <LoginForm />}
      {isAuthenticated && (
        <>
          <div className="user-info-box">
            <div className="user-info">
              <Icon f7="person_crop_circle" />
              <span>{currentUser?.name}님</span>
            </div>
            <button onClick={logoutHandler} className="logout-btn">
              로그아웃
            </button>
          </div>
          {/* Switch Between Tabs  */}
          <div className="tabLink-box">
            <Link
              tabLink="#tab-1"
              tabLinkActive={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(0);
              }}
            >
              보고싶어요
            </Link>
            <Link
              tabLink="#tab-2"
              tabLinkActive={currentIndex === 1}
              onClick={() => {
                setCurrentIndex(1);
              }}
            >
              장바구니
            </Link>
            <Link
              tabLink="#tab-3"
              tabLinkActive={currentIndex === 2}
              onClick={() => {
                setCurrentIndex(2);
              }}
            >
              주문내역
            </Link>
            <Link
              tabLink="#tab-4"
              tabLinkActive={currentIndex === 3}
              onClick={() => {
                setCurrentIndex(3);
              }}
            >
              정보수정
            </Link>
          </div>
          {/* Tabs  */}
          <Tabs>
            <Tab id="tab-1" className="like-tab" tabActive>
              {isFetching && (
                <div className="m-32">
                  <Loading />
                </div>
              )}
              {error && <div>{error}</div>}

              {likedMovies &&
                isSuccess &&
                likedMovies.pages.map((page) => <ColSwiper item={page.data.data.liked_movies} />)}

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
            </Tab>
            <Tab id="tab-2">
              <div className="flex justify-center mt-24">
                <Link
                  className="px-7 py-3 text-base font-bold text-white bg-indigo-500 rounded-lg"
                  onClick={() => {
                    f7router.navigate('/carts');
                  }}
                  popupClose
                >
                  장바구니 바로가기
                </Link>
              </div>
            </Tab>
            <Tab id="tab-3">
              <UserOrderList />
            </Tab>
            <Tab id="tab-4">
              <UserInfoEdit />
            </Tab>
          </Tabs>
        </>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={3} />
      </Toolbar>
    </Page>
  );
};

export default React.memo(MyPage);
