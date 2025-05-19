---
title: 图表的color
order: 8
nav:
  title: 图表组件
  path: /components
---

```tsx

import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider, Combine, Tooltip, Card } from "@ucloud-fe/react-components";

const { useDesignTokens } = ThemeProvider;

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

const Deatil: React.FC = () => {

    const DT = useDesignTokens();
    let ColorAll = [];

    ColorLevel.forEach(level => {
        ColorKey.forEach(key => {
            let keyname = key + '_' + level;
            ColorAll.push(keyname);
        })
    })

    return (
        <div style={{ height: 300 }}>
                {
                    ColorLevel.map(level => {
                        return (
                            <div style={{ marginTop: 30 }}>
                                 <Combine>
                                    {
                                        ColorKey.map(key => {
                                            let colorKey = key + '_' + level;
                                            return (
                                                 <Tooltip popup={colorKey} arrow={false}>
                                                    <div style={{ width: 50, height: 50, background: DT[colorKey] }}></div>
                                                 </Tooltip>
                                            )
                                        })
                                    }
                                </Combine>
                            </div>
                        )
                    })
                }
        </div>
    )
}

export default Deatil;

```