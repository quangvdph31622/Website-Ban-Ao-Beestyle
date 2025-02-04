import {Button} from "antd";
import React, {memo, useState} from "react";
import CheckoutComponent from "@/components/Admin/Sale/CheckoutComponent";

interface IProps {
}

const DeliverySale: React.FC<IProps> = (props) => {
    const {} = props;
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                CHECKOUT DELIVERY SALE
            </Button>
            <CheckoutComponent
                title="Checkout Delivery Sale"
                open={open}
                onClose={onClose}
            />
        </>
    )
};

export default memo(DeliverySale);