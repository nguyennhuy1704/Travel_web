import AxiosClient from '@/apis/AxiosClient';
import { Notification } from '@/utils';
import { Image, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import { UploadFile, UploadListType } from 'antd/lib/upload/interface';
import React, { ReactNode } from 'react';
import IconAntd from '../IconAntd';
import { Player } from 'video-react';
import { openNotificationWithIcon } from '../Notification';
import { duration } from 'moment';

type uploadType = 'single' | 'list';
interface IProps {
    onSuccessUpload: (file: any) => void;
    isUploadServerWhenUploading?: boolean;
    isShowFileList?: boolean;
    children?: ReactNode;
    uploadType?: uploadType;
    accept?: string;
    listType?: UploadListType;
    maxLength?: number;
    initialFiles?: any;
    title?: string;
}

const UploadComponent: React.FC<IProps> = ({
    accept = 'image/*',
    listType = 'text',
    uploadType = 'single',
    isShowFileList = true,
    isUploadServerWhenUploading = false,
    onSuccessUpload,
    children,
    maxLength = 1,
    title,
    initialFiles = [],
}) => {
    const [files, setFiles] = React.useState<UploadFile[]>([]);
    const [progress, setProgress] = React.useState(0);
    const [visiblePreview, setVisiblePreview] = React.useState(false);
    const firstLoad = React.useRef(false);
    const [videoSrc, seVideoSrc] = React.useState('');

    React.useEffect(() => {
        if (accept === '.mp4') {
            if (!initialFiles[0]?.url || firstLoad.current) return;
            firstLoad.current = true;
            setFiles(initialFiles);
            seVideoSrc(initialFiles[0]?.url);
        }
    }, [initialFiles[0]?.url]);

    const beforeUploadFile = (file: any): any => {
        let fileSize: number = 20;
        if (accept === '.mp4') {
            const isMP4: boolean = file.type === 'video/mp4';
            const validateFileSize: boolean = file.size / 1024 / 1024 > fileSize;

            if (!isMP4) {
                openNotificationWithIcon('error', 'Thất bại', 'Video không đúng định dạng!', 0);
                return false;
            } else if (validateFileSize) {
                openNotificationWithIcon('error', 'Thất bại', 'Dung lượng tối đa của video là 20.0 MB', 0);
                return false;
            }

            return true;
        }
        return true;
    };

    const uploadImage = async (options: any) => {
        const { onSuccess, onError, file, onProgress } = options;

        if (beforeUploadFile(file)) {
            if (files.length > maxLength) {
                file.status = 'error';
                const error = new Error('Some error');
                if (uploadType === 'single') {
                    setFiles([file]);
                } else {
                    setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                }
                onError({ error });
                return Notification('error', 'Vượt quá số lượng cho phép');
            }

            if (isUploadServerWhenUploading) {
                const fmData = new FormData();
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                    onUploadProgress: (event: any) => {
                        const percent = Math.floor((event.loaded / event.total) * 100);
                        setProgress(percent);
                        if (percent === 100) {
                            setTimeout(() => setProgress(0), 1000);
                        }
                        onProgress({ percent: (event.loaded / event.total) * 100 });
                    },
                };
                fmData.append('images', file);
                try {
                    const res: any = await AxiosClient.post('/UploadFile/UploadFile', fmData, config);

                    if (res.status) {
                        setFiles([file]);
                        onSuccessUpload(res?.data as string);
                        onSuccess('ok');
                    } else {
                        file.status = 'error';
                        const error = new Error('Some error');
                        if (uploadType === 'single') {
                            setFiles([file]);
                        } else {
                            setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                        }
                        onError({ error });
                    }
                } catch (err) {
                    file.status = 'error';
                    const error = new Error('Some error');
                    if (uploadType === 'single') {
                        setFiles([file]);
                    } else {
                        setFiles((f) => [...f.filter((_f) => _f.status !== 'uploading'), file]);
                    }
                    onError({ error });
                }
            } else {
                setTimeout(() => onSuccess('ok'), 500);
            }
        }
    };

    const handleOnChange: UploadProps['onChange'] = ({ file, fileList, event }: any) => {
        if (file.status !== 'error') {
            setFiles(fileList);
            if (accept === '.mp4' && file.status !== 'removed') {
                seVideoSrc(URL.createObjectURL(file.originFileObj));
            }
        }

        if (file.status !== 'removed') {
            !isUploadServerWhenUploading && onSuccessUpload(file);
        } else {
            if (uploadType === 'single') {
                setFiles([]);
                seVideoSrc('');
                onSuccessUpload([]);
            }
        }
    };

    const handlePreview = async (file: UploadFile) => {
        setVisiblePreview(true);
        return;
    };

    React.useEffect(() => {
        if (!initialFiles[0]?.url || firstLoad.current) return;
        firstLoad.current = true;
        setFiles(initialFiles);
    }, [initialFiles[0]?.url]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Upload
                accept={accept}
                customRequest={uploadImage}
                onChange={handleOnChange}
                listType={listType}
                fileList={isShowFileList ? files : []}
                className="image-upload-grid"
                onPreview={handlePreview}
                beforeUpload={beforeUploadFile}
            >
                {files.length >= maxLength ? null : uploadType === 'single' && files.length >= 1 ? null : listType ===
                  'text' ? (
                    children
                ) : (
                    <div>
                        <IconAntd icon={'PlusOutlined'} fontSize={14} />
                        <p style={{ paddingTop: 10 }}>{title}</p>
                    </div>
                )}
            </Upload>
            {listType !== 'text' && (
                <Image.PreviewGroup
                    preview={{
                        visible: visiblePreview,
                        onVisibleChange: (visible) => setVisiblePreview(visible),
                    }}
                >
                    {files.map((file: UploadFile, index: number) => {
                        return <Image key={file.uid} src={file.url} width={0} style={{ display: 'none' }} />;
                    })}
                </Image.PreviewGroup>
            )}
            {accept === '.mp4' && videoSrc !== '' && (
                <Player playsInline src={videoSrc} fluid={false} width={320} height={180} />
            )}
        </div>
    );
};

export default UploadComponent;
