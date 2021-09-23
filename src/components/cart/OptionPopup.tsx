import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { useMutation } from 'react-query';
import { Transition, Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Popup, Page, Navbar, NavRight, Link, Stepper } from 'framework7-react';

import { createLineItem } from '@api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const OptionPopup = ({ options, f7router }) => {
  const nullOption = {
    id: null,
    movie_id: null,
    name: '옵션을 선택하세요',
  };
  options = [nullOption, ...options];
  const [selected, setSelected] = useState(options[0]);
  const [cart, setCart] = useState({});
  const [price, setPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const sendCart = useMutation(async (params) => await createLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
      setShowModal(true);
    },
  });

  const sendToCart = useCallback(async () => {
    const newValue = await Promise.all(Object.entries(cart).map((v) => v[1]));
    await sendCart.mutateAsync(newValue);
  }, [cart]);

  /** 선택된 option 카트에 넣기 */
  useEffect(() => {
    if (selected.id !== null) {
      setCart({ ...cart, [selected.id]: { ...selected, quantity: (cart[selected.id]?.quantity || 0) + 1 } });
      setPrice((prev) => prev + selected.price);
      setSelected(nullOption);
    }
  }, [selected]);

  useEffect(() => {
    console.log('optionCart', cart);
  }, [cart]);

  return (
    <Popup className="demo-popup-swipe" swipeToClose>
      <Page className="theme-dark">
        <Navbar>
          <NavRight>
            <Link
              iconF7="xmark"
              popupClose
              onClick={() => {
                setCart({});
                setShowModal(false);
              }}
            />
          </NavRight>
        </Navbar>
        {options && (
          <div>
            {options.length === 1 && (
              <div className="flex justify-center items-center pt-8 font-bold text-xl text-primary">
                품절된 상품입니다.
              </div>
            )}
            {options.length > 1 && (
              <div className="px-4">
                <Listbox value={selected} onChange={setSelected}>
                  {({ open }) => (
                    <div className="flex flex-col py-5">
                      <Listbox.Label className="block mb-3 text-sm font-semibold text-white">
                        옵션 선택하기
                      </Listbox.Label>
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
                      {Object.entries(cart).map(([id, { name, price, quantity }]) => (
                        <li key={id} className="mb-3.5 flex flex-col items-end">
                          <div className="mx-2 mb-2 flex-1 flex justify-between items-center">
                            <div className="flex flex-col w-36 text-base font-medium text-white">
                              <div className="font-bold w-36 overflow-hidden">{name}</div>

                              <p className="font-bold">₩{price}</p>
                            </div>
                            <Stepper
                              fill
                              small
                              color="#f82f62"
                              value={quantity}
                              min={1}
                              onStepperPlusClick={() => {
                                setCart({ ...cart, [id]: { ...cart[id], quantity: cart[id].quantity + 1 } });
                                setPrice((prev) => prev + cart[id].price);
                              }}
                              onStepperMinusClick={() => {
                                if (cart[id].quantity > 1) {
                                  setCart({ ...cart, [id]: { ...cart[id], quantity: cart[id].quantity - 1 } });
                                  setPrice((prev) => prev - cart[id].price);
                                }
                              }}
                            />
                          </div>
                          <div className="flex pr-2">
                            <button
                              type="button"
                              className="font-bold text-primary hover:text-primary"
                              onClick={() => {
                                const sliced = Object.entries(cart).slice();
                                const filtered = sliced.filter((v) => v[0] !== id);
                                const mapped = new Map(filtered);
                                const newCart = Object.fromEntries(mapped);
                                setCart(newCart);
                                setPrice((prev) => prev - cart[id].price * cart[id].quantity);
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {Object.entries(cart).length > 0 && (
                  <div className="flex flex-row justify-between">
                    <div>
                      <div className="text-base font-semibold text-white">총 상품금액</div>
                      <div className="text-primary text-xl font-bold">₩ {price}</div>
                    </div>
                    <div className="flex flex-row items-center">
                      <Link className="w-20 py-3 px-2 bg-indigo-500 font-bold" onClick={() => sendToCart()}>
                        장바구니
                      </Link>
                      <button className="w-20 py-3 px-2 bg-primary font-bold">바로구매</button>
                    </div>
                  </div>
                )}
                {showModal && (
                  <div className="flex flex-col items-center fixed top-1/3 left-0 right-0 z-50 w-4/5 mx-auto my-0 px-5 pt-12 pb-10 text-indigo-500 bg-black border-4 border-indigo-500 rounded-md">
                    <div>
                      <Link
                        className="absolute top-2 right-2"
                        iconF7="xmark"
                        onClick={() => {
                          setShowModal(false);
                        }}
                      />
                    </div>
                    <div className="mb-6 text-sm">장바구니에 상품이 담겼습니다.</div>
                    <Link
                      className="px-7 py-3 text-base font-bold text-white bg-indigo-500 rounded-lg"
                      onClick={() => {
                        setShowModal(false);
                        f7router.navigate('/carts');
                        setCart({});
                      }}
                      popupClose
                    >
                      장바구니 바로가기
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Page>
    </Popup>
  );
};

export default OptionPopup;