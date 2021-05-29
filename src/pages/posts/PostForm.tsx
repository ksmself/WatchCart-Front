import React, { useRef } from 'react';
import * as Yup from 'yup';
import { createPost, updatePost } from '@api';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Button } from 'framework7-react';
import { Post } from '@constants';
import { Router } from 'framework7/types';

const PostNewSchema = Yup.object().shape({
  title: Yup.string().required('필수 입력사항입니다.'),
  content: Yup.string()
    .required('필수 입력사항입니다.')
    .min(3, '3글자 이상 입력해주셔야 합니다')
    .max(1000, '1000자 미만으로 작성해주셔야합니다'),
});

interface PostFormProps {
  setPost?: React.Dispatch<React.SetStateAction<Post>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  f7router: Router.Router;
  post?: Post;
}

interface PostFormValue {
  title: string;
  content: string;
}

const PostForm = ({ setPost = null, setPosts, f7router, post = null }: PostFormProps) => {
  const formikRef = useRef(null);
  const initialValues: PostFormValue = {
    title: post?.title,
    content: post?.content,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PostNewSchema}
      innerRef={formikRef}
      onSubmit={async (values, { setSubmitting }: FormikHelpers<PostFormValue>) => {
        f7.dialog.preloader(`게시글 ${post ? '수정' : '생성'}중입니다...`);
        await setSubmitting(true);
        try {
          if (post) {
            const { data } = await updatePost(post.id, values);
            if (data) {
              setPost(data);
              setPosts((posts) => posts.map((p) => (p.id === post.id ? data : p)));
              f7router.back();
            }
          } else {
            const { data } = await createPost(values);
            if (data) {
              setPosts((posts) => [...posts, data]);
              f7router.back();
            }
          }
        } catch (e) {
          throw new Error(e);
        } finally {
          setSubmitting(false);
          f7.dialog.close();
        }
      }}
      validateOnMount
    >
      {({ values, isSubmitting, handleChange, handleBlur, errors, touched, isValid }) => (
        <Form>
          <List noHairlinesMd>
            <ListInput
              label="제목"
              type="text"
              name="title"
              placeholder="제목을 입력해주세요"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessageForce
              errorMessage={touched.title && errors.title}
            />
            <ListInput
              label="내용"
              type="textarea"
              name="content"
              placeholder="내용을 입력해주세요"
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessageForce
              errorMessage={touched.content && errors.content}
            />
            <div className="p-3">
              <Button type="submit" fill large disabled={isSubmitting || !isValid}>
                게시글 {post ? '수정' : '생성'}
              </Button>
            </div>
          </List>
        </Form>
      )}
    </Formik>
  );
};

export default PostForm;
