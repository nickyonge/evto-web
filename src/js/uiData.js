/* UI elements for the Data window - tabs, selection buttons, etc */

import * as ui from "./ui";
import * as txt from './text';

import iconArt from '../assets/svg/icon-art.svg';
import iconFeatures from '../assets/svg/icon-features.svg';
import iconHome from '../assets/svg/icon-home.svg';
import iconSave from '../assets/svg/icon-save.svg';
import iconScale from '../assets/svg/icon-scale.svg';

let iconArray = [iconHome, iconScale, iconFeatures, iconArt, iconSave];

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
        // tab text and icon
        let tabText = ui.CreateDivWithClass('text');
        tabText.innerText = txt.TABS[i];
        // let tabIcon = ui.CreateDivWithClass('icon');
        // let img = ui.CreateImage(iconArray[i]);
        // let tabIcon = ui.CreateDivWithClass('icon');
        let tabIcon = ui.CreateImage(iconArray[i]);
        ui.AddClassToDOMs('icon', tabIcon);
        // tabIcon.appendChild(img);
        tabLabel.appendChild(tabText);
        tabLabel.appendChild(tabIcon);
        // add tab elements to tabs list
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