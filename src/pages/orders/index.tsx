import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Page } from 'framework7-react';
import { useRecoilState } from 'recoil';
import * as Yup from 'yup';

import { sleep } from '@utils';
import TopNavBar from '@components/TopNavBar';
import { cartItemsState, totalState } from '@pages/carts';
import OrderItem from '@components/OrderItem';

interface FormValues {
  name: string;
  phone: string;
  address: string;
}

const phoneRegex = RegExp(/^\(?([0-9]{3})\)?[-]([0-9]{4})[-]([0-9]{4})$/);

const OrderSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  phone: Yup.string().matches(phoneRegex, '010-0000-0000 형태로 입력해주세요').required('필수 입력사항 입니다'),
  address: Yup.string().required('필수 입력사항 입니다'),
});

const OrderIndexPage = () => {
  const [total, setTotal] = useRecoilState(totalState);
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);
  const initialValues: FormValues = {
    name: '',
    phone: '',
    address: '',
  };

  return (
    <>
      {/* 입력 폼 */}
      <Page className="theme-dark">
        <TopNavBar backLink optionName="주문 페이지" />
        <Formik
          initialValues={initialValues}
          validationSchema={OrderSchema}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            await sleep(400);
            setSubmitting(false);
            f7.dialog.preloader('잠시만 기다려주세요...');
            try {
              // orderAPI
              // const { data: user } = await signupAPI({ ...values });
              console.log(values);
              f7.dialog.close();
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
                  label="수령인"
                  type="text"
                  name="name"
                  placeholder="수령인의 이름을 입력해주세요"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  errorMessageForce
                  errorMessage={touched.name && errors.name}
                />
                <ListInput
                  label="전화번호"
                  type="tel"
                  name="phone"
                  placeholder="010-0000-0000"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  errorMessageForce
                  errorMessage={touched.phone && errors.phone}
                />
                <ListInput
                  label="주소"
                  type="text"
                  name="address"
                  placeholder="수령받을 주소를 입력해주세요"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  errorMessageForce
                  errorMessage={touched.address && errors.address}
                />
              </List>

              {/* 주문 상품 */}
              <div className="px-2 mt-8">
                <div className="mb-3 font-bold text-primary text-base">* 주문 상품</div>
                {cartItems.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>

              <div className="p-4 mb-10">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50 login-button"
                  disabled={isSubmitting || !isValid}
                >
                  {total}원 결제하기
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Page>
    </>
  );
};

export default OrderIndexPage;
