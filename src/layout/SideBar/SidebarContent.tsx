import CustomScrollbars from '@/components/CustomScrollbars';
import UserInfo from '@/components/UserInfo';
import { MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined } from '@ant-design/icons';
import { Menu, Row } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { items } from './Sidebar.Menu';

const SidebarContent = ({
    collapsed,
    handleCallbackCollapsed,
}: {
    collapsed?: boolean;
    handleCallbackCollapsed?: () => void;
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const selectedKeys = location.pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1] || 'dashboard';

    return (
        <>
            <Row align="middle" justify="center" style={{ height: 120 }}>
                {!collapsed && (
                    <Link to="/">
                        <img
                            height={80}
                            width={100}
                            alt=""
                            src="https://i0.wp.com/daknonggeopark.com/wp-content/uploads/2021/10/logo-CVDC-Dak-Nong19.5-02.png?w=769&ssl=1"
                        />
                    </Link>
                )}
                {/* <div className="gx-linebar" onClick={handleCallbackCollapsed}>
                    {collapsed ? (
                        <MenuUnfoldOutlined className="gx-icon-btn" />
                    ) : (
                        <MenuFoldOutlined className="gx-icon-btn" />
                    )}
                </div> */}
            </Row>
            <CustomScrollbars className="gx-layout-sider-scrollbar">
                <MenuStyled
                    defaultOpenKeys={[defaultOpenKeys]}
                    selectedKeys={[selectedKeys]}
                    mode="inline"
                    items={items}
                    onClick={(e) => navigate('/' + e.key)}
                />
            </CustomScrollbars>
        </>
    );
};

const MenuStyled = styled(Menu)`
    * {
        font-weight: 800;
    }
`;

export default React.memo(SidebarContent);
