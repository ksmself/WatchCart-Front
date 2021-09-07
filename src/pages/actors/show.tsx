import React, { useState, useEffect } from 'react';
import { Page, Toolbar } from 'framework7-react';
import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getActor } from '@api';

const ActorShowPage = ({ f7route }) => {
  const actorId = f7route.params.id;
  const [actor, setActor] = useState(null);

  useEffect(() => {
    (async () => {
      if (actorId !== undefined) {
        const { data } = await getActor(actorId);
        setActor(data);
      }
    })();
  });

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      <div>{actor?.name}의 페이지입니다</div>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default ActorShowPage;
