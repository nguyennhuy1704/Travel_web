import ButtonAdd from '@/components/Button/ButtonAdd';
import ButtonSave from '@/components/Button/ButtonSave';
import IconAntd from '@/components/IconAntd';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import UploadComponent from '@/components/UploadComponent';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import { Col, Input, PageHeader, Popconfirm, Radio, Row, Select, Spin } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AddEditCategoryModal from '../components/AddEditCategoryModal';
import { libraryService } from '../service';

const AddEditCategory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentRecord = location?.state?.record;
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('');
    const [isTitleError, setIsTitleError] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string>('');
    const [isDescriptionError, setIsDescriptionError] = React.useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
    // Loại
    const [categoryId, setCategoryId] = React.useState<number>();
    const [isCategoryIdError, setIsCategoryIdError] = React.useState<boolean>(false);
    // Danh mục
    const [subCategoryId, setSubCategoryId] = React.useState<number>();
    const [isSubCategoryIdError, setSubIsCategoryIdError] = React.useState<boolean>(false);
    const [listImages, setListImages] = React.useState<any[]>([]);
    const [listVideos, setListVideos] = React.useState<any[]>([]);
    const [listDocuments, setListDocuments] = React.useState<any[]>([]);
    const [newSubCategory, setNewSubCategory] = React.useState<string>('');
    const [isNewSubCategoryError, setNewSubCategoryError] = React.useState<boolean>(false);
    const [subCategories, setSubCategories] = React.useState<any[]>([]);
    const [currentCategory, setCurrentCategory] = React.useState<any>();

    const renderOptionContent = (category: any) => {
        return (
            <Row align="middle">
                <Col span={17}>
                    <p style={{ paddingTop: 10 }}>{category.label}</p>
                </Col>
                <Col span={7}>
                    <a
                        onClick={(e: any) => {
                            setIsOpenModal(true);
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentCategory(category);
                        }}
                    >
                        <IconAntd icon="EditOutlined" fontSize={18} />
                    </a>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xoá danh mục này?"
                        placement="right"
                        onConfirm={() => deleteLibraryCategory(category.id)}
                        okText="Xoá"
                        cancelText="Đóng"
                        style={{ background: 'red' }}
                        onCancel={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <a
                            style={{ color: 'red' }}
                            onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <IconAntd icon="DeleteOutlined" fontSize={18} marginLeft={20} />
                        </a>
                    </Popconfirm>
                </Col>
            </Row>
        );
    };

    const validateValue = () => {
        if (!title || title === '') {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng nhập tiêu đề');
            setIsTitleError(true);
            return false;
        } else {
            setIsTitleError(false);
        }

        if (!categoryId) {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng chọn loại!');
            setIsCategoryIdError(true);
            return false;
        } else {
            setIsCategoryIdError(false);
        }

        if (!subCategoryId) {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng chọn danh mục!');
            setSubIsCategoryIdError(true);
            return false;
        } else {
            setSubIsCategoryIdError(false);
        }

        if (!listImages || listImages.length === 0) {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng tải ảnh!');
            return false;
        }

        // if (!description || description === '') {
        //     openNotificationWithIcon('error', 'Thất bại', 'Vui lòng nhập mô tả!');
        //     return false;
        // }

        //Video
        if (categoryId === 3) {
            if (!listVideos || listVideos.length === 0) {
                openNotificationWithIcon('error', 'Thất bại', 'Vui lòng tải video!');
                return false;
            }
            // Tài liệu
        } else if (categoryId === 2) {
            if (!listDocuments || listDocuments.length === 0) {
                openNotificationWithIcon('error', 'Thất bại', 'Vui lòng tải tài liệu!');
                return false;
            }
        }

        return true;
    };

    // danh sách danh mục
    const getListSubCategories = async () => {
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

    // thêm mới danh mục
    const addLibraryCategory = async () => {
        try {
            setIsLoading(true);
            const payload = {
                name: newSubCategory,
                type: categoryId,
            };
            const res = await libraryService.addLibraryCategory(payload);
            if (res?.status) {
                openNotificationWithIcon('success', 'Thành công', 'Thêm mới danh mục thành công!');
                getListSubCategories();
                setIsOpenModal(false);
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Thêm mới danh mục thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteLibraryCategory = async (id: number) => {
        try {
            const res = await libraryService.removeLibraryCategory(id);
            if (res?.status) {
                openNotificationWithIcon('success', 'Thành công', 'Xoá danh mục thành công!');
                getListSubCategories();
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Xoá danh mục thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const updateLibraryCategory = async (id: number) => {
        try {
            const payload = {
                id,
                name: newSubCategory,
                type: categoryId,
            };
            const res = await libraryService.updateLibraryCategory(payload);
            if (res?.status) {
                openNotificationWithIcon('success', 'Thành công', 'Cập nhật danh mục thành công!');
                getListSubCategories();
                setIsOpenModal(false);
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Cập nhật danh mục thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            if (validateValue()) {
                // Cập nhật
                if (location?.state?.record) {
                    const payload = {
                        title,
                        videoUrl: listVideos[0],
                        documentUrl: listDocuments[0],
                        imageUrl: listImages[0],
                        description: description,
                        // Danh mục
                        libraryCategoryID: subCategoryId,
                        // Loại
                        type: categoryId,
                        id: currentRecord.id,
                    };
                    const res = await libraryService.updateLibraryItem(payload);
                    if (res.status) {
                        openNotificationWithIcon('success', 'Thành công', 'Thêm nội dung mới thành công!');
                        navigate(routerPage.manageCategory);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Thêm nội dung mới thất bại!');
                    }
                } else {
                    // Thêm mới
                    const payload = {
                        title,
                        videoUrl: listVideos[0],
                        documentUrl: listDocuments[0],
                        imageUrl: listImages[0],
                        description: description,
                        // Danh mục
                        libraryCategoryID: subCategoryId,
                        // Loại
                        type: categoryId,
                    };
                    const res = await libraryService.addLibraryItem(payload);
                    if (res.status) {
                        openNotificationWithIcon('success', 'Thành công', 'Thêm nội dung mới thành công!');
                        navigate(routerPage.manageCategory);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Thêm nội dung mới thất bại!');
                    }
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (categoryId) getListSubCategories();
    }, [categoryId]);

    React.useEffect(() => {
        if (currentRecord) {
            setTitle(currentRecord.title);
            setCategoryId(currentRecord.type);
            setDescription(currentRecord.describe);
            setListImages([currentRecord.imageUrl]);
            setSubCategoryId(currentRecord.idCategory);
        }
        if (currentRecord?.videoUrl) {
            setListVideos([currentRecord.videoUrl]);
        }
        if (currentRecord?.documentUrl) {
            setListDocuments([currentRecord.documentUrl]);
        }
    }, [currentRecord]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        onBack={() => navigate(routerPage.manageCategory)}
                        style={{ borderRadius: 8 }}
                        title={location?.state?.record ? 'Chỉnh sửa nội dung danh mục' : 'Thêm mới nội dung danh mục'}
                        extra={[<ButtonSave text="Lưu" onClickButton={onSubmit} />]}
                    />
                }
                contentComponent={
                    <Spin spinning={isLoading}>
                        <div style={{ height: 700 }}>
                            <Row>
                                <Col span={10}>
                                    <Row>
                                        <CustomCol span={24}>
                                            <div className="label-block">
                                                <p>
                                                    Tiêu đề<span style={{ color: 'red' }}> *</span>
                                                </p>
                                            </div>
                                            <div className="input-block">
                                                <Input
                                                    style={{ width: '100%' }}
                                                    placeholder="Nhập tiêu đề"
                                                    maxLength={100}
                                                    value={title}
                                                    allowClear
                                                    status={isTitleError ? 'error' : undefined}
                                                    onChange={(e: any) => {
                                                        if (e.target.value !== '') {
                                                            setIsTitleError(false);
                                                        } else setIsTitleError(true);
                                                        setTitle(e?.target?.value);
                                                    }}
                                                />
                                            </div>
                                        </CustomCol>
                                        <CustomCol span={24}>
                                            <div className="label-block">
                                                <p>
                                                    Loại<span style={{ color: 'red' }}> *</span>
                                                </p>
                                            </div>
                                            <div className="input-block">
                                                <Radio.Group
                                                    disabled={currentRecord ? true : false}
                                                    value={categoryId}
                                                    onChange={(e: any) => {
                                                        setCategoryId(e.target.value);
                                                    }}
                                                >
                                                    <Radio value={1}>Ảnh</Radio>
                                                    <Radio value={3}>Video</Radio>
                                                    <Radio value={2}>Tài liệu</Radio>
                                                </Radio.Group>
                                            </div>
                                        </CustomCol>
                                        <CustomCol span={24}>
                                            <div className="label-block">
                                                <p>
                                                    Danh mục<span style={{ color: 'red' }}> *</span>
                                                </p>
                                            </div>
                                            <div className="input-block">
                                                <Select
                                                    disabled={!categoryId}
                                                    style={{ width: '100%', marginRight: 10 }}
                                                    allowClear
                                                    placeholder="Chọn danh mục"
                                                    value={subCategoryId}
                                                    optionLabelProp="label"
                                                    popupClassName={'select-popup'}
                                                    onChange={(value: number | undefined) => {
                                                        if (!value) {
                                                            setSubIsCategoryIdError(true);
                                                        } else setSubIsCategoryIdError(false);
                                                        setSubCategoryId(value);
                                                    }}
                                                    status={isSubCategoryIdError ? 'error' : undefined}
                                                >
                                                    {subCategories.map((item: any, index: number) => (
                                                        <Select.Option label={item.label} key={index} value={item.id}>
                                                            {renderOptionContent(item)}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                <ButtonAdd
                                                    text="Thêm danh mục"
                                                    isDisable={!categoryId}
                                                    onClickButton={() => setIsOpenModal(true)}
                                                />
                                            </div>
                                        </CustomCol>
                                        <CustomCol span={24}>
                                            <div className="label-block">
                                                <p>Mô tả</p>
                                            </div>
                                            <div className="input-block">
                                                <Input.TextArea
                                                    style={{ width: '100%' }}
                                                    placeholder="Nhập mô tả"
                                                    maxLength={250}
                                                    allowClear
                                                    rows={4}
                                                    value={description}
                                                    status={isDescriptionError ? 'error' : undefined}
                                                    onChange={(e: any) => {
                                                        if (e.target.value !== '') {
                                                            setIsDescriptionError(false);
                                                        } else setIsDescriptionError(true);
                                                        setDescription(e?.target?.value);
                                                    }}
                                                />
                                            </div>
                                        </CustomCol>
                                    </Row>
                                </Col>
                                <Col span={1} />
                                <Col span={13}>
                                    <Row>
                                        <CustomCol span={24}>
                                            <CustomCol span={8}>
                                                <div className="label-block">
                                                    <p>
                                                        Ảnh<span style={{ color: 'red' }}> *</span>
                                                    </p>
                                                </div>
                                                <div className="input-block">
                                                    <UploadComponent
                                                        isUploadServerWhenUploading
                                                        uploadType="single"
                                                        listType="picture-card"
                                                        maxLength={1}
                                                        title={'Tải ảnh'}
                                                        initialFiles={
                                                            currentRecord
                                                                ? [
                                                                      {
                                                                          uid: currentRecord.id,
                                                                          name: 'image.png',
                                                                          status: 'done',
                                                                          url: currentRecord.imageUrl,
                                                                      },
                                                                  ]
                                                                : []
                                                        }
                                                        onSuccessUpload={(url: any) => {
                                                            setListImages(url.flat());
                                                        }}
                                                    />
                                                </div>
                                            </CustomCol>
                                            {categoryId === 3 && (
                                                <CustomCol span={13}>
                                                    <div className="label-block">
                                                        <p>
                                                            Video<span style={{ color: 'red' }}> *</span>
                                                        </p>
                                                    </div>
                                                    <div className="input-block">
                                                        <UploadComponent
                                                            accept=".mp4"
                                                            isUploadServerWhenUploading
                                                            uploadType="single"
                                                            listType="picture-card"
                                                            maxLength={1}
                                                            title={'Tải video'}
                                                            initialFiles={
                                                                currentRecord
                                                                    ? [
                                                                          {
                                                                              uid: currentRecord.id,
                                                                              name: 'video.mp4',
                                                                              status: 'done',
                                                                              url: currentRecord.videoUrl,
                                                                          },
                                                                      ]
                                                                    : []
                                                            }
                                                            onSuccessUpload={(url: any) => {
                                                                console.log(
                                                                    '🚀 ~ file: AddEditCategory.tsx ~ line 384 ~ AddEditCategory ~ url',
                                                                    url
                                                                );

                                                                setListVideos(url.flat());
                                                            }}
                                                        />
                                                    </div>
                                                </CustomCol>
                                            )}
                                            {categoryId === 2 && (
                                                <CustomCol span={8}>
                                                    <div className="label-block">
                                                        <p>
                                                            Tài liệu<span style={{ color: 'red' }}> *</span>
                                                        </p>
                                                    </div>
                                                    <div className="input-block">
                                                        <UploadComponent
                                                            isUploadServerWhenUploading
                                                            accept=".txt, .pdf"
                                                            uploadType="single"
                                                            listType="picture-card"
                                                            maxLength={1}
                                                            title={'Tải file tài liệu'}
                                                            initialFiles={
                                                                currentRecord
                                                                    ? [
                                                                          {
                                                                              uid: currentRecord.id,
                                                                              name: 'document.pdf',
                                                                              status: 'done',
                                                                              url: currentRecord.documentUrl,
                                                                          },
                                                                      ]
                                                                    : []
                                                            }
                                                            onSuccessUpload={(url: any) => {
                                                                setListDocuments(url.flat());
                                                            }}
                                                        />
                                                    </div>
                                                </CustomCol>
                                            )}
                                        </CustomCol>
                                    </Row>
                                </Col>
                            </Row>
                            {isOpenModal && (
                                <AddEditCategoryModal
                                    isOpenModal={isOpenModal}
                                    setIsOpenModal={setIsOpenModal}
                                    addLibraryCategory={addLibraryCategory}
                                    setNewSubCategory={setNewSubCategory}
                                    newSubCategory={newSubCategory}
                                    setNewSubCategoryError={setNewSubCategoryError}
                                    isNewSubCategoryError={isNewSubCategoryError}
                                    currentCategory={currentCategory}
                                    setCurrentCategory={setCurrentCategory}
                                    updateLibraryCategory={updateLibraryCategory}
                                />
                            )}
                        </div>
                    </Spin>
                }
            />
        </CustomLoading>
    );
};

const CustomCol = styled(Col)`
    display: flex;
    width: 100%;

    .label-block {
        flex: 1;
        margin-right: 10px;
    }

    .input-block {
        flex: 4;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 30px;
    }

    .label-block-image {
    }
`;

export default AddEditCategory;
