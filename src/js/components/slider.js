import { GetCSSVariable, isBlank, StringNumericOnly, StringToNumber } from "../lilutils";
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

    initialValue = 50;
    minValue = 0;
    maxValue = 100;
    steps = 20;

    valuePrefix = '';
    valueSuffix = '%';

    constructor(componentTitle, onChangeCallback, initialValue = 50, steps = 100) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'slider', 'container');

        this.initialValue = initialValue;

        this.#input = ui.CreateInputWithID('range', this.uniqueComponentName, 'sinput');
        let increment = 100 / steps;
        ui.AddElementAttributes(this.#input, ['min', 'max', 'step', 'value'], [0, 100, increment, initialValue]);
        this.#bg = ui.CreateElementWithClass('span', 'sbg');
        ui.AddElementAttribute(this.#bg, 'value', initialValue);
        this.#bg.style.setProperty('--slider-value', `${initialValue.toMax()}%`);

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
            let value = e.target.value;
            console.log(typeof value);
            this.#bg.style.setProperty('--slider-value', `${e.target.value}%`);
            this.#textIndicator.innerHTML = `${e.target.value}%`;
            if (onChangeCallback) {
                onChangeCallback(e.target.value, this);
            }
        });

        this.div.appendChild(this.#input);
        this.div.appendChild(this.#bg);

        this.value = '69%';

        this._addHelpIcon(componentTitle, false, false);

        // TODO: slider.css vars move to vars.css
        // Issue URL: https://github.com/nickyonge/evto-web/issues/43
    }

    get valueAsString() {
        if (!this.#input) { return null; }
        return this.#input.value;
    }
    set valueAsString(v) {
        this.value = v;
    }

    get value() {
        let v = this.valueAsString;
        if (!Number.isFinite(v)) { return null; }
        return StringToNumber(v);
    }
    set value(v) {
        if (!this.#input) { return; }
        if (v == null) { v = this.initialValue; }
        switch (typeof v) {
            case 'string':
                if (isBlank(v)) {
                    v = this.initialValue;
                    break;
                }
                v = StringToNumber(v);
                break;
            case 'number':
                if (!Number.isFinite(v)) {
                    v = this.initialValue;
                    break;
                }
                v = v.clamp(this.minValue, this.maxValue);
                break;
            default:
                // other type - attempt to coerce to a number, or simply warn and return 
                const n = Number(value);
                if (n == null || typeof n != 'number' || !Number.isFinite(n)) {
                    console.warn(`WARNING: failed to parse value ${value} of type "${typeof value}" to Number, can't set slider value`, this);
                    return;
                }
                v = n.clamp(this.minValue, this.maxValue);
                break;
        }
        this.#input.value = v;
        this.#input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

/* Example HTML
    <div class="slider container">
        <input class="sinput" type="range" min="0" max="100" step="5" value="50" />
        <span class="sbg" value="50"> </span>
    </div>
*/
