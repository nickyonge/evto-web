/* functiionality related to the Data window */

import * as txt from './text';
import { style, StringToNumber } from "./lilutils";
import { dataWindow } from './uiMain';

const initialTab = 0;
export const tabColors = ['red', 'orange', 'blue', 'green', 'purple'];

let bgColorMain;

export function SetupDataWindow() {
    // prep vars 
    bgColorMain = style.value.getPropertyValue('--ui-data-window-bg-color');
    // select initial tab
    SelectTab(initialTab, true);
    // create events for changing tabs
    document.querySelectorAll('input[name="tab"]').forEach(tab => {
        tab.addEventListener('change', () => {
            const selected = document.querySelector('input[name="tab"]:checked');
            SelectTab(StringToNumber(selected.id));
        });
    });
}

export function SelectTab(tabNum, snap = false) {
    for (let i = 0; i < txt.TABS_NUM; i++) {
        let currentTab = i == tabNum;
        let tabId = 'tab' + i;
        let tabInput = document.querySelector(`input[id=${tabId}]`);

        if (currentTab) {
            let tabColor = tabColors[i];
            let cssColor = GetBGColor(tabColor);
            console.log(`Tab ID: ${tabId}, tabColor: ${tabColor}, cssColor: ${cssColor}`);
            let bgGradient = `linear-gradient(to right, ${cssColor} -100%, ${bgColorMain} 127%)`;
            dataWindow.style.setProperty('background', bgGradient);
        }

        if (snap) {
            // snap to initial state
            if (i == tabNum) {
                tabInput.checked = true;
            } else {
                tabInput.checked = false;
            }
        }
    }
}

function GetBGColor(color) {
    let cssVar = '--color-data-bg-blend-' + color;
    let cssColor = style.value.getPropertyValue(cssVar);
    if (!cssColor) {
        throw new Error(`ERROR: couldn't get CSS variable for BG color: ${color}, parsed to CSS var ${cssVar}`);
    }
    return cssColor;
}