import React from 'react';
import Chart from '../Chart';
import type { EChartsOption, LineSeriesOption } from 'echarts';
import type { ChartProps } from '../Chart';
import { getEchartsOptions } from './defaultOptions';
import { merge } from 'lodash';
import getBaseToolTip from '../ChartUtils/tooltip';
import { getAxisLabel, IUnitRule } from '../ChartUtils/unit-adapt';

export interface LineChartProps extends Omit<ChartProps, 'options'> {
  /** 数据源 */
  data: {
    xAxis?: EChartsOption['xAxis'];
    series: Array<LineSeriesOption>;
  };
  unitConfig?: {
    /** 原始单位 */
    unit?: string;
    /** 自定义单位转换规则 */
    unitRule?: IUnitRule[];
  },
  /** 自定义配置项，会与预设配置合并 */
  customOptions?: Partial<EChartsOption>;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  customOptions,
  unitConfig,
  ...restProps
}) => {
  // 生成 series 配置
  const series: LineSeriesOption[] = data.series.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data,
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
    getEchartsOptions(),
    {
      tooltip: getBaseToolTip({
        unit: unitConfig?.unit,
        unitRule: unitConfig?.unitRule,
        tooltipConfig: undefined,
        shouldSliceTooltipName: false
      }),
      yAxis: {
        axisLabel: {
          formatter: unitConfig?.unit ? getAxisLabel({ unit: unitConfig?.unit, targetUnit: '', customUnitRule: unitConfig?.unitRule, precision: 1, showYAxisUnit: true }).formatter : undefined
        }
      }
    },
    customOptions,
    {
      xAxis: data.xAxis,
      series
    }
  );

  console.log('options:', options);

  return <Chart options={options} {...restProps} />;
};

export default LineChart; 