import React, { useState } from 'react';
import { Link, Page, Tab, Tabs, Toolbar } from 'framework7-react';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { useQuery } from 'react-query';
import { getUser } from '@api';
import useAuth from '@hooks/useAuth';
import Like from '@components/tab/Like';

const StarPage = () => {
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: user, status, error } = useQuery(`user-${currentUser?.id}`, getUser(currentUser?.id));

  return (
    <Page className="theme-dark">
      <TopNavBar optionName="Stars" />
      <div className="tabLink-star flex pl-4 mt-8 mb-5">
        <Link
          iconF7="hand_thumbsup_fill"
          tabLink="#tab-1"
          tabLinkActive={currentIndex === 0}
          className="w-10 px-8 py-3 mr-2 font-bold border-2 rounded-3xl border-grey bg-brown"
          onClick={() => {
            setCurrentIndex(0);
          }}
        />
        <Link
          iconF7="hand_thumbsdown_fill"
          tabLink="#tab-2"
          tabLinkActive={currentIndex === 1}
          className="w-10 px-8 py-3 font-bold border-2 rounded-3xl border-grey bg-brown"
          onClick={() => {
            setCurrentIndex(1);
          }}
        />
      </div>

      {/* Tabs */}
      <Tabs>
        <Tab id="tab-1" tabActive>
          <Like data={user?.good_movies} status={status} error={error} />
        </Tab>
        <Tab id="tab-2">
          <Like data={user?.bad_movies} status={status} error={error} />
        </Tab>
      </Tabs>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={2} />
      </Toolbar>
    </Page>
  );
};

export default StarPage;
