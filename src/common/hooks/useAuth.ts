import { useRecoilState } from 'recoil';
import { AuthState, Token } from '@constants';
import { getCurrentUserFromToken } from '@utils';
import { destroyToken, saveToken } from '@store';
import { authSelector } from '@selectors';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState<AuthState>(authSelector);

  const authenticateUser = ({ token, csrf }: Token) => {
    saveToken({ token, csrf });
    setCurrentUser({ token, csrf, currentUser: getCurrentUserFromToken(token) });
  };

  const unAuthenticateUser = () => {
    destroyToken();
    setCurrentUser({ token: null, csrf: null, currentUser: null });
  };

  /**
   * currentUser에는 현재 user의 정보가 담겨있음
   * isAuthenticated는 로그인 시, true
   * authenticateUser는 user가 로그인과 회원가입하는 절차
   * unAuthenticateUser는 user가 로그아웃?하는 절차
   */

  return {
    ...currentUser,
    authenticateUser,
    unAuthenticateUser,
    isAuthenticated: !!currentUser.token && !!currentUser.csrf,
  };
};

export default useAuth;
