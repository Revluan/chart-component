import type { EChartsOption } from 'echarts';
import { getColor } from '../ChartUtils/color';
import { ThemeProvider } from '@ucloud-fe/react-components';

export const getEchartsOptions = (): EChartsOption => {
  // @ts-ignore
  const { useDesignTokens } = ThemeProvider;
  const DT = useDesignTokens();

  return {
    color: getColor(),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#E5E6EB',
          width: 1,
          type: 'solid'
        }
      }
    },
    legend: {
      show: true,
      bottom: 0,
      icon: "rect",
      itemWidth: 14,
      itemHeight: 2,
      type: "scroll",
      orient: 'horizontal',
      pageButtonItemGap: 5,
      pageButtonGap: 15,
      itemGap: 10,
      textStyle: {
        color: DT.T_COLOR_TEXT_REMARK_DARK,
        overflow: 'truncate',
      },
      formatter: (name: string) => {
        // if (!name) return '';
        // if (name.length > 15) {
        //     name = name.slice(0, 15) + '...';
        // }
        return name
      },
      tooltip: {
        show: true
      },
      // 自定义翻页图标
      pageIcons: {
        horizontal: ["path://M687.4,990l115.3-115.3L427.9,500l374.7-374.7L687.4,10l-490,490L687.4,990z", "path://M197.8,124.3L312.2,10l490,490l-490,490L197.8,875.7L573.5,500L197.8,124.3z"],
      },
      pageIconColor: '#0A1633',
      pageIconInactiveColor: '#C3CAD9',
      pageIconSize: 10,
      pageTextStyle: {
        fontSize: 12,
        fontWeight: 400
      }
    },
    grid: {
      top: 30,
      right: 30,
      bottom: 40,
      left: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: true,
        lineStyle: {
          color: DT.T_COLOR_LINE_DEFAULT_LIGHT
        }
      },
      axisLabel: {
        color: DT.T_COLOR_TEXT_DEFAULT_LIGHT,
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      nameLocation: 'end',
      nameTextStyle: {
        fontSize: 12,
        color: '7A8BAA',
        lineHeight: 20,
        fontWeight: 400,
        align: 'left',
        padding: [0, 0, 0, -30]
      },
      // 用虚线
      splitLine: {
        lineStyle: {
          type: [5, 5],
          dashOffset: 5,
          color: DT.T_COLOR_LINE_DEFAULT_LIGHT
        },
        show: true
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        fontSize: 12,
        color: DT.T_COLOR_TEXT_DEFAULT_LIGHT,
        lineHeight: 20,
        fontWeight: 400,
        showMaxLabel: true,
        showMinLabel: true,
      },
    }
  };
};
