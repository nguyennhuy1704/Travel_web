import './Container.css';
import styled from 'styled-components';

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
            <div className="header_container">{header}</div>
            {filterComponent && <div className="content_container">{filterComponent}</div>}
            <div className="content_container">{contentComponent}</div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    margin: 5px 10px 15px;
`;

export default Container;
