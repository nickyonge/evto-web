import './css'; // import css classes 
import { BuildUI } from './uiMain';
import { SetupDataWindow } from './contentData';
import { SetupArtWindow } from './contentArt';

window.addEventListener('load', function () {
    BuildUI();
    SetupDataWindow();
    SetupArtWindow();
    // DemoLabel();
});

function DemoLabel() {
    console.log("Creating demo label");
    var label = document.createElement("Label");
    label.innerHTML = "Hello world! 0123456789";
    document.body.appendChild(label);
}
