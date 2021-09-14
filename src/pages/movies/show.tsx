import { Page, Toolbar, Icon, Link, f7, Button, Popup, Navbar, NavRight } from 'framework7-react';
import React, { useCallback } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';

import BottomToolBarContent from '@components/BottomToolBarContent';
import TopNavBar from '@components/TopNavBar';
import { API_URL, getMovie, getDirector, isLiked, likeMovie } from '@api';
import useAuth from '@hooks/useAuth';
import SelectOptions from '@components/cart/SelectOptions';

const MovieShowPage = ({ f7route }) => {
  const movieId = f7route.params.id;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: movie, status: movieStatus, error: movieError } = useQuery(`movie-${movieId}`, getMovie(movieId));
  const { data: liked, status: likeStatus, error: likeError } = useQuery(`like-${movieId}`, isLiked(movieId));

  const directorId = movie?.director_id;
  const { data: director, status: directorStatus, error: directorError } = useQuery(
    [`director-${directorId}`, directorId],
    getDirector(directorId),
    { enabled: !!directorId },
  );

  const actors = movie?.played_actors;
  const options = movie?.options;

  const like = useMutation(likeMovie, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(`like-${movieId}`, data.data);
    },
  });

  const onClickLike = useCallback(async () => {
    if (!isAuthenticated) {
      f7.dialog.alert('로그인 후에 보고싶어요를 클릭해주세요!');
    } else {
      like.mutate(movieId);
    }
  }, [isAuthenticated]);

  const onClickBuy = useCallback(() => {
    /**
     * 로그인되어있지 않다면 일단 장바구니에 넣어놓고
     * 로그인 하는 순간 그 정보를 user의 장바구니로
     */
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
              <Link
                style={{ color: liked ? '#f82f62' : '#fff' }}
                iconF7={liked ? 'checkmark_alt' : 'plus'}
                onClick={onClickLike}
              />
              <span style={{ color: liked ? '#f82f62' : '#fff' }}>보고싶어요</span>
            </div>
            <div>
              <Button iconF7="cart_badge_plus" className="buy" popupOpen=".demo-popup-swipe" onClick={onClickBuy} />
              <span>구매하기</span>
            </div>
            <div>
              <Link iconF7="star" className="star" onClick={() => console.log('평가하기')} />
              <span>평가하기</span>
            </div>
          </div>
          <Popup className="demo-popup-swipe" swipeToClose>
            <Page className="theme-dark">
              <Navbar>
                <NavRight>
                  <Link iconF7="xmark" popupClose />
                </NavRight>
              </Navbar>
              {options && <SelectOptions options={options} />}
            </Page>
          </Popup>
        </div>
      )}
      <Toolbar tabbar labels position="bottom">
        <BottomToolBarContent currentIdx={0} />
      </Toolbar>
    </Page>
  );
};

export default MovieShowPage;
