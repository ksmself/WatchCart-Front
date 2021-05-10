import _ from 'lodash';
import { selector, selectorFamily } from 'recoil';
import { AuthState } from '@constants';
import { authState } from '@atoms';

export const authSelector = selector({
  key: 'authSelector',
  get: ({ get }) => get(authState),
  set: ({ set }, newAuthState: AuthState) => set(authState, newAuthState),
});
