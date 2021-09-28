import React, { useCallback } from 'react';
import { f7, Navbar, NavLeft, Link, NavTitle, NavRight, Icon, Badge } from 'framework7-react';

const TopNavBar = ({ f7router, backLink, optionName, cartCount, currentUser, centerTitle }) => {
  const onClickCart = useCallback(() => {
    if (!currentUser) {
      f7.dialog.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?', 'WatchCart', () =>
        f7router.navigate('/mypage'),
      );
    } else {
      // cart 가져오기
      f7router.navigate('/carts');
    }
  }, [currentUser]);

  const onClickSearch = useCallback(() => {
    f7router.navigate('/search');
  }, []);

  return (
    <Navbar className="theme-dark">
      {!backLink && !optionName && (
        <>
          <NavLeft>
            <Link onClick={() => onClickCart()}>
              <Icon ios="f7:cart" aurora="f7:cart" md="material:shopping_cart">
                {currentUser && cartCount > 0 && <Badge color="red">{cartCount}</Badge>}
              </Icon>
            </Link>
          </NavLeft>
          <NavTitle className="title">WatchCart</NavTitle>
          <NavRight>
            <Link iconF7="search" onClick={() => onClickSearch()} />
          </NavRight>
        </>
      )}
      {backLink && <NavLeft backLink="Back" className="back" />}
      {optionName && <NavTitle className="title">{optionName}</NavTitle>}
    </Navbar>
  );
};

export default TopNavBar;
