import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import UploadComponent from '@/components/UploadComponent';
import { EMAIL_REGEX, EMAIL_REGEX_2, NAME_REGEX, PHONE_REGEX } from '@/constant';
import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { accountService } from '../service';
import { IAccountDetail } from './Interface';

interface IAddEditModal {
    isOpenModal: boolean;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    getListAccounts: () => Promise<void>;
    currentId: number | undefined;
    setCurrentId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const AddEditModal = (props: IAddEditModal) => {
    const { isOpenModal, setIsOpenModal, getListAccounts, currentId, setCurrentId } = props;

    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const onFinish = async (values: any) => {
        const { name, phone, address, email, password } = values;
        try {
            setIsLoading(true);
            if (!currentId) {
                // Thêm mới
                const payload = {
                    name,
                    phone,
                    adrees: address,
                    password,
                    email,
                    role: 0,
                };
                const res = await accountService.addAccount(payload);
                if (res.status) {
                    openNotificationWithIcon('success', 'Thành công', 'Thêm tài khoản mới thành công!');
                    setIsOpenModal(false);
                    setCurrentId(undefined);
                    getListAccounts();
                } else {
                    // openNotificationWithIcon('error', 'Thất bại', 'Thêm tài khoản mới thất bại!');
                    openNotificationWithIcon('error', 'Thất bại', res?.data?.message);
                }
            } else {
                // Cập nhật
                const payload = {
                    id: currentId,
                    name,
                    phone,
                    adrees: address,
                    email,
                    role: 0,
                };
                const res = await accountService.updateAccount(payload);
                if (res.status) {
                    openNotificationWithIcon('success', 'Thành công', 'Cập nhật tài khoản mới thành công!');
                    setIsOpenModal(false);
                    setCurrentId(undefined);
                    getListAccounts();
                } else {
                    openNotificationWithIcon('error', 'Thất bại', 'Cập nhật tài khoản mới thất bại!');
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAccountDetail = async () => {
        try {
            setIsLoading(true);
            const res = await accountService.getAccountDetail(currentId);
            if (res.status) {
                form.setFieldsValue({
                    name: res?.data?.username,
                    email: res?.data?.email,
                    address: res?.data?.address,
                    phone: res?.data?.phone,
                });
            } else {
                openNotificationWithIcon('error', 'Thất bại', 'Lấy thông tin người dùng thất bại!');
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        console.log('THIS CASE');
        if (currentId) getAccountDetail();
    }, [currentId]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Modal
                title={currentId ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
                open={isOpenModal}
                footer={null}
                onCancel={() => {
                    setIsOpenModal(false);
                    setCurrentId(undefined);
                }}
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <CustomFormItem
                        label="Họ tên"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ tên!' },
                            { max: 65, message: 'Vui lòng nhập không quá 65 ký tự!' },
                            {
                                message: 'Tên không đúng định dạng!',
                                validator: (_, value) => {
                                    // const value = value.trim();
                                    if (!NAME_REGEX.test(value) || !value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject();
                                },
                            },
                        ]}
                    >
                        <Input allowClear placeholder="Họ tên" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { max: 10, message: 'Vui lòng nhập đúng 10 ký tự!' },
                            {
                                message: 'Số điện thoại không đúng định dạng!',
                                validator: (_, value) => {
                                    // const value = value.trim();
                                    if (PHONE_REGEX.test(value) || !value || value.length > 10) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject();
                                },
                            },
                        ]}
                    >
                        <Input disabled={currentId ? true : false} allowClear placeholder="Số điện thoại" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { max: 100, message: 'Vui lòng nhập không quá 100 ký tự!' },
                            {
                                message: 'Email không đúng định dạng!',
                                validator: (_, value) => {
                                    // const value = value.trim();
                                    if (
                                        (EMAIL_REGEX.test(value) && EMAIL_REGEX_2.test(value)) ||
                                        !value ||
                                        value.length > 100
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject();
                                },
                            },
                        ]}
                    >
                        <Input autoComplete="off" allowClear placeholder="Email" />
                    </CustomFormItem>

                    <CustomFormItem
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng chọn địa chỉ!' }]}
                    >
                        <Input allowClear placeholder="Nhập địa chỉ chi tiết" />
                    </CustomFormItem>

                    {!currentId && (
                        <>
                            <CustomFormItem
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 6, message: 'Mật khẩu chứa tối thiểu 6 ký tự!' },
                                    { max: 65, message: 'Mật khẩu chứa tối đa 65 ký tự!' },
                                    { whitespace: true, message: 'Mật khẩu không thể chứa khoảng trắng!' },
                                ]}
                            >
                                <Input.Password autoComplete="off" allowClear placeholder="Nhập mật khẩu" />
                            </CustomFormItem>
                            <CustomFormItem
                                label="Nhập lại mật khẩu"
                                name="confimedPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                    {
                                        message: 'Mật khẩu không khớp!',
                                        validator: (_, value) => {
                                            // const value = value.trim();
                                            if (value === form.getFieldValue('password') || !value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject();
                                        },
                                    },
                                ]}
                            >
                                <Input.Password allowClear placeholder="Nhập lại mật khẩu" />
                            </CustomFormItem>
                        </>
                    )}

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
