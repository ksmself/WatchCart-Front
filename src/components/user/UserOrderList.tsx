import React, { useState } from 'react';

import OrderItem from '@components/OrderItem';
import logo from '../../assets/images/logo.png';

const UserOrderList = () => {
  const [order, setOrder] = useState(0);
  const info = {
    movie_title: '기생충',
    option_price: '6000',
    quantity: 2,
  };

  // GET /orders?q[user_id]=${currenUser.id}
  // => 해당 user가 주문한 order 여러개 출력
  // 그 order들 map 돌면서 먼저 orderId 찾고, 예를 들어 30이다
  // GET /lineitems?q[order_id]=30&q[status]=complete
  // => lineitems들이 출력된다
  // => GET /lineitems/:id 하면 movie_title 등 필요한 정보 받아올 수 있다.

  return (
    <div className="px-4 py-5">
      <div className="border-4 border-primary py-3 px-3.5">
        <div className="mb-4 font-bold text-base">20210917(주문완료)</div>
        <div className="mb-1 font-bold text-primary text-base">* 배송 정보</div>
        <table className="table-fixed mb-4">
          <tbody>
            <tr className="mb-1.5">
              <th className="w-1/3 text-left">수령인</th>
              <td>라치카</td>
            </tr>
            <tr className="mb-1.5">
              <th className="w-1/3 text-left">전화번호</th>
              <td>010-0000-0000</td>
            </tr>
            <tr className="mb-1.5">
              <th className="w-1/3 text-left">주소</th>
              <td>경기도 고양시 일산동구 대화동 강송로 195</td>
            </tr>
          </tbody>
        </table>

        {/* 주문한 상품 정보 */}
        <div className="mb-2 font-bold text-primary text-base">* 주문 상품</div>
        <div className="flex flex-row justify-between items-start mb-1 px-1">
          <div className="flex flex-col">
            <div className="font-bold text-sm mb-2">{info.movie_title}</div>
            <div>
              ₩ {info.option_price} / 수량 {info.quantity}개
            </div>
          </div>
          <img src={logo} className="w-20 h-20" />
        </div>
        {/* 
          {cartItems.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        */}
        <div className="flex flex-row justify-between items-start mb-3 px-1">
          <div className="flex flex-col">
            <div className="font-bold text-sm mb-2">{info.movie_title}</div>
            <div>
              ₩ {info.option_price} / 수량 {info.quantity}개
            </div>
          </div>
          <img src={logo} className="w-20 h-20" />
        </div>
      </div>
    </div>
  );
};

export default UserOrderList;
