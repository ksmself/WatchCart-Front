import { Page, Toolbar } from 'framework7-react';
import React, { useCallback } from 'react';

import { logoutAPI } from '@api';
import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
import useAuth from '@hooks/useAuth';
import LoginForm from '@pages/users/sessions/new';

const MyPage = () => {
  const { currentUser, isAuthenticated, unAuthenticateUser } = useAuth();

  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (e) {
      console.log(e);
    } finally {
      unAuthenticateUser();
    }
  }, [unAuthenticateUser]);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      {!isAuthenticated && <LoginForm />}
      {isAuthenticated && <button onClick={logoutHandler}>로그아웃</button>}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={3} />
      </Toolbar>
    </Page>
  );
};

export default React.memo(MyPage);
