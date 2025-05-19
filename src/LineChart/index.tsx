import React from 'react';
import Chart from '../Chart';
import type { EChartsOption, LineSeriesOption } from 'echarts';
import type { ChartProps } from '../Chart';
import { defaultLineChartOptions } from './defaultOptions';
import { merge } from 'lodash';

export interface LineChartProps extends Omit<ChartProps, 'options'> {
  /** 数据源 */
  data: {
    xAxis: string[];
    series: Array<{
      name: string;
      data: number[];
      color?: string;
      smooth?: boolean;
      showSymbol?: boolean;
      areaStyle?: boolean;
    }>;
  };
  /** 自定义配置项，会与预设配置合并 */
  customOptions?: Partial<EChartsOption>;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  customOptions,
  ...restProps
}) => {
  // 生成 series 配置
  const series: LineSeriesOption[] = data.series.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data,
    smooth: item.smooth,
    showSymbol: item.showSymbol,
    symbol: 'circle',
    symbolSize: 6,
    itemStyle: {
      color: item.color
    },
    lineStyle: {
      width: 2
    },
    areaStyle: item.areaStyle ? {
      opacity: 0.1
    } : undefined
  }));

  // 合并配置
  const options: EChartsOption = merge(
    {},
    defaultLineChartOptions,
    customOptions,
    {
      xAxis: {
        data: data.xAxis
      },
      series
    }
  );

  return <Chart options={options} {...restProps} />;
};

export default LineChart; 