/* functiionality related to the Data window */

import { style } from "./lilutils";
import { StringToNumber } from "./lilutils";

export function SetupDataWindow() {
    document.querySelectorAll('input[name="tab"]').forEach(tab => {
        tab.addEventListener('change', () => {
            const selected = document.querySelector('input[name="tab"]:checked');
            let selectedTab = StringToNumber(selected.id);
            console.log(`Now selected: ${selectedTab}`);
        });
    });
}