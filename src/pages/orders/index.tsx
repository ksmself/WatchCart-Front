import React, { useEffect, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Page } from 'framework7-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

import { sleep } from '@utils';
import TopNavBar from '@components/TopNavBar';
import { cartItemsState, totalState } from '@pages/carts';
import OrderItem from '@components/OrderItem';
import { API_URL, createOrder, updateLineItem, updateOrder } from '@api';
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
  const initialValues: FormValues = {
    receiver_name: '',
    receiver_phone: '',
    address1: '',
  };

  const total = useRecoilValue(totalState);
  const cartItems = useRecoilValue(cartItemsState);

  // selected는 check된 아이템
  const selected = cartItems.filter((v) => v.check === undefined || v.check === true);

  // cartItems 전부가 select 되었다면 allChecked는 true
  const allChecked = selected.length === cartItems.length;

  // selectedTotal: select 합계
  const selectedTotal = selected.reduce((acc, cur) => acc + cur.option.price * cur.quantity, 0);

  const { currentUser } = useAuth();
  const [uncompletedOrderId, setUncompletedOrderId] = useRecoilState(uncompletedOrderState);
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
      // line_item의 status가 complete 될 때
      console.log(data.data);
      // data.data.order_id를 넘겨줘야 함
      f7router.navigate(`/orders/complete/${data?.data?.order_id}`);
    },
  });

  const makeOrder = useMutation((params) => updateOrder(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      if (allChecked) {
        cartItems.map((v) =>
          updateCart.mutate({
            id: v.id,
            line_item: {
              status: 'complete',
            },
          }),
        );
      } else {
        selected.map((v) =>
          updateCart.mutate({
            id: v.id,
            line_item: {
              status: 'complete',
            },
          }),
        );
      }
    },
  });

  // allChecked가 아니라면 new Order를 만들어줘야 함
  const [newOrderId, setNewOrderId] = useState(null);

  // 새로운 order를 위해 필요한 values
  const [values, setValues] = useState(null);
  // 새로운 order가 completedOrder가 되고자 할 때 사용
  const updateSelected = useMutation((params) => updateLineItem(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      if (newOrderId !== null) {
        makeOrder.mutateAsync({
          orderId: newOrderId,
          order: {
            receiver_name: values.receiver_name,
            receiver_phone: values.receiver_phone,
            address1: values.address1,
            total: selectedTotal,
            status: 'orderCompleted',
          },
        });
      }
    },
  });

  // 새로운 order 생성
  const createNewOrder = useMutation((params) => createOrder(params), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      setNewOrderId(data?.data?.id);
    },
  });

  // selected의 order_id를 newOrderId로 바꿔줌(단, newOrderId가 null이 아닐때만)
  useEffect(() => {
    if (newOrderId !== null) {
      selected.map((v) => {
        updateSelected.mutateAsync({ id: v.id, line_item: { order_id: newOrderId } });
      });
    }
  }, [newOrderId]);

  return (
    <>
      {/* 입력 폼 */}
      <Page className="theme-dark">
        <TopNavBar backLink optionName="주문 페이지" />
        <Formik
          initialValues={initialValues}
          validationSchema={OrderSchema}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            setValues(values);
            await sleep(400);
            setSubmitting(false);
            f7.dialog.preloader('잠시만 기다려주세요...');
            try {
              if (allChecked) {
                // allChecked이면 지금과 같은 방식으로
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
              } else {
                createNewOrder.mutateAsync(currentUser?.id);
              }

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
                {selected.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>

              <div className="p-4 mb-10">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50 login-button"
                  disabled={isSubmitting || !isValid}
                >
                  {selectedTotal}원 결제하기
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
