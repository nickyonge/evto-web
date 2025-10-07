import * as ui from "../ui";
import * as txt from '../text';
import * as cmp from '../components';

/** Create the Intro page
 * @param {HTMLElement} page Element of the page itself */
export function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let txIntro = new cmp.TextField(txt.LIPSUM);
    page.appendChild(txIntro);

    let slider = new cmp.Slider('Test Slider');
    page.appendChild(slider);
}