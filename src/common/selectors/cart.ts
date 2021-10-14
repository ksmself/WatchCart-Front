import { cartItemsState } from '@atoms/cart';
import { selector } from 'recoil';

export const totalState = selector<number>({
  key: 'totalsState',
  get: ({ get }) => {
    const cart = get(cartItemsState);
    const subTotal = cart.reduce((acc, cur) => acc + cur.option.price * cur.quantity, 0);
    return subTotal;
  },
});
