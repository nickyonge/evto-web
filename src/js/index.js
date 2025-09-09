import './css'; // import css classes 
import { BuildUI } from './uiMain';
import { SetupDataWindow } from './contentData';
import { SetupArtWindow } from './contentArt';
import { DisconnectObserver } from './mutationObserver';

window.addEventListener('load', function () {
    // initial window load 
    BuildUI();
    SetupDataWindow();
    SetupArtWindow();
    // DemoLabel();

    this.setTimeout(() => {
        // one tick after loading
        DisconnectObserver();
    }, 0);
});

function DemoLabel() {
    console.log("Creating demo label");
    var label = document.createElement("Label");
    label.innerHTML = "Hello world! 0123456789";
    document.body.appendChild(label);
}
