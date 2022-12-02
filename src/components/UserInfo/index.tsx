import { Avatar, Popover, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React from 'react';
import LocalStorage from '@/apis/LocalStorage';

const UserInfo = () => {
    const userMenuOptions = (
        <ul className="gx-user-popover">
            <li>My Account</li>
            <li
                onClick={() => {
                    LocalStorage.removeToken();
                    window.location.reload();
                }}
            >
                Logout
            </li>
        </ul>
    );
    return (
        <Row wrap={false} justify="start" className="gx-avatar-row gx-m-0">
            <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
                <Avatar src="https://via.placeholder.com/150x150" className="gx-size-40 gx-pointer gx-mr-3" alt="" />
                <span className="gx-avatar-name">
                    Nguyễn Như Ý
                    <DownOutlined className="gx-fs-sm gx-ml-4" />
                </span>
            </Popover>
        </Row>
    );
};

export default UserInfo;
