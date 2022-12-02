import { Col, Input, Modal, Row } from 'antd';
import React from 'react';

interface IAddEditCategoryModal {
    isOpenModal: boolean;
    addLibraryCategory: () => Promise<void>;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    setNewSubCategory: React.Dispatch<React.SetStateAction<string>>;
    newSubCategory: string;
    setNewSubCategoryError: React.Dispatch<React.SetStateAction<boolean>>;
    isNewSubCategoryError: boolean;
    currentCategory: any;
    updateLibraryCategory: (id: number) => Promise<void>;
    setCurrentCategory: React.Dispatch<any>;
}

const AddEditCategoryModal = (props: IAddEditCategoryModal) => {
    const {
        isOpenModal,
        addLibraryCategory,
        setIsOpenModal,
        setNewSubCategory,
        newSubCategory,
        setNewSubCategoryError,
        isNewSubCategoryError,
        currentCategory,
        updateLibraryCategory,
        setCurrentCategory,
    } = props;

    React.useEffect(() => {
        if (currentCategory) {
            setNewSubCategory(currentCategory.label);
        }
    }, [currentCategory]);

    return (
        <Modal
            title={currentCategory ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}
            open={isOpenModal}
            onOk={
                currentCategory
                    ? () => {
                          updateLibraryCategory(currentCategory.id);
                      }
                    : addLibraryCategory
            }
            onCancel={() => {
                setIsOpenModal(false);
                setNewSubCategory('');
                setNewSubCategoryError(false);
                setCurrentCategory(undefined);
            }}
            width={'50%'}
            okText="Lưu"
            cancelText="Đóng"
        >
            <Row>
                <Col span={6}>
                    <p>
                        Tên danh mục:<span style={{ color: 'red' }}> *</span>
                    </p>
                </Col>
                <Col span={18}>
                    <Input
                        allowClear
                        autoFocus
                        style={{ width: '100%' }}
                        placeholder="Tên danh mục"
                        value={newSubCategory}
                        onChange={(e: any) => {
                            if (e.target.value !== '') {
                                setNewSubCategoryError(false);
                            } else setNewSubCategoryError(true);
                            setNewSubCategory(e?.target?.value);
                        }}
                        status={isNewSubCategoryError ? 'error' : undefined}
                    />
                </Col>
            </Row>
        </Modal>
    );
};

export default AddEditCategoryModal;
