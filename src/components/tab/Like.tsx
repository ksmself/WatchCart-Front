import React from 'react';
import { Tab } from 'framework7-react';
import { useQuery } from 'react-query';

import ColSwiper from '@components/Swiper/ColSwiper';
import { getUser } from '@api';
import useAuth from '@hooks/useAuth';

const Like = () => {
  const { currentUser } = useAuth();
  const { data: user, status, error } = useQuery(`user-${currentUser.id}`, getUser(currentUser.id));

  return (
    <Tab id="tab-1" className="like-tab" tabActive>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>{error}</div>}
      <ColSwiper item={user?.liked_movies} />
    </Tab>
  );
};

export default Like;
