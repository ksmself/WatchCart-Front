import React from 'react';

import ColSwiper from '@components/Swiper/ColSwiper';
import Loading from '@components/Loading';

const Like = ({ data, status, error }) => (
  <>
    {status === 'loading' && (
      <div className="m-32">
        <Loading />
      </div>
    )}
    {status === 'error' && <div>{error}</div>}
    {data && <ColSwiper item={data} />}
  </>
);

export default Like;
