import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Container = ({ children }: { children: ReactNode }) => {
    return <div>{children}</div>;
};

const ContainerStyled = styled.div``;

export default Container;
