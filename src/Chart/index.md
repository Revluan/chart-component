---
title: Chart基础图表组件
order: 1
nav:
  title: 图表组件
  path: /components
---

# Chart 基础图表组件

基于 ECharts 封装的 React 图表组件，提供了简单的配置接口和完整的类型支持。

## 代码演示

### 基础折线图

```tsx
import React from 'react';
import { Chart } from '@ucloud/cmp-chart-components';

export default () => {
  const options = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
        show: true
    },
    series: [{
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      smooth: true
    }]
  };

  return <Chart options={options} height={400} />;
};
```

### 使用 ref 获取图表实例

```tsx
import React, { useRef } from 'react';
import { Chart } from '@ucloud/cmp-chart-components';
import type { ChartRef } from '@ucloud/cmp-chart-components';

export default () => {
  const chartRef = useRef<ChartRef>(null);

  const handleClick = () => {
    const instance = chartRef.current?.getInstance();
    console.log('instance:', instance);
    if (instance) {
      // 修改第三个数据点的颜色为红色
      instance.setOption({
        series: [{
          data: [
            { value: 150 },
            { value: 230 },
            { value: 224, itemStyle: { color: 'red' } },
            { value: 218 },
            { value: 135 },
            { value: 147 },
            { value: 260 }
          ]
        }]
      });
    }
  };

  const options = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
        show: true
    },
    series: [{
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      smooth: true
    }]
  };

  return (
    <div>
      <button onClick={handleClick}>将第三个数据点改为红色,查看控制台输出echarts的实例</button>
      <Chart ref={chartRef} options={options} height={400} />
    </div>
  );
};
```

### 柱状图

```tsx
import React from 'react';
import { Chart } from '@ucloud/cmp-chart-components';

export default () => {
  const options = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
        show: true
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }]
  };

  return <Chart options={options} height={400} />;
};
```

### 饼图

```tsx
import React from 'react';
import { Chart } from '@ucloud/cmp-chart-components';

export default () => {
  const options = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return <Chart options={options} height={400} />;
};
```

### 自定义样式

```tsx
import React from 'react';
import { Chart } from '@ucloud/cmp-chart-components';

export default () => {
  const options = {
    // ... 图表配置
  };

  return (
    <Chart 
      options={options}
      height={400}
      className="custom-chart"
      style={{ 
        border: '1px solid #eee',
        borderRadius: '4px',
        padding: '20px'
      }}
    />
  );
};
```

### 错误处理

```tsx
import React from 'react';
import { Chart } from '@ucloud/cmp-chart-components';

export default () => {
  const options = {
    // ... 图表配置
  };

  const handleError = (error: Error) => {
    console.error('图表加载出错:', error);
    // 可以在这里添加错误上报逻辑
  };

  return (
    <Chart 
      options={options}
      height={400}
      onError={handleError}
    />
  );
};
```

## API

### Chart

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | ECharts 配置项 | `EChartsOption` | - |
| height | 图表高度 | `number \| string` | 400 |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |
| onError | 错误回调函数 | `(error: Error) => void` | - |

### ChartRef

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getInstance | 获取 ECharts 实例 | `() => ECharts \| null` |

## 注意事项

1. 组件会自动适应容器宽度，不需要设置 width 属性
2. 图表实例会在组件卸载时自动销毁
3. 当 options 发生变化时，图表会自动更新
4. 组件内置了错误边界处理，可以捕获渲染过程中的错误
5. 支持响应式布局，会自动监听窗口大小变化并调整图表大小 