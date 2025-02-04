import { useState } from 'react';

export function useEmailValidation() {
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!value) {
      setError('Vui lòng nhập email!');
      return Promise.reject('Vui lòng nhập email!');
    }

    if (!emailRegex.test(value)) {
      setError('Email không đúng định dạng!');
      return Promise.reject('Email không đúng định dạng!');
    }

    setError(null); // Xóa lỗi nếu hợp lệ
    return Promise.resolve();
  };

  return { error, validateEmail };
}
