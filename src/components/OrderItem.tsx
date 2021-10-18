import React from 'react';

import { API_URL } from '@api/api.config';

const OrderItem = ({ item }) => (
  <div className="flex flex-row justify-between items-start mb-5">
    <div className="flex flex-col">
      <div className="font-bold text-lg mb-1">{item.option.name}</div>
      <div className="text-xs mb-2 text-gray-300">{item.option.movie.title}</div>
      <div>
        ₩ {item.option.price} / 수량 {item.quantity}개
      </div>
    </div>
    <img src={`${API_URL}${item.option.movie.image_path}`} alt={`${item.option.movie.title}`} className="w-20 h-20" />
  </div>
);

export default OrderItem;
