import './css'; // import css classes 
import { BuildUI } from './uiMain';
import { SetupDataWindow } from './contentData';
import { SetupArtWindow } from './contentArt';
import { DisconnectObserver, StartObservation } from './mutationObserver';
import Coloris from "@melloware/coloris";
import { BasicComponent } from './components/base';

let _onLoadCompleteCallbacks = [];

window.addEventListener('load', function () {
    // initial window load
    StartObservation();
    BuildUI();
    SetupDataWindow();
    SetupArtWindow();

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
            margin: 3,
            themeMode: 'polaroid',
            alpha: false,
            defaultColor: '#beeeef',
            selectInput: true,
            formatToggle: true,
        });
        // call DocumentLoaded on all components
        BasicComponent.allComponents.forEach(component => {
            if (component.DocumentLoaded) {
                component.DocumentLoaded();
            }
        });
        
    }, 0);
});

export function CallOnLoadComplete(callback) {
    if (!callback) { return; }
    _onLoadCompleteCallbacks.push(callback);
}
