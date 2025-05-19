---
title: LineChart 折线图
order: 2
nav:
  title: 图表组件
  path: /components
---

# LineChart 折线图组件

基于 ECharts 的折线图组件，提供了预设的样式配置和简化的数据接口。支持三种类型的 x 轴：category（类目轴）、time（时间轴）和 value（数值轴）。

## 基础用法（类目轴）

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

export default () => <LineChart type="category" data={data} />;
```

## 时间轴场景

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';
import moment from 'moment';

// 时间戳数据
const dataValue = [
  [1677722400, 10],
  [1677808800, 20],
  [1677895200, 30],
  [1677981600, 80],
  [1678068000, 50],
  [1678154400, 20],
  [1678240800, 90],
  [1678327200, 40]
];

// 转换为 ECharts 时间轴需要的格式
const formatValue = dataValue.map(([timestamp, value]) => [
  moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
  value
]);

const data = {
  xAxis: {
    type: 'time',
    // 设置时间轴的范围
    min: moment(dataValue[0][0] * 1000).format('YYYY-MM-DD HH:mm:ss'),
    max: moment(dataValue[dataValue.length - 1][0] * 1000).format('YYYY-MM-DD HH:mm:ss')
  },
  series: [
    {
      name: '访问量',
      data: formatValue,
      // 时间轴建议开启平滑曲线
      smooth: true
    }
  ]
};

export default () => <LineChart type="time" data={data} />;
```

## 数值轴场景（散点图）

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const data = {
  xAxis: {
    type: 'value',
    min: 0,
    max: 100
  },
  series: [
    {
      name: '散点数据',
      data: [
        [10, 20],
        [30, 40],
        [50, 60],
        { value: [70, 80], itemStyle: { color: 'red' } }
      ]
    }
  ]
};

export default () => <LineChart type="value" data={data} />;
```

## 带单位和进制转换的用法

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';

const unitConfig = {
  unit: '个',
  unitRule: [
    {
      units: ['个', '百个', '千个'],
      conversionFactor: 100,
      conversionRules: [
      {
        from: '百个',
        to: '千个',
        conversionFactor: 10
      },
    ]
    }
  ]
};

const data = {
  xAxis: {
    type: 'category',
    data: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9']
  },
  series: [
    {
      name: '访问量',
      smooth: true,
      data: [750, 230, 800, 500, 1200, 345, 490, 260, 1500]
    }
  ]
};

export default () => <LineChart type="category" data={data} unitConfig={unitConfig} />;
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
      smooth: true
    },
    {
      name: '下载量',
      data: [120, 132, 101, 134, 90, 230, 210],
      showSymbol: false
    }
  ]
};

export default () => <LineChart type="category" data={data} />;
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
      areaStyle: true,
      smooth: true
    }
  ]
};

export default () => <LineChart type="category" data={data} />;
```

## 性能测试示例

以下示例展示了渲染大量数据时的性能表现。示例包含50条线，每条线10000个数据点。

```tsx
import { LineChart } from '@ucloud/cmp-chart-components';
import { useEffect, useState, useRef } from 'react';

const PerformanceTest = () => {
  const [renderTime, setRenderTime] = useState<number>(0);
  const [data, setData] = useState<any>(null);
  const renderStartTime = useRef<number>(0);

  useEffect(() => {
    // 生成测试数据
    const generateData = () => {
      const startTime = performance.now();
      
      // 生成时间轴数据
      const timePoints = Array.from({ length: 10000 }, (_, i) => {
        const timestamp = Date.now() - (10000 - i) * 60000; // 每分钟一个点
        return new Date(timestamp).toISOString();
      });

      // 生成100条线的数据
      const series = Array.from({ length: 50 }, (_, seriesIndex) => ({
        name: `Series ${seriesIndex + 1}`,
        data: timePoints.map((time, i) => [
          time,
          Math.random() * 1000 + seriesIndex * 100 // 每条线的基础值不同
        ]),
        showSymbol: false, // 不显示数据点标记以提高性能
        lineStyle: {
          width: 1
        }
      }));

      const chartData = {
        xAxis: {
          type: 'time',
          min: timePoints[0],
          max: timePoints[timePoints.length - 1]
        },
        series
      };

      const endTime = performance.now();
      console.log(`数据生成耗时: ${(endTime - startTime).toFixed(2)}ms`);
      
      return chartData;
    };

    setData(generateData());
  }, []);

  const handleChartInit = () => {
    renderStartTime.current = performance.now();
  };

  const handleChartReady = () => {
    const endTime = performance.now();
    const totalTime = endTime - renderStartTime.current;
    setRenderTime(totalTime);
    console.log(`图表渲染耗时: ${totalTime.toFixed(2)}ms`);
  };

  return (
    <div>
      <h3>性能测试结果</h3>
      <p>渲染耗时: {renderTime.toFixed(2)}ms</p>
      {data && (
        <LineChart
          type="time"
          data={data}
          onChartInit={handleChartInit}
          onChartReady={handleChartReady}
          customOptions={{
            animation: false, // 禁用动画以提高性能
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            }
          }}
        />
      )}
    </div>
  );
};

export default PerformanceTest;
```

### 性能优化建议

1. 数据优化：
   - 使用 `showSymbol: false` 隐藏数据点标记
   - 减少数据精度，只保留必要的小数位
   - 考虑使用数据采样，减少数据点数量

2. 渲染优化：
   - 禁用动画 `animation: false`
   - 使用 `throttle` 或 `debounce` 处理频繁更新
   - 考虑使用 Web Worker 处理数据转换

3. 配置优化：
   - 调整 `grid` 配置，减少边距
   - 使用 `silent: true` 禁用交互事件
   - 减少不必要的样式配置

4. 其他建议：
   - 考虑使用虚拟滚动或分页加载
   - 实现数据缓存机制
   - 使用 `requestAnimationFrame` 优化渲染

## API

### LineChartProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图表类型 | `'category' \| 'time' \| 'value'` | `'category'` |
| data | 图表数据源 | 见下方详细说明 | - |
| unitConfig | 单位配置 | `{ unit?: string; unitRule?: IUnitRule[] }` | - |
| customOptions | 自定义配置项 | `Partial<EChartsOption>` | - |

### data 配置说明

#### Category 类型
```typescript
{
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
}
```

#### Time 类型
```typescript
{
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
}
```

#### Value 类型
```typescript
{
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
}
```

### series 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 系列名称 | `string` | - |
| data | 数据数组 | 根据 type 不同而不同 | - |
| smooth | 是否平滑曲线 | `boolean` | `false` |
| showSymbol | 是否显示数据点标记 | `boolean` | `true` |
| areaStyle | 是否显示面积 | `boolean` | `false` |

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

5. 对于时间轴类型，建议使用 moment 等库处理时间格式化。

6. 对于数值轴类型，可以通过 `min` 和 `max` 设置坐标轴范围，通过 `itemStyle` 自定义数据点样式。 