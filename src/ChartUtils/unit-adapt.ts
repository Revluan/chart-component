import { DEFAULT_UNIT_CONFIG } from './const';

/**
 * 单位转换规则接口
 * @interface IUnitRule
 * @property {string[]} units - 单位数组，按从小到大排序，如 ['B', 'KB', 'MB', 'GB']
 * @property {number} conversionFactor - 默认的转换因子，如 1024
 * @property {Array<{from: string, to: string, conversionFactor: number}>} conversionRules - 特殊转换规则，用于处理不同单位间的转换
 */
export interface IUnitRule {
    units: string[];
    conversionFactor: number;
    conversionRules?: Array<{
        from: string;
        to: string;
        conversionFactor: number;
    }>;
}

/**
 * 单位转换参数接口
 * @interface ITransUnit
 * @property {number} [value] - 需要转换的数值
 * @property {string} unit - 原始单位
 * @property {string} [targetUnit] - 目标单位，如果指定则强制转换到该单位
 * @property {IUnitRule[]} [customUnitRule] - 自定义单位转换规则
 * @property {number} [precision] - 数值精度，默认2位小数
 * @property {boolean} [showYAxisUnit] - 是否显示单位，默认true
 */
export interface ITransUnit {
    value?: number;
    unit: string;
    targetUnit?: string;
    customUnitRule?: IUnitRule[];
    precision?: number;
    showYAxisUnit?: boolean;
}

/**
 * 批量数据转换参数接口
 * @interface IConvertDatas
 * @property {Array<number | { value: number }>} datas - 需要转换的数据数组
 * @property {string} unit - 原始单位
 * @property {string} [targetUnit] - 目标单位
 * @property {IUnitRule[]} [customUnitRule] - 自定义单位转换规则
 * @property {number} [standard] - 单位转换标准阈值
 * @property {number} [precision] - 数值精度
 * @property {number} [unitValue] - 单位转换值阈值
 * @property {string} [dataPath] - 数据路径
 * @property {number} [valPath] - 值路径
 * @property {any} [fillUndefined] - 填充未定义值的默认值
 */
export interface IConvertDatas {
    datas: Array<number | { value: number }>;
    unit: string;
    targetUnit?: string;
    customUnitRule?: IUnitRule[];
    standard?: number;
    precision?: number;
    unitValue?: number;
    dataPath?: string;
    valPath?: number;
    fillUndefined?: any;
}

/**
 * 获取单位转换因子
 * @param {string} unit - 当前单位
 * @param {string} nextUnit - 下一个单位
 * @param {IUnitRule['conversionRules']} conversionRules - 转换规则
 * @param {number} defaultFactor - 默认转换因子
 * @returns {number} 转换因子
 */
const getConversionFactor = (
    unit: string,
    nextUnit: string,
    conversionRules: IUnitRule['conversionRules'],
    defaultFactor: number
): number => {
    if (!conversionRules?.length) return defaultFactor;
    const rule = conversionRules.find(r => r.from === unit && r.to === nextUnit);
    return rule?.conversionFactor || defaultFactor;
};

/**
 * 格式化数值
 * @param {number} value - 需要格式化的数值
 * @param {number} precision - 精度
 * @returns {string} 格式化后的字符串
 */
const formatValue = (value: number, precision: number): string => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(precision);
};

/**
 * 单位转换器类
 * 处理单位转换的核心逻辑
 */
class UnitConverter {
    private unitRule: IUnitRule | null;
    private unit: string;
    private targetUnit?: string;
    private precision: number;
    private showYAxisUnit: boolean;

    /**
     * 构造函数
     * @param {ITransUnit} params - 转换参数
     */
    constructor(params: ITransUnit) {
        this.unitRule = this.getUnitRule(params.unit, params.customUnitRule);
        this.unit = params.unit;
        this.targetUnit = params.targetUnit;
        this.precision = params.precision ?? 2;
        this.showYAxisUnit = params.showYAxisUnit ?? true;
    }

    /**
     * 获取单位转换规则
     * 处理流程：
     * 1. 检查原始单位是否存在
     * 2. 从自定义规则或默认规则中查找匹配的规则
     * 3. 截取从当前单位开始的单位数组
     * 4. 返回处理后的规则
     */
    private getUnitRule(originalUnit: string, customUnitRule?: IUnitRule[]): IUnitRule | null {
        if (!originalUnit) return null;

        const item = (customUnitRule?.length)
            ? customUnitRule.find(unitInfo => unitInfo.units.includes(originalUnit))
            : DEFAULT_UNIT_CONFIG.find(unitInfo => unitInfo.units.includes(originalUnit));

        if (!item) return null;

        const i = item.units.indexOf(originalUnit);
        const units = item.units.slice(i);
        if (units.length < 2) return null;

        return { ...item, units };
    }

