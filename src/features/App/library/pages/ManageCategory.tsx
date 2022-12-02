import ButtonAdd from '@/components/Button/ButtonAdd';
import IconAntd from '@/components/IconAntd';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import useDebounce from '@/hooks/useDebounce';
import { PageHeader, Popconfirm, Spin, Switch, Table, Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICategory, IPaging } from '../../post/components/Interface';
import CategoryFilter from '../components/CategoryFilter';
import { libraryService } from '../service';

interface ICategoryItem {
    id: number;
    title: string;
    category: string;
    subCategory: string;
    status: number;
    date: string;
}

const ManageCategory = () => {
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
            title: <b>Tiêu đề</b>,
            width: '40%',
            dataIndex: 'title',
        },
        {
            title: <b>Loại</b>,
            dataIndex: 'category',
        },
        {
            title: <b>Danh mục</b>,
            dataIndex: 'subCategory',
        },

        {
            title: <b>Trạng thái</b>,
            dataIndex: 'status',
            render: (value: number, record: any) => (
                <Switch defaultChecked={value === 1} onChange={() => changeStatus(record.id)} />
            ),
        },
        {
            title: <b>Ngày tạo</b>,
            dataIndex: 'date',
        },
        {
            title: <b>Chi tiết</b>,
            dataIndex: '',
            width: 100,
            render: (_: any, record: any) => {
                return (
                    <>
                        <a onClick={() => navigate(routerPage.addEditCategory, { state: { record } })}>
                            <IconAntd icon="EditOutlined" fontSize={18} />
                        </a>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xoá bài viết này?"
                            placement="top"
                            onConfirm={() => deteleItem(record.id)}
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

    const categories = [
        {
            id: 1,
            value: 1,
            label: 'Ảnh',
        },
        {
            id: 2,
            value: 2,
            label: 'Tài liệu',
        },
        {
            id: 3,
            value: 3,
            label: 'Video',
        },
    ];
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [categoryId, setCategoryId] = React.useState<number>();
    const [subCategoryId, setSubCategoryId] = React.useState<number>();
    const [search, setSearch] = React.useState<string>('');
    const [status, setStatus] = React.useState<number>();
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    // Danh sách
    const [listCategories, setListCategories] = React.useState<ICategoryItem[]>([]);
    const [subCategories, setSubCategories] = React.useState<any[]>([]);
    const [paging, setPaging] = React.useState<IPaging>({
        total: 0,
        current: 1,
        pageSize: 10,
    });
    const [params, setParams] = React.useState<any>({
        status,
        type: undefined,
        SeachKey: '',
        fromDate: '',
        toDate: '',
        page: 1,
        IDCategory: subCategoryId,
    });
    const searchDebounce = useDebounce(search, 300);

    const convertType = (type: number) => {
        switch (type) {
            case 1:
                return 'Ảnh';
            case 2:
                return 'Tài liệu';
            case 3:
                return 'Video';
            default:
                return 'hihi';
        }
    };

    const getListCategories = async () => {
        try {
            setIsLoading(true);
            const res = await libraryService.getListCategories(params);
            if (res.status) {
                const data = res?.data?.data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    subCategory: item.categoryName,
                    category: convertType(item.type),
                    status: item.status,
                    date: item.createDate.slice(0, 10),
                    ...item,
                }));
                setListCategories(data.reverse());
                setPaging({
                    ...paging,
                    total: res?.data?.totalItemCount,
                    current: res?.data?.page,
                });
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Đã có lỗi xảy ra!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getListSubCategoriesFilter = async () => {
        try {
            const res = await libraryService.getListSubCategories(categoryId);
            if (res.status) {
                const data = res?.data?.map((item: any) => ({
                    id: item.id,
                    label: item.name,
                }));
                setSubCategories(data);
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Đã có lỗi xảy ra!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const deteleItem = async (id: number) => {
        try {
            const res = await libraryService.deleteLibraryItem(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá thành công!');
                getListCategories();
            } else {
                openNotificationWithIcon('error', 'Thát bại', 'Xoá thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const changeStatus = async (id: number) => {
        try {
            // Thay đổi cate trong API
            const res = await libraryService.changeStatusCate(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thay đổi trạng thái thành công!');
                getListCategories();
            } else {
                openNotificationWithIcon('error', 'Thát bại', 'Thay đổi trạng thái thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    React.useEffect(() => {
        setParams({
            ...params,
            status,
            type: categoryId,
            SeachKey: searchDebounce,
            fromDate,
            toDate,
            page: 1,
            IDCategory: subCategoryId,
        });
    }, [searchDebounce, status, fromDate, toDate, categoryId, subCategoryId]);

    React.useEffect(() => {
        if (categoryId) getListSubCategoriesFilter();
    }, [categoryId]);

    React.useEffect(() => {
        getListCategories();
    }, [params]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        style={{ borderRadius: 8 }}
                        title="Quản lý danh mục"
                        extra={[
                            <ButtonAdd
                                text="Thêm mới"
                                onClickButton={() => {
                                    navigate(routerPage.addEditCategory);
                                }}
                            />,
                        ]}
                    />
                }
                filterComponent={
                    <CategoryFilter
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
                        subCategoryId={subCategoryId}
                        setSubCategoryId={setSubCategoryId}
                        subCategories={subCategories}
                    />
                }
                contentComponent={
                    <div>
                        <p>
                            Kết quả lọc: <b>{paging.total}</b>
                        </p>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={listCategories}
                            scroll={{
                                x: 1200,
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
                                    const element: any = document.getElementById('top-table');
                                    element.scrollIntoView({ block: 'start' });
                                },
                            }}
                        />
                    </div>
                }
            />
        </CustomLoading>
    );
};

export default ManageCategory;
