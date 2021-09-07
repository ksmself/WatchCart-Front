import { Page, Toolbar, Icon, Link } from 'framework7-react';
import React, { useState, useEffect, useCallback } from 'react';

import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
import { API_URL, getMovie, getDirector, getPlays, getActors } from '@api';
// import { PageRouteProps } from '@constants';

const MovieShowPage = ({ f7route }) => {
  const movieId = f7route.params.id;
  const [movie, setMovie] = useState(null);
  const [director, setDirector] = useState(null);
  const [actorIds, setActorIds] = useState([]);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getMovie(movieId);
      setMovie(data);
    })();
  }, [movieId]);

  useEffect(() => {
    (async () => {
      const directorId = movie?.director_id;
      if (directorId !== undefined) {
        const { data } = await getDirector(directorId);
        setDirector(data);
      }
    })();
  }, [movie]);

  useEffect(() => {
    (async () => {
      const { data } = await getPlays(movieId);
      const onlyActorIds = data.map((d) => d.actor_id);
      setActorIds(onlyActorIds);
    })();
  }, [movieId]);

  useEffect(() => {
    actorIds?.map((id) => {
      (async () => {
        const { data } = await getActors(id);
        setActors((oldActors) => [...oldActors, data]);
      })();
    });
  }, [actorIds]);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      <div className="movie-container">
        <img src={`${API_URL}${movie?.image_path}`} alt={movie?.title} />
        <div>
          <span className="star-container">
            <span>평균</span>
            <Icon f7="star_fill" size="13px" color="#f82f62"></Icon>
            <span>{movie?.stars}</span>
          </span>
        </div>
        <div className="movie-title">{movie?.title}</div>
        <div className="movie-year">{movie?.year}</div>
        <div className="movie-desc">{movie?.description}</div>
        <div className="movie-director">
          <span>감독: </span>
          <Link href={`/directors/${director?.id}`}>{director?.name}</Link>
        </div>
        <div className="movie-actor">
          <span>출연: </span>
          <div>
            {actors?.map((actor) => (
              <Link href={`/actors/${actor?.id}`} key={actor.id}>
                {actor.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default MovieShowPage;
