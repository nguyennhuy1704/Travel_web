import { LOADING_COLOR } from '@/config/theme';
import { Spin } from 'antd';
import React from 'react';
import { HashLoader } from 'react-spinners';
import styled from 'styled-components';

interface ICustomLoading {
    isLoading: boolean;
    children: any;
}

const CustomLoading = (props: ICustomLoading) => {
    return (
        <SpinLoadingStyled
            spinning={props.isLoading}
            indicator={<HashLoader color={LOADING_COLOR} loading size={60} />}
        >
            {props.children}
        </SpinLoadingStyled>
    );
};

const SpinLoadingStyled = styled(Spin)`
    &&& {
        top: 20%;
    }
`;

export default CustomLoading;
