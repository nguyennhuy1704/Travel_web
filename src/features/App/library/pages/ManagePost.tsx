import ButtonAdd from '@/components/Button/ButtonAdd';
import IconAntd from '@/components/IconAntd';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import useDebounce from '@/hooks/useDebounce';
import { PageHeader, Popconfirm, Spin, Switch, Table } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../../post/components/Filter';
import { ICategory, IPaging } from '../../post/components/Interface';
import AddEditPostModal from '../components/AddEditPostModal';
import PostFilter from '../components/PostFilter';
import { libraryService } from '../service';

interface IDocument {
    id: number;
    title: string;
    index: string;
    type: string;
    status: number;
    createdDate: string;
    releasedDate: string;
    // documentUrl?: string;
}

const ManagePost = () => {
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
            title: <b>Tên văn bản</b>,
            width: '40%',
            dataIndex: 'title',
        },
        {
            title: <b>Số/ký hiệu</b>,
            dataIndex: 'index',
        },
        {
            title: <b>Loại văn bản</b>,
            dataIndex: 'type',
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
            dataIndex: 'createdDate',
        },
        {
            title: <b>Ngày ban hành</b>,
            dataIndex: 'releasedDate',
        },

        {
            title: <b>Chi tiết</b>,
            dataIndex: '',
            width: 100,
            render: (_: any, record: any) => {
                return (
                    <>
                        <a
                            onClick={() => {
                                setIsOpenModal(true);
                                setCurrentRecord(record);
                            }}
                        >
                            <IconAntd icon="EditOutlined" fontSize={18} />
                        </a>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xoá văn bản này?"
                            placement="top"
                            onConfirm={() => deleteDoc(record.id)}
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
    const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [searchDocType, setSearchDocType] = React.useState<string>();
    const [search, setSearch] = React.useState<string>('');
    const [searchIndex, setSearchIndex] = React.useState<string>('');
    const [status, setStatus] = React.useState<number>();
    const [fromDate, setFromDate] = React.useState<string>();
    const [toDate, setToDate] = React.useState<string>();
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [documents, setDocuments] = React.useState<IDocument[]>([]);
    const [currentRecord, setCurrentRecord] = React.useState<any>();
    const searchDebounce = useDebounce(search, 300);
    const searchIndexDebounce = useDebounce(searchIndex, 300);
    const searchDocTypeDebounce = useDebounce(searchDocType, 300);
    const [paging, setPaging] = React.useState<IPaging>({
        total: 0,
        current: 1,
        pageSize: 10,
    });
    const [params, setParams] = React.useState<any>({
        status,
        type: searchDocTypeDebounce,
        SeachKey: searchDebounce,
        fromDate: '',
        toDate: '',
        page: 1,
    });

    const getDocumentList = async () => {
        try {
            setIsLoading(false);
            const res = await libraryService.getListDocuments(params);
            if (res.status) {
                const data = res?.data?.data?.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    index: item.symbolNumber,
                    createdDate: item.createDate.slice(0, 10),
                    releasedDate: item?.dateIssued.slice(0, 10),
                    status: item.status,
                    type: item?.type,
                    documentUrl: item?.documentUrl,
                }));
                setDocuments(data.reverse());
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

    const changeStatus = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await libraryService.changeStatusDoc(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thay đổi trạng thái thành công!');
                getDocumentList();
            } else {
                openNotificationWithIcon('error', 'Thát bại', 'Thay đổi trạng thái thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDoc = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await libraryService.deleteDoc(id);
            if (res.status) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá văn bản thành công!');
                getDocumentList();
            } else {
                openNotificationWithIcon('error', 'Thát bại', 'Xoá văn bản thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setParams({
            ...params,
            status,
            type: searchDocTypeDebounce,
            SeachKey: searchDebounce,
            page: 1,
            fromDate,
            toDate,
        });
    }, [status, searchDocTypeDebounce, searchDebounce, fromDate, toDate, searchIndexDebounce]);

    React.useEffect(() => {
        getDocumentList();
    }, [params]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        style={{ borderRadius: 8 }}
                        title="Quản lý văn bản"
                        extra={[
                            <ButtonAdd
                                text="Thêm mới"
                                onClickButton={() => {
                                    setIsOpenModal(true);
                                }}
                            />,
                        ]}
                    />
                }
                filterComponent={
                    <PostFilter
                        setSearch={setSearch}
                        search={search}
                        searchIndex={searchIndex}
                        setSearchIndex={setSearchIndex}
                        status={status}
                        setToDate={setToDate}
                        setStatus={setStatus}
                        toDate={toDate}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        categories={categories}
                        searchDocType={searchDocType}
                        setSearchDocType={setSearchDocType}
                    />
                }
                contentComponent={
                    <>
                        <div>
                            <p>
                                Kết quả lọc: <b>{documents.length}</b>
                            </p>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={documents}
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
                        {isOpenModal && (
                            <AddEditPostModal
                                isOpenModal={isOpenModal}
                                setIsOpenModal={setIsOpenModal}
                                getDocumentList={getDocumentList}
                                currentRecord={currentRecord}
                                setCurrentRecord={setCurrentRecord}
                            />
                        )}
                    </>
                }
            />
        </CustomLoading>
    );
};

export default ManagePost;
