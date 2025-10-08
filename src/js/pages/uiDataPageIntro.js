import * as ui from "../ui";
import * as txt from '../text';
import * as cmp from '../components';

/** Create the Intro page
 * @param {HTMLElement} page Element of the page itself */
export function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let txIntro = new cmp.TextField(txt.LIPSUM);
    page.appendChild(txIntro);

    let slider1 = new cmp.Slider('Test Slider 1', Callback);
    page.appendChild(slider1);
    
    let slider2 = new cmp.Slider('Test Slider 2');
    page.appendChild(slider2);
    
    let slider3 = new cmp.Slider('Test Slider 3');
    page.appendChild(slider3);
}

function Callback(value) {
    console.log("V: " + value);
}