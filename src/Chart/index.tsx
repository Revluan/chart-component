import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption, ECharts } from 'echarts';
import { ErrorBoundary } from 'react-error-boundary';
import { debounce } from 'lodash';

export interface ChartProps {
  /** 图表配置 */
  options: EChartsOption;
  /** 图表高度 */
  height?: number | string;
  /** 图表渲染器 */
  renderer?: 'canvas' | 'svg';
  /** 图表类名 */
  className?: string;
  /** 图表样式 */
  style?: React.CSSProperties;
  /** 错误处理 */
  onError?: (error: Error) => void;
  /** 事件绑定：{ click: handler, legendselectchanged: handler, ... } */
  onEvents?: Record<string, (params?: any) => void>;
}

export interface ChartRef {
  getInstance: () => ECharts | null;
}

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div role="alert" style={{ padding: '20px', color: 'red' }}>
    <p>图表加载出错:</p>
    <pre>{error.message}</pre>
  </div>
);

const Chart = forwardRef<ChartRef, ChartProps>(({
  options,
  height = 400,
  renderer = 'canvas',
  className,
  style,
  onError,
  onEvents
}, ref) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ECharts | null>(null);

  useImperativeHandle(ref, () => ({
    getInstance: () => instanceRef.current
  }), []);

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    try {
      // 初始化图表
      const instance = echarts.init(chartRef.current, null, { renderer });
      instanceRef.current = instance;
      
      // 设置图表配置
      instance.setOption(options);

    if (onEvents) {
        Object.entries(onEvents).forEach(([event, handler]) =>
          instance.on(event, handler)
        );
      }

      // ResizeObserver + 防抖
      const resize = debounce(() => instance.resize(), 200);
      const ro = new ResizeObserver(resize);
      ro.observe(chartRef.current);

      return () => {
        ro.disconnect();
        instance.dispose();
        instanceRef.current = null;
      };
    } catch (error) {
      onError?.(error as Error);
    }
  }, []); // 仅初始化一次

  // 响应 options 变化
  useEffect(() => {
    const instance = instanceRef.current;
    if (instance) {
      try {
         // 防抖更新
        debounce((opt: EChartsOption) => {
          instance.setOption(opt, false);
        }, 100)(options);
      } catch (error) {
        onError?.(error as Error);
      }
    }
  }, [options]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={onError}
    >
      <div
        ref={chartRef}
        className={className}
        style={{
          width: '100%',
          height,
          ...style,
        }}
      />
    </ErrorBoundary>
  );
});

Chart.displayName = 'Chart';

export default Chart;
