import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const openNotificationWithIcon = (type: NotificationType, msg: string, des: string, duration?: number) => {
    notification[type]({
        message: msg,
        description: des,
        duration,
    });
};
