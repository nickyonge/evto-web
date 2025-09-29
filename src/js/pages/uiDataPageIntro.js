import * as ui from "../ui";
import * as txt from '../text';

export function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let p1 = ui.CreateElement('p');
    p1.innerHTML = txt.LIPSUM;
    page.appendChild(p1);
}