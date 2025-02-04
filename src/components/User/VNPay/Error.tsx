'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Result } from 'antd';

const ErrorPage: React.FC = () => {
  const router = useRouter();

  const handleBackHome = () => {
    router.push('/'); // Redirect về trang chủ
  };

  return (
    <div className='my-[150px]'>
      <Result
        status="error"
        title="Giao dịch thất bại"
        subTitle="Đã xảy ra lỗi trong quá trình xử lý thanh toán. Vui lòng thử lại sau."
        extra={
          <Button type="primary" onClick={handleBackHome}>
            Quay lại trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage;
