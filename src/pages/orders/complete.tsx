import React from 'react';
import { Page, Icon } from 'framework7-react';

import TopNavBar from '@components/TopNavBar';

const OrderCompletePage = ({ f7router, f7route }) => {
  const orderId = f7route.params.id;

  return (
    <Page className="theme-dark">
      <TopNavBar backLink={false} optionName="WatchCart" />
      <div className="flex flex-col items-center px-8 py-32">
        <div className="font-bold text-lg mb-1.5">주문이 완료되었습니다.</div>
        <div className="mb-6">
          <Icon f7="checkmark_circle" className="font-bold text-primary" />
        </div>
        <div className="flex flex-row">
          <button
            className="px-4 py-2 font-bold bg-indigo-500 break-word"
            onClick={() => f7router.navigate(`/orders/${orderId}`)}
          >
            주문내역 확인하기
          </button>
          <button className="px-4 py-2 font-bold bg-primary break-word" onClick={() => f7router.navigate('/intro')}>
            메인으로 돌아가기
          </button>
        </div>
      </div>
    </Page>
  );
};

export default OrderCompletePage;
