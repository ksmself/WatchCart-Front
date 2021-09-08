import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, ListItem } from 'framework7-react';
import * as Yup from 'yup';
import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { updateUser } from '@api';

interface FormValues {
  name: string;
  email: string;
  curPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  curPassword: Yup.string().required('필수 입력사항 입니다'),
  newPassword: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다'),
  newPassword_confirmation: Yup.string().when('newPassword', {
    is: (newPassword) => newPassword?.length > 0,
    then: Yup.string()
      .required('필수 입력사항입니다')
      .min(4, '길이가 너무 짧습니다')
      .max(50, '길이가 너무 깁니다')
      .oneOf([Yup.ref('newPassword'), null], '비밀번호를 다시 확인해주세요'),
  }),
});

const UserInfoEdit = () => {
  const { authenticateUser, currentUser } = useAuth();
  const initialValues: FormValues = {
    name: currentUser.name,
    email: currentUser.email,
    curPassword: '',
    newPassword: '',
    newPassword_confirmation: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpSchema}
      onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
        await sleep(400);
        setSubmitting(false);
        f7.dialog.preloader('잠시만 기다려주세요...');
        try {
          const { data: user } = await updateUser(currentUser.id, { user: values });
          f7.dialog.close();
          // 성공적으로 변경됐다면 모달 띄우기
          // unAuthenticateUser();
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
              label={i18next.t('이메일 (수정 불가)')}
              type="email"
              name="email"
              disabled
              value={values.email}
            />
            <ListInput
              label={i18next.t('현재 비밀번호 (필수 입력)')}
              type="password"
              name="curPassword"
              placeholder="현재 비밀번호를 입력해주세요"
              clearButton
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.curPassword}
              errorMessageForce
              errorMessage={touched.curPassword && errors.curPassword}
            />
            <ListInput
              label={i18next.t('새 비밀번호')}
              type="password"
              name="newPassword"
              placeholder="새 비밀번호를 입력해주세요"
              clearButton
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.newPassword}
              errorMessageForce
              errorMessage={touched.newPassword && errors.newPassword}
            />
            <ListInput
              label={i18next.t('새 비밀번호 확인')}
              type="password"
              name="newPassword_confirmation"
              placeholder="새 비밀번호를 확인해주세요"
              clearButton
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.newPassword_confirmation}
              errorMessageForce
              errorMessage={touched.newPassword_confirmation && errors.newPassword_confirmation}
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
