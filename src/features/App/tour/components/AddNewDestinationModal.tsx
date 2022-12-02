import UploadComponent from '@/components/UploadComponent';
import { Col, Input, InputNumber, Modal, Row } from 'antd';
import MyEditor from '@/components/Editor/EditorComponent';
import React from 'react';
import styled from 'styled-components';
import CustomLoading from '@/components/Loading';
import { tourService } from '../service';
import { openNotificationWithIcon } from '@/components/Notification';
import { IDestinationDetail } from './Interface';

interface IAddNewDestinationModal {
    isModalOpen: boolean;
    currentId: number | undefined;
    setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
    currentTourId: number | undefined;
    getDestinationList: () => Promise<void>;
    getTours: () => Promise<void>;
    currentRecord: any;
    setCurrentRecord: React.Dispatch<any>;
}

const AddNewDestinationModal = (props: IAddNewDestinationModal) => {
    const {
        isModalOpen,
        setIsModalOpen,
        currentId,
        currentTourId,
        getDestinationList,
        getTours,
        currentRecord,
        setCurrentRecord,
    } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isAllSpace, setIsAllSpace] = React.useState<boolean>(false);
    const [desName, setDesName] = React.useState<string>();
    const [isDesNameError, setIsDesNameError] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string>();
    const [isDesError, setIsDesError] = React.useState<boolean>(false);
    const [mapUrl, setMapUrl] = React.useState<string>();
    const [isMapUrlError, setIsMapUrlError] = React.useState<boolean>(false);
    const [index, setIndex] = React.useState<number | null>();
    const [isIndexError, setIsIndexError] = React.useState<boolean>(false);
    const [listImages, setListImages] = React.useState<any[]>([]);
    const [listVideos, setListVideos] = React.useState<any[]>([]);

    const addUpdateDestination = async () => {
        try {
            setIsLoading(true);
            if (!currentRecord) {
                // Thêm mới
                const payload = {
                    name: desName,
                    orderIndex: index,
                    mapUrl,
                    imageUrl: listImages[0],
                    videoUrl: listVideos[0],
                    description,
                    tourID: currentTourId,
                };
                const res = await tourService.addDestination(payload);
                if (res.status) {
                    openNotificationWithIcon('success', 'Thành công', 'Thêm địa điểm mới thành công!');
                    getDestinationList();
                    setIsModalOpen(false);
                    getTours();
                }
            } else {
                // Cập nhật
                const payload = {
                    name: desName,
                    orderIndex: index,
                    mapUrl,
                    imageUrl: listImages[0],
                    videoUrl: listVideos[0],
                    description,
                    tourID: currentTourId,
                    id: currentRecord?.id,
                };
                const res = await tourService.updateDestination(payload);
                if (res.status) {
                    openNotificationWithIcon('success', 'Thành công', 'Cập nhật địa điểm thành công!');
                    getDestinationList();
                    setIsModalOpen(false);
                    getTours();
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setDesName(currentRecord?.destinationName);
        setIndex(currentRecord?.orderIndex);
        setMapUrl(currentRecord?.mapUrl);
        setDescription(currentRecord?.description);
        setListImages([currentRecord?.imageUrl]);
        setListVideos([currentRecord?.videoUrl]);
    }, [currentRecord]);

    return (
        <CustomLoading isLoading={isLoading}>
            <Modal
                title={currentRecord ? 'Sửa địa điểm' : 'Thêm điểm đến mới'}
                open={isModalOpen}
                centered
                onCancel={() => {
                    setIsModalOpen(false);
                    setCurrentRecord(null);
                }}
                cancelText="Đóng"
                okText="Lưu"
                width={'60%'}
                onOk={addUpdateDestination}
            >
                <Row>
                    <Col span={12}>
                        <p>
                            Tên điểm đến<span style={{ color: 'red' }}> *</span>
                        </p>
                        <Input
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Tên điểm đến"
                            value={desName}
                            onChange={(e: any) => {
                                if (e.target.value !== '') {
                                    setIsDesNameError(false);
                                } else setIsDesNameError(true);
                                setDesName(e?.target?.value);
                            }}
                            status={isDesNameError ? 'error' : undefined}
                        />
                    </Col>
                    <Col span={12}>
                        <p>
                            Thứ tự hiển thị<span style={{ color: 'red' }}> *</span>
                        </p>
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Thứ tự hiển thị"
                            min={1}
                            value={index}
                            onChange={(value: number | null) => {
                                console.log('Value: ', value);
                                if (value) {
                                    setIsIndexError(false);
                                } else setIsIndexError(true);
                                setIndex(value);
                            }}
                            status={isIndexError ? 'error' : undefined}
                        />
                    </Col>
                </Row>
                <MarginedRow>
                    <Col span={24}>
                        <p>
                            Địa chỉ Google Map<span style={{ color: 'red' }}> *</span>
                        </p>
                        <Input
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Địa chỉ điểm đến"
                            value={mapUrl}
                            onChange={(e: any) => {
                                if (e.target.value !== '') {
                                    setIsMapUrlError(false);
                                } else setIsMapUrlError(true);
                                setMapUrl(e?.target?.value);
                            }}
                            status={isMapUrlError ? 'error' : undefined}
                        />
                    </Col>
                </MarginedRow>
                <MarginedRow>
                    <Col span={12}>
                        <p>
                            Hình ảnh<span style={{ color: 'red' }}> *</span>
                        </p>
                        <UploadComponent
                            isUploadServerWhenUploading
                            uploadType="single"
                            listType="picture-card"
                            maxLength={1}
                            initialFiles={
                                currentRecord
                                    ? [
                                          {
                                              uid: currentId,
                                              name: 'image.png',
                                              status: 'done',
                                              url: listImages[0],
                                          },
                                      ]
                                    : []
                            }
                            onSuccessUpload={(url: any) => {
                                setListImages(url.flat());
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <p>
                            Video<span style={{ color: 'red' }}> *</span>
                            <span style={{ color: '#bbbdbc', fontSize: 12 }}>
                                {' '}
                                (Dung lượng tối đa của video là 20MB)
                            </span>
                        </p>

                        <UploadComponent
                            accept=".mp4"
                            isUploadServerWhenUploading
                            uploadType="single"
                            listType="picture-card"
                            maxLength={1}
                            initialFiles={
                                currentRecord
                                    ? [
                                          {
                                              uid: currentId,
                                              name: 'video.mp4',
                                              status: 'done',
                                              url: listVideos[0],
                                          },
                                      ]
                                    : []
                            }
                            onSuccessUpload={(url: any) => {
                                setListVideos(url.flat());
                            }}
                        />
                    </Col>
                    <Col span={12}></Col>
                </MarginedRow>
                <MarginedRow>
                    <Col span={24}>
                        <MyEditor
                            defaultValue={currentRecord ? description : ''}
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
                </MarginedRow>
            </Modal>
        </CustomLoading>
    );
};

const MarginedRow = styled(Row)`
    margin-top: 20px;
`;

export default AddNewDestinationModal;
