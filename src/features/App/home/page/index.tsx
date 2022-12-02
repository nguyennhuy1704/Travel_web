import LocalStorage from '@/apis/LocalStorage';
import IconAntd from '@/components/IconAntd';
import CustomLoading from '@/components/Loading';
import Container from '@/container/Container';
import { wait } from '@/utils';
import { Button, Col, message, PageHeader, Row, Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { homeService } from '../service';
const HomePage = () => {
    const [isLoading, setIsLoadng] = React.useState<boolean>(false);
    const [posts, setPosts] = React.useState<number>();
    const [tours, setTours] = React.useState<number>();
    const [customers, setCustomers] = React.useState<number>();
    const listBlocks = [
        {
            id: 1,
            title: 'Bài viết',
            value: posts,
            icon: <IconAntd icon="ReadOutlined" fontSize={40} />,
        },
        {
            id: 2,
            title: 'Tour du lịch',
            value: tours,
            icon: <IconAntd icon="AliwangwangOutlined" fontSize={40} />,
        },
        {
            id: 3,
            title: 'Khách hàng',
            value: customers,
            icon: <IconAntd icon="TeamOutlined" fontSize={40} />,
        },
    ];

    const renderBlock = (item: any, index: number) => {
        return (
            <Col key={index} className="gutter-row" span={8}>
                <ItemBlock>
                    <div className="info-block">
                        <p className="title">{item.title}</p>
                        <div className="statistic-block">
                            <p className="statistic">{item.value}</p>
                        </div>
                    </div>
                    <div className="icon-block">
                        <div className="icon">{item.icon}</div>
                    </div>
                </ItemBlock>
            </Col>
        );
    };

    const getData = async () => {
        try {
            setIsLoadng(true);
            const res = await homeService.getData();
            if (res.status) {
                setPosts(res?.data?.news);
                setTours(res?.data?.tour);
                setCustomers(res?.data?.customer);
            } else {
                message.error('Đã có lỗi xảy ra!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoadng(false);
        }
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={<PageHeader style={{ borderRadius: 8 }} title="Tổng quan" />}
                contentComponent={
                    <CustomLoading isLoading={isLoading}>
                        <Row gutter={12} style={{ minHeight: 700 }}>
                            {listBlocks.map((item: any, index: number) => renderBlock(item, index))}
                        </Row>
                    </CustomLoading>
                }
            />
        </CustomLoading>
    );
};

const ContentBlock = styled.div`
    width: 100%;
    padding: 30px;

    .label {
        font-weight: 800;
        padding-left: 10px;
        padding-bottom: 20px;
        font-size: 30px;
    }
`;

const ItemBlock = styled.div`
    width: 80%;
    height: 100px;
    background: white;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

    .info-block {
        flex: 2;
        padding: 20px;

        .title {
            font-size: 22px;
            font-weight: 700;
        }

        .statistic-block {
            margin-top: -14px;
        }
    }

    .icon-block {
        flex: 1;
        position: relative;

        .icon {
            margin: auto;
            width: 40px;
            height: 40px;
            position: absolute;
            top: 25%;
        }
    }
`;

export default HomePage;
