import { LineItem } from '@constants';
import { atom } from 'recoil';

export const cartItemsState = atom<LineItem[]>({
  key: 'cartItemsState',
  default: [],
});

export const quickItemsState = atom<LineItem[]>({
  key: 'quickItemsState',
  default: [],
});
