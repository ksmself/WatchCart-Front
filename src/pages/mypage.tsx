import { Page, Toolbar, Icon, Tabs, Tab, Link } from 'framework7-react';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import { getUser, logoutAPI } from '@api';
import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
import useAuth from '@hooks/useAuth';
import LoginForm from '@pages/users/sessions/new';
import UserInfoEdit from '@components/user/UserInfoEdit';
import Like from '@components/tab/Like';
import UserOrderList from '@components/user/UserOrderList';
import { User } from '@constants';

const MyPage = ({ f7router }) => {
  const { currentUser, isAuthenticated, unAuthenticateUser } = useAuth();
  const { data: user, status, error } = useQuery<User>(`user-${currentUser?.id}`, getUser(currentUser?.id), {
    enabled: isAuthenticated,
  });

  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (e) {
      console.log(e);
    } finally {
      unAuthenticateUser();
    }
  }, [unAuthenticateUser]);

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Page className="theme-dark">
      <TopNavBar optionName="My Page" />
      {!isAuthenticated && <LoginForm />}
      {isAuthenticated && (
        <>
          <div className="user-info-box">
            <div className="user-info">
              <Icon f7="person_crop_circle" />
              <span>{currentUser?.name}님</span>
            </div>
            <button onClick={logoutHandler} className="logout-btn">
              로그아웃
            </button>
          </div>
          {/* Switch Between Tabs  */}
          <div className="tabLink-box">
            <Link
              tabLink="#tab-1"
              tabLinkActive={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(0);
              }}
            >
              보고싶어요
            </Link>
            <Link
              tabLink="#tab-2"
              tabLinkActive={currentIndex === 1}
              onClick={() => {
                setCurrentIndex(1);
              }}
            >
              장바구니
            </Link>
            <Link
              tabLink="#tab-3"
              tabLinkActive={currentIndex === 2}
              onClick={() => {
                setCurrentIndex(2);
              }}
            >
              주문내역
            </Link>
            <Link
              tabLink="#tab-4"
              tabLinkActive={currentIndex === 3}
              onClick={() => {
                setCurrentIndex(3);
              }}
            >
              정보수정
            </Link>
          </div>
          {/* Tabs  */}
          <Tabs>
            <Tab id="tab-1" className="like-tab" tabActive>
              <Like data={user?.liked_movies} status={status} error={error} />
            </Tab>
            <Tab id="tab-2">
              <div className="flex justify-center mt-24">
                <Link
                  className="px-7 py-3 text-base font-bold text-white bg-indigo-500 rounded-lg"
                  onClick={() => {
                    f7router.navigate('/carts');
                  }}
                  popupClose
                >
                  장바구니 바로가기
                </Link>
              </div>
            </Tab>
            <Tab id="tab-3">
              <UserOrderList />
            </Tab>
            <Tab id="tab-4">
              <UserInfoEdit />
            </Tab>
          </Tabs>
        </>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={3} />
      </Toolbar>
    </Page>
  );
};

export default React.memo(MyPage);
