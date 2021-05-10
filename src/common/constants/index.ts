import React from 'react';
import { Router } from 'framework7/types';
import packageJson from '../../../package.json';

/** 리터럴 혹은 불변 객체 */
export const TOKEN_KEY = `${packageJson.name}_TOKEN`;
export const CSRF_KEY = `${packageJson.name}_CSRF`;

export const ACTIONS = {
  NEW: 'new',
  INDEX: 'index',
  EDIT: 'edit',
  SHOW: 'show',
};

export const DEFAULT_ACTIONS = Object.values(ACTIONS);

/** 인터페이스 */
/* User Auth Interfaces */
export interface Token {
  token: null | string;
  csrf: null | string;
}

export interface AuthState extends Token {
  // isLoading: boolean;
  currentUser: any; // TODO currentUser 인터페이스화
}

export interface TokenPayload {
  user: any; // TODO IToknePayload any 타입 변경
}
// Shared

export interface PageRouteProps {
  f7route: Router.Route;
  f7router: Router.Router;
}

interface DefaultProps {
  id: number;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  zipcode: string;
  address1: string;
  address2?: string;
}

// Tables

export interface User extends DefaultProps, Address {
  email: string;
  name: string;
  phone: string;
  image_path: string;
  status?: string;
  description?: string;
}

export interface Category extends DefaultProps {
  title: string;
  body: string;
  image_path: string;
}

export interface Image extends DefaultProps {
  imagable_type: string;
  imagable_id: number;
  image_path: string;
}

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
