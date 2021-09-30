import React, { useEffect, useState } from 'react';
import { f7, Page } from 'framework7-react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

import TopNavBar from '@components/TopNavBar';
import { API_URL } from '@api';
import { uncompletedOrderState } from '@pages/intro';
import CartItem from '@components/cart/CartItem';
import useAuth from '@hooks/useAuth';

export const cartItemsState = atom({
  key: 'cartItemsState',
  default: [],
});

export const totalState = selector({
  key: 'totalsState',
  get: ({ get }) => {
    const cart = get(cartItemsState);
    const subTotal = cart.reduce((acc, cur) => acc + cur.option.price * cur.quantity, 0);
    return subTotal;
  },
});

const CartIndexPage = ({ f7router }) => {
  const { currentUser } = useAuth();
  const [uncompletedOrderId, setUncompletedOrderId] = useRecoilState(uncompletedOrderState);
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);
  const [selectTotal, setSelectTotal] = useState(0);

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

  useEffect(() => {
    const filtered = cartItems.filter((v) => v.check === undefined || v.check === true);
    const newTotal = filtered.reduce((acc, cur) => acc + cur.option.price * cur.quantity, 0);
    setSelectTotal(newTotal);
  }, [cartItems]);

  useEffect(() => {
    console.log('selected', selectTotal);
  }, [selectTotal]);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink />
      {cartItems?.length === 0 && (
        <div className="flex justify-center items-center pt-8 font-bold text-xl text-primary">
          장바구니가 비었습니다.
        </div>
      )}
      {cartItems?.length > 0 &&
        cartItems.map((item) => (
          <div className="pt-2 px-3" key={item.id}>
            <div className="my-2">
              <div className="flow-root">
                <ul>
                  <CartItem item={item} />
                </ul>
              </div>
            </div>
          </div>
        ))}
      {cartItems?.length > 0 && (
        <div className="pt-3 px-5">
          <div className="flex flex-row justify-between">
            <div>
              <div className="text-base font-semibold text-white">총 상품금액</div>
              <div className="text-primary text-xl font-bold">₩ {selectTotal}</div>
            </div>
            <div className="flex flex-row items-center">
              <button
                className="w-36 py-3 px-2 mb-10 bg-indigo-500 font-bold"
                onClick={() => {
                  if (selectTotal > 0) f7router.navigate('/orders');
                  else f7.dialog.alert('상품을 선택해주세요!');
                }}
              >
                바로구매
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default CartIndexPage;
