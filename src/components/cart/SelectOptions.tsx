import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Stepper } from 'framework7-react';
import { useMutation, useQueryClient } from 'react-query';
import { createLineItem } from '@api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SelectOptions = ({ options, cartNull }) => {
  const queryClient = useQueryClient();
  const nullOption = {
    id: null,
    movie_id: null,
    name: '옵션을 선택하세요',
  };
  options = [nullOption, ...options];
  const [selected, setSelected] = useState(options[0]);
  const [cart, setCart] = useState([]);
  const [cartKey, setCartKey] = useState([]);
  const [total, setTotal] = useState(0);

  const onClickDelete = useCallback(
    (id) => {
      const cartKeyFiltered = cartKey.slice().filter((v) => v !== id);
      setCartKey(cartKeyFiltered);
      const cartFiltered = cart.slice().filter((v) => v.id !== id);
      setCart(cartFiltered);
    },
    [cartKey, cart],
  );

  const onChangeMinus = useCallback(
    (id) => {
      const newItem = cart.slice().map((v) => {
        if (v.id === id && v.quantity > 1) {
          return {
            ...v,
            quantity: v.quantity - 1,
          };
        }
        return v;
      });
      setCart(newItem);
    },
    [cart],
  );

  const onChangePlus = useCallback(
    (id) => {
      const newItem = cart.slice().map((v) => {
        if (v.id === id) {
          return {
            ...v,
            quantity: v.quantity + 1,
          };
        }
        return v;
      });
      setCart(newItem);
    },
    [cart],
  );

  const sendCart = useMutation((params) => createLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      // 성공적으로 보냈다면 카트 초기화
      setCart([]);
      // '장바구니' 페이지로 이동할지 질문
    },
  });

  const sendToCart = useCallback(async () => {
    console.log(cart);
    sendCart.mutate(cart);
    // cart.map((item) => sendCart.mutate({ option_id: item.id, quantity: item.quantity }));
    // sendCart.mutate();
  }, [cart]);

  // useEffect(() => {
  //   console.log(cartNull);
  //   if (cartNull) {
  //     setCart([]);
  //   }
  // }, [cartNull]);

  useEffect(() => {
    if (selected.id !== null) {
      if (!cartKey.includes(selected.id)) {
        cartKey.push(selected.id);
        setCart((prev) => [...prev, selected]);
        setSelected(nullOption);
      } else {
        setSelected(nullOption);
      }
    }
  }, [selected, cart, cartKey, nullOption]);

  useEffect(() => {
    setTotal(cart.slice().reduce((acc, cur) => acc + cur.price * cur.quantity, 0));
  }, [cart, total]);

  /*
  useEffect(() => {
    console.log('cart: ', cart);
  }, [cart]);
  */

  return (
    <div>
      {options.length === 1 && (
        <div className="flex justify-center items-center pt-8 font-bold text-xl text-primary">품절된 상품입니다.</div>
      )}
      {options.length > 1 && (
        <div className="px-4">
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <div className="flex flex-col py-5">
                <Listbox.Label className="block mb-3 text-sm font-semibold text-white">옵션 선택하기</Listbox.Label>
                <div className="relative">
                  <Listbox.Button className="relative w-9/10 border-2 border-primary rounded-md shadow-sm pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                    <span className="flex items-center">
                      <span className="ml-1 block truncate font-bold">{selected.name}</span>
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {options.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            classNames(
                              active ? 'text-white bg-primary' : 'text-white',
                              'cursor-default select-none relative py-2 pl-3 pr-9',
                            )
                          }
                          value={option}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <span
                                  className={classNames(
                                    selected ? 'ml-3 font-semibold' : 'ml-3 font-semibold',
                                    'block truncate',
                                  )}
                                >
                                  {option.name}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-white' : '',
                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </div>
            )}
          </Listbox>

          {/* cart.map */}
          <div className="my-2">
            <div className="flow-root">
              <ul>
                {cart.map((product, idx, cartArr) => (
                  <li key={product.id} className="mb-3.5 flex flex-col items-end">
                    <div className="mx-2 mb-2 flex-1 flex justify-between items-center">
                      <div className="flex flex-col w-36 text-base font-medium text-white">
                        <div className="font-bold w-36 overflow-hidden">{product.name}</div>

                        <p className="font-bold">₩{product.price}</p>
                      </div>
                      <Stepper
                        fill
                        small
                        color="#f82f62"
                        value={cartArr[idx].quantity}
                        min={1}
                        onStepperMinusClick={() => onChangeMinus(product.id)}
                        onStepperPlusClick={() => onChangePlus(product.id)}
                      />
                    </div>
                    <div className="flex pr-2">
                      <button
                        type="button"
                        className="font-bold text-primary hover:text-primary"
                        onClick={() => onClickDelete(product.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {cart.length > 0 && (
            <div className="flex flex-row justify-between">
              <div>
                <div className="text-base font-semibold text-white">총 상품금액</div>
                <div className="text-primary text-xl font-bold">₩ {total}</div>
              </div>
              <div className="flex flex-row items-center">
                <button className="w-20 py-3 px-2 bg-indigo-500 font-bold" onClick={() => sendToCart()}>
                  장바구니
                </button>
                <button className="w-20 py-3 px-2 bg-primary font-bold">바로구매</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectOptions;
