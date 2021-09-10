import React from 'react';
import { Tab } from 'framework7-react';
import ColSwiper from '@components/Swiper/ColSwiper';

const Like = () => {
  const dummy = {
    id: 1,
    name: '송강호',
    liked_movies: [
      {
        id: 2,
        title: '기생충',
        description: null,
        stars: '3.0',
        year: 2020,
        category_id: 1,
        director_id: 3,
        played_actors: null,
        image_path: '/uploads/square_cdaae24e-38ba-4370-bd59-505a799875a0parasite.png.png',
        options: [
          {
            id: 1,
            movie_id: 3,
            name: 'cgv',
          },
          {
            id: 2,
            movie_id: 3,
            name: 'megabox',
          },
        ],
      },
      {
        id: 3,
        title: '기생충',
        description: null,
        stars: '3.0',
        year: 2020,
        category_id: 1,
        director_id: 3,
        played_actors: null,
        image_path: '/uploads/square_cdaae24e-38ba-4370-bd59-505a799875a0parasite.png.png',
        options: [
          {
            id: 1,
            movie_id: 3,
            name: 'cgv',
          },
          {
            id: 2,
            movie_id: 3,
            name: 'megabox',
          },
        ],
      },
      {
        id: 4,
        title: '기생충',
        description: null,
        stars: '3.0',
        year: 2020,
        category_id: 1,
        director_id: 3,
        played_actors: null,
        image_path: '/uploads/square_cdaae24e-38ba-4370-bd59-505a799875a0parasite.png.png',
        options: [
          {
            id: 1,
            movie_id: 3,
            name: 'cgv',
          },
          {
            id: 2,
            movie_id: 3,
            name: 'megabox',
          },
        ],
      },
    ],
  };

  return (
    <Tab id="tab-1" className="like-tab" tabActive>
      <ColSwiper item={dummy.liked_movies} />
    </Tab>
  );
};

export default Like;
