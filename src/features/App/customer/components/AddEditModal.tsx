import CustomLoading from '@/components/Loading';
import UploadComponent from '@/components/UploadComponent';
import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

interface IAddEditModal {
    isOpenModal: boolean;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditModal = (props: IAddEditModal) => {
    const { isOpenModal, setIsOpenModal } = props;
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const onFinish = (values: any) => {
        setIsOpenModal(false);
        console.log('Success:', values);
    };
    return (
        <CustomLoading isLoading={isLoading}>
            <Modal title="Thêm mới băn bản" open={isOpenModal} footer={null} onCancel={() => setIsOpenModal(false)}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    // onFinish={onFinish}
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
                    <CustomFormItem
                        label="Tài liệu"
                        name="uploadedFile"
                        rules={[{ required: true, message: 'Vui lòng tải tài liệu!' }]}
                    >
                        <UploadComponent
                            isUploadServerWhenUploading
                            uploadType="single"
                            listType="picture-card"
                            maxLength={1}
                            // initialFiles={
                            //     location?.state?.id
                            //         ? [
                            //               {
                            //                   uid: location?.state?.id,
                            //                   name: 'image.png',
                            //                   status: 'done',
                            //                   url: listImages[0],
                            //               },
                            //           ]
                            //         : []
                            // }
                            onSuccessUpload={(url: any) => {
                                // setListImages(url.flat());
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

export default AddEditModal;
