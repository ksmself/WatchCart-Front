import { Page, Toolbar, Icon, Link } from 'framework7-react';
import React, { useState, useEffect, useCallback } from 'react';

import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
import { API_URL, getMovie, getDirector } from '@api';
import { useQuery } from 'react-query';

const MovieShowPage = ({ f7route }) => {
  const movieId = f7route.params.id;

  const { data: movie, status: movieStatus, error: movieError } = useQuery(`movie-${movieId}`, getMovie(movieId));

  const directorId = movie?.director_id;
  const { data: director, status: directorStatus, error: directorError } = useQuery(
    [`director-${directorId}`, directorId],
    getDirector(directorId),
    { enabled: !!directorId },
  );

  const actors = movie?.played_actors;

  const onClickLike = useCallback(() => {
    console.log('보고 싶어요 클릭됨');
  }, []);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      {movieStatus === 'loading' && <div>Loading...</div>}
      {movieStatus === 'error' && <div>{movieError}</div>}
      {movie && (
        <div className="movie-container">
          <img src={`${API_URL}${movie?.image_path}`} alt={movie?.title} />
          <div>
            <span className="star-container">
              <span>평균</span>
              <Icon f7="star_fill" size="13px" color="#f82f62" />
              <span>{movie?.stars}</span>
            </span>
          </div>
          <div className="movie-title">{movie?.title}</div>
          <div className="movie-year">{movie?.year}</div>
          <div className="movie-desc">{movie?.description}</div>
          {directorStatus === 'loading' && <div>Loading...</div>}
          {directorStatus === 'error' && <div>{directorError}</div>}
          {director && (
            <div className="movie-director">
              <span>감독: </span>
              <Link href={`/directors/${director?.id}`}>{director?.name}</Link>
            </div>
          )}
          <div className="movie-actor">
            <div>
              출연:&nbsp;
              {actors?.map((actor) => (
                <Link href={`/actors/${actor?.id}`} key={actor.id}>
                  {actor.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="movie-btn">
            <div>
              <Link iconF7="plus" className="plus" onClick={onClickLike} />
              <span>보고싶어요</span>
            </div>
            <div>
              <Link iconF7="cart_badge_plus" onClick={() => console.log('구매하기')} />
              <span>구매하기</span>
            </div>
            <div>
              <Link iconF7="star" className="star" onClick={() => console.log('평가하기')} />
              <span>평가하기</span>
            </div>
          </div>
        </div>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default MovieShowPage;
