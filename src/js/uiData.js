/* UI elements for the Data window - tabs, selection buttons, etc */

import * as ui from "./ui";
import * as txt from './text';

// import iconArt from '../assets/svg/icons-currentColor/icon-art.svg';
// import iconFeatures from '../assets/svg/icons-currentColor/icon-features.svg';
// import iconHome from '../assets/svg/icons-currentColor/icon-home.svg';
// import iconSave from '../assets/svg/icons-currentColor/icon-save.svg';
// import iconScale from '../assets/svg/icons-currentColor/icon-scale.svg';

// import iconArt from '../assets/svg/icons-white/icon-art.svg';
// import iconFeatures from '../assets/svg/icons-white/icon-features.svg';
// import iconHome from '../assets/svg/icons-white/icon-home.svg';
// import iconSave from '../assets/svg/icons-white/icon-save.svg';
// import iconScale from '../assets/svg/icons-white/icon-scale.svg';

import iconArt from '../assets/svg/icons-red/icon-art.svg';
import iconFeatures from '../assets/svg/icons-red/icon-features.svg';
import iconHome from '../assets/svg/icons-red/icon-home.svg';
import iconSave from '../assets/svg/icons-red/icon-save.svg';
import iconScale from '../assets/svg/icons-red/icon-scale.svg';

let iconArray = [iconHome, iconScale, iconFeatures, iconArt, iconSave];
let iconColors = ['red', 'orange', 'blue', 'green', 'purple'];

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
        let tab = 'tab' + i;
        let tabInput = ui.CreateElement('input'); // input element
        ui.AddElementAttributes(tabInput,
            ['type', 'id', 'name'],
            ['radio', tab, 'tab']);
        // create label 
        let tabLabel = ui.CreateElement('label'); // label element
        if (i != txt.TABS_NUM - 1) {
            ui.AddClassToDOMs('separator', tabLabel);
        }
        ui.AddElementAttribute(tabLabel, 'for', tab);
        // tab text and icon
        let tabText = ui.CreateDivWithClass('text');
        tabText.innerText = txt.TABS[i];
        // let tabIcon = ui.CreateDivWithClass('icon');
        // let img = ui.CreateImage(iconArray[i]);
        // let tabIcon = ui.CreateDivWithClass('icon');
        let tabIcon = ui.CreateImage(iconArray[i]);
        // ui.AddClassToDOMs('icon', tabIcon);
        ui.AddClassesToDOM(tabIcon, 'icon', iconColors[i]);
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