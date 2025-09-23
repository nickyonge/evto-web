import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";
import Coloris from "@melloware/coloris";

export class ColorPicker extends TitledComponent {

    #button;
    #text;

    constructor(componentTitle, initialValue, onChangeCallback) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'colorPicker', 'clr-field');
        this.#button = ui.CreateElement('button');
        ui.AddElementAttributes(this.#button, ['type', 'aria-labelledby'], ['button', 'clr-open-label']);
        this.#text = ui.CreateInputWithID('text', `${this.uniqueComponentName}_tx`);
        ui.AddElementAttribute(this.#text, 'data-coloris', '');
        this.div.appendChild(this.#button);
        this.div.appendChild(this.#text);

    }
}

/* Example HTML
<div class="clr-field">
  <button type="button" aria-labelledby="clr-open-label"></button>
  <input type="text" data-coloris="">
</div>
*/

/* Example Coloris implementation
let _col = ui.CreateInput('text');
ui.AddElementAttribute(_col, 'data-coloris', '');
page.appendChild(_col);
Coloris.init();
Coloris({ el: "#coloris" });
*/
