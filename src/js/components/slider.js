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
    #textIndicator;
    #ticksContainer;
    #ticks;

    constructor(componentTitle, onChangeCallback, initialValue = 50, steps = 20) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'slider', 'container');

        this.#input = ui.CreateInputWithID('range', this.uniqueComponentName, 'sinput');
        let increment = 100 / steps;
        ui.AddElementAttributes(this.#input, ['min', 'max', 'step', 'value'], [0, 100, increment, initialValue]);
        this.#bg = ui.CreateElementWithClass('span', 'sbg');
        ui.AddElementAttribute(this.#bg, 'value', initialValue);
        this.#bg.style.setProperty('--slider-value', `${initialValue}%`);

        // generate text indicator
        this.#textIndicator = ui.CreateDivWithClass('stext');
        ui.AddElementAttribute(this.#textIndicator, 'slider-value', initialValue);
        this.#textIndicator.innerHTML = `${initialValue}%`;
        this._titleElement.appendChild(this.#textIndicator);

        // generate tickmarks
        this.#ticksContainer = ui.CreateDivWithClass('stickmarks');
        this.#bg.appendChild(this.#ticksContainer);
        let min = parseInt(this.#input.min);
        let max = parseInt(this.#input.max);
        let step = parseInt(this.#input.step);
        if (step < 10) { step = 10; }
        this.#ticks = [];
        for (let i = min; i <= max; i += step) {
            let tick = ui.CreateElement('span');
            this.#ticks.push(tick);
            this.#ticksContainer.appendChild(tick);
        }

        // add callback event 
        this.#input.addEventListener('input', (e) => {
            this.#bg.style.setProperty('--slider-value', `${e.target.value}%`);
            this.#textIndicator.innerHTML = `${e.target.value}%`;
            if (onChangeCallback) {
                onChangeCallback(e.target.value, this);
            }
        });

        this.div.appendChild(this.#input);
        this.div.appendChild(this.#bg);

        this._addHelpIcon(componentTitle, false, false);

        // TODO: slider.css vars move to vars.css

    }

    /* Example HTML
<div class="slider container">
    <input class="sinput" type="range" min="0" max="100" step="5" value="50" />
    <span class="sbg" value="50"> </span>
</div>
*/
}
