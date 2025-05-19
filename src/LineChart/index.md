---
title: LineChart 折线图
order: 2
nav:
  title: 图表组件
  path: /components
---

# LineChart 折线图组件

基于 ECharts 的折线图组件，提供了预设的样式配置和简化的数据接口。
需要传入data: { xAxis, series }

## 基础用法

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';
const data = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260]
    }
  ]
};

export default () => <LineChart data={data} />;
```

## x轴为时间的场景

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';
import moment from 'moment';

const dataValue = [[1677722400, 10], [1677808800,20], [1677895200,30], [1677981600,80], [1678068000,50], [1678154400,20], [1678240800,90], [1678327200,40]];
const formatValue = dataValue.map(i => ([moment(i[0]).format('MM-DD HH:mm:ss'), i[1]]));

const data = {
  series: [
    {
     name: '访问量',
     data: formatValue
    }
  ]
};

const customOptions = {
  xAxis: {
     type: 'time'
  }
}

export default () => <LineChart data={data} customOptions />;
```

## 带单位和进制转换的用法，一般用于监控数据图
### 需要传入unitConfig配置项，包括当前的单位unit，单位的进制转换规则{ units, unitRule }[]

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const unitConfig = {
  unit: '个',
  unitRule: [
      {
        units: ['个', '百个'],
        conversionFactor: 100
      }
  ]
}

const data = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260]
    }
  ]
};

export default () => <LineChart data={data} unitConfig={unitConfig} />;
```

## 多折线图

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260],
    },
    {
      name: '下载量',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '测试量',
      data: [130, 100, 30, 50, 80, 130, 210],
    }
  ]
};

export default () => <LineChart data={data} />;
```

## 面积图

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260],
      areaStyle: true
    }
  ]
};

export default () => <LineChart data={data} />;
```

## 自定义配置

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';
import type { EChartsOption } from 'echarts';

const data = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260],
      smooth: true,
      showSymbol: false
    }
  ]
};

const customOptions: Partial<EChartsOption> = {
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c}'
  }
};

export default () => (
  <LineChart 
    data={data} 
    customOptions={customOptions}
  />
);
```

## API

### LineChartProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 图表数据源 | `{ xAxis: string[]; series: Array<{ name: string; data: number[]; color?: string; smooth?: boolean; showSymbol?: boolean; areaStyle?: boolean; }> }` | - |
| customOptions | 自定义配置项，会与预设配置合并 | `Partial<EChartsOption>` | - |

### data.series 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 系列名称 | `string` | - |
| data | 数据数组 | `number[]` | - |
| smooth | 是否平滑曲线 | `boolean` | - |
| showSymbol | 是否显示数据点标记 | `boolean` | - |
| areaStyle | 是否显示面积 | `boolean` | - |

## 注意事项

1. 组件内部已经预设了常用的样式配置，包括：
   - 坐标轴样式
   - 图例样式
   - 网格线样式
   - 提示框样式
   - 数据点样式

2. 如果需要自定义配置，可以通过 `customOptions` 属性传入，这些配置会与预设配置合并。

3. 组件支持通过 `ref` 获取 ECharts 实例，可以用于调用 ECharts 的 API。

4. 组件会自动处理窗口大小变化，并支持设置最小宽度和禁用自动调整大小。 