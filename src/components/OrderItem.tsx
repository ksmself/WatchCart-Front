import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { API_URL } from '@api';
import { itemIds } from './cart/CartItem';

const OrderItem = ({ item }) => {
  const [info, setInfo] = useRecoilState(itemIds(item.id));

  useEffect(() => {
    const getInfo = async (itemId) => {
      const url = `${API_URL}/lineitems/${itemId}`;
      const resp = await fetch(url);
      const body = await resp.json();
      setInfo(body);
    };

    getInfo(item.id);
  }, []);

  return (
    <div className="flex flex-row justify-between items-start mb-5">
      <div className="flex flex-col">
        <div className="font-bold text-lg mb-2">{info.movie_title}</div>
        <div>
          ₩ {info.option_price} / 수량 {info.quantity}개
        </div>
      </div>
      <img src={`${API_URL}/uploads/${info.image_path}`} className="w-20 h-20" />
    </div>
  );
};

export default OrderItem;
