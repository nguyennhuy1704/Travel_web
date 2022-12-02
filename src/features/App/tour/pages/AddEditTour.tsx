import ButtonSave from '@/components/Button/ButtonSave';
import MyEditor from '@/components/Editor/EditorComponent';
import CustomLoading from '@/components/Loading';
import { openNotificationWithIcon } from '@/components/Notification';
import UploadComponent from '@/components/UploadComponent';
import { routerPage } from '@/config/routes';
import Container from '@/container/Container';
import { Col, Input, PageHeader, Row } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { tourService } from '../service';

const AddEditTour = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setisLoading] = React.useState<boolean>(false);
    const [listImages, setListImages] = React.useState<any[]>(
        location?.state?.record ? [location?.state?.record?.imageUrl] : []
    );
    const [isAllSpace, setIsAllSpace] = React.useState<boolean>(false);
    const [tourName, setTourName] = React.useState<string>(location?.state?.record?.tourName);
    const [isTourNameError, setIsTourNameError] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string>(location?.state?.record?.description);

    const validateValue = () => {
        if (!tourName || tourName === '') {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng nhập tiêu đề bài viết!');
            setIsTourNameError(true);
            return false;
        } else {
            setIsTourNameError(false);
        }

        if (!listImages || listImages.length === 0) {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng chọn ảnh bìa cho bài viết!');
            return false;
        }

        if (!description || description === '<p></p>') {
            openNotificationWithIcon('error', 'Thất bại', 'Vui lòng nhập nội dung bài viết!');
            return false;
        }
        if (isAllSpace) {
            openNotificationWithIcon('error', 'Thất bại', 'Nội dung bài viết không thể là khoảng trắng!');
            return false;
        }
        return true;
    };

    const addEditTour = async () => {
        try {
            setisLoading(true);
            if (validateValue()) {
                if (location?.state?.id) {
                    // Cập nhật
                    const payload = {
                        imageUrl: listImages[0],
                        title: tourName,
                        description: description,
                        id: location?.state?.id,
                    };
                    const res = await tourService.updateTour(payload);
                    if (res.status) {
                        openNotificationWithIcon('success', 'Thành công', 'Cập nhật tour thành công!');
                        navigate(routerPage.tour);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Cập nhật tour thất bại!');
                    }
                } else {
                    // Thêm mới
                    const payload = {
                        imageUrl: listImages[0],
                        title: tourName,
                        description: description,
                    };
                    const res = await tourService.addTour(payload);
                    if (res.status) {
                        openNotificationWithIcon('success', 'Thành công', 'Thêm tour mới thành công!');
                        navigate(routerPage.tour);
                    } else {
                        openNotificationWithIcon('error', 'Thất bại', 'Thêm tour mới thất bại!');
                    }
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setisLoading(false);
        }
    };

    return (
        <CustomLoading isLoading={isLoading}>
            <Container
                header={
                    <PageHeader
                        onBack={() => navigate(routerPage.tour)}
                        style={{ borderRadius: 8 }}
                        title={location?.state?.id ? 'Chỉnh sửa tour' : 'Thêm tour mới'}
                        extra={[<ButtonSave text="Lưu" onClickButton={addEditTour} />]}
                    />
                }
                contentComponent={
                    <CustomLoading isLoading={isLoading}>
                        <div>
                            <Row gutter={[16, 16]}>
                                <CustomCol span={12}>
                                    <div className="label-block">
                                        <p>
                                            Tên tour<span style={{ color: 'red' }}> *</span>
                                        </p>
                                    </div>
                                    <div className="input-block">
                                        <Input
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Tiều đề bài viết"
                                            value={tourName}
                                            onChange={(e: any) => {
                                                if (e.target.value !== '') {
                                                    setIsTourNameError(false);
                                                } else setIsTourNameError(true);
                                                setTourName(e?.target?.value);
                                            }}
                                            status={isTourNameError ? 'error' : undefined}
                                        />
                                    </div>
                                </CustomCol>
                                <CustomCol span={2} />
                                <CustomCol span={10}>
                                    <div className="label-block">
                                        <p>
                                            Hình ảnh<span style={{ color: 'red' }}> *</span>
                                        </p>
                                    </div>
                                    <div className="input-block">
                                        {listImages && (
                                            <UploadComponent
                                                isUploadServerWhenUploading
                                                uploadType="single"
                                                listType="picture-card"
                                                isShowFileList
                                                maxLength={1}
                                                initialFiles={
                                                    location?.state?.record
                                                        ? [
                                                              {
                                                                  uid: '-1',
                                                                  name: 'image.png',
                                                                  status: 'done',
                                                                  url: location?.state?.record?.imageUrl,
                                                              },
                                                          ]
                                                        : []
                                                }
                                                onSuccessUpload={(url: any) => {
                                                    setListImages(url.flat());
                                                }}
                                            />
                                        )}
                                    </div>
                                </CustomCol>
                                <Col style={{ marginTop: 20 }} span={24}>
                                    <p>
                                        Nội dung bài viết<span style={{ color: 'red' }}> *</span>
                                    </p>
                                    <MyEditor
                                        defaultValue={
                                            location?.state?.record ? location?.state?.record?.description : ''
                                        }
                                        logData={(value) => {
                                            setDescription(value);
                                        }}
                                        editorStyle={{
                                            border: '1px solid #ACB0B0',
                                            borderRadius: '5px',
                                            overflow: 'hidden scroll',
                                            padding: '0 16px',
                                        }}
                                        height={350}
                                        setIsAllSpace={setIsAllSpace}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </CustomLoading>
                }
            />
        </CustomLoading>
    );
};

const CustomCol = styled(Col)`
    display: flex;
    flex-direction: row;

    .label-block {
        flex: 1;
        margin-right: -10px;
        width: 50px;
    }

    .input-block {
        flex: 4;
    }
`;

export default AddEditTour;
