import { createPost } from '@api';
import { PageRouteProps } from '@constants';
import { Form, Formik } from 'formik';
import { f7, Navbar, Page, List, ListInput, Button } from 'framework7-react';
import React from 'react';
import * as Yup from 'yup';
import posts from '.';

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

      <Formik
        initialValues={{ title: '', content: '' }}
        validationSchema={PostNewSchema}
        onSubmit={async (values, { setSubmitting }) => {
          f7.dialog.preloader('게시글 생성중입니다...');
          await setSubmitting(true);
          try {
            const { data } = await createPost(values);
            if (data) {
              await setPosts((posts) => [...posts, data]);
              f7router.back();
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
                  게시글 작성
                </Button>
              </div>
            </List>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(PostNewPage);
