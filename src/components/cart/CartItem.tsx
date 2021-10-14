import React, { useCallback, useEffect, useState } from 'react';
import { Stepper } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { useMutation } from 'react-query';
import { API_URL, deleteLineItem, updateLineItem } from '@api';
import { cartItemsState } from '@atoms/cart';

const CartItem = ({ item }) => {
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);
  const [check, setCheck] = useState(true);

  const updateCart = useMutation((params) => updateLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      // 성공적으로 수정함
      const sliced = cartItems.slice();
      try {
        const newValue = await Promise.all(
          sliced.map((v) => {
            if (v.id === data?.data.id) {
              return data?.data;
            }
            return v;
          }),
        );
        await setCartItems(newValue);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const onChangePlus = useCallback(async () => {
    try {
      const sliced = cartItems.slice();
      const plusValue = await Promise.all(
        sliced
          .map((v) => {
            if (v.id === item.id) {
              return {
                ...v,
                quantity: v.quantity + 1,
              };
            }
            return v;
          })
          .filter((v) => v.id === item.id),
      );
      await updateCart.mutateAsync({ id: item.id, line_item: plusValue[0] });
    } catch (err) {
      console.log(err);
    }
  }, [cartItems]);

  const onChangeMinus = useCallback(async () => {
    try {
      const sliced = cartItems.slice();
      const minusValue = await Promise.all(
        sliced
          .map((v) => {
            if (v.id === item.id && item.quantity > 1) {
              return {
                ...v,
                quantity: v.quantity - 1,
              };
            }
            return v;
          })
          .filter((v) => v.id === item.id),
      );
      await updateCart.mutateAsync({ id: item.id, line_item: minusValue[0] });
    } catch (err) {
      console.log(err);
    }
  }, [cartItems]);

  const deleteCart = useMutation((params) => deleteLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      // 성공적으로 삭제함
      const sliced = cartItems.slice();
      try {
        const newValue = await Promise.all(sliced.filter((v) => v.id !== data?.data.id));
        await setCartItems(newValue);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const onClickDelete = useCallback(async () => {
    try {
      await deleteCart.mutateAsync(item.id);
    } catch (err) {
      console.log(err);
    }
  }, [cartItems]);

  const handleClick = useCallback(() => {
    setCheck((prev) => !prev);
  }, []);

  useEffect(async () => {
    try {
      const sliced = cartItems.slice();
      const newValue = await Promise.all(
        sliced.map((v) => {
          if (v.id === item.id) {
            return {
              ...v,
              check,
            };
          }
          return v;
        }),
      );
      await setCartItems(newValue);
    } catch (err) {
      console.log(err);
    }
  }, [check]);

  return (
    <li className="mb-3.5">
      <div className="mx-2 mb-2 flex-row">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row">
            <label className="item-checkbox item-content">
              <input type="checkbox" name="demo-checkbox" onChange={() => handleClick()} checked={check} />
              <i className="icon icon-checkbox" />
            </label>
            <a href={`/movies/${item.option.movie.id}`}>
              <img
                src={`${API_URL}${item.option.movie.image_path}`}
                alt={`${item.option.movie.title}`}
                className="w-28 h-28"
              />
            </a>
          </div>
          <div className="flex flex-col text-sm font-medium text-white">
            <div className="mb-1.5 font-normal overflow-hidden">{item.option.name}</div>
            <div className="text-xs mb-2 text-gray-300">{item.option.movie.title}</div>
            <p className="mb-2 font-normal">₩{item.option.price}</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="w-12 mb-3 text-center font-bold text-white bg-primary rounded-md"
                onClick={() => onClickDelete()}
              >
                삭제
              </button>
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
        </div>
      </div>
    </li>
  );
};

export default CartItem;
