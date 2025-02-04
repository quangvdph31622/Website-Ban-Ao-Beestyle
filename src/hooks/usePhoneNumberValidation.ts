// hooks/usePhoneValidation.ts
import { useState } from 'react';

export function usePhoneValidation() {
  const [error, setError] = useState<string | null>(null);

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^(?:\+84|84|0)(3|5|7|8|9)(\d{8})$/;

  if (!value) { 
      setError('Vui lòng nhập số điện thoại!');
      return Promise.reject('Vui lòng nhập số điện thoại!');
    }

    if (!phoneRegex.test(value)) {
      setError('Số điện thoại không đúng định dạng!');
      return Promise.reject('Số điện thoại không đúng định dạng!');
    }

    setError(null); // Xóa lỗi nếu hợp lệ
    return Promise.resolve();
  };

  return { error, validatePhoneNumber };
}
