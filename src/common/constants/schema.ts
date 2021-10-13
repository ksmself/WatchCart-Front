import { Address } from '@constants';

interface DefaultProps {
  id: number;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export interface User extends DefaultProps, Address {
  email: string;
  name: string;
  phone: string;
  image_path: string;
  status?: string;
  description?: string;
}

// export interface Category extends DefaultProps {
//   title: string;
//   body: string;
//   image_path: string;
// }

export interface Image extends DefaultProps {
  imagable_type: string;
  imagable_id: number;
  image_path: string;
}

export type Category = {
  id: number;
  title: string;
  movies: Movie[];
};

export type Movie = {
  id: number;
  title: string;
  description?: string;
  stars?: number;
  year?: number;
  category_id: number;
  director_id: number;
  image_path: string;
  category?: Category;
  options?: Option[];
  director?: Director;
  played_actors?: Actor[];
};

export type Option = {
  id: number;
  movie_id: number;
  name: string;
  price: number;
  quantity: number;
  movie: Movie;
};

export type Director = {
  id: number;
  name: string;
  movies?: Movie[];
};

export type Actor = {
  id: number;
  name: string;
  movies?: Movie[];
};

export interface Item extends DefaultProps {
  user_id: number;
  category_id: number;
  name: string;
  status: 'active' | 'disabled';
  list_price: number;
  sale_price: number;
  description: string;
  image_path: string;
  category?: Category;
  images?: Image[];
  user?: User;
}

export interface Post extends DefaultProps {
  user_id: number;
  title: string;
  content: string;
  user: User;
}
