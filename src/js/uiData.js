/* UI elements for the Data window - tabs, selection buttons, etc */

import * as ui from "./ui";
import * as txt from './text';


/**
 * Create the data window (tabs, options, info)
 * @param {Element} dataWindow 
 */
export function CreateDataWindow(dataWindow) {
    CreateTabs(dataWindow);
}

function CreateTabs(dataWindow) {
    let tabs = ui.CreateDivWithClass('tabs');
    for (let i = 0; i < txt.TABS_NUM; i++) {
        // create individual tabs, based off TABS array in text.js
        let tabInput = ui.CreateElement('input'); // input element
        ui.AddElementAttributes(tabInput,
            ['type', 'id', 'name'],
            ['radio', 'tab' + (i + 1), 'tab']);
        let tabLabel = ui.CreateElement('label'); // label element
        ui.AddElementAttribute(tabLabel, 'for', 'tab' + (i + 1));
        tabLabel.innerText = txt.TABS[i];
        // add elements
        tabs.appendChild(tabInput);
        tabs.appendChild(tabLabel);
    }
    // tabs marker
    let marker = ui.CreateDivWithClass('tabMarker');
    marker.appendChild(ui.CreateDivWithID('tmTop'));
    marker.appendChild(ui.CreateDivWithID('tmBottom'));
    tabs.appendChild(marker);
    // add to window
    dataWindow.appendChild(tabs);
}