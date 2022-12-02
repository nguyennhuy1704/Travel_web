import IconAntd from '@/components/IconAntd';
import { openNotificationWithIcon } from '@/components/Notification';
import { Modal, Upload } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { newsService } from '../service';

interface IImagePost {
    listImages: any[];
    setListImages: React.Dispatch<React.SetStateAction<any[]>>;
}

const ImagePost = (props: IImagePost) => {
    const { listImages, setListImages } = props;
    const [previewImage, setPreviewImage] = React.useState<string>('');
    const [previewTitle, setPreviewTitle] = React.useState<string>('');
    const [isPreviewVisible, setIsPreviewVisible] = React.useState<boolean>(false);

    const getBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setIsPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList }: { fileList: any }) => {
        setListImages(fileList);
    };

    const uploadButton = (
        <div>
            <IconAntd icon={'PlusOutlined'} />
            <p style={{ marginTop: 10 }}>Tải ảnh</p>
        </div>
    );

    return (
        <>
            {/* <WSUpload
                onUploadImage={newsService.uploadImageToServer}
                listType="picture-card"
                accept="image/jpeg,image/png,image/jpg"
                fileList={listImages}
                defaultFileList={listImages}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {listImages.length >= 1 ? null : uploadButton}
            </WSUpload> */}
            <Modal
                open={isPreviewVisible}
                title={<TitleModal>{previewTitle}</TitleModal>}
                footer={null}
                onCancel={() => setIsPreviewVisible(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export const TitleModal = styled.div`
    font-weight: 600;
    font-size: 20px;
`;

export default ImagePost;
