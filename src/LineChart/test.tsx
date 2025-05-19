import { LineChart } from '@ucloud/cmp-chart-components';
import React from 'react';
import moment from 'moment';

const dataValue = [
    [
        1677722400,
        100000
    ],
    [
        1677808800,
        2000000
    ],
    [
        1677895200,
        300000
    ],
    [
        1677981600,
        400000
    ],
    [
        1678068000,
        500000
    ],
    [
        1678154400,
        600000
    ],
    [
        1678240800,
        700000
    ],
    [
        1678327200,
        800000
    ]
]

const Line = () => {
    return (
        <LineChart 
            data={{
                xAxis: {
                    type: 'time'
                },
                series: [
                    {
                        name: '访问量',
                        data: dataValue.map(i => ([moment(i[0]).format('MM-DD HH:mm:ss'), i[1]]))
                    }
                ]
            }} 
            customOptions={{
                xAxis: {
                    type: 'time'
                },
            }}
        />
    )
}

export default Line;