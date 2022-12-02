import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import UploadComponent from '@/components/UploadComponent';
import { Button, DatePicker, Form, Input, Modal, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { libraryService } from '../service';

interface IAddEditPostModal {
    isOpenModal: boolean;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    getDocumentList: () => Promise<void>;
    currentRecord: any;
    setCurrentRecord: React.Dispatch<any>;
}

const AddEditPostModal = (props: IAddEditPostModal) => {
    const { isOpenModal, setIsOpenModal, getDocumentList, currentRecord, setCurrentRecord } = props;
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [listDocUrl, setListDocUrl] = React.useState<string[]>([]);

    const onFinish = async (values: any) => {
        try {
            if (listDocUrl.length === 0) {
                openNotificationWithIcon('error', 'Thất bại', 'Vui lòng tải file tài liệu!!');
            } else {
                // Chỉnh sửa
                if (currentRecord) {
                    setIsLoading(true);
                    const { title, index, type, releasedDate } = values;
                    const payload = {
                        title,
                        type: type,
                        symbolNumber: index,
                        dateIssued: releasedDate,
                        status: currentRecord.status,
                        documentUrl: listDocUrl[0],
                        id: currentRecord.id,
                    };
                    const res = await libraryService.updateDoc(payload);
                    if (res.status) {
                        openNotificationWithIcon('success', 'Thành công', 'Cập nhật văn bản mới thành công!');
                        setIsOpenModal(false);
                        getDocumentList();
                        setCurrentRecord(undefined);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Cập nhật văn bản mới thất bại!');
                    }
                } else {
                    // Thêm mới
                    setIsLoading(true);
                    const { title, index, type, releasedDate } = values;
                    const payload = {
                        title,
                        type: type,
                        symbolNumber: index,
                        dateIssued: releasedDate,
                        status: 1,
                        documentUrl: listDocUrl[0],
                    };
                    const res = await libraryService.addDoc(payload);
                    if (res.status) {
                        openNotificationWithIcon('success', 'Thành công', 'Thêm văn bản mới thành công!');
                        setIsOpenModal(false);
                        getDocumentList();
                        setCurrentRecord(undefined);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Thêm văn bản mới thất bại!');
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
        if (currentRecord) {
            setListDocUrl([currentRecord.documentUrl]);
        }
    }, [currentRecord]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Modal
                title={currentRecord ? 'Cập nhật băn bản' : 'Thêm mới băn bản'}
                open={isOpenModal}
                footer={null}
                onCancel={() => {
                    setIsOpenModal(false);
                    setCurrentRecord(undefined);
                }}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{
                        title: currentRecord?.title,
                        index: currentRecord?.index,
                        releasedDate: currentRecord ? moment(currentRecord?.releasedDate, 'DD/MM/YYYY') : undefined,
                        status: currentRecord?.status,
                        type: currentRecord?.type,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <CustomFormItem
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề cho văn bản!' }]}
                    >
                        <Input allowClear placeholder="Tiêu đề văn bản" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Số ký hiệu"
                        name="index"
                        rules={[{ required: true, message: 'Vui lòng nhập số ký hiệu cho văn bản!' }]}
                    >
                        <Input allowClear placeholder="Số ký hiệu văn bản" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Loại văn bản"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng nhập loại văn bản!' }]}
                    >
                        <Input allowClear placeholder="Loại văn bản" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Ngày ban hành"
                        name="releasedDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành văn bản!' }]}
                    >
                        <DatePicker
                            placeholder="Ngày ban hành"
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            disabledDate={(current) => current.isAfter(moment().subtract(0, 'day'))}
                        />
                    </CustomFormItem>
                    <CustomFormItem label="Tài liệu" name="uploadedFile">
                        <UploadComponent
                            isUploadServerWhenUploading
                            uploadType="single"
                            listType="picture-card"
                            maxLength={1}
                            accept=".txt, .pdf"
                            title="Tải file tài liệu"
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
                                setListDocUrl(url.flat());
                            }}
                        />
                    </CustomFormItem>
                    <hr />
                    <Row justify="end">
                        <Button type="default" htmlType="submit" onClick={() => setIsOpenModal(false)}>
                            Đóng
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Row>
                </Form>
            </Modal>
        </CustomLoading>
    );
};

const CustomFormItem = styled(Form.Item)`
    margin-bottom: 30px;
`;

export default AddEditPostModal;
