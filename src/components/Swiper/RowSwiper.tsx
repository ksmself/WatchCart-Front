import React from 'react';
import { Swiper, SwiperSlide, Link } from 'framework7-react';

import { API_URL } from '@api/index';

const RowSwiper = ({ movies }) => (
  <Swiper navigation speed={500} slidesPerView={3} spaceBetween={20}>
    {movies.map((movie) => (
      <SwiperSlide key={movie?.id}>
        <Link href={`/movies/${movie?.id}`} className="movie-link">
          <img src={`${API_URL}${movie?.image_path}`} alt={movie?.title} width="83.328px" height="83.328px" />
          <div>{movie?.title}</div>
        </Link>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default RowSwiper;
