import { ThemeProvider } from '@ucloud-fe/react-components';

const ColorKey = [
    'T_COLOR_LEGEND_BLUE',
    'T_COLOR_LEGEND_CYAN',
    'T_COLOR_LEGEND_ORANGE',
    'T_COLOR_LEGEND_PURPLE',
    'T_COLOR_LEGEND_GREEN',
    'T_COLOR_LEGEND_LIGHTBLUE',
    'T_COLOR_LEGEND_RED',
    'T_COLOR_LEGEND_YELLOW'
];

const ColorLevel = [6,4,2];

export const getColor = () => {
    // @ts-ignore
    const { useDesignTokens } = ThemeProvider;
    const DT = useDesignTokens();
    let ColorAll: string[] = [];

    ColorLevel.forEach(level => {
        ColorKey.forEach(key => {
            let keyname = key + '_' + level;
            ColorAll.push(DT[keyname]);
        })
    })
    return ColorAll;
}