import React, { useCallback, useEffect } from 'react';
import { Stepper } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { cartItemsState } from '@pages/carts';
import { useMutation } from 'react-query';
import { API_URL, deleteLineItem, updateLineItem } from '@api';

const CartItem = ({ item }) => {
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);

  const updateCart = useMutation(async (params) => await updateLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      // 성공적으로 수정함
      console.log('수정 결과', data?.data);
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

  const deleteCart = useMutation(async (params) => await deleteLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      // 성공적으로 삭제함
      console.log('삭제 결과', data?.data);
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
      const data = await deleteCart.mutateAsync(item.id);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }, [cartItems]);

  useEffect(() => {
    console.log('cartItems: ', cartItems);
  }, [cartItems]);

  return (
    <li className="mb-3.5">
      <div className="mx-2 mb-2 flex-row">
        <div className="flex flex-row justify-between items-center">
          <a href={`/movies/${item.option.movie.id}`}>
            <img
              src={`${API_URL}${item.option.movie.image_path}`}
              alt={`${item.option.movie.movie_title}`}
              className="w-28 h-28"
            />
          </a>
          <div className="flex flex-col text-sm font-medium text-white">
            <div className="mb-2 font-bold text-lg">{item.option.movie.movie_title}</div>
            <div className="mb-1.5 font-normal overflow-hidden">{item.option.name}</div>
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
