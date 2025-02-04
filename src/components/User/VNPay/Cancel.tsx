'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Result } from 'antd';

const CancelPage: React.FC = () => {
  const router = useRouter();

  const handleRetryPayment = () => {
    router.push('/checkout'); // Redirect đến trang thanh toán nếu có
  };

  return (
    <div className='my-[150px]'>
      <Result
        status="warning"
        title="Bạn đã hủy giao dịch"
        subTitle="Bạn có thể thử lại thanh toán nếu muốn."
        extra={
          <Button type="primary" onClick={handleRetryPayment}>
            Thử lại thanh toán
          </Button>
        }
      />
    </div>
  );
};

export default CancelPage;
