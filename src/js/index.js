import(/* webpackPreload: true */ './../css/fonts.css');
import(/* webpackPreload: true */ './../css/style.css');

import { BuildUI } from './ui';

window.addEventListener('load', function () {
    console.log("page loaded");
    DemoLabel();
    BuildUI();
});

function DemoLabel() {
    console.log("Creating demo label");
    var label = document.createElement("Label");
    label.innerHTML = "Hello world! 0123456789";
    document.body.appendChild(label);
}
