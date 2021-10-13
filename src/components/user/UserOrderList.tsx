import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';

import useAuth from '@hooks/useAuth';
import { API_URL, getUser } from '@api';
import Loading from '@components/Loading';
import { User } from '@constants';

dayjs.locale('ko');

const UserOrderList = () => {
  const { currentUser } = useAuth();
  const { data: userInfo, status, error } = useQuery<User>(`userInfo-${currentUser.id}`, getUser(currentUser.id));

  const [onlyOrder, setOnlyOrder] = useState(null);
  useEffect(() => {
    setOnlyOrder(userInfo?.orders);
  }, [userInfo]);

  return (
    <>
      {status === 'loading' && (
        <div className="m-32">
          <Loading />
        </div>
      )}
      {status === 'error' && <div className="flex justify-center">{error}</div>}
      {onlyOrder &&
        onlyOrder.map((order) => {
          if (order.status === 'orderCompleted') {
            return (
              <div key={order.id} className="px-4 py-5">
                <div className="border-4 border-primary py-3 px-3.5">
                  <div className="mb-4 font-bold text-base">
                    {dayjs(order.updated_at).format('YYYY년 MM월 DD일')}(주문완료)
                  </div>
                  <div className="mb-1 font-bold text-primary text-base">* 배송 정보</div>
                  <table className="table-fixed mb-4">
                    <tbody>
                      <tr className="mb-1.5">
                        <th className="w-1/3 text-left">수령인</th>
                        <td className="pl-5">{order.receiver_name}</td>
                      </tr>
                      <tr className="mb-1.5">
                        <th className="w-1/3 text-left">전화번호</th>
                        <td className="pl-5">{order.receiver_phone}</td>
                      </tr>
                      <tr className="mb-1.5">
                        <th className="w-1/3 text-left">주소</th>
                        <td className="pl-5">{order.address1}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 주문한 상품 정보 */}
                  <div className="mb-2 font-bold text-primary text-base">* 주문 상품</div>
                  {order.line_items?.length > 0 &&
                    order.line_items.map((item) => {
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
                  <div className="flex justify-between items-center mt-5">
                    <div className="mr-3 text-sm font-bold text-white">총 주문금액) </div>
                    <div className="text-indigo-500 text-xl font-bold">₩{order.total}</div>
                  </div>
                </div>
              </div>
            );
          }
        })}
    </>
  );
};

export default UserOrderList;
