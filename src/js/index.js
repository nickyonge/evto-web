import(/* webpackPreload: true */ './../css/fonts.css');
import(/* webpackPreload: true */ './../css/style.css');
import(/* webpackPreload: true */ './../css/components/hbbtn.css');
import(/* webpackPreload: true */ './../css/components/minput.css');
import(/* webpackPreload: true */ './../css/components/socialbtn.css');
import(/* webpackPreload: true */ './../css/components/slidebtn.css');

import { BuildUI } from './ui';

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
