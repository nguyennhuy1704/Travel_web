import IconAntd from '@/components/IconAntd';
import { openNotificationWithIcon } from '@/components/Notification';
import { Upload } from 'antd';
import React from 'react';

interface IImageTour {
    listImages: any[];
    setListImages: React.Dispatch<React.SetStateAction<any[]>>;
}

const ImageTour = (props: IImageTour) => {
    const { listImages, setListImages } = props;
    const [previewImage, setPreviewImage] = React.useState<string>('');
    const [isShowModalPreview, setShowModalPreview] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [imageUrl, setImageUrl] = React.useState<string>();

    const getBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    const handlePreviewImage = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setShowModalPreview(true);
    };

    const handleChangeImage = async (file: any, index: number) => {
        // case remove image
        var resUploadImage: any;

        if (file.file.status === 'removed') {
            listImages[index].fileList = [];
            listImages[index].url = '';
            setListImages([...listImages]);
            return;
        }
        const isLt3M = file.file.type ? file.file.size / 1024 / 1024 < 3 : true;
        const isJpgOrPng =
            file.file.type === 'image/jpeg' || file.file.type === 'image/png' || file.file.type === 'image/jpg';
        if (!isJpgOrPng) {
            openNotificationWithIcon('error', 'Thất bại', 'Bạn chỉ có thể upload ảnh có định dạng JPG/PNG/JPEG!');
            return;
        } else if (!isLt3M) {
            openNotificationWithIcon('error', 'Thất bại', 'Dung lượng ảnh tối đa là 3MB!');
            return;
        }
        // case uploading image
        if (file?.fileList[0]?.status === 'uploading') {
            listImages[index].fileList = file.fileList || [];
            setListImages([...listImages]);
        }
        // case upload image
        else if (file.file.status !== 'removed') {
            try {
                // resUploadImage = await uploadImageToServer(file.fileList);
                listImages[index].fileList = [
                    {
                        status: 'done',
                        size: '10000',
                        type: 'image/jpeg',
                        uid: index,
                        url: resUploadImage?.location,
                    },
                ];
                listImages[index].url = resUploadImage?.location;
                setListImages([...listImages]);
            } catch (error) {
                openNotificationWithIcon(
                    'error',
                    'Thất bại',
                    'Tải ảnh thất bại, vui lòng kiểm tra kết nối và thử lại.'
                );
            }
        }
    };

    const uploadButton = (
        <div>
            {isLoading ? <IconAntd icon="LoadingOutlined" /> : <IconAntd icon="PlusOutlined" />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
    );
};

export default ImageTour;
