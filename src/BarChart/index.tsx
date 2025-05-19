import React from 'react';
import Chart from '../Chart';
import type { EChartsOption, BarSeriesOption } from 'echarts';
import type { ChartProps } from '../Chart';
import { defaultBarChartOptions } from './defaultOptions';
import { merge } from 'lodash';

export interface BarChartProps extends Omit<ChartProps, 'options'> {
  /** 数据源 */
  data: {
    xAxis: string[];
    series: Array<{
      name: string;
      data: number[];
      color?: string;
      barWidth?: number;
      stack?: string;
      label?: {
        show?: boolean;
        position?: 'top' | 'inside' | 'bottom';
      };
    }>;
  };
  /** 自定义配置项，会与预设配置合并 */
  customOptions?: Partial<EChartsOption>;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  customOptions,
  ...restProps
}) => {
  // 生成 series 配置
  const series: BarSeriesOption[] = data.series.map(item => ({
    name: item.name,
    type: 'bar',
    data: item.data,
    barWidth: item.barWidth,
    stack: item.stack,
    itemStyle: {
      color: item.color
    },
    label: item.label ? {
      show: item.label.show,
      position: item.label.position,
      fontSize: 12,
      color: '#86909C'
    } : undefined
  }));

  // 合并配置
  const options: EChartsOption = merge(
    {},
    defaultBarChartOptions,
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

export default BarChart; 