import { GetCSSVariable, InverseLerp, isBlank, StringNumericOnly, StringToNumber } from "../lilutils";
import * as ui from "../ui";
import { TitledComponent } from "./base";

const INITIAL_VALUE = 0;
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const STEPS = 20;
const AS_PERCENTAGE = true;
const PREFIX = '';
const SUFFIX = '';

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

    get initialValue() { return this.#_initialValue; }
    set initialValue(v) { this.#_initialValue = v; }
    #_initialValue = INITIAL_VALUE;
    get minValue() { return this.#_minValue; }
    set minValue(v) { this.#_minValue = v; }
    #_minValue = MIN_VALUE;
    get maxValue() { return this.#_maxValue; }
    set maxValue(v) { this.#_maxValue = v; }
    #_maxValue = MAX_VALUE;
    get steps() { return this.#_steps; }
    set steps(v) { this.#_steps = v; }
    #_steps = STEPS;

    get asPercentage() { return this.#_asPercentage; }
    set asPercentage(v) { this.#_asPercentage = v; }
    #_asPercentage = AS_PERCENTAGE;

    get valuePrefix() { return this.#_valuePrefix; }
    set valuePrefix(v) { this.#_valuePrefix = v; }
    #_valuePrefix = PREFIX;
    get valueSuffix() { return this.#_valueSuffix; }
    set valueSuffix(v) { this.#_valueSuffix = v; }
    #_valueSuffix = SUFFIX;

    #updateInput() {
        let increment = this.maxValue / this.steps;
        ui.AddElementAttributes(this.#input,
            ['min', 'max', 'step'],
            [this.minValue, this.maxValue, increment]);
    }

    #generateTickMarks() {
        if (this.#ticksContainer == null) {
            this.#ticksContainer = ui.CreateDivWithClass('stickmarks');
            this.#bg.appendChild(this.#ticksContainer);
        }
        let min = StringToNumber(this.minValue);
        let max = StringToNumber(this.maxValue);
        let step = StringToNumber(this.steps);
        if (step < 10) { step = 10; }
        if (this.#ticks != null && this.#ticks.length > 0) {
            for (let i = 0; i < this.#ticks.length; i++) {
                this.#ticks[i]?.remove();
            }
        }
        this.#ticks = [];
        for (let i = min; i <= max; i += step) {
            let tick = ui.CreateElement('span');
            this.#ticks.push(tick);
            this.#ticksContainer.appendChild(tick);
        }
    }

    constructor(componentTitle, onChangeCallback, initialValue = INITIAL_VALUE,
        minValue = MIN_VALUE, maxValue = MAX_VALUE, asPercentage = AS_PERCENTAGE, steps = STEPS) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'slider', 'container');

        initialValue = initialValue.clamp(minValue, maxValue);
        this.initialValue = initialValue;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.steps = steps;
        this.asPercentage = asPercentage;

        // create slider input 
        this.#input = ui.CreateInputWithID('range', this.uniqueComponentName, 'sinput');
        this.value = initialValue; // ensure we set initial value 
        this.#bg = ui.CreateElementWithClass('span', 'sbg');
        ui.AddElementAttribute(this.#bg, 'value', initialValue);
        this.#bg.style.setProperty('--slider-value', this.valueAsString());
        this.#updateInput();

        // generate text indicator
        this.#textIndicator = ui.CreateDivWithClass('stext');
        ui.AddElementAttribute(this.#textIndicator, 'slider-value', initialValue);
        this.#textIndicator.innerHTML = this.valueAsString();
        this._titleElement.appendChild(this.#textIndicator);

        // generate tickmarks
        this.#generateTickMarks();

        // add callback event 
        this.#input.addEventListener('input', (e) => {
            this.#bg.style.setProperty('--slider-value', `${this.valueNormalized * 100}%`);
            this.#textIndicator.innerHTML = this.valueAsString();
            if (onChangeCallback) {
                onChangeCallback(e.target.value, this);
            }
        });

        this.div.appendChild(this.#input);
        this.div.appendChild(this.#bg);

        this._addHelpIcon(componentTitle, false, false);

        // TODO: slider.css vars move to vars.css
        // Issue URL: https://github.com/nickyonge/evto-web/issues/43
    }

    /** gets the current slider value, normalized between 0-1 @returns {Number} */
    get valueNormalized() {
        if (this.#input == null) { return NaN; }
        let value = this.#input.value;
        let n = StringToNumber(value);
        if (n == null || !Number.isFinite(n)) {
            console.warn(`WARNING: couldn't parse slider value ${value} to number, can't create percentage`, this);
            return NaN;
        }
        // normalize to a value between min and max 
        let min = StringToNumber(this.minValue);
        let max = StringToNumber(this.maxValue);
        return InverseLerp(n, min, max);
    }
    get valueAsPercent() {
        return `${Math.round(this.valueNormalized * 100)}%`;
    }

    valueAsString(formatted = true) {
        if (!this.#input) { return null; }
        if (!formatted) { return this.#input.value; }

        let value = this.#input.value;

        if (this.asPercentage) {
            value = this.valueAsPercent;
        }

        return `${this.valuePrefix}${value}${this.valueSuffix}`;
    }

    /**
     * Gets/sets this slider's value number.
     * - Getter returns the value as a Number (for string, see {@link valueAsString})
     * - Setter can take string or number (or any type that can be parsed into a numeric value)
     *   - Setting to `null` will reset the value to {@linkcode initialValue}
     * @type {Number|string} can take a number, string, or other type that can be parsed to number
     * @returns {Number}
     */
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
    get value() {
        let v = this.valueAsString(false);
        if (!Number.isFinite(v)) { return null; }
        return StringToNumber(v);
    }
}

/* Example HTML
    <div class="slider container">
        <input class="sinput" type="range" min="0" max="100" step="5" value="50" />
        <span class="sbg" value="50"> </span>
    </div>
*/
