import React from 'react';
import Loader from 'react-loader-spinner';

const Loading = () => (
  <div className="flex justify-center">
    <Loader
      type="Oval"
      color="#f82f62"
      height={30}
      width={30}
      timeout={3000} //3 secs
    />
  </div>
);

export default Loading;
