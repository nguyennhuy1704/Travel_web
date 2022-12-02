import Icon from '@ant-design/icons';
import { Col, DatePicker, Input, Row, Select } from 'antd';
import React from 'react';
import { ICategory } from '../../post/components/Interface';

interface ICategoryFilter {
    search: string;
    categories: any[];
    subCategories: any[];
    status: number | undefined;
    toDate: string | undefined;
    fromDate: string | undefined;
    categoryId: number | undefined;
    subCategoryId: number | undefined;
    setSubCategoryId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setCategoryId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setStatus: React.Dispatch<React.SetStateAction<number | undefined>>;
    setToDate: React.Dispatch<React.SetStateAction<string | undefined>>;
    setFromDate: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CategoryFilter = (props: ICategoryFilter) => {
    const {
        setSearch,
        search,
        status,
        setStatus,
        setFromDate,
        setToDate,
        categories,
        categoryId,
        setCategoryId,
        subCategoryId,
        setSubCategoryId,
        subCategories,
    } = props;

    return (
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <Input.Search
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Tiều đề bài viết"
                    addonAfter={<Icon type="close-circle-o" />}
                    value={search}
                    onChange={(e: any) => {
                        setSearch(e.target.value);
                    }}
                />
            </Col>
            <Col span={4}>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn loại"
                    allowClear
                    value={categoryId}
                    onChange={(value: number | undefined) => {
                        if (value === undefined) {
                            setCategoryId(undefined);
                        } else {
                            setCategoryId(value);
                        }
                    }}
                >
                    {categories.map((item: any) => (
                        <Select.Option value={item.id}>{item.label}</Select.Option>
                    ))}
                </Select>
            </Col>
            <Col span={4}>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn danh mục"
                    allowClear
                    disabled={categoryId ? false : true}
                    value={subCategoryId}
                    onChange={(value: number | undefined) => {
                        if (value === undefined) {
                            setSubCategoryId(undefined);
                        } else {
                            setSubCategoryId(value);
                        }
                    }}
                >
                    {subCategories.map((item: any) => (
                        <Select.Option value={item.id}>{item.label}</Select.Option>
                    ))}
                </Select>
            </Col>
            <Col span={4}>
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    value={status}
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

export default CategoryFilter;
