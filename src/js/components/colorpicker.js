import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";
import Coloris from "@melloware/coloris";

export class ColorPicker extends TitledComponent {

    #button;
    #input;

    #enableAlpha

    // default color
    // enable alpha
    // swatches

    constructor(componentTitle, onChangeCallback, defaultColor = '#beeeef', enableAlpha = false) {
        super(componentTitle);

        this.#enableAlpha = enableAlpha;

        ui.AddClassesToDOM(this.div, 'colorPicker', 'clr-field');
        this.#button = ui.CreateElement('button');
        ui.AddElementAttributes(this.#button, ['type', 'aria-labelledby'], ['button', 'clr-open-label']);
        this.#input = ui.CreateInputWithID('text', `${this.uniqueComponentName}_tx`);
        ui.AddElementAttribute(this.#input, 'data-coloris', '');
        this.div.appendChild(this.#button);
        this.div.appendChild(this.#input);

        this.#input.addEventListener('click', function () {
            Coloris({
                alpha: this.#enableAlpha,
            });
            this.UpdateColor();
        }.bind(this));

        if (defaultColor) {
            this.#input.value = defaultColor;
        }
        
        this.UpdateColor();
    }

    DocumentLoaded() {
        this.UpdateColor();
    }

    /** manually update the color, ensure the thumbnail icon matches the color input */
    UpdateColor() {
        this.#input.dispatchEvent(new Event('input', { bubbles: true }));
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
