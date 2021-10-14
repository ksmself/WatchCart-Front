import { atom } from 'recoil';

export const uncompletedOrderState = atom<number>({
  key: 'orderState',
  default: null,
});
