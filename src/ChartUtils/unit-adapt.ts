import { DEFAULT_UNIT_CONFIG } from './const';
import { get, set, cloneDeep } from 'lodash';

export interface IUnitRule {
    // 换算单位数组集
    units: string[];
    // 换算规则
    conversionFactor: number;
    // 用于进制不同的情况下的换算规则，如[毫秒，秒，分, 小时]， 就是1000，60，conversionRules: [{ from: '毫秒', to: '毫秒', conversionFactor: 1000 }]
    conversionRules?: {
        from: string,
        to: string,
        conversionFactor: number
    }[];
}

// 获取传入单位的，进制计算规则，也就是IUnitRule
export function getUnitRule(originalUnit: string, customUnitRule?: IUnitRule[]) {

    if (!originalUnit) {
        return null
    }

    // 如果用户自己传入了自己的单位进制规则，就用自己的
    const item = (customUnitRule && customUnitRule.length > 0)
        ? customUnitRule.find(unitInfo => unitInfo.units.includes(originalUnit))
        : DEFAULT_UNIT_CONFIG.find(unitInfo => unitInfo.units.includes(originalUnit));

    if (!item) return null
    const i = item.units.indexOf(originalUnit)
    const units = item.units.slice(i)
    if (units.length < 2) return null
    return {
        ...item,
        units,
    }
}
interface ITransUnit {
    // 原始传的数据
    value?: number;
    // 原始传的单位
    unit: string;
    // 目标单位，如果定义，则全部转成此单位的数据，例如: { unit: '秒', targetUnit: '天'， 则全部转成天，无视规则 }
    targetUnit: string | undefined;
    // 用户自定义的单位转换规则
    customUnitRule?: IUnitRule[];
    // 保留精度位数,默认值为3
    precision?: number;
    // 是否展示Y轴的单位
    showYAxisUnit?: boolean;
}

interface IConvertDatas {
    // 原始传的数据
    datas: any[];
    // 原始传的单位
    unit: string;
    // 目标单位，如果定义，则全部转成此单位的数据，例如: { unit: '秒', targetUnit: '天'， 则全部转成天，无视规则 }
    targetUnit: string | undefined;
    // 用户自定义的单位转换规则
    customUnitRule?: IUnitRule[];
    /**
     * 指标单位换算标准，默认值是 5
     * 统计每个指标进行单位向上转换后的值大于 1 的个数，个数大于 standard 则进行转换，如果小于 standard  则不转换。
     */
    standard?: number;
    /**
     * 图表数据保留的小数点个数, 默认保留两位小数
     */
    precision?: number;
    // 数据判断标准, 默认值是 1,大于则进行单位转换
    unitValue?: number;
    // 辅助参数，暂时hardcode
    dataPath?: string;
    valPath?: number;
    fillUndefined?: any;
}

// 给y轴用的
export function getAxisLabel(params: ITransUnit) {

    const {
        unit,
        targetUnit,
        customUnitRule,
        precision = 1,
        showYAxisUnit = true
    } = params;

    // 从传入的原始单位和进制规则，找到单位的进制规则
    const unitRule = getUnitRule(unit, customUnitRule);
    if (
        !unit ||
        !unitRule ||
        targetUnit === unit ||
        (targetUnit && !unitRule.units.includes(targetUnit))
    ) {
        return {
            formatter: function (v: number) {
                const result = `${v} ${showYAxisUnit ? (unit || '') : ''}`;
                return result;
            }
        };
    }

    // @ts-ignore
    const { units = [], conversionFactor = null, conversionRules = [] } = unitRule;

    const unitLen = units.length;

    function trans(value: number) {
        let gap = 0;

        // 当前单位所处的位置[秒，分，时]，originUnit=秒，则位置是0
        const unitIndex = units.indexOf(unit);

        // 当前单位的下一个单位，做进制计算
        const nextUnit = units[unitIndex + 1];

        // 如果位置不存在或者，是最后一个位置，不用转换，直接返回
        if (unitIndex < 0 || unitIndex === unitLen - 1) {
            const formatValue = value.toFixed(precision);
            return `${formatValue} ${showYAxisUnit ? (unit || '') : ''}`
        }

        if (value == 0) {
            return `${value} ${showYAxisUnit ? (targetUnit || unit || '') : ''}`
        }

        // 获取进制，如果是特殊进制，则用{from,to,conversionFactor}里的进制，不然就用常规的进制
        let isSpecialUnit = conversionRules.length > 0;
        let conversionFactorTmp =
            (conversionRules.find((ele: any) => ele.from === unit && ele.to === nextUnit) || {}).conversionFactor || unitRule?.conversionFactor || 1;

        if (targetUnit) {
            // 全部转换成指定单位
            while ((units?.[gap] !== targetUnit) && (gap < units.length - 1)) {
                value = value / conversionFactorTmp;
                gap++;
            }
        } else {
            // 自适应
            while ((value >= conversionFactorTmp) && (gap < units.length - 1)) {
                value = value / conversionFactorTmp;
                gap++;
                // 如果是特殊进制，则需要更新进制
                if (isSpecialUnit) {
                    let tempUnit = units?.[gap];
                    let tempNextUnit = units?.[gap + 1];
                    conversionFactorTmp = (conversionRules.find((ele: any) => ele.from === tempUnit && ele.to === tempNextUnit) || {}).conversionFactor || unitRule?.conversionFactor || 1;
                }
            }
        }

        // 浮点数不显示，避免出现0.1个，0.2个的情况
        const formatValue = Number.isInteger(value) ? value : value.toFixed(precision);
        // const formatValue = ((value < 1) && !Number.isInteger(value)) ? '' : value.toFixed(0);

        return `${formatValue} ${(showYAxisUnit && formatValue) ? (units?.[gap] || unit || '') : ''}`

    }

    return {
        formatter: function (v: number) {
            const result = trans(v);
            return result;
        }
    }

}


