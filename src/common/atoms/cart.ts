import { atom, selector } from 'recoil';

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
