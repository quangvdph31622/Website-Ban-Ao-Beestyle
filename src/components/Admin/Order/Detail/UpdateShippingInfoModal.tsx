import { Modal } from "antd";
import React, {memo} from "react";

interface IProps {
    isShippingInfoModalOpen: boolean;
    setIsShippingInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateShippingInfoModal: React.FC<IProps> = (props) => {
    const { isShippingInfoModalOpen, setIsShippingInfoModalOpen } = props;

    const handleOk = () => {
        setIsShippingInfoModalOpen(false);
    };

    const handleCancel = () => {
        setIsShippingInfoModalOpen(false);
    }

    return (
        <Modal title="Basic Modal" open={isShippingInfoModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    );
}
export default memo(UpdateShippingInfoModal);