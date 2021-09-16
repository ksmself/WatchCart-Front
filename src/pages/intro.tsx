import { Page, Toolbar, BlockTitle, Block } from 'framework7-react';
import { replace, sampleSize, zip } from 'lodash';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { atom, useRecoilState } from 'recoil';
// import sanitizeHtml from '../js/utils/sanitizeHtml';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { API_URL, getCategories } from '@api';
import RowSwiper from '@components/Swiper/RowSwiper';
import useAuth from '@hooks/useAuth';
import { cartItemsState } from '@pages/carts';

export const uncompletedOrderState = atom({
  key: 'orderState',
  default: [],
});

const IntroPage = ({ f7router }) => {
  const { currentUser } = useAuth();
  const { data: categories, status, error } = useQuery('categories', getCategories());
  const [uncompletedOrderId, setUncompletedOrderId] = useRecoilState(uncompletedOrderState);
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);

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
