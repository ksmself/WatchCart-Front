import React, { useCallback, useEffect, useState } from 'react';
import { Stepper } from 'framework7-react';
import { useRecoilState, atomFamily, atom } from 'recoil';
import { cartItemsState, totalState } from '@pages/carts';
import { useMutation } from 'react-query';
import { API_URL, deleteLineItem, updateLineItem } from '@api';

export const itemIds = atomFamily({
  key: 'itemIds',
  default: {},
});

const priceState = atom({
  key: 'price',
  default: 0,
});

const CartItem = ({ item }) => {
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);
  const [prev, setPrev] = useState(cartItems.slice());
  const [info, setInfo] = useRecoilState(itemIds(item.id));
  const [total, setTotal] = useRecoilState(totalState);

  useEffect(() => {
    setTotal(0);
    const getInfo = async (itemId) => {
      const url = `${API_URL}/lineitems/${itemId}`;
      const resp = await fetch(url);
      const body = await resp.json();
      setInfo(body);
      setTotal((p) => p + body.quantity * body.option_price);
    };

    getInfo(item.id);
  }, []);

  useEffect(() => {
    setPrev(cartItems.slice());
  }, []);

  const onChangeMinus = useCallback(() => {
    const newValue =
      cartItems?.length > 0 &&
      cartItems.map((cartitem) => {
        if (cartitem.id === item.id && cartitem.quantity > 1) {
          return {
            ...cartitem,
            quantity: cartitem.quantity - 1,
          };
        }
        return cartitem;
      });

    setCartItems(newValue);
    if (item.quantity > 1) setTotal((p) => p - info.option_price);
  }, [cartItems, info]);

  const onChangePlus = useCallback(() => {
    const newValue =
      cartItems?.length > 0 &&
      cartItems.map((cartitem) => {
        if (cartitem.id === item.id) {
          return {
            ...cartitem,
            quantity: cartitem.quantity + 1,
          };
        }
        return cartitem;
      });

    setCartItems(newValue);
    setTotal((p) => p + info.option_price);
  }, [cartItems, info]);

  const deleteCart = useMutation((params) => deleteLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      // 성공적으로 삭제함
      console.log('삭제 결과', data?.data);
      setPrev(cartItems);
    },
  });

  const onClickDelete = useCallback(() => {
    const newValue = cartItems?.filter((c) => c.id !== item.id);
    setCartItems(newValue);
    deleteCart.mutate(item.id);
    setTotal((p) => p - item.quantity * info.option_price);
  }, [cartItems, info]);

  const updateCart = useMutation((params) => updateLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      // 성공적으로 수정함
      console.log('수정 결과', data?.data);
      setPrev(cartItems);
    },
  });

  useEffect(() => {
    prev.map((v) => {
      const cur = cartItems.filter((c) => c.id === v.id);
      if (cur?.length !== 0 && v.quantity !== cur[0]?.quantity) {
        updateCart.mutate({ lineitemId: v.id, line_item: cur[0] });
      }
    });
  }, [cartItems, prev]);

  return (
    <li className="mb-3.5">
      <div className="mx-2 mb-2 flex-row">
        <div className="flex flex-row justify-between items-center">
          <img src={`${API_URL}/uploads/${info.image_path}`} alt="insomenia-logo" className="w-20 h-20" />
          <div className="flex flex-col text-sm font-medium text-white">
            <div className="mb-2 font-bold text-lg">{info.movie_title}</div>
            <div className="mb-1.5 font-normal overflow-hidden">{info.option_name}</div>
            <p className="mb-0.5 font-normal">₩{info.option_price}</p>
            <button
              type="button"
              className="mb-2 pr-2 text-right font-bold text-primary hover:text-primary"
              onClick={() => onClickDelete()}
            >
              삭제
            </button>
            <Stepper
              fill
              small
              color="#f82f62"
              value={item.quantity}
              min={1}
              onStepperMinusClick={() => onChangeMinus()}
              onStepperPlusClick={() => onChangePlus()}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
