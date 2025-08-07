import './css'; // import css classes 
import { BuildUI } from './uiMain';

window.addEventListener('load', function () {
    console.log("page loaded");
    BuildUI();
    // DemoLabel();
});

function DemoLabel() {
    console.log("Creating demo label");
    var label = document.createElement("Label");
    label.innerHTML = "Hello world! 0123456789";
    document.body.appendChild(label);
}
