import { atom } from 'recoil';

export const uncompletedOrderState = atom({
  key: 'orderState',
  default: null,
});
