import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber } from 'antd';

interface QuantityControlProps {
    quantity: number;
    quantityInStock: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

const QuantityControl = ({ quantity, quantityInStock, onIncrement, onDecrement }: QuantityControlProps) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>

        <Button
            onClick={onDecrement}
            className="!bg-gray-200 hover:!bg-gray-300 !text-black !font-bold relative z-10
                            !border-none !rounded-none !w-7 !h-7 flex items-center justify-center"
            icon={<MinusOutlined />}
            disabled={quantity <= 1}
        />

        <InputNumber
            min={1}
            value={quantity}
            style={{ textAlignLast: 'center'}}
            className="!text-black !font-semibold !border-0 !w-11 !h-7 custom-input"
            readOnly
            controls={false}
        />

        <Button
            onClick={onIncrement}
            className="!bg-gray-200 hover:!bg-gray-300 !text-black !font-bold relative z-10
                            !border-none !rounded-none !w-7 !h-7 flex items-center justify-center"
            icon={<PlusOutlined />}
            disabled={quantity >= quantityInStock}
        />
    </div>
);

export default QuantityControl;
