import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'framework7-react';

import { getMovies } from '@api';

const RowSwiper = ({ categoryId }) => {
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await getMovies(categoryId);
      console.log(data);
      setMovies(data);
    })();
  }, []);

  return (
    <Swiper navigation speed={500} slidesPerView={3} spaceBetween={20}>
      {movies?.map((movie) => (
        <SwiperSlide key={movie?.id}>
          <img src={movie?.image_path} alt={movie?.title} />
          <div>{movie?.title}</div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RowSwiper;
