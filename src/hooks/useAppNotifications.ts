import {App} from 'antd';
import {ArgsProps, NotificationConfig, NotificationPlacement} from "antd/es/notification/interface";
import {ReactNode} from "react";

type NotificationType = 'open' | 'success' | 'info' | 'warning' | 'error';
type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';
type ModalType = 'success' | 'info' | 'warning' | 'error' | 'confirm';

const defaultNotificationConfig: NotificationConfig = {
    showProgress: true,
    placement: "bottomLeft" as NotificationPlacement,
};

const useAppNotifications = () => {
    const {notification, message, modal} = App.useApp();

    const showNotification = (type: NotificationType, config: ArgsProps) => {
        notification[type]({
            ...defaultNotificationConfig,
            ...config,
        });
    };

    const showMessage = (type: MessageType, content: string | ReactNode, duration = 2) => {
        message[type](content, duration);
    };

    const showModal = (type: ModalType, config = {}) => {
        modal[type]({
            ...config,
        });
    };

    return {showNotification, showMessage, showModal};
};
export default useAppNotifications;
