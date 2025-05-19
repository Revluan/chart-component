import React from 'react';
import Chart from '../Chart';
import type { EChartsOption, LineSeriesOption } from 'echarts';
import { getEchartsOptions } from './defaultOptions';
import { merge } from 'lodash';
import getBaseToolTip from '../ChartUtils/tooltip';
import { getAxisLabel } from '../ChartUtils/unit-adapt';
import type { LineChartProps } from './types';

const LineChart: React.FC<LineChartProps> = ({
  data,
  customOptions,
  unitConfig,
  type = 'category',
  ...restProps
}) => {
  // 生成 series 配置
  const series: LineSeriesOption[] = data.series.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data,
    smooth: item.smooth,
    showSymbol: item.showSymbol,
    lineStyle: {
      width: 2
    },
    areaStyle: item.areaStyle ? {
      opacity: 0.1
    } : undefined
  }));

  // 基础配置
  const baseOptions: Partial<EChartsOption> = {
    xAxis: data.xAxis,
    series
  };

  // 单位转换相关配置
  const unitOptions: Partial<EChartsOption> = unitConfig?.unit ? {
    tooltip: getBaseToolTip({
      unit: unitConfig.unit,
      unitRule: unitConfig.unitRule,
      tooltipConfig: undefined,
      shouldSliceTooltipName: false
    }),
    yAxis: {
      axisLabel: {
        formatter: getAxisLabel({
          unit: unitConfig.unit,
          targetUnit: '',
          customUnitRule: unitConfig.unitRule,
          precision: 1,
          showYAxisUnit: true
        }).formatter
      }
    }
  } : {
    tooltip: getBaseToolTip({
      unit: '',
      unitRule: [],
      tooltipConfig: undefined,
      shouldSliceTooltipName: false
    })
  };

  // 合并所有配置
  const options: EChartsOption = merge(
    {}, // 空对象作为基础
    getEchartsOptions(), // 默认配置
    baseOptions, // 基础数据配置
    unitOptions, // 单位转换配置
    customOptions // 用户自定义配置（优先级最高）
  );

  return <Chart options={options} {...restProps} />;
};

export default LineChart; 