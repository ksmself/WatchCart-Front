import { createPost } from '@api';
import { PageRouteProps } from '@constants';
import { Form, Formik } from 'formik';
import { f7, Navbar, Page, List, ListInput, Button } from 'framework7-react';
import React from 'react';
import * as Yup from 'yup';
import PostForm from './PostForm';

interface PostNewPageProps extends PageRouteProps {
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
}

const PostNewSchema = Yup.object().shape({
  title: Yup.string().required('필수 입력사항입니다.'),
  content: Yup.string()
    .required('필수 입력사항입니다.')
    .min(3, '3글자 이상 입력해주셔야 합니다')
    .max(1000, '1000자 미만으로 작성해주셔야합니다'),
});

const PostNewPage = ({ f7route, f7router, setPosts }: PostNewPageProps) => {
  return (
    <Page noToolbar>
      <Navbar title="게시글 작성" backLink={true}></Navbar>

      <p className="p-3 text-base font-bold">게시글 작성</p>

      <PostForm f7router={f7router} setPosts={setPosts} />
    </Page>
  );
};

export default React.memo(PostNewPage);
