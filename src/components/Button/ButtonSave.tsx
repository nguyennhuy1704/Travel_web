import { LoadingOutlined, SplitCellsOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type ButtonFixedProps = {
    onClickButton?: Function;
    text?: string;
    icon?: any;
    loading?: boolean;
    size?: any;
    htmlType?: any;
    styleButton?: any;
    isDisable?: any;
};

const SaveButton = ({
    text,
    onClickButton,
    icon,
    loading,
    size,
    htmlType,
    styleButton,
    isDisable,
}: ButtonFixedProps) => {
    return (
        <Button
            disabled={isDisable && isDisable}
            style={{
                borderRadius: '3px',
                backgroundColor: 'green',
                borderColor: 'green',
                color: 'white',
            }}
            htmlType={htmlType ? htmlType : 'button'}
            onClick={() => {
                onClickButton && onClickButton();
            }}
            size={size ? size : 'middle'}
        >
            <b>{text}</b>
        </Button>
    );
};

export default SaveButton;