// 给tooltip用的
export function transDataByUnit(params: ITransUnit) {

    const {
        value,
        unit,
        targetUnit,
        customUnitRule,
        precision = 2,
        showYAxisUnit = true
    } = params;

    // 从传入的原始单位和进制规则，找到单位的进制规则
    const unitRule = getUnitRule(unit, customUnitRule);

    if (
        !unit ||
        !unitRule ||
        targetUnit === unit ||
        (targetUnit && !unitRule.units.includes(targetUnit))
    ) {
        const formatValue = value?.toFixed(precision);
        const result = `${formatValue} ${unit || ''}`;
        return result;
    }

    // @ts-ignore
    const { units = [], conversionFactor = null, conversionRules = [] } = unitRule;

    const unitLen = units.length;

    function trans(value: number) {
        let gap = 0;

        // 当前单位所处的位置[秒，分，时]，originUnit=秒，则位置是0
        const unitIndex = units.indexOf(unit);

        // 当前单位的下一个单位，做进制计算
        const nextUnit = units[unitIndex + 1];

        // 如果位置不存在或者，是最后一个位置，不用转换，直接返回
        if (unitIndex < 0 || unitIndex === unitLen - 1) {
            const formatValue = value.toFixed(precision);
            return `${formatValue} ${showYAxisUnit ? (unit || '') : ''}`
        }

        if (value == 0) {
            return `${value} ${showYAxisUnit ? (unit || '') : ''}`
        }

        // 获取进制，如果是特殊进制，则用{from,to,conversionFactor}里的进制，不然就用常规的进制
        let isSpecialUnit = conversionRules.length > 0;
        let conversionFactorTmp =
            (conversionRules.find((ele: any) => ele.from === unit && ele.to === nextUnit) || {}).conversionFactor ||
            unitRule?.conversionFactor || 1;


        if (targetUnit) {
            // 全部转换成指定单位
            while ((units?.[gap] !== targetUnit) && (gap < units.length - 1)) {
                value = value / conversionFactorTmp;
                gap++;
            }
        } else {
            // 自适应
            while ((value >= conversionFactorTmp) && (gap < units.length - 1)) {
                value = value / conversionFactorTmp;
                gap++;
                // 如果是特殊进制，则需要更新进制
                if (isSpecialUnit) {
                    let tempUnit = units?.[gap];
                    let tempNextUnit = units?.[gap + 1];
                    conversionFactorTmp = (conversionRules.find((ele: any) => ele.from === tempUnit && ele.to === tempNextUnit) || {}).conversionFactor || unitRule?.conversionFactor || 1;
                }
            }
        }

        const formatValue = value.toFixed(precision);
        return `${formatValue} ${units?.[gap] || unit || ''}`
    }

    // @ts-ignore
    const result = trans(value);
    return result;

}


