import { Page, Toolbar, BlockTitle, Block } from 'framework7-react';
import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRecoilState } from 'recoil';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { API_URL, API } from '@api/api.config';
import RowSwiper from '@components/Swiper/RowSwiper';
import useAuth from '@hooks/useAuth';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import Loading from '@components/Loading';
import { uncompletedOrderState } from '@atoms/order';
import { cartItemsState } from '@atoms/cart';
import { LineItem } from '@constants';

const IntroPage = ({ f7router }) => {
  const { currentUser } = useAuth();

  const fetchRange = 4;

  const fetchCategory = async ({ pageParam = 1 }) => {
    const data = await API.get(`/categories/page/${pageParam}`);
    return { data, nextPage: pageParam + 1 };
  };

  const {
    data: categories,
    error,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('categories', fetchCategory, {
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.data?.length < fetchRange) return undefined;
      return lastPage.nextPage ?? false;
    },
  });

  useEffect(() => {
    fetchCategory(1);
  }, []);

  const loadMoreButtonRef = React.useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const [uncompletedOrderId, setUncompletedOrderId] = useRecoilState<number>(uncompletedOrderState);
  const [cartItems, setCartItems] = useRecoilState<LineItem[]>(cartItemsState);

  useEffect(() => {
    const getUncompletedOrderId = async () => {
      const url = `${API_URL}/orders?q[user_id_eq]=${currentUser?.id}&q[status_eq]=orderUncompleted`;
      const resp = await fetch(url);
      const body = await resp.json();
      if (body) setUncompletedOrderId(body[0]?.id || null);
    };

    getUncompletedOrderId();
  }, [currentUser]);

  useEffect(() => {
    const getCartItems = async () => {
      const url = `${API_URL}/lineitems?q[order_id_eq]=${uncompletedOrderId}&q[status_eq]=uncomplete`;
      const resp = await fetch(url);
      const body = await resp.json();
      setCartItems(body);
    };

    getCartItems();
  }, [uncompletedOrderId]);

  return (
    <Page className="theme-dark">
      <TopNavBar f7router={f7router} cartCount={cartItems?.length} currentUser={currentUser} />
      {isFetching && (
        <div className="m-8">
          <Loading />
        </div>
      )}
      {error && <div className="flex justify-center">{error}</div>}
      {categories && (
        <div className="container-box">
          {isSuccess &&
            categories.pages.map((page) =>
              page.data.data.map(
                (category) =>
                  category.movies.length !== 0 && (
                    <div className="category-box" key={category?.id}>
                      <BlockTitle className="mb-2 font-bold">{category?.title}</BlockTitle>
                      <RowSwiper movies={category.movies} />
                    </div>
                  ),
              ),
            )}
          <Block />
        </div>
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
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default React.memo(IntroPage);
