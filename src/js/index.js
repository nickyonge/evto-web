import './css'; // import css classes 
import { BuildUI, DisplayUI } from './uiMain';
import { SetupDataWindow } from './contentData';
import { SetupArtWindow } from './contentArt';
import { DisconnectObserver, StartObservation } from './mutationObserver';
import Coloris from "@melloware/coloris";
import { BasicComponent } from './components/base';
import { _env_currentEnv, GetParentWithClass } from './lilutils';
import { testExport } from './assetExporter';

import { GenerateCSS as ComponentsCSS } from './components';

import './doc'; // should be called after all other imports 

let _onLoadCompleteCallbacks = [];

window.addEventListener('load', function () {
    // initial window load
    GenerateCSS();
    StartObservation();
    BuildUI();
    SetupDataWindow();
    SetupArtWindow();

    testExport();

    // load complete 

    // post-load timeout 
    this.setTimeout(() => {
        // one tick after loading
        // on load complete callbacks 
        for (let i = 0; i < _onLoadCompleteCallbacks.length; i++) {
            _onLoadCompleteCallbacks[i]();
        }
        _onLoadCompleteCallbacks = [];
        // disconnect mutation observer
        DisconnectObserver();
        // init coloris
        Coloris.init();
        Coloris({
            margin: 6.9,
            themeMode: 'polaroid',
            alpha: false,
            defaultColor: '#beeeef',
            selectInput: true,
            formatToggle: true,
        });
        // assign parent page to all components, and call DocumentLoaded on them 
        let unparentedComponents = [];
        BasicComponent.allComponents.forEach(component => {
            component.hasBeenLoaded = true;
            let parentPage = GetParentWithClass(component.div, 'page');
            if (parentPage == null) {
                component.hasBeenAddedToPage = true;
                unparentedComponents.push(component);
                return;
            }
            component.parentPage = parentPage;
            if (component.DocumentLoaded) {
                component.DocumentLoaded();
            }
        });
        if (unparentedComponents.length > 0) {
            let warning = `${unparentedComponents.length} component${unparentedComponents.length > 1 ? 's' : ''}`;
            console.warn(`WARNING: found ${warning} without parent pages, investigate`, unparentedComponents);
        }

        // display ui
        DisplayUI();
        
    }, 0);
});

/** Generate dynamic CSS across all scripts that call for it */
function GenerateCSS() {
    ComponentsCSS();
}

/**
 * Specify a function to be called once the page is loaded and one tick has passed 
 * @param {function} callback Function/method to call when page load is complete 
 * @returns 
 */
export function CallOnLoadComplete(callback) {
    if (!callback) { return; }
    _onLoadCompleteCallbacks.push(callback);
}
