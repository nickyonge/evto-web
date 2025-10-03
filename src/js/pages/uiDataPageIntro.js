import * as ui from "../ui";
import * as txt from '../text';

/** Create the Intro page
 * @param {HTMLElement} page Element of the page itself */
export function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let p1 = ui.CreateElement('p');
    p1.innerHTML = txt.LIPSUM;
    page.appendChild(p1);
}