import type { EChartsOption } from 'echarts';
import type { ChartProps } from '../Chart';
import { IUnitRule } from '../ChartUtils/unit-adapt';

export interface BaseLineChartProps extends Omit<ChartProps, 'options'> {
  unitConfig?: {
    unit?: string;
    unitRule?: IUnitRule[];
  };
  customOptions?: Partial<EChartsOption>;
}

export interface CategoryLineChartProps extends BaseLineChartProps {
  type: 'category';
  data: {
    xAxis: {
      type: 'category';
      data: string[];
    };
    series: Array<{
      name: string;
      data: number[];
      areaStyle?: boolean;
      smooth?: boolean;
      showSymbol?: boolean;
    }>;
  };
}

export interface TimeLineChartProps extends BaseLineChartProps {
  type: 'time';
  data: {
    xAxis: {
      type: 'time';
    };
    series: Array<{
      name: string;
      data: Array<[string | number, number]>;
      areaStyle?: boolean;
      smooth?: boolean;
      showSymbol?: boolean;
    }>;
  };
}

export interface ValueLineChartProps extends BaseLineChartProps {
  type: 'value';
  data: {
    xAxis: {
      type: 'value';
      min?: number;
      max?: number;
    };
    series: Array<{
      name: string;
      data: Array<[number, number] | { value: [number, number]; itemStyle?: any }>;
      areaStyle?: boolean;
      smooth?: boolean;
      showSymbol?: boolean;
    }>;
  };
}

export type LineChartProps = CategoryLineChartProps | TimeLineChartProps | ValueLineChartProps; 