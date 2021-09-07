import React, { useState, useEffect } from 'react';
import { Page, Toolbar } from 'framework7-react';

import TopNavBar from '@components/TopNavBar';
import BottomToolBarContent from '@components/BottomToolBarContent';
import { getDirector } from '@api';

const DirectorShowPage = ({ f7route }) => {
  const directorId = f7route.params.id;
  const [director, setDirector] = useState(null);

  useEffect(() => {
    (async () => {
      if (directorId !== undefined) {
        const { data } = await getDirector(directorId);
        setDirector(data);
      }
    })();
  }, [directorId]);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      <div>{director?.name}의 페이지입니다</div>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default DirectorShowPage;
