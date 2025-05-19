---
title: LineChart 折线图
nav:
  title: 组件
  path: /components
---

# LineChart 折线图组件

基于 ECharts 的折线图组件，提供了预设的样式配置和简化的数据接口。

## 基础用法

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260]
    }
  ]
};

export default () => <LineChart data={data} />;
```

## 多折线图

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260],
      color: '#165DFF'
    },
    {
      name: '下载量',
      data: [120, 132, 101, 134, 90, 230, 210],
      color: '#0FC6C2'
    }
  ]
};

export default () => <LineChart data={data} />;
```

## 面积图

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
| color | 线条颜色 | `string` | - |
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