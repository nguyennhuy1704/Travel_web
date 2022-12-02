import LocalStorage from '@/apis/LocalStorage';
import { colors, PHONE_REGEX } from '@/constant';
import { enterNumbersOnly, wait } from '@/utils';
import { Button, Form, Input, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import '../components/styles.css';
import { authenService } from '../service';

const LoginPage = () => {
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        const payload = {
            phone: values.phone,
            password: values.password,
        };
        const res = await authenService.login(payload);
        if (res?.status) {
            LocalStorage.setToken(`${res?.data?.token}`);

            wait(100).then(() => {
                setLoading(false);
                window.location.reload();
            });
        }
        try {
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100%', width: '100%', marginLeft: '16%', marginRight: '16%' }}>
            <LoginFormBlock>
                <Block>
                    <FormBlock>
                        <div style={{ marginBottom: 40 }}>
                            <p style={{ fontSize: 25, fontWeight: '700' }}>Công viên địa chất toàn cầu ĐăkNông</p>
                            <div style={{ marginTop: -20 }}>
                                <p style={{ fontSize: 14, fontWeight: '700', color: 'lightgray' }}>
                                    Chào mừng bạn quay trở lại!
                                </p>
                            </div>
                        </div>
                        <Form
                            name="basic"
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="phone"
                                style={{ marginBottom: 30 }}
                                rules={[
                                    // { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    {
                                        message: 'Số điện thoại không đúng định dạng!',
                                        validator: (_, value) => {
                                            const trimValue = value.trim();
                                            if (PHONE_REGEX.test(trimValue)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject();
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" allowClear autoComplete="off" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 6, message: 'Mật khẩu cần chứa ít nhất 6 ký tự!' },
                                ]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu" autoComplete="off" />
                            </Form.Item>

                            {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                <Checkbox>Nhớ tài khoản</Checkbox>
                            </Form.Item> */}
                            <br />
                            <Row justify="center" style={{ position: 'relative' }}>
                                <Button
                                    htmlType="submit"
                                    style={{ width: '92%', background: colors.primary, color: 'white' }}
                                >
                                    Đăng nhập
                                </Button>
                            </Row>
                        </Form>
                    </FormBlock>
                </Block>
                <Block>
                    <img
                        className="image"
                        src="https://images.unsplash.com/photo-1494472155656-f34e81b17ddc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2F0ZXJmYWxsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                    />
                </Block>
            </LoginFormBlock>
        </div>
    );
};

const LoginFormBlock = styled.div`
    width: 100%;
    height: 800px;
    border-radius: 8px;
    background-color: white;
    margin-top: 60px;
    display: flex;
    flex-direction: row;
`;

const FormBlock = styled.div`
    width: 70%;
    height: 80%;
    margin: auto;
    margin-top: 200px;

    .label-block {
        margin-bottom: 40px;
    }
`;

const Block = styled.div`
    flex: 1;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;

    .img:hover {
        filter: grayscale(100%);
    }
`;

export default LoginPage;
