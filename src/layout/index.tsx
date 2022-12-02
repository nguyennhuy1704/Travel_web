import LocalStorage from '@/apis/LocalStorage';
import CustomScrollbars from '@/components/CustomScrollbars';
import IconAntd from '@/components/IconAntd';
import { TAB_SIZE } from '@/config/theme';
import ErrorBoundary from '@/features/Error/ErrorBoundary';
import useWindowSize from '@/hooks/useWindowSize';
import SideBar from '@/layout/SideBar';
import { wait } from '@/utils';
import { Dropdown, Layout, Menu, Row, Space } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Topbar from './Content/Topbar';
const { Content, Footer } = Layout;
const PageLayout = (PageComponent: React.JSXElementConstructor<any>) => {
    return function WithPage({ ...props }) {
        const [isLogin, setIsLogin] = React.useState(false);
        const userInfor = useSelector((state: any) => state?.root?.user);

        const { width } = useWindowSize();

        const [collapsedMobile, setCollapsedMobile] = React.useState(false);

        const handleCallbackCollapseMobile = React.useCallback(() => {
            setCollapsedMobile(!collapsedMobile);
        }, [collapsedMobile]);

        React.useLayoutEffect(() => {
            if (localStorage.getItem('token')) {
                setIsLogin(true);
            }
        }, []);

        const menu = (
            <Menu
                style={{ width: 250 }}
                items={[
                    {
                        key: '1',
                        label: 'Thông tin cá nhân',
                        icon: <IconAntd icon="UserOutlined" fontSize={16} marginRight={14} />,
                    },
                    {
                        key: '2',
                        label: 'Đăng xuất',
                        icon: <IconAntd icon="LogoutOutlined" fontSize={16} marginRight={14} />,
                        onClick: () => {
                            LocalStorage.removeToken();
                            wait(1000).then(() => {
                                window.location.reload();
                            });
                        },
                    },
                ]}
            />
        );

        return isLogin ? (
            <Layout className="gx-app-layout">
                {/* sidebar */}
                <SideBar
                    collapsedMobile={collapsedMobile}
                    handleCallbackCollapseMobile={handleCallbackCollapseMobile}
                />
                {/* content */}
                <Layout>
                    {/* top content */}
                    {width < TAB_SIZE && <Topbar handleCallbackCollapseMobile={handleCallbackCollapseMobile} />}
                    <TopBar>
                        <div style={{ height: 20 }}></div>
                        <div className="account-block">
                            <Dropdown overlay={menu}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <IconAntd icon="UserOutlined" /> {userInfor?.username}
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </TopBar>
                    {/* body content */}
                    <ErrorBoundary>
                        <Content className="gx-layout-content">
                            <div className="gx-main-content-wrapper" style={{ overflow: 'auto', marginTop: 70 }}>
                                <CustomScrollbars>
                                    <PageComponent {...props} />
                                </CustomScrollbars>
                            </div>
                            {/* footer content */}
                            {/* <Footer>
                                <div className="gx-layout-footer-content">
                                    <div className="gx-layout-footer-content">WindsSoft Frontend Team - 2022</div>
                                </div>
                            </Footer> */}
                        </Content>
                    </ErrorBoundary>
                </Layout>
            </Layout>
        ) : (
            <Layout className="gx-app-layout">
                <ContainerAuthStyled justify="center" align="middle">
                    <PageComponent {...props} />
                </ContainerAuthStyled>
            </Layout>
        );
    };
};

const ContainerAuthStyled = styled(Row)`
    min-height: 100vh;
`;

const TopBar = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

    .account-block {
        width: 18%;
        position: absolute;
        right: 180px;
        z-index: 3;
        margin: 0 auto;
    }
`;

export default PageLayout;
