import React, { useEffect } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Page } from 'framework7-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { sleep } from '@utils';
import TopNavBar from '@components/TopNavBar';
import { cartItemsState, totalState } from '@pages/carts';
import OrderItem from '@components/OrderItem';
import { API_URL, updateLineItem, updateOrder } from '@api';
import { uncompletedOrderState } from '@pages/intro';
import useAuth from '@hooks/useAuth';

interface FormValues {
  receiver_name: string;
  receiver_phone: string;
  address1: string;
}

const phoneRegex = RegExp(/^\(?([0-9]{3})\)?[-]([0-9]{4})[-]([0-9]{4})$/);

const OrderSchema = Yup.object().shape({
  receiver_name: Yup.string().required('필수 입력사항 입니다'),
  receiver_phone: Yup.string()
    .matches(phoneRegex, '010-0000-0000 형태로 입력해주세요')
    .required('필수 입력사항 입니다'),
  address1: Yup.string().required('필수 입력사항 입니다'),
});

const OrderIndexPage = ({ f7router }) => {
  const { currentUser } = useAuth();
  const total = useRecoilValue(totalState);
  const cartItems = useRecoilValue(cartItemsState);
  const [uncompletedOrderId, setUncompletedOrderId] = useRecoilState(uncompletedOrderState);
  const initialValues: FormValues = {
    receiver_name: '',
    receiver_phone: '',
    address1: '',
  };

  useEffect(() => {
    const getUncompletedOrderId = async () => {
      const url = `${API_URL}/orders?q[user_id_eq]=${currentUser?.id}&q[status_eq]=orderUncompleted`;
      const resp = await fetch(url);
      const body = await resp.json();
      if (body) setUncompletedOrderId(body[0]?.id || null);
    };

    getUncompletedOrderId();
  }, [currentUser]);

  const updateCart = useMutation((params) => updateLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      // 성공적으로 수정함
      console.log('line_item status 수정', data?.data);
      f7router.navigate('/orders/complete');
    },
  });

  const makeOrder = useMutation((params) => updateOrder(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      cartItems.map((v) =>
        updateCart.mutate({
          id: v.id,
          line_item: {
            status: 'complete',
          },
        }),
      );
    },
  });

  useEffect(() => {
    console.log(cartItems);
    console.log(total);
  }, [cartItems, total]);

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
              makeOrder.mutateAsync({
                orderId: uncompletedOrderId,
                order: {
                  receiver_name: values.receiver_name,
                  receiver_phone: values.receiver_phone,
                  address1: values.address1,
                  total: total,
                  status: 'orderCompleted',
                },
              });
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
                  name="receiver_name"
                  placeholder="수령인의 이름을 입력해주세요"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.receiver_name}
                  errorMessageForce
                  errorMessage={touched.receiver_name && errors.receiver_name}
                />
                <ListInput
                  label="전화번호"
                  type="tel"
                  name="receiver_phone"
                  placeholder="010-0000-0000"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.receiver_phone}
                  errorMessageForce
                  errorMessage={touched.receiver_phone && errors.receiver_phone}
                />
                <ListInput
                  label="주소"
                  type="text"
                  name="address1"
                  placeholder="수령받을 주소를 입력해주세요"
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address1}
                  errorMessageForce
                  errorMessage={touched.address1 && errors.address1}
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
