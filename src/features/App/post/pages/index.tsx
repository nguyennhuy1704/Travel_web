import LocalStorage from '@/apis/LocalStorage';
import ButtonAdd from '@/components/Button/ButtonAdd';
import IconAntd from '@/components/IconAntd';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import TableComponent from '@/components/TableComponents';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import useDebounce from '@/hooks/useDebounce';

import { Button, PageHeader, Popconfirm, Spin, Switch, Table, Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { ICategory, INews, IPaging, IParams } from '../components/Interface';
import { newsService } from '../service';

const PostPage = () => {
    const navigate = useNavigate();

    const columns: any = [
        {
            width: '60px',
            title: <b>STT</b>,
            dataIndex: 'stt',
            align: 'center',
            render: (text: any, record: any, index: any) => (
                <td id={record.id}>{(paging.current - 1) * paging.pageSize + index + 1}</td>
            ),
        },
        {
            title: <b>Tiêu đề</b>,
            dataIndex: 'title',
        },
        {
            title: <b>Danh mục</b>,
            width: '160px',
            align: 'center',
            dataIndex: 'category',
            render: (value: string[]) => {
                const finalCategories: any = [];
                value.forEach((item: string) => finalCategories.push(<Tag color="#955531">{item}</Tag>));
                return finalCategories;
            },
        },
        {
            width: '160px',
            align: 'center',
            title: <b>Lượt yêu thích</b>,
            dataIndex: 'loveNumber',
        },
        {
            width: '160px',
            align: 'center',
            title: <b>Trạng thái</b>,
            dataIndex: 'status',
            render: (value: number, record: any) => {
                return <Switch checked={value === 1} onChange={() => changeNewsStatus(record.id)} />;
            },
        },
        {
            width: '160px',
            align: 'center',
            title: <b>Ngày tạo</b>,
            dataIndex: 'date',
        },
        {
            title: <b>Thao tác</b>,
            dataIndex: '',
            width: 100,
            render: (_: any, record: any) => {
                return (
                    <>
                        <a onClick={() => navigate(routerPage.addEditPost, { state: { id: record.id } })}>
                            <IconAntd icon="EditOutlined" fontSize={18} />
                        </a>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xoá bài viết này?"
                            placement="top"
                            onConfirm={() => deleteNews(record.id)}
                            okText="Xoá"
                            cancelText="Đóng"
                            style={{ background: 'red' }}
                        >
                            <a style={{ color: 'red' }} href="#">
                                <IconAntd icon="DeleteOutlined" fontSize={18} marginLeft={20} />
                            </a>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];
    const [listNews, setListNews] = React.useState<INews[]>([]);
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [categoryId, setCategoryId] = React.useState<number>();
    const [search, setSearch] = React.useState<string>('');
    const [status, setStatus] = React.useState<number>();
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    const [isLoading, setisLoading] = React.useState<boolean>(false);
    const [paging, setPaging] = React.useState<IPaging>({
        total: 0,
        current: 1,
        pageSize: 10,
    });
    const [params, setParams] = React.useState<IParams>({
        searchKey: '',
        page: 1,
        limit: 10,
    });

    const searchDebounce = useDebounce(search, 300);

    const getListNews = async () => {
        try {
            setisLoading(true);
            const res = await newsService.getListNews(params);
            console.log('res: ', res);
            if (res.status === 1) {
                const data = res?.data?.data?.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    status: item.status,
                    date: item.createDate.slice(0, 10),
                    category: item.listCategory.map((item: any) => item.name),
                    loveNumber: item.newFavourite,
                }));
                console.log('DATA: ', data);

                setListNews(data);
                setPaging({
                    ...paging,
                    total: res?.data?.totalItemCount,
                    current: res?.data?.page,
                });
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Đã có lỗi xảy ra! Xin vui lòng thử lại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    const deleteNews = async (id: number) => {
        try {
            setisLoading(true);
            const res = await newsService.deleteNews(id);
            if (res.status === 1) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá bài viết thành công!');
                getListNews();
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    const getListCategories = async () => {
        try {
            const res = await newsService.getListCategories();
            if (res.status) {
                const data = res?.data.map((item: any) => ({
                    id: item.id,
                    title: item.name,
                }));
                setCategories(data);
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const changeNewsStatus = async (id: number) => {
        try {
            setisLoading(true);
            const res = await newsService.changeNewsStatus(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Chỉnh sửa trạng thái bài viết thành công!');
                getListNews();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Đã có lỗi xảy ra!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    React.useEffect(() => {
        setParams({
            ...params,
            searchKey: searchDebounce,
            status: status,
            fromDate: fromDate,
            toDate: toDate,
            category: categoryId,
        });
    }, [searchDebounce, status, fromDate, toDate, categoryId]);

    React.useEffect(() => {
        getListCategories();
    }, [categoryId]);

    React.useEffect(() => {
        getListNews();
    }, [params]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        style={{ borderRadius: 8 }}
                        title="Danh sách bài viết"
                        extra={[
                            <ButtonAdd
                                text="Thêm mới"
                                onClickButton={() => {
                                    navigate(routerPage.addEditPost);
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
                        setToDate={setToDate}
                        setStatus={setStatus}
                        toDate={toDate}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        categories={categories}
                        categoryId={categoryId}
                        setCategoryId={setCategoryId}
                    />
                }
                contentComponent={
                    <TableComponent
                        showTotalResult
                        columns={columns}
                        dataSource={listNews}
                        page={params.page}
                        total={paging.total}
                        loading={isLoading}
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
                //             columns={columns}
                //             dataSource={listNews}
                //             locale={{
                //                 emptyText: 'Chưa có bản ghi nào!',
                //             }}
                //             className="table-responsive"
                //             pagination={{
                //                 ...paging,
                //                 showSizeChanger: false,
                //                 onChange: async (page, pageSize) => {
                //                     setParams({ ...params, page });
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

export default PostPage;
