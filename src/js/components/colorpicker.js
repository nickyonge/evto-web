import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";
import Coloris from "@melloware/coloris";

/** if true, inserts an intermediary container between coloris and div */
const useColorisContainer = true;

export class ColorPicker extends TitledComponent {


    #coloris;
    #button;
    #input;

    #enableAlpha

    // default color
    // enable alpha
    // swatches

    constructor(componentTitle, onChangeCallback, defaultColor = '#beeeef', enableAlpha = false) {
        super(componentTitle);

        this.#enableAlpha = enableAlpha;


        this.#button = ui.CreateElement('button');
        ui.AddElementAttributes(this.#button, ['type', 'aria-labelledby'], ['button', 'clr-open-label']);
        this.#input = ui.CreateInputWithID('text', `${this.uniqueComponentName}_tx`);
        ui.AddElementAttribute(this.#input, 'data-coloris', '');

        if (useColorisContainer) {
            ui.AddClassesToDOM(this.div, 'colorPicker', 'clr-container');
            this.#coloris = ui.CreateDivWithClass('colorPicker', 'clr-field');
            this.#coloris.appendChild(this.#button);
            this.#coloris.appendChild(this.#input);
            this.div.appendChild(this.#coloris);
        } else {
            ui.AddClassesToDOM(this.div, 'colorPicker', 'clr-field');
            this.div.appendChild(this.#button);
            this.div.appendChild(this.#input);
        }

        this.#input.addEventListener('click', function () {
            Coloris({
                alpha: this.#enableAlpha,
            });
            this.UpdateColor();
        }.bind(this));

        if (defaultColor) {
            this.#input.value = defaultColor;
        }
        
        this._addHelpIcon(`help me! ${componentTitle}`);
        
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
