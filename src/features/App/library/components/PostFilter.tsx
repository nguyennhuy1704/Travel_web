import Icon from '@ant-design/icons';
import { Col, DatePicker, Input, Row, Select } from 'antd';
import { Item } from 'rc-menu';
import React from 'react';
import { ICategory } from '../../post/components/Interface';

interface IPostFilter {
    search: string;
    categories: ICategory[];
    status: number | undefined;
    toDate: string | undefined;
    fromDate: string | undefined;
    searchDocType: string | undefined;
    searchIndex: string;
    setSearchIndex: React.Dispatch<React.SetStateAction<string>>;
    setSearchDocType: React.Dispatch<React.SetStateAction<string | undefined>>;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setStatus: React.Dispatch<React.SetStateAction<number | undefined>>;
    setToDate: React.Dispatch<React.SetStateAction<string | undefined>>;
    setFromDate: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PostFilter = (props: IPostFilter) => {
    const {
        setSearch,
        search,
        status,
        setStatus,
        setFromDate,
        setToDate,
        categories,
        searchDocType,
        setSearchDocType,
        searchIndex,
        setSearchIndex,
    } = props;

    return (
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <Input.Search
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Tên văn bản"
                    addonAfter={<Icon type="close-circle-o" />}
                    value={search}
                    onChange={(e: any) => {
                        setSearch(e.target.value);
                    }}
                />
            </Col>
            <Col span={4}>
                <Input.Search
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Loại văn bản"
                    addonAfter={<Icon type="close-circle-o" />}
                    value={searchDocType}
                    onChange={(e: any) => {
                        setSearchDocType(e.target.value);
                    }}
                />
            </Col>
            <Col span={4}>
                <Input.Search
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Số/ký hiệu"
                    addonAfter={<Icon type="close-circle-o" />}
                    value={searchIndex}
                    onChange={(e: any) => {
                        setSearchIndex(e.target.value);
                    }}
                />
            </Col>
            <Col span={4}>
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    placeholder="Chọn trạng thái"
                    onChange={(value: number | undefined) => {
                        if (value === undefined) {
                            setStatus(undefined);
                        } else {
                            setStatus(value);
                        }
                    }}
                >
                    <Select.Option value={1}>Hoạt động</Select.Option>
                    <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                </Select>
            </Col>
            <Col span={6}>
                <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    format={'DD/MM/YYYY'}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    onChange={(value: any, dateString: [string, string]) => {
                        setFromDate(dateString[0]);
                        setToDate(dateString[1]);
                    }}
                />
            </Col>
        </Row>
    );
};

export default PostFilter;