    /**
     * 判断是否需要转换单位
     * 处理流程：
     * 1. 检查原始单位和规则是否存在
     * 2. 检查目标单位是否与原始单位不同
     * 3. 如果指定了目标单位，检查是否在规则范围内
     */
    private shouldConvert(): boolean {
        return Boolean(
            this.unit &&
            this.unitRule &&
            this.targetUnit !== this.unit &&
            (!this.targetUnit || this.unitRule.units.includes(this.targetUnit))
        );
    }

    /**
     * 转换数值和单位
     * 处理流程：
     * 1. 检查是否需要转换
     * 2. 如果指定了目标单位，直接转换到目标单位
     * 3. 否则进行自适应转换：
     *    - 当数值大于转换因子时，转换到更大的单位
     *    - 直到数值小于转换因子或达到最大单位
     * 4. 返回转换后的值和单位
     */
    private convertValue(value: number): { value: number; unit: string } {
        if (!this.shouldConvert() || value === 0) {
            return {
                value,
                unit: this.unit
            };
        }

        const { units, conversionFactor, conversionRules } = this.unitRule!;
        const unitIndex = units.indexOf(this.unit);
        let currentValue = value;
        let currentUnit = this.unit;
        let gap = 0;

        if (this.targetUnit) {
            // 转换到指定单位
            while (units[gap] !== this.targetUnit && gap < units.length - 1) {
                const nextUnit = units[gap + 1];
                const factor = getConversionFactor(currentUnit, nextUnit, conversionRules, conversionFactor);
                currentValue /= factor;
                currentUnit = nextUnit;
                gap++;
            }
        } else {
            // 自适应转换
            while (gap < units.length - 1) {
                const nextUnit = units[gap + 1];
                const factor = getConversionFactor(currentUnit, nextUnit, conversionRules, conversionFactor);
                if (currentValue < factor) break;
                currentValue /= factor;
                currentUnit = nextUnit;
                gap++;
            }
        }

        return {
            value: currentValue,
            unit: currentUnit
        };
    }

    /**
     * 格式化输出值
     * 处理流程：
     * 1. 转换数值和单位
     * 2. 格式化数值（整数不显示小数位）
     * 3. 根据配置决定是否显示单位
     */
    formatValue(value: number): string {
        const { value: convertedValue, unit } = this.convertValue(value);
        const formattedValue = formatValue(convertedValue, this.precision);
        return `${formattedValue}${this.showYAxisUnit ? ` ${unit}` : ''}`;
    }
}

/**
 * 获取坐标轴标签格式化函数
 * 处理流程：
 * 1. 创建单位转换器实例
 * 2. 返回格式化函数，用于处理坐标轴标签
 */
export function getAxisLabel(params: ITransUnit) {
    const converter = new UnitConverter(params);
    return {
        formatter: (value: number) => converter.formatValue(value)
    };
}

/**
 * 转换单个数值的单位
 * 处理流程：
 * 1. 检查输入值是否存在
 * 2. 创建单位转换器实例
 * 3. 格式化输出值
 */
export function transDataByUnit(params: ITransUnit): string {
    if (!params.value) return '';
    const converter = new UnitConverter(params);
    return converter.formatValue(params.value);
}

/**
 * 批量转换数据单位
 * 处理流程：
 * 1. 创建单位转换器实例
 * 2. 转换所有数据，记录每个数据转换后的单位
 * 3. 统计各单位的出现次数
 * 4. 选择出现次数最多的单位作为最终单位
 * 5. 将所有数据转换到最终单位
 * 6. 返回转换后的数据和单位
 */
export function convertDatasByUnit(params: IConvertDatas): { data: any[]; unit: string } {
    const converter = new UnitConverter({
        unit: params.unit,
        targetUnit: params.targetUnit,
        customUnitRule: params.customUnitRule,
        precision: params.precision
    });

    const convertedData = params.datas.map(item => {
        const value = typeof item === 'number' ? item : item.value;
        const { value: convertedValue, unit } = converter['convertValue'](value);
        return {
            value: convertedValue,
            unit
        };
    });

    // 统计转换后的单位
    const unitCounts = convertedData.reduce((acc, { unit }) => {
        acc[unit] = (acc[unit] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 选择出现次数最多的单位
    const mostCommonUnit = Object.entries(unitCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || params.unit;

    // 如果指定了目标单位，使用目标单位
    const finalUnit = params.targetUnit || mostCommonUnit;

    // 转换所有数据到最终单位
    return {
        data: convertedData.map(({ value, unit }) => {
            if (unit === finalUnit) return value;
            const factor = getConversionFactor(
                unit,
                finalUnit,
                converter['unitRule']?.conversionRules,
                converter['unitRule']?.conversionFactor || 1
            );
            return value * factor;
        }),
        unit: finalUnit
    };
}