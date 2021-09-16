import React, { useCallback, useEffect, useState } from 'react';
import { Stepper } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { cartItemsState } from '@pages/carts';
import { useMutation } from 'react-query';
import { deleteLineItem, updateLineItem } from '@api';

import logo from '../../assets/images/logo.png';

const CartItem = ({ item }) => {
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);
  const [prev, setPrev] = useState(cartItems.slice());

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
  }, [cartItems]);

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
  }, [cartItems]);

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
  }, [cartItems]);

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

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  return (
    <li className="mb-3.5">
      <div className="mx-2 mb-2 flex-row">
        <div className="flex flex-row justify-between items-center">
          <img src={logo} alt="insomenia-logo" className="w-20 h-20" />
          <div className="flex flex-col text-sm font-medium text-white">
            <div className="mb-2 font-bold text-lg">기생충</div>
            <div className="mb-1.5 font-normal overflow-hidden">기생충-롯데시네마</div>
            <p className="mb-0.5 font-normal">₩6500</p>
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
