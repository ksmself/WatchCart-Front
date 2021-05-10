import NotFoundPage from '@pages/404';
import HomePage from '@pages/home';
import IntroPage from '@pages/intro';
import ItemIndexPage from '@pages/items';
import MyPage from '@pages/mypage';
import SignUpPage from '@pages/users/registrations/new';
import LoginPage from '@pages/users/sessions/new';

const routes = [
  { path: '/', component: HomePage },
  { path: '/users/sign_in', component: LoginPage },
  { path: '/users/sign_up', component: SignUpPage },
  { path: '/intro', component: IntroPage },
  { path: '/mypage', component: MyPage },
  { path: '/items', component: ItemIndexPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
