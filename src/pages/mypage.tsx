import { API_URL, logoutAPI } from '@api';
import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
import useAuth from '@hooks/useAuth';
import { Page, Toolbar } from 'framework7-react';
import React, { useCallback } from 'react';

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
      <div className="py-10">This is MyPage</div>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={3} />
      </Toolbar>
    </Page>
  );
};

export default React.memo(MyPage);
