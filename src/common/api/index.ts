import { Category, Item, Token } from '@constants';
import { getToken } from '@store';
import { PlainAPI, API, VERSION, API_URL } from './api.config';
import { ApiService } from './api.service';

export const refresh = (): Promise<{ data: Token }> =>
  PlainAPI.post(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  );

export const get = (url: string, params: any) => PlainAPI.get(url, params);
export const loginAPI = (params: any) => PlainAPI.post('/login', { user: params });
export const signupAPI = (params: any) => PlainAPI.post('/signup', { user: params });
export const logoutAPI = () => API.delete('/logout');
export const updateUser = async (params) => {
  const data = await API.patch(`/users/${params.userId}`, { user: params.user });
  return data;
};
export const getUser = (userId) => async () => {
  const { data } = await API.get(`/users/${userId}`);
  return data;
};
// export const {
//   query: getItems,
//   get: getItem,
//   create: createItem,
//   update: updateItem,
//   destroy: destroyItem,
// } = ApiService('items');

// export const { query: getUsers, get: getUser } = ApiService('users');
// export const { query: getCategories, get: getCategory } = ApiService('categories');

// export const getItems = (params = null) => API.get<any>('/items', { params });
export const getCategories = () => async () => {
  const { data } = await API.get<Category[]>('/categories');
  return data;
};
export const getCategory = (id, url) => async () => {
  const { data } = await API.get<Category>(`/categories/${id}${url}`);
  return data;
};

export const getMovies = (categoryId) => async () => {
  const { data } = await API.get(`/movies?q[category_id_eq]=${categoryId}`);
  return data;
};

export const getMoviesByKeyword = (params) => async () => {
  const { data } = await API.get(`/movies/search?q=${params}`);
  return data;
};

export const getCarts = (userId, orderStatus) => async () => {
  const { data } = await API.get(`/orders?q[user_id_eq]=${userId}&q[status_eq]=${orderStatus}`);
  return data;
};

export const getMovie = (movieId) => async () => {
  const { data } = await API.get(`/movies/${movieId}`);
  return data;
};

export const getDirector = (directorId, url) => async () => {
  const { data } = await API.get(`/directors/${directorId}${url}`);
  return data;
};
export const getActor = (actorId, url) => async () => {
  const { data } = await API.get(`/actors/${actorId}${url}`);
  return data;
};

export const likeMovie = (movieId) => {
  const data = API.post(`/movies/${movieId}/like`);
  return data;
};

export const isLiked = (movieId) => async () => {
  const { data } = await API.get(`/movies/${movieId}/like`);
  return data;
};

export const createLineItem = async (params) => {
  const data = await API.post('/lineitems', { line_item: params });
  return data;
};

export const getLineitemInfo = (orderId) => async () => {
  const data = await API.get(`/lineitems/${orderId}`);
  return data;
};

export const getLineitem = (orderId) => async () => {
  const data = await API.get(`/lineitems?q[order_id_eq]=${orderId}`);
  return data;
};

export const updateLineItem = async (params) => {
  const data = await API.put(`/lineitems/${params.id}`, { line_item: params.line_item });
  return data;
};

export const deleteLineItem = async (lineitemId) => {
  const data = await API.delete(`/lineitems/${lineitemId}`);
  return data;
};

export const getLineitems = (orderId) => async () => {
  const data = await API.get(`/lineitems?q[order_id_eq]=${orderId}&q[status_eq]=complete`);
  return data;
};

export const createOrder = async (params) => {
  const data = await API.post('/orders', { user_id: params });
  return data;
};

export const getOrder = (orderId) => async () => {
  const data = await API.get(`/orders/${orderId}`);
  return data;
};

export const getUserOrders = (userId) => async () => {
  const data = await API.get(`/orders?q[user_id_eq]=${userId}&q[status_eq]=orderCompleted`);
  return data;
};

export const updateOrder = (params) => {
  const data = API.put(`/orders/${params.orderId}`, { order: params.order });
  return data;
};

/*
export const unlikeMovie = (movieId, params) => async () => {
  const { data } = await API.post(`/movies/${movieId}/like`, { params });
  return data;
};
*/

/*
export const getPosts = () => async (params = null) => {
  const { data } = await API.get('/posts', { params });
  return data;
};
export const getPost = (postId) => async () => {
  const { data } = await API.get<any>(`/posts/${postId}`);
  return data;
};
export const createPost = (params) => API.post('/posts', { post: params });

export const updatePost = (postId, params) => API.patch(`/posts/${postId}`, { post: params });

export const destroyPost = (postId) => API.delete(`/posts/${postId}`);
*/

export { API_URL, VERSION };
