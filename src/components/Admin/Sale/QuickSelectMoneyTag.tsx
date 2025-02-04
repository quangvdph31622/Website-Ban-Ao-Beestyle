import React, {memo} from 'react';
import {Col, Row, Tag} from 'antd';
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {PaymentInfo} from "@/components/Admin/Sale/CheckoutComponent";

interface IProps {
    amountDue: number,
    step: number,
    selectedTag: number,
    setSelectedTag: (value: number) => void
    setPaymentInfo: React.Dispatch<React.SetStateAction<PaymentInfo>>;
}

const QuickSelectMoneyTag: React.FC<IProps> = (props) => {
    const {amountDue, step, selectedTag, setSelectedTag, setPaymentInfo} = props;

    const tagMoneyOptions = Array.from({ length: 5 }, (_, index) => amountDue + index * step);

    const handleChangeQuickSelectMoney = (tag: number, checked: boolean) => {
        const valueSelectedTag = checked ? tag : tagMoneyOptions.find((t) => t === tag);
        // console.log('money quick select: ', valueSelectedTag);
        setSelectedTag(valueSelectedTag ?? 0);
        setPaymentInfo((prevValue: PaymentInfo) => ({
            ...prevValue,
            amountPaid: valueSelectedTag && valueSelectedTag !== 0 ? valueSelectedTag : prevValue.amountPaid
        }));
    };

    return (
        <Row wrap gutter={[8, 8]} style={{width: "100%"}} className="container-tag-price">
            {tagMoneyOptions.map<React.ReactNode>((tag, index) => (
                <Col key={index}>
                    <Tag.CheckableTag
                        key={tag}
                        checked={selectedTag === tag}
                        onChange={(checked) => handleChangeQuickSelectMoney(tag, checked)}
                        className="tag-price-item"
                    >
                        {`${tag}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                    </Tag.CheckableTag>
                </Col>
            ))}
        </Row>
    );
};
export default memo(QuickSelectMoneyTag);