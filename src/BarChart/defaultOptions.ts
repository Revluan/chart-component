import type { EChartsOption } from 'echarts';

export const defaultBarChartOptions: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  },
  legend: {
    show: true,
    top: 0,
    icon: 'roundRect',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      color: '#86909C',
      fontSize: 12
    }
  },
  grid: {
    top: 40,
    right: 20,
    bottom: 20,
    left: 60,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#E5E6EB'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#86909C',
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: '#E5E6EB',
        type: 'dashed'
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#86909C',
      fontSize: 12
    }
  }
}; 