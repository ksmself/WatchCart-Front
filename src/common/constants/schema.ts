import { Address } from '@constants';

interface DefaultProps {
  id: number;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  address1: string;
  liked_movies: Movie[];
  rated_good: Movie[];
  rated_bad: Movie[];
  orders: Order[];
};

export interface Image extends DefaultProps {
  imagable_type: string;
  imagable_id: number;
  image_path: string;
}

export type Category = {
  id: number;
  title: string;
  movies: Movie[];
  image_path: string;
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

export type LineItem = {
  id: number;
  option_id: number;
  order_id: number;
  quantity: number;
  status: string;
  option: Option;
  check?: boolean;
};

export type Order = {
  id: number;
  user_id: number;
  receiver_name: string;
  receiver_phone: string;
  address1: string;
  total: number;
  created_at: string;
  updated_at: string;
  status: string;
  line_items: LineItem[];
};

export type Observer = {
  root?: any;
  target: any;
  onIntersect: any;
  threshold?: number;
  rootMargin?: string;
  enabled: boolean;
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
