import './css'; // import css classes 
import { BuildUI } from './uiMain';
import { SetupDataWindow } from './contentData';
import { SetupArtWindow } from './contentArt';
import { DisconnectObserver, StartObservation } from './mutationObserver';

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
    }, 0);
});

export function CallOnLoadComplete(callback) {
    if (!callback) { return; }
    _onLoadCompleteCallbacks.push(callback);
}
