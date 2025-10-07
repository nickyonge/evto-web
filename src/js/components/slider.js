import { GetCSSVariable } from "../lilutils";
import * as ui from "../ui";
import { TitledComponent } from "./base";

/**
 * Slider component with range input
 * @see https://codepen.io/nickyonge/pen/EaPWMRe
 * @see https://uiverse.io/nickyonge/evil-mole-95
 */
export class Slider extends TitledComponent {

    #input;
    #bg;

    constructor(componentTitle) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'slider', 'container');

        this.#input = ui.CreateInputWithID('range', this.uniqueComponentName, 'sinput');
        ui.AddElementAttributes(this.#input, ['min', 'max', 'step', 'value'], [0, 100, 5, 50]);
        this.#bg = ui.CreateElementWithClass('span', 'sbg');
        ui.AddElementAttribute(this.#bg, 'value', 50);

        this.#input.addEventListener('input', (e) => {
            this.#bg.style.setProperty('--slider-value', `${e.target.value}%`)
        });

        this.div.appendChild(this.#input);
        this.div.appendChild(this.#bg);

        this._addHelpIcon(componentTitle);

    }

    /* Example HTML
<div class="slider container">
    <input class="sinput" type="range" min="0" max="100" step="5" value="50" />
    <span class="sbg" value="50"> </span>
</div>
*/
}
