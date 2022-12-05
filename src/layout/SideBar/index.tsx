import { TAB_SIZE } from '@/config/theme';
import useWindowSize from '@/hooks/useWindowSize';
import { Drawer, Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';
import SidebarContent from './SidebarContent';

const SideBar = ({
    collapsedMobile,
    handleCallbackCollapseMobile,
}: {
    collapsedMobile: boolean;
    handleCallbackCollapseMobile: () => void;
}) => {
    const [collapsed, setCollapsed] = React.useState<boolean>(false);

    const { width } = useWindowSize();

    const handleCallbackCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <SiderStyled
            className={`gx-app-sidebar ${width < TAB_SIZE && 'gx-collapsed-sidebar'} ${collapsed && 'gx-mini-sidebar'}`}
            trigger={null}
            collapsed={width < TAB_SIZE ? false : collapsed}
            collapsible
        >
            {width < TAB_SIZE ? (
                <Drawer
                    // className="gx-drawer-sidebar gx-drawer-sidebar-bright"
                    placement="left"
                    closable={false}
                    onClose={handleCallbackCollapseMobile}
                    open={collapsedMobile}
                >
                    <SidebarContent />
                </Drawer>
            ) : (
                <SidebarContent handleCallbackCollapsed={handleCallbackCollapsed} collapsed={collapsed} />
            )}
        </SiderStyled>
    );
};

const SiderStyled = styled(Layout.Sider)`
    background-color: #def4fc;
    border-right: 1.5px solid #e3e3e3;

    & .ant-menu-vertical .ant-menu-item:after,
    .ant-menu-vertical-left .ant-menu-item:after,
    .ant-menu-vertical-right .ant-menu-item:after,
    .ant-menu-inline .ant-menu-item:after {
        border: none;
    }

    li.ant-menu-item.ant-menu-item-selected {
        border-radius: 14px;
        background-color: #0093e9;
        background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
        color: white;
    }

    & li.ant-menu-item {
        border-radius: 14px;

        margin: 10px 0;
    }
    & * {
        transition: none !important;
        animation: none !important;
    }

    & ul.ant-menu.ant-menu-root {
        padding: 0 15px;
        background-color: #def4fc;
    }
`;

export default React.memo(SideBar);
