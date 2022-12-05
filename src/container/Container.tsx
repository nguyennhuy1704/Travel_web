import './Container.css';
import styled from 'styled-components';
import { BOX_SHADOW, BOX_SHADOW_CARD } from '@/config/theme';

type Props = {
    children?: any;
    filterComponent?: any;
    contentComponent?: any;
    header?: any;
    footer?: any;
};

const Container = ({
    // children,
    filterComponent,
    contentComponent,
    header = () => {},
}: Props) => {
    return (
        <StyledContainer>
            {/* {header!()} */}
            {/* <Spin size="large" spinning={false}> */}
            <HeaderStyled>{header}</HeaderStyled>
            <WrapperContentStyled>
                {filterComponent && <div>{filterComponent}</div>}

                <ContentStyled>{contentComponent}</ContentStyled>
            </WrapperContentStyled>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    margin: 0 30px;
    overflow: hidden;
`;

const HeaderStyled = styled.div`
    background-color: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: ${BOX_SHADOW_CARD};
`;

const WrapperContentStyled = styled.div`
    background-color: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: ${BOX_SHADOW_CARD};
    padding: 20px 24px 4px 24px;
    margin: 12px 0;
    height: 100%;
`;
const ContentStyled = styled.div`
    margin-top: 12px;
`;

export default Container;
