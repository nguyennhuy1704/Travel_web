import ButtonAdd from '@/components/Button/ButtonAdd';
import IconAntd from '@/components/IconAntd';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import TableComponent from '@/components/TableComponents';
import Container from '@/container/Container';
import useDebounce from '@/hooks/useDebounce';
import { message, Modal, PageHeader, Popconfirm, Spin, Switch, Table } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IPaging } from '../../tour/pages';
import AddEditModal from '../components/AddEditModal';
import Filter from '../components/Filter';
import { ICustomer, IParams } from '../components/Interface';
import { accountService } from '../service';

const AccountPage = () => {
    const columns = [
        {
            width: '70px',
            title: <b>STT</b>,
            dataIndex: 'stt',
            render: (text: any, record: any, index: any) => (
                <td id={record.id}>{(paging.current - 1) * paging.pageSize + index + 1}</td>
            ),
        },
        {
            title: <b>Họ và tên</b>,
            width: '35%',
            dataIndex: 'name',
        },
        {
            title: <b>Số điện thoại</b>,
            dataIndex: 'phone',
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'date',
        },
        {
            title: <b>Trạng thái</b>,
            dataIndex: 'status',
            render: (value: number, record: any) => {
                return <Switch checked={value === 1} onChange={() => changeStatus(record.id)} />;
            },
        },

        {
            title: <b>Chi tiết</b>,
            dataIndex: '',
            width: 120,
            render: (_: any, record: any) => {
                return (
                    <>
                        <a
                            onClick={() => {
                                setIsOpenModal(true);
                                setCurrentId(record.id);
                            }}
                        >
                            <IconAntd icon="EditOutlined" fontSize={18} />
                        </a>

                        <Popconfirm
                            title="Bạn có chắc chắn muốn reset mật khẩu tài khoản này?"
                            placement="top"
                            onConfirm={() => resetPassword(record.id)}
                            okText="Reset"
                            cancelText="Đóng"
                            style={{ background: 'red' }}
                        >
                            <a style={{ color: 'orange' }}>
                                <IconAntd icon="RedoOutlined" fontSize={18} marginLeft={15} />
                            </a>
                        </Popconfirm>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xoá người dùng này?"
                            placement="top"
                            onConfirm={() => deleteAccount(record.id)}
                            okText="Xoá"
                            cancelText="Đóng"
                            style={{ background: 'red' }}
                        >
                            <a style={{ color: 'red' }} href="#">
                                <IconAntd icon="DeleteOutlined" fontSize={18} marginLeft={15} />
                            </a>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const navigate = useNavigate();
    const [currentId, setCurrentId] = React.useState<number>();
    const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
    const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState<boolean>(false);
    const [listAccounts, setListAccounts] = React.useState<ICustomer[]>([]);
    const [search, setSearch] = React.useState<string>('');
    const [status, setStatus] = React.useState<number>();
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [paging, setPaging] = React.useState<IPaging>({
        total: 0,
        current: currentPage,
        pageSize: 10,
    });
    const [params, setParams] = React.useState<IParams>({
        searchKey: '',
        page: 1,
        fromDate: '',
        toDate: '',
        limit: 10,
        status: status,
    });

    const getListAccounts = async () => {
        try {
            setIsLoading(true);
            const res = await accountService.getListAccounts(params);
            if (res.status) {
                const data = res?.data?.data?.map((item: any) => {
                    return {
                        id: item?.id,
                        name: item?.username,
                        phone: item?.phone,
                        email: item?.email,
                        date: item?.createdDate.slice(0, 10).split('-').reverse().join('-'),
                        status: item?.status,
                    };
                });
                setListAccounts(data);
                setPaging({
                    ...paging,
                    total: res?.data?.totalItemCount,
                    current: res?.data?.page,
                    pageSize: 10,
                });
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeStatus = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await accountService.changeStatus(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thay đổi trạng thái tài khoản thành công!');
                getListAccounts();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Thay đổi trạng thái tài khoản thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAccount = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await accountService.deleteAccount(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá thái tài khoản thành công!');
                getListAccounts();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Xoá thái tài khoản thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await accountService.resetAccount(id);
            if (res.status) {
                message.success('Reset mật khẩu thành công!');
                getListAccounts();
            } else {
                message.error('Đã có lỗi xảy ra!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const searchDebounce = useDebounce(search, 300);

    React.useEffect(() => {
        setParams({
            ...params,
            searchKey: searchDebounce,
            status: status,
            fromDate: fromDate,
            toDate: toDate,
        });
    }, [searchDebounce, status, fromDate, toDate]);

    React.useEffect(() => {
        getListAccounts();
    }, [params]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        style={{ borderRadius: 8 }}
                        title="Tài khoản"
                        extra={[<ButtonAdd text="Thêm mới" onClickButton={() => setIsOpenModal(true)} />]}
                    />
                }
                filterComponent={
                    <Filter
                        setSearch={setSearch}
                        search={search}
                        status={status}
                        setToDate={setToDate}
                        setStatus={setStatus}
                        toDate={toDate}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                    />
                }
                contentComponent={
                    <div>
                        {/* <p>
                                Kết quả lọc: <b>{paging.total}</b>
                            </p>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={listAccounts}
                                scroll={{
                                    x: 800,
                                    scrollToFirstRowOnChange: true,
                                }}
                                locale={{
                                    emptyText: 'Chưa có bản ghi nào!',
                                }}
                                pagination={{
                                    ...paging,
                                    showSizeChanger: false,
                                    onChange: async (page) => {
                                        setParams({ ...params, page });
                                        setCurrentPage(page);
                                        const element: any = document.getElementById('top-table');
                                        element.scrollIntoView({ block: 'start' });
                                    },
                                }}
                            /> */}
                        <TableComponent
                            showTotalResult
                            columns={columns}
                            dataSource={listAccounts}
                            page={params.page}
                            total={paging.total}
                            loading={isLoading}
                            onChangePage={(_page) => setParams({ ...params, page: _page })}
                        />
                        {isOpenModal && (
                            <AddEditModal
                                getListAccounts={getListAccounts}
                                isOpenModal={isOpenModal}
                                setIsOpenModal={setIsOpenModal}
                                currentId={currentId}
                                setCurrentId={setCurrentId}
                            />
                        )}
                        {isOpenConfirmModal && (
                            <Modal
                                title="Đặt lại mật khẩu"
                                open={isOpenConfirmModal}
                                onOk={() => {}}
                                onCancel={() => setIsOpenConfirmModal(false)}
                                okText="Đặt lại"
                                cancelText="Đóng"
                            >
                                <p>Bạn có chắc chắn muốn reset lại mật khẩu của tài khoản này?</p>
                            </Modal>
                        )}
                    </div>
                }
            />
        </CustomLoading>
    );
};

export default AccountPage;