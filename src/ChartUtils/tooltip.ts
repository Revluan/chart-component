import moment from 'moment';
import type { EChartsOption } from "echarts";
import { IUnitRule, transDataByUnit } from './unit-adapt';
import { ThemeProvider } from '@ucloud-fe/react-components';

interface ITooltipConfig {
    formatterTitle?: (params: any) => string;
    formatterName?: (params: any) => string;
    formatterValue?: (params: any) => string;
}

type ITooltip = {
    unit?: string;
    unitRule?: IUnitRule[];
    tooltipConfig?: ITooltipConfig;
    type?: string;
    shouldSliceTooltipName?: boolean;
}

/**
 * 基础的toolTip
*/
export default function getBaseToolTip(props: ITooltip): EChartsOption['tooltip'] {
    // @ts-ignore
    const { useDesignTokens } = ThemeProvider;
    const DT = useDesignTokens();

    const {
        unit,
        unitRule,
        tooltipConfig,
        type,
        shouldSliceTooltipName = true
    } = props;
    
    return {
        trigger: "axis",
        appendToBody: false,
        enterable: true,
        backgroundColor: DT?.T_COLOR_BG_DEFAULT_BRIGHT,
        borderColor: DT?.T_COLOR_BG_DEFAULT_BRIGHT,
        confine: false, //限制tooltip在图表范围内展示
        className: 'textCss',
        extraCssText: `max-height:80%;overflow:scroll;scrollbar-color:DarkGray Gray;scrollbar-width: thin;`,//最大高度以及超出处理
        formatter: (params: any) => {
            // 一般来说，params是一个数组，折线图，柱状图的params是数组,图的params是对象
            // 所以这边需要特殊处理，如果是对象，就转换成数组
            if (!Array.isArray(params)) {
                params = [params];
            }
            if (!params.length) {
                return '';
            }
            let result = '';
            let tooltipTitle = '';
            const { axisValue } = params[0];
            params.forEach((item: any) => {
                const { data, seriesName, marker } = item;

                // 提取marker的background-color
                let startIndex = marker.indexOf('="');
                let endIndex = marker.indexOf(';"');


                let markerStyle = marker.substring(startIndex + 2, endIndex);
                let markerColor = markerStyle.split(";").find((x: any) => x.includes("background-color"))?.split(":")[1];

                let value = Array.isArray(data) ? data[1] : type == 'pie' ? data.value : data;
                let valueUnit = unit ? transDataByUnit({ value: value, unit: unit || '' , targetUnit: undefined, customUnitRule: unitRule }) : value;
                let formattedSeriesName = tooltipConfig && tooltipConfig.formatterName ? tooltipConfig.formatterName(item) : type == 'pie' ? data.name : seriesName;

                if (!formattedSeriesName) return '';
                if (shouldSliceTooltipName && formattedSeriesName.length > 15) {
                    formattedSeriesName = formattedSeriesName.slice(0, 15) + '...';
                }
                
                let formattedValue = tooltipConfig && tooltipConfig.formatterValue ? tooltipConfig.formatterValue(item) : undefined;
                tooltipTitle = axisValue || seriesName;
                if (tooltipConfig && tooltipConfig.formatterTitle) {
                    tooltipTitle = tooltipConfig.formatterTitle(item);
                } else {
                    if (typeof axisValue === "number") {
                        tooltipTitle = moment(axisValue).format('YYYY-MM-DD HH:mm:ss');
                    }
                }
                
                result += `
                            <div style="display: flex; justify-content: space-between; word-break: break-all; margin-top: 10px;">
                                <div style="display: flex; white-space: initial;">
                                    <div style="margin-right: 8px;">
                                        <span style="background-color: ${markerColor}; width: 8px; height: 8px; display: inline-block";></span>
                                    </div>
                                    <div style="width: auto; margin-right: 16px; color: ${DT?.T_COLOR_TEXT_DEFAULT_LIGHT};">
                                        ${formattedSeriesName}
                                    </div>
                                </div>
                                <div style="word-break: normal; font-weight: 500; color: ${DT?.T_COLOR_TEXT_DEFAULT_LIGHT};">
                                    ${formattedValue || valueUnit}
                                </div>
                            </div>
                        `;
            });
            return `
                        <div class="textCss" style="font-size: 12px; width: auto;">
                            <div style="height: 18px; font-size: 14px; font-weight: 500; line-height: 14px; line-height: 18px; color: ${DT?.T_COLOR_TEXT_DEFAULT_LIGHT};">
                                ${tooltipTitle}
                            </div>
                            <div style="overflow-y:auto;max-height:100vh;">
                                ${result}
                            </div>
                        </div>
                    `;
        }
    }

}
