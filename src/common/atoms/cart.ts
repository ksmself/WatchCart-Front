import { LineItem } from '@constants';
import { atom, selector } from 'recoil';

export const cartItemsState = atom<LineItem[]>({
  key: 'cartItemsState',
  default: [],
});

export const totalState = selector<number>({
  key: 'totalsState',
  get: ({ get }) => {
    const cart = get(cartItemsState);
    const subTotal = cart.reduce((acc, cur) => acc + cur.option.price * cur.quantity, 0);
    return subTotal;
  },
});
