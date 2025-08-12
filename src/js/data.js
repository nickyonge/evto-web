/* functiionality related to the Data window */

import * as txt from './text';
import { StringToNumber } from "./lilutils";
import { dataWindow } from './uiMain';
import { initialTab, SelectTab } from './uiData';

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