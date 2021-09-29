import NotFoundPage from '@pages/404';
import HomePage from '@pages/home';
import IntroPage from '@pages/intro';
import ItemIndexPage from '@pages/items';
import ItemShowPage from '@pages/items/show';
import PostIndexPage from '@pages/posts/index';
import PostShowPage from '@pages/posts/show';
import PostNewPage from '@pages/posts/new';
import PostEditPage from '@pages/posts/edit';
import MyPage from '@pages/mypage';
import SignUpPage from '@pages/users/registrations/new';
import LoginPage from '@pages/users/sessions/new';
import CategoryIndexPage from '@pages/categories/index';
import StarPage from '@pages/star';
import MovieShowPage from '@pages/movies/show';
import DirectorShowPage from '@pages/directors/show';
import ActorShowPage from '@pages/actors/show';
import CategoryShowPage from '@pages/categories/show';
import CartIndexPage from '@pages/carts';
import OrderIndexPage from '@pages/orders';
import OrderCompletePage from '@pages/orders/complete';
import OrderShowPage from '@pages/orders/show';
import Search from '@pages/search';

const routes = [
  { path: '/', component: IntroPage },
  { path: '/users/sign_in', component: LoginPage },
  { path: '/users/sign_up', component: SignUpPage },
  { path: '/intro', component: IntroPage },
  { path: '/categories', component: CategoryIndexPage },
  { path: '/categories/:id', component: CategoryShowPage },
  { path: '/star', component: StarPage },
  { path: '/mypage', component: MyPage },
  { path: '/carts', component: CartIndexPage },
  { path: '/orders', component: OrderIndexPage },
  { path: '/orders/complete/:id', component: OrderCompletePage },
  { path: '/orders/:id', component: OrderShowPage },
  { path: '/search', component: Search },
  { path: '/items', component: ItemIndexPage },
  { path: '/items/:id', component: ItemShowPage },
  { path: '/movies/:id', component: MovieShowPage },
  { path: '/directors/:id', component: DirectorShowPage },
  { path: '/actors/:id', component: ActorShowPage },
  { path: '/posts', component: PostIndexPage },
  { path: '/posts/new', component: PostNewPage },
  { path: '/posts/:id', component: PostShowPage },
  { path: '/posts/:id/edit', component: PostEditPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