// 整体处理数据用的, 在获取数据后，统一处理数据，根据单位进制规则，转换数据
// 控制台之前一直是这样处理的
export function convertDatasByUnit(params: IConvertDatas) {
    const {
        datas,
        unit,
        targetUnit,
        customUnitRule,
        standard = 5,
        precision = 2,
        dataPath = 'data',
        valPath = 1,
        unitValue = 1,
        fillUndefined = null
    } = params;

    // 从传入的原始单位和进制规则，找到单位的进制规则
    const unitRule = getUnitRule(unit, customUnitRule);

    // 如果数据不是数组，或者单位不存在，或者目标单位和原始单位一样，或者目标单位不存在，或者目标单位不在规则里，就不转换
    // 返回原始数据
    if (
        !Array.isArray(datas) ||
        !unit ||
        !unitRule ||
        targetUnit === unit ||
        (targetUnit && !unitRule.units.includes(targetUnit))
    ) {
        return { data: datas, unit };
    }

    const { units = [], conversionRules = [] } = unitRule;
    const unitLen = units.length;

    // @ts-ignore
    const setValue = (target, propPath, v) => (typeof target === 'object' ? set(target, propPath, v) : v);
    // @ts-ignore
    const getValue = (target, propPath) => (typeof target === 'object' ? get(target, propPath) : target);

    function trans(datas: any[], originUnit: string): { data: any[], unit: string } {
        // 如果原始单位和目标单位一样，就不转换, 返回原始数据
        if (originUnit === targetUnit) {
            return { data: datas, unit: originUnit };
        }
        // 深拷贝原始数据
        const originDatas = cloneDeep(datas);
        let count: any[] = [];
        // 获取目标单位，在单位数组里的位置
        const unitIndex = units.indexOf(originUnit);
        // 如果位置不存在或者，是最后一个位置，不用转换，直接返回
        if (unitIndex < 0 || unitIndex === unitLen - 1) {
            return { data: datas, unit: originUnit };
        }
        // 获取当前单位的下一个单位，做进制计算
        const nextUnit = units[unitIndex + 1];

        // 获取进制，如果是特殊进制，则用{from,to,conversionFactor}里的进制，不然就用常规的进制
        const isSpecialUnit = conversionRules.length > 0;

        // 获取当前单位的换算规则
        const conversionFactorTmp =
            (conversionRules.find(ele => ele.from === originUnit && ele.to === nextUnit) || {}).conversionFactor ||
            unitRule?.conversionFactor;

        // 遍历数据，转换数据
        const outputs = datas.map((dataItem, i) => {
            if (!count[i]) count[i] = 0;
            let data = dataPath ? getValue(dataItem, dataPath) : dataItem;
            if (!data) return dataItem;
            data = data.map((item: any) => {
                // 获取原始数据的数值
                const value = getValue(item, valPath);
                // 如果数值不存在，就填充fillUndefined
                if (value === void 0) {
                    return setValue(item, valPath, fillUndefined);
                }
                // 如果数值为0，就不转换
                if (!value) {
                    return item;
                }
                // 进行单位转换，数值除以换算规则
                // @ts-ignore
                const nextValue = value / conversionFactorTmp;
                if (nextValue >= unitValue) {
                    count[i]++;
                }
                return setValue(item, valPath, nextValue);
            });
            return dataPath ? setValue(dataItem, dataPath, data) : data;
        });

        // 如果目标单位存在，或者count里的值有大于standard的，就转换
        if (targetUnit || count.some(ele => ele >= standard)) {
            return trans(outputs, nextUnit);
        }

        return { data: originDatas, unit: originUnit };
    }

    const result = trans(datas, unit);

    //当单位变化后，对最终数据精度保留换算
    result.data =
    // 如果单位和目标单位一样，就不转换
        result.unit === unit
            ? result.data
            // 如果单位和目标单位不一样，就转换
            : result.data.map(dataItem => {
                const v =
                // 如果dataPath存在，就转换dataPath里的数据
                    (dataPath ? getValue(dataItem, dataPath) : dataItem)?.map((item: any) => {
                        const value = getValue(item, valPath);
                        // 对数据进行精度保留
                        const precisionValue = value ? Number(value?.toFixed(precision)) : value;
                        // 设置精度保留后的数据
                        return setValue(item, valPath, precisionValue);
                    }) || dataItem;
                return dataPath ? setValue(dataItem, dataPath, v) : v;
            });
    return result;
}