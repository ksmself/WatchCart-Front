import React from 'react';
import { useMutation } from 'react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput } from 'framework7-react';
import * as Yup from 'yup';

import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { updateUser } from '@api/index';

interface FormValues {
  name: string;
  email: string;
  current_password: string;
  password: string;
  password_confirmation: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  current_password: Yup.string().required('필수 입력사항 입니다'),
  password: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다'),
  password_confirmation: Yup.string().when('password', {
    is: (password) => password?.length > 0,
    then: Yup.string()
      .required('필수 입력사항입니다')
      .min(4, '길이가 너무 짧습니다')
      .max(50, '길이가 너무 깁니다')
      .oneOf([Yup.ref('password'), null], '비밀번호를 다시 확인해주세요'),
  }),
});

const UserInfoEdit = () => {
  const { currentUser } = useAuth();
  const initialValues: FormValues = {
    name: currentUser.name,
    email: currentUser.email,
    current_password: '',
    password: '',
    password_confirmation: '',
  };

  const updatePassword = useMutation(async (params) => updateUser(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      f7.dialog.alert(data?.data?.error || '비밀번호가 성공적으로 변경됐습니다.');
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpSchema}
      onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
        await sleep(400);
        setSubmitting(false);
        f7.dialog.preloader('잠시만 기다려주세요...');
        try {
          await updatePassword.mutateAsync({ userId: currentUser.id, user: values });
          f7.dialog.close();
        } catch (error) {
          console.log(error);
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
              label={i18next.t('이메일 (수정 불가)')}
              type="email"
              name="email"
              disabled
              value={values.email}
            />
            <ListInput
              label={i18next.t('현재 비밀번호 (필수 입력)')}
              type="password"
              name="current_password"
              placeholder="현재 비밀번호를 입력해주세요"
              clearButton
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.current_password}
              errorMessageForce
              errorMessage={touched.current_password && errors.current_password}
            />
            <ListInput
              label={i18next.t('새 비밀번호')}
              type="password"
              name="password"
              placeholder="새 비밀번호를 입력해주세요"
              clearButton
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              errorMessageForce
              errorMessage={touched.password && errors.password}
            />
            <ListInput
              label={i18next.t('새 비밀번호 확인')}
              type="password"
              name="password_confirmation"
              placeholder="새 비밀번호를 확인해주세요"
              clearButton
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password_confirmation}
              errorMessageForce
              errorMessage={touched.password_confirmation && errors.password_confirmation}
            />
          </List>

          <div className="p-4">
            <button
              type="submit"
              className="button button-fill button-large disabled:opacity-50 login-button"
              disabled={isSubmitting || !isValid}
            >
              정보수정
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserInfoEdit;
