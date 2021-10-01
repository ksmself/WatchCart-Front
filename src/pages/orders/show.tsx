import React, { useEffect } from 'react';
import { Page } from 'framework7-react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';

import TopNavBar from '@components/TopNavBar';
import { API_URL, getOrder } from '@api';
import Loading from '@components/Loading';

dayjs.locale('ko');

const OrderShowPage = ({ f7route }) => {
  const orderId = f7route.params.id;

  const { data, status, error } = useQuery(`order-${orderId}`, getOrder(orderId));

  return (
    <Page className="theme-dark">
      <TopNavBar backLink optionName="Order" />
      {status === 'loading' && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {status === 'error' && <div className="flex justify-center">{error}</div>}

      <div className="my-7 px-4">
        <div className="border-4 border-primary py-3 px-3.5">
          <div className="mb-4 font-bold text-base">
            {dayjs(data?.data.created_at).format('YYYY년 MM월 DD일')}(주문완료)
          </div>
          <div className="mb-1 font-bold text-primary text-base">* 배송 정보</div>
          <table className="table-fixed mb-4">
            <tbody>
              <tr className="mb-1.5">
                <th className="w-1/3 text-left">수령인</th>
                <td className="pl-5">{data?.data.receiver_name}</td>
              </tr>
              <tr className="mb-1.5">
                <th className="w-1/3 text-left">전화번호</th>
                <td className="pl-5">{data?.data.receiver_phone}</td>
              </tr>
              <tr className="mb-1.5">
                <th className="w-1/3 text-left">주소</th>
                <td className="pl-5">{data?.data.address1}</td>
              </tr>
            </tbody>
          </table>

          {/* 주문한 상품 정보 */}
          <div className="mb-2 font-bold text-primary text-base">* 주문 상품</div>
          {data?.data.line_items?.length > 0 &&
            data?.data.line_items.map((item) => {
              if (item.status === 'complete') {
                return (
                  <div key={item.id} className="flex flex-row justify-between items-start mb-4 px-1">
                    <div className="flex flex-col">
                      <div className="font-bold text-sm mb-1">{item.option.name}</div>
                      <div className="text-xs mb-2 text-gray-300">{item.option.movie.title}</div>
                      <div>
                        ₩ {item.option.price} / 수량 {item.quantity}개
                      </div>
                    </div>
                    <img
                      src={`${API_URL}${item.option.movie.image_path}`}
                      className="w-20 h-20"
                      alt={item.option.name || '이미지'}
                    />
                  </div>
                );
              }
            })}
          <div className="flex justify-between items-center mt-6">
            <div className="mr-3 text-sm font-bold text-white">총 주문금액) </div>
            <div className="text-indigo-500 text-xl font-bold">₩{data?.data.total}</div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default OrderShowPage;
