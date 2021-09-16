import React, { useCallback, useEffect, useState } from 'react';
import { Stepper } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { cartItemsState } from '@pages/carts';
import { useMutation } from 'react-query';
import { deleteLineItem, updateLineItem } from '@api';

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
  }, [cartItems, item]);

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
  }, [cartItems, item]);

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
    // console.log('방금 CART 변경시킴', cartItems);
    deleteCart.mutate(item.id);
  }, [cartItems, item]);

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
    <li className="mb-3.5 flex flex-col items-end">
      <div className="mx-2 mb-2 flex-1 flex justify-between items-center">
        <div className="flex flex-col w-36 text-base font-medium text-white">
          <div className="font-bold w-36 overflow-hidden">{item.name}</div>

          <p className="font-bold">₩{item.price}</p>
        </div>
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
      <div className="flex pr-2">
        <button type="button" className="font-bold text-primary hover:text-primary" onClick={() => onClickDelete()}>
          삭제
        </button>
      </div>
    </li>
  );
};

export default CartItem;
