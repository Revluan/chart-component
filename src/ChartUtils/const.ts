/**
 * 保留精度位数,默认值为2
*/
export const DEFAULT_DECIMAL_COUNT = 2;

/**
 * 内置的一些单位转换
*/
export const DEFAULT_UNIT_CONFIG = [
  {
    units: ['μs', 'ms', 's', 'min', 'h'],
    /**
     * 换算因数,当前单位换算到下一个单位的换算因子
     */
    conversionFactor: 1000,
    /**
     * 换算规则，默认使用conversionFactor换算
     */
    conversionRules: [
      {
        from: 's',
        to: 'min',
        conversionFactor: 60
      },
      {
        from: 'min',
        to: 'h',
        conversionFactor: 60
      }
    ]
  },
  {
      units: ["s", "m", "h", "d", "y"],
      /**
       * 换算因数,当前单位换算到下一个单位的换算因子
       */
      conversionFactor: 60,
  },
  {
      units: ["个", "万个", "亿个", "兆个", "京个"],
      conversionFactor: 10000,
  },
  {
      units: ["个/s", "万个/s", "亿个/s", "兆个/s", "京个/s"],
      conversionFactor: 10000,
  },
  {
      units: ["次/s", "万次/s", "亿次/s", "兆次/s", "京次/s"],
      conversionFactor: 10000,
  },
  {
      units: ["B/s", "KB/s", "MB/s", "GB/s", "TB/s", "PB/s", "EB/s", "ZB/s", "YB/s"],
      conversionFactor: 1024,
  },
  {
      units: ["b/s", "Kb/s", "Mb/s", "Gb/s", "Tb/s", "Pb/s", "Eb/s", "Zb/s", "Yb/s"],
      conversionFactor: 1024,
  },
  {
      units: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      conversionFactor: 1024,
  },
  {
      units: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
      conversionFactor: 1024,
  },
  {
      units: ["Bps", "KBps", "MBps", "GBps", "TBps", "PBps", "EBps", "ZBps", "YBps"],
      conversionFactor: 1024,
  },
  {
      units: ["bps", "Kbps", "Mbps", "Gbps", "Tbps", "Pbps", "Ebps", "Zbps", "Ybps"],
      conversionFactor: 1024,
  },
  {
      units: ["Byte", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      conversionFactor: 1024,
  },
]
