/* functiionality related to the Data window */

import * as txt from './text';
import { style } from "./lilutils";
import { StringToNumber } from "./lilutils";

const initialTab = 0;
export const tabColors = ['red', 'orange', 'blue', 'green', 'purple'];

export function SetupDataWindow() {
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
    console.log(`Now selected: ${tabNum}, snap: ${snap}`);
    for (let i = 0; i < txt.TABS_NUM; i++) {
        let tab = 'tab' + i;
        let tabInput = document.querySelector(`input[id=${tab}]`);
        console.log(tabInput);
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