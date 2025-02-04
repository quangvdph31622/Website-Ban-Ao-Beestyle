import React from 'react';
import { Progress } from 'antd';
import { FaShippingFast } from 'react-icons/fa';

interface ProgressBarProps {
    totalAmount: number;
    condition: number;
}

const ProgressShipping: React.FC<ProgressBarProps> = ({ totalAmount, condition }) => {
    const result = (totalAmount / condition) * 100;
    const progress = result > 100 ? 100 : result;
    const remainingForFreeShipping = condition - totalAmount;
    const iconPosition = `${progress > 100 ? 100 : progress}%`;

    return (
        <div style={{ position: "relative" }}>
            <p style={{ fontSize: 14 }}>
                {remainingForFreeShipping > 0 ? (
                    <>
                        Bạn cần mua thêm
                        <span style={{ fontWeight: 'bold' }}> {remainingForFreeShipping.toLocaleString('vi-VN')}₫ </span>
                        để được <span className="text-uppercase fw-bold">miễn phí vận chuyển</span>
                    </>
                ) : (
                    <>Bạn đã được <span className="text-uppercase fw-bold">miễn phí vận chuyển</span></>
                )}
            </p>
            <Progress
                percent={progress}
                showInfo={false}
                strokeColor={progress < 100 ? '#f7941d' : '#3D9851'}
            />
            <div
                style={{
                    position: "absolute",
                    top: "35px",
                    left: iconPosition,
                    transform: "translateX(-50%)",
                    backgroundColor: progress < 100 ? "#f7941d" : "#3D9851",
                    borderRadius: "50%",
                    padding: "8px",
                    transition: "left 0.4s ease-out"
                }}
            >
                <FaShippingFast size={18} color="#333" />
            </div>
        </div>
    );
};

export default ProgressShipping;
