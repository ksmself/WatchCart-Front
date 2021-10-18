import _ from 'lodash';
import { selector } from 'recoil';
import { AuthState } from '@constants';
import { authState } from '@atoms/index';

export const authSelector = selector({
  key: 'authSelector',
  get: ({ get }) => get(authState),
  set: ({ set }, newAuthState: AuthState) => set(authState, newAuthState),
});
