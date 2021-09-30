import { Page, Icon, Link, f7, Button } from 'framework7-react';
import React, { useCallback, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';

import TopNavBar from '@components/TopNavBar';
import { API_URL, getMovie, isLiked, likeMovie, goodMovie, badMovie, isGood, isBad } from '@api';
import useAuth from '@hooks/useAuth';
import Loading from '@components/Loading';
import OptionPopup from '@components/cart/OptionPopup';

const MovieShowPage = ({ f7route, f7router }) => {
  const movieId = f7route.params.id;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [rateOpen, setRateOpen] = useState(false);

  const { data: movie, status: movieStatus, error: movieError } = useQuery(`movie-${movieId}`, getMovie(movieId));
  const { data: liked, status: likeStatus, error: likeError } = useQuery(`like-${movieId}`, isLiked(movieId));
  const { data: movieIsGood, status: goodStatus, error: goodError } = useQuery(`good-${movieId}`, isGood(movieId));
  const { data: movieIsBad, status: badStatus, error: badError } = useQuery(`bad-${movieId}`, isBad(movieId));

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

  const good = useMutation(goodMovie, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(`good-${movieId}`, data.data);
      // delay 주고 close
      setRateOpen(false);
    },
  });

  const bad = useMutation(badMovie, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(`bad-${movieId}`, data.data);
      // delay 주고 close
      setRateOpen(false);
    },
  });

  const onClickLike = useCallback(async () => {
    if (!isAuthenticated) {
      // 로그인 되어 있지 않다면 모달 띄우기
      if (!isAuthenticated) {
        f7.dialog.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?', 'WatchCart', () =>
          f7router.navigate('/mypage'),
        );
      }
    } else {
      like.mutate(movieId);
    }
  }, [isAuthenticated]);

  const onClickBuy = useCallback(() => {
    // 로그인 되어 있지 않다면 모달 띄우기
    if (!isAuthenticated) {
      f7.dialog.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?', 'WatchCart', () =>
        f7router.navigate('/mypage'),
      );
    }
  }, [isAuthenticated]);

  const onClickRate = useCallback(() => {
    // 로그인 되어 있지 않다면 모달 띄우기
    if (!isAuthenticated) {
      f7.dialog.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?', 'WatchCart', () =>
        f7router.navigate('/mypage'),
      );
    } else {
      // setRateOpen(true);
      if (movieIsGood) good.mutate(movieId);
      if (movieIsBad) bad.mutate(movieId);
      if (!movieIsGood && !movieIsBad) setRateOpen(true);
    }
  }, [isAuthenticated, movieIsGood, movieIsBad]);

  const thumbsUp = useCallback(() => {
    good.mutate(movieId);
  }, []);

  const thumbsDown = useCallback(() => {
    bad.mutate(movieId);
  }, []);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink backLinkForce={true} />
      {movieStatus === 'loading' && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {movieStatus === 'error' && <div className="flex justify-center">{movieError}</div>}
      {likeStatus === 'error' && <div className="flex justify-center">{likeError}</div>}
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
          <div className="movie-director">
            <span>감독: </span>
            <Link href={`/directors/${movie?.director?.id}`}>{movie?.director?.name}</Link>
          </div>
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
          <div className="movie-btn relative">
            <div className="flex flex-col items-center">
              <Link
                className="mb-4"
                style={{ color: liked ? '#f82f62' : '#fff' }}
                iconF7={liked ? 'checkmark_alt' : 'plus'}
                onClick={onClickLike}
              />
              <span style={{ color: liked ? '#f82f62' : '#fff' }}>보고싶어요</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                iconF7="cart_badge_plus"
                className="buy mb-4"
                popupOpen=".demo-popup-swipe"
                onClick={() => onClickBuy()}
              />
              <span>구매하기</span>
            </div>
            <div className="flex flex-col items-center">
              <Link
                style={{ color: movieIsGood || movieIsBad ? '#f82f62' : '#fff' }}
                iconF7={movieIsGood ? 'hand_thumbsup_fill' : movieIsBad ? 'hand_thumbsdown_fill' : 'star'}
                className="star mb-4"
                onClick={() => onClickRate()}
              />
              <span style={{ color: movieIsGood || movieIsBad ? '#f82f62' : '#fff' }}>평가하기</span>
            </div>
            {rateOpen && (
              <div className="absolute -top-14 right-1 flex z-10">
                <Button
                  iconF7="xmark_circle"
                  className="x-btn absolute -top-9 left-0 p-0"
                  onClick={() => setRateOpen(false)}
                />
                <Button
                  iconF7={movieIsGood ? 'hand_thumbsup_fill' : 'hand_thumbsup'}
                  className="w-12 h-12 mr-2 border rounded-full bg-black"
                  onClick={() => thumbsUp()}
                />
                <Button
                  iconF7={movieIsBad ? 'hand_thumbsdown_fill' : 'hand_thumbsdown'}
                  className="w-12 h-12 border rounded-full bg-black"
                  onClick={() => thumbsDown()}
                />
              </div>
            )}
          </div>

          {isAuthenticated && <OptionPopup options={options} f7router={f7router} />}
        </div>
      )}
    </Page>
  );
};

export default MovieShowPage;
