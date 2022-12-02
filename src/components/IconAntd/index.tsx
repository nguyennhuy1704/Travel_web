import React, { ReactNode } from 'react';
import * as AntdIcons from '@ant-design/icons';

const IconAntd = ({
    icon,
    props,
    fontSize = 20,
    marginLeft = 0,
    marginRight = 0,
}: {
    icon: any;
    props?: any;
    fontSize?: number;
    marginLeft?: number;
    marginRight?: number;
}) => {
    //@ts-ignore
    const AntdIcon = AntdIcons[icon];

    return (
        <AntdIcon
            style={{ fontSize: `${fontSize}px`, marginLeft: marginLeft, cursor: 'pointer', marginRight: marginRight }}
            {...props}
        />
    );
};

export default IconAntd;
