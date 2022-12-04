import { Bar } from '@ant-design/plots';

const ChartColumn = () => {
    const data = [
        {
            year: 'Tour 1',
            value: 38,
        },
        {
            year: 'Tour 2',
            value: 52,
        },
        {
            year: 'Tour 3',
            value: 61,
        },
        {
            year: 'Tour 4',
            value: 145,
        },
    ];
    const config: any = {
        data,
        xField: 'value',
        yField: 'year',
        seriesField: 'year',
        legend: {
            position: 'bottom',
        },
    };
    return <Bar appendPadding={[20, 0]} {...config} />;
};

export default ChartColumn;
