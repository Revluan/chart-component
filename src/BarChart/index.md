---
title: BarChart 柱状图
order: 3
nav:
  title: 图表组件
  path: /components
---

# BarChart 柱状图组件

基于 ECharts 的柱状图组件，提供了预设的样式配置和简化的数据接口。

## 基础用法

```tsx
import { BarChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260]
    }
  ]
};

export default () => <BarChart data={data} />;
```

## 多柱状图

```tsx
import { BarChart } from '@ucloud/cmp-chart-components';

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

export default () => <BarChart data={data} />;
```

## 堆叠柱状图

```tsx
import { BarChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260],
      stack: 'total'
    },
    {
      name: '下载量',
      data: [120, 132, 101, 134, 90, 230, 210],
      stack: 'total'
    }
  ]
};

export default () => <BarChart data={data} />;
```

## 带标签的柱状图

```tsx
import { BarChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260],
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
};

export default () => <BarChart data={data} />;
```

## 自定义配置

```tsx
import { BarChart } from '@ucloud/cmp-chart-components';
import type { EChartsOption } from 'echarts';

const data = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: '访问量',
      data: [150, 230, 224, 218, 135, 147, 260],
      barWidth: 20
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
  <BarChart 
    data={data} 
    customOptions={customOptions}
  />
);
```

## API

### BarChartProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 图表数据源 | `{ xAxis: string[]; series: Array<{ name: string; data: number[]; color?: string; barWidth?: number; stack?: string; label?: { show?: boolean; position?: 'top' \| 'inside' \| 'bottom'; }; }> }` | - |
| customOptions | 自定义配置项，会与预设配置合并 | `Partial<EChartsOption>` | - |

### data.series 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 系列名称 | `string` | - |
| data | 数据数组 | `number[]` | - |
| color | 柱状图颜色 | `string` | - |
| barWidth | 柱状图宽度 | `number` | - |
| stack | 堆叠标识 | `string` | - |
| label | 数据标签配置 | `{ show?: boolean; position?: 'top' \| 'inside' \| 'bottom'; }` | - |

## 注意事项

1. 组件内部已经预设了常用的样式配置，包括：
   - 坐标轴样式
   - 图例样式
   - 网格线样式
   - 提示框样式
   - 柱状图样式

2. 如果需要自定义配置，可以通过 `customOptions` 属性传入，这些配置会与预设配置合并。

3. 组件支持通过 `ref` 获取 ECharts 实例，可以用于调用 ECharts 的 API。

4. 组件会自动处理窗口大小变化，并支持设置最小宽度和禁用自动调整大小。 