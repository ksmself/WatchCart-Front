import { signupAPI } from '@api';
import TopNavBar from '@components/TopNavBar';
import useAuth from '@hooks/useAuth';
import { getCurrentUserFromToken, sleep } from '@utils';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Page } from 'framework7-react';
import React, { useEffect } from 'react';
import * as Yup from 'yup';

interface FormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  address1: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  email: Yup.string().email().required('필수 입력사항 입니다'),
  password: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다').required('필수 입력사항 입니다'),
  password_confirmation: Yup.string()
    .min(4, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .required('필수 입력사항 입니다')
    .oneOf([Yup.ref('password'), null], '비밀번호를 다시 확인해주세요'),
});

const SignUpPage = ({ f7router }) => {
  const { authenticateUser, isAuthenticated } = useAuth();
  const initialValues: FormValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    address1: null,
  };

  useEffect(() => {
    if (isAuthenticated) {
      f7router.navigate('/mypage');
    }
  }, [isAuthenticated]);

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={true} />
      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
          await sleep(400);
          setSubmitting(false);
          f7.dialog.preloader('잠시만 기다려주세요...');
          try {
            const { data: user } = await signupAPI({ ...values });
            f7.dialog.close();
            authenticateUser(user);
          } catch (error) {
            f7.dialog.close();
            f7.dialog.alert(error?.response?.data || error?.message);
          }
        }}
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form className="login-form">
            <List noHairlinesMd>
              <ListInput
                label={i18next.t('login.name')}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t('login.email')}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password')}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={touched.password && errors.password}
              />
              <ListInput
                label={i18next.t('login.password_confirmation')}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce
                errorMessage={touched.password_confirmation && errors.password_confirmation}
              />
              <ListInput
                label={i18next.t('주소 (선택)')}
                type="text"
                name="address1"
                placeholder="주소를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address1}
                errorMessageForce
                errorMessage={touched.address1 && errors.address1}
              />
            </List>

            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50 login-button"
                disabled={isSubmitting || !isValid}
              >
                회원가입
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SignUpPage);
