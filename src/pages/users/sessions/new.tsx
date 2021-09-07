import { loginAPI } from '@api';
import TopNavBar from '@components/TopNavBar';
import useAuth from '@hooks/useAuth';
import { Formik, FormikHelpers } from 'formik';
import { f7, Link, List, ListInput, Navbar, Page } from 'framework7-react';
import React from 'react';
import * as Yup from 'yup';

interface FormValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required('필수 입력사항 입니다'),
  password: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다').required('필수 입력사항 입니다'),
});

const initialValues: FormValues = { email: '', password: '' };

const SessionNewPage = () => {
  const { authenticateUser } = useAuth();

  const handleLogin = async (params, setSubmitting) => {
    setSubmitting(true);
    try {
      const { data: user } = await loginAPI({ ...params });
      authenticateUser(user);
      f7.dialog.alert('성공적으로 로그인 하였습니다. ');
    } catch (error) {
      f7.dialog.alert('정보를 확인 해주세요. ');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<FormValues>) => handleLogin(values, setSubmitting)}
        validateOnMount
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
          <form onSubmit={handleSubmit} class="login-form">
            <List>
              <ListInput
                label={i18next.t('login.email')}
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password')}
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={touched.password && errors.password}
              />
            </List>
            <div>
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50 login-button"
                disabled={isSubmitting || !isValid}
              >
                로그인
              </button>
            </div>
          </form>
        )}
      </Formik>
      <div className="for-sign-up">
        <span>아직 회원이 아니신가요?</span>
        <Link href="/users/sign_up">회원가입하러가기</Link>
      </div>
    </>
  );
};

export default React.memo(SessionNewPage);
