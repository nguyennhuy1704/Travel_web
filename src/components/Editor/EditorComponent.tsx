import AxiosClient from '@/apis/AxiosClient';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { Component, CSSProperties } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface IProps {
    logData: (data: string) => any;
    defaultValue?: string;
    height?: number | string;
    width?: number | string;
    editorStyle?: CSSProperties;
    setIsAllSpace: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorComponent = (props: IProps) => {
    const [editorState, setEditorState] = React.useState<any>('');
    const firstEdit = React.useRef<any>(null);

    const uploadImageCallBack = async (file: any) => {
        const fmData = new FormData();
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        fmData.append('images', file);

        const res: any = await AxiosClient.post('/UploadFile/UploadFile', fmData, config);

        return new Promise((resolve, reject) => {
            resolve({ data: { link: res?.data?.[0] } });
        });
    };

    React.useEffect(() => {
        if (firstEdit.current) return;

        if (props.defaultValue) {
            const html = props.defaultValue;

            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState);
            }

            if (firstEdit) {
                firstEdit.current = true;
            }
        }
    }, [props.defaultValue]);

    const onEditorStateChange = (editorState: any) => {
        props.logData(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        setEditorState(editorState);
    };

    return (
        <div style={{ width: '100%', marginBottom: 20 }}>
            <Editor
                placeholder="Thêm nội dung bài viết"
                editorState={editorState}
                onEditorStateChange={(value) => onEditorStateChange(value)}
                toolbar={{
                    options: [
                        'inline',
                        'blockType',
                        'fontSize',
                        'fontFamily',
                        'image',
                        'list',
                        'textAlign',
                        'colorPicker',
                        'link',
                        'embedded',
                        'emoji',
                        'remove',
                        'history',
                    ],
                    image: {
                        uploadCallback: uploadImageCallBack,
                        previewImage: true,
                        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                    },
                }}
                editorStyle={{
                    ...props.editorStyle,
                    height: props.height ? props.height : 200,
                    width: props.width ? props.width : '100%',
                }}
            />
        </div>
    );
};

export default EditorComponent;
