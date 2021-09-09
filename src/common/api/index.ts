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
export const updateUser = (userId, params) => {
  API.patch(`/users/${userId}`, { user: params });
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
export const getCategory = (id, params = null) => async () => {
  const { data } = await API.get<Category>(`/categories/${id}`, { params });
  return data;
};

export const getMovies = (categoryId) => async () => {
  const { data } = await API.get(`/movies?q[category_id_eq]=${categoryId}`);
  return data;
};

export const getMovie = (movieId) => async () => {
  const { data } = await API.get(`/movies/${movieId}`);
  return data;
};

export const getDirector = (directorId) => async () => {
  const { data } = await API.get(`/directors/${directorId}`);
  return data;
};
export const getPlays = (movieId) => async () => {
  const { data } = await API.get(`/plays?q[movie_id_eq]=${movieId}`);
  return data;
};
// export const getActor = (actorId) => async () => {
//   const { data } = await API.get(`/actors/${actorId}`);
//   return data;
// };
export const getActor = (actorId) => API.get(`/actors/${actorId}`);
export const getActors = (actorId) => async () => {
  const { data } = await API.get(`/actors/${actorId}`);
  return data;
};

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

export { API_URL, VERSION };
