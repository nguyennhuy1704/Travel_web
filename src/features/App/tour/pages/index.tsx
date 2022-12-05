import ButtonAdd from '@/components/Button/ButtonAdd';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import TableComponent from '@/components/TableComponents';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import useDebounce from '@/hooks/useDebounce';

import { PageHeader, Spin, Table, Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import TourDetail from '../components/TourDetail';
import { tourService } from '../service';

export interface IPaging {
    total: number;
    current: number;
    pageSize: number;
}

interface ITour {
    title: string;
    numberDestination: number;
    status: number;
    date: string;
    image: string;
    description: string;
}

const TourPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = React.useState<string>('');
    const searchDebounce = useDebounce(search, 300);
    const [listTours, setListTours] = React.useState<ITour[]>([]);
    const [status, setStatus] = React.useState<number>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [currentTourId, setCurrentTourId] = React.useState<number>();
    const [expandedRowKeys, setExpandedRowKeys] = React.useState<number[]>([]);
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    const [params, setParams] = React.useState<any>({
        searchKey: '',
        page: 1,
        limit: 10,
        fromDate: '',
        toDate: '',
    });
    const [paging, setPaging] = React.useState<IPaging>({
        total: 0,
        current: 1,
        pageSize: 12,
    });

    const columns = [
        {
            width: '70px',
            title: <b>STT</b>,
            render: (text: any, record: any, index: any) => <td id={record.id}>{index + 1}</td>,
        },
        {
            title: <b>Mã tour</b>,
            dataIndex: 'tourName',
        },
        {
            title: <b>Tên tour du lịch</b>,
            dataIndex: 'tourName',
        },
        {
            title: <b>Giá tour</b>,
            dataIndex: 'tourName',
        },
        {
            title: <b>Ngày khởi hành</b>,
            dataIndex: 'tourName',
        },
        {
            title: <b>Lượt đánh giá</b>,
            dataIndex: 'tourName',
        },
        {
            title: <b>Trạng thái</b>,
            dataIndex: 'status',
            render: (value: number) => {
                if (value === 1) {
                    return <Tag color="green">Hoạt động</Tag>;
                } else return <Tag color="red">Ngừng hoạt động</Tag>;
            },
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'date',
        },
    ];

    const getTours = async () => {
        try {
            setIsLoading(true);
            const res = await tourService.getTours(params);
            if (res.status) {
                const data = res?.data?.data?.map((item: any) => {
                    return {
                        id: item.id,
                        key: item.id,
                        tourName: item.name,
                        numberDestination: item.numberDestinations,
                        status: item.status,
                        date: item.createDate,
                        imageUrl: item.imageUrl,
                        description: item.description,
                    };
                });
                setListTours(data);
            }
            setPaging({
                ...paging,
                total: res?.data?.totalItemCount,
                current: res?.data?.totalItemCount,
            });
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDestination = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await tourService.deleteDestination(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá điểm đến thành công!');
                getTours();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Xoá điểm đến thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeTourStatus = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await tourService.changeTourStatus(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thay đổi trạng thái tour thành công!');
                getTours();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Thay đổi trạng thái tour thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        getTours();
    }, [params]);

    React.useEffect(() => {
        setParams({
            ...params,
            searchKey: searchDebounce,
            fromDate: fromDate,
            toDate: toDate,
            status: status,
            page: currentPage,
        });
    }, [searchDebounce, status, fromDate, toDate, currentPage]);
    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        style={{ borderRadius: 8 }}
                        title="Danh sách tour"
                        extra={[
                            <ButtonAdd
                                text="Thêm mới"
                                onClickButton={() => {
                                    navigate(routerPage.addEditTour);
                                }}
                            />,
                        ]}
                    />
                }
                filterComponent={
                    <Filter
                        setSearch={setSearch}
                        search={search}
                        status={status}
                        setStatus={setStatus}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                        fromDate={fromDate}
                        toDate={toDate}
                    />
                }
                contentComponent={
                    <TableComponent
                        showTotalResult
                        columns={columns}
                        dataSource={listTours}
                        page={params.page}
                        total={paging.total}
                        loading={isLoading}
                        expandedRowRender={(record) => (
                            <div>
                                <TourDetail
                                    record={record}
                                    changeTourStatus={changeTourStatus}
                                    deleteDestination={deleteDestination}
                                    getTours={getTours}
                                    currentTourId={currentTourId}
                                />
                            </div>
                        )}
                        onExpand={(expanded: boolean, record: any) => {
                            const keys = [];
                            if (expanded) {
                                keys.push(record.key);
                                setCurrentTourId(record.id);
                            }

                            setExpandedRowKeys(keys);
                        }}
                        onChangePage={(_page) => setParams({ ...params, page: _page })}
                    />
                }
                // <CustomLoading isLoading={isLoading}>
                //     <div>
                //         <p>
                //             Kết quả lọc: <b>{paging.total}</b>
                //         </p>
                //         <Table
                //             bordered
                //             expandRowByClick
                //             columns={columns}
                //             dataSource={listTours}
                //             scroll={{
                //                 x: 800,
                //                 scrollToFirstRowOnChange: true,
                //             }}
                //             locale={{
                //                 emptyText: 'Chưa có bản ghi nào!',
                //             }}
                //             expandable={{
                //                 expandedRowRender: (record) => (
                //                     <div>
                //                         <TourDetail
                //                             record={record}
                //                             changeTourStatus={changeTourStatus}
                //                             deleteDestination={deleteDestination}
                //                             getTours={getTours}
                //                             currentTourId={currentTourId}
                //                         />
                //                     </div>
                //                 ),
                //             }}
                //             expandedRowKeys={expandedRowKeys}
                //             onExpand={(expanded: boolean, record: any) => {
                //                 const keys = [];
                //                 if (expanded) {
                //                     keys.push(record.key);
                //                     setCurrentTourId(record.id);
                //                 }

                //                 setExpandedRowKeys(keys);
                //             }}
                //             pagination={{
                //                 ...paging,
                //                 showSizeChanger: false,
                //                 onChange: async (page, pageSize) => {
                //                     setCurrentPage(page);
                //                     const element: any = document.getElementById('top-table');
                //                     element.scrollIntoView({ block: 'start' });
                //                 },
                //             }}
                //         />
                //     </div>
                // </CustomLoading>
            />
        </CustomLoading>
    );
};

export default TourPage;
