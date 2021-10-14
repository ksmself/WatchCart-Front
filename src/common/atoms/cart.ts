import { LineItem } from '@constants';
import { atom, selector } from 'recoil';

export const cartItemsState = atom<LineItem[]>({
  key: 'cartItemsState',
  default: [],
});
