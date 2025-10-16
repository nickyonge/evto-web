import { GetCSSVariable, InverseLerp, isBlank, SetElementEnabled, StringNumericOnly, StringToNumber } from "../lilutils";
import * as ui from "../ui";
import { TitledComponent } from "./base";

const INITIAL_VALUE = 0;
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const INCREMENT = 5;
const STEPS = 20;
const AS_PERCENTAGE = true;
const PREFIX = '';
const SUFFIX = '';
const INCREMENT_AS_STEPS = false;

const MIN_TICKMARKS = 4;
const MAX_TICKMARKS = 20;

const DISABLED_ALPHA = 0.69;
const DISABLED_GRAYSCALE = 0.69;

/**
 * Slider component with range input
 * @see https://codepen.io/nickyonge/pen/EaPWMRe
 * @see https://uiverse.io/nickyonge/evil-mole-95
 */
export class Slider extends TitledComponent {

    #input;
    #bg;
    #textIndicator;
    #tickmarksContainer;
    #tickmarks;

    /** 
     * If {@link disabled}, return `0` (`true`) or {@linkcode initialValue} (`false`)? Default `true`
     * @type {boolean} */
    disabledReturnsZero = true;

    get enabled() { return !this.disabled; }
    set enabled(v) { this.disabled = !v; }
    get disabled() { return this.#input.disabled; }
    set disabled(v) {
        // TODO: make enable/disable a core part of BasicComponent
        // Issue URL: https://github.com/nickyonge/evto-web/issues/52
        this.#input.disabled = v;
        this.div.style.opacity = v ? DISABLED_ALPHA : 1;
        this.div.style.filter = v ? `grayscale(${DISABLED_GRAYSCALE})` : '';
        SetElementEnabled(this.div, !v);
        if (v) {
            ui.DisableContentSelection(this.div);
        } else {
            ui.AllowContentSelectionWithDefaultCursor(this.div);
        }
        this.#updateText(v);// require override if disabled 
    }

    get initialValue() { return this.#_initialValue; }
    set initialValue(v) { this.#_initialValue = v; }
    #_initialValue = INITIAL_VALUE;
    get minValue() { return this.#_minValue; }
    set minValue(v) { this.#_minValue = v; this.#recalculateIncrementAndSteps(); }
    #_minValue = MIN_VALUE;
    get maxValue() { return this.#_maxValue; }
    set maxValue(v) { this.#_maxValue = v; this.#recalculateIncrementAndSteps(); }
    #_maxValue = MAX_VALUE;

    get asPercentage() { return this.#_asPercentage; }
    set asPercentage(v) { this.#_asPercentage = v; this.#updateText(); }
    #_asPercentage = AS_PERCENTAGE;

    get valuePrefix() { return this.#_valuePrefix; }
    set valuePrefix(v) { this.#_valuePrefix = v; this.#updateText(); }
    #_valuePrefix = PREFIX;
    get valueSuffix() { return this.#_valueSuffix; }
    set valueSuffix(v) { this.#_valueSuffix = v; this.#updateText(); }
    #_valueSuffix = SUFFIX;

    #_uniqueValueOverrides = [];
    /** 
     * Array of [number,string] pairs. 
     * If slider's current {@link value} is found as the first element in 
     * this array, use the second element as the display text.
     * 
     * Read-only - to add, use {@linkcode AddUniqueValueOverride}.
     * 
     * Use value `NaN` for disabled override.
     * @type {Array<Array<number,string>>}
     */
    get uniqueValueOverrides() { if (this.#_uniqueValueOverrides == null) { this.#_uniqueValueOverrides = []; } return this.#_uniqueValueOverrides; }
    AddUniqueValueOverride(value, override, autoUpdateText = true) {
        let i = this.GetUniqueValueOverrideIndex(value);
        if (i >= 0) {
            this.uniqueValueOverrides[i] = override;
            return;
        }
        this.uniqueValueOverrides.push([value, override]);
        if (autoUpdateText) {this.#updateText();}
    }
    AddUniqueValueOverrides(valueOverrides) {
        if (valueOverrides == null) { return; }
        for (let i = 0; i < valueOverrides.length; i++) {
            if (valueOverrides[i] == null || !Array.isArray(valueOverrides[i]) || valueOverrides[i].length < 2) { continue; }
            this.AddUniqueValueOverride(valueOverrides[i][0], valueOverrides[i][1], false);
        }
        this.#updateText();
    }
    RemoveUniqueValueOverride(value) {
        let i = this.GetUniqueValueOverrideIndex(value);
        if (i >= 0) {
            this.#_uniqueValueOverrides = this.#_uniqueValueOverrides.splice(i, 1);
        }
    }
    ClearUniqueValueOverrides() { this.#_uniqueValueOverrides = []; }
    GetCurrentUniqueValueOverride() {
        if (this.#input == null) { return null; }
        return this.GetUniqueValueOverride(this.disabled ? NaN : this.#input.value);
    }
    GetCurrentUniqueValueOverrideIndex() {
        if (this.#input == null) { return null; }
        return this.GetUniqueValueOverrideIndex(this.disabled ? NaN : this.#input.value);
    }
    GetUniqueValueOverrideIndex(value) {
        let checkNaN = Number.isNaN(value);
        for (let i = 0; i < this.uniqueValueOverrides.length; i++) {
            if (this.uniqueValueOverrides[i] == null || !Array.isArray(this.uniqueValueOverrides[i]) || this.uniqueValueOverrides[i].length == 0) { continue; }
            if (this.uniqueValueOverrides[i][0] == value) {
                return i;
            }
            if (checkNaN) {
                if (Number.isNaN(this.uniqueValueOverrides[i][0])) {
                    return i;
                }
            }
        }
        return -1;
    }
    GetUniqueValueOverride(value) {
        let i = this.GetUniqueValueOverrideIndex(value);
        return i >= 0 ? this.uniqueValueOverrides[i][1] : null;
    }

    get steps() { return this.#_steps; }
    set steps(v) {
        this.#_steps = v;
        this.#recalculateIncrement();
    }
    #_steps = STEPS;

    get increment() { return this.#_increment; }
    set increment(v) {
        this.#_increment = v;
        this.#recalculateSteps();
    }
    #_increment = INCREMENT;

    #updateInput() {
        ui.AddElementAttributes(this.#input,
            ['min', 'max', 'step'],
            [this.minValue, this.maxValue, this.increment]);
    }

    #recalculateIncrementAndSteps(regenerateTickmarks = true) {
        this.#recalculateIncrement(false);
        this.#recalculateSteps(false);
        if (regenerateTickmarks) { this.#generateTickMarks(); }
    }
    #recalculateIncrement(regenerateTickmarks = true) {
        this.#_increment = (this.maxValue - this.minValue) / this.steps;
        if (regenerateTickmarks) { this.#generateTickMarks(); }
    }
    #recalculateSteps(regenerateTickmarks = true) {
        this.#_steps = (this.maxValue - this.minValue) / this.increment;
        if (regenerateTickmarks) { this.#generateTickMarks(); }
    }

    #generateTickMarks(initialGeneration = false) {
        if (!initialGeneration && !this.hasBeenLoaded) {
            return;
        }
        // create tickmarks container
        if (this.#tickmarksContainer == null) {
            this.#tickmarksContainer = ui.CreateDivWithClass('stickmarks');
            this.#bg.appendChild(this.#tickmarksContainer);
        }
        // ensure tickmarks array is empty
        if (this.#tickmarks != null && this.#tickmarks.length > 0) {
            for (let i = 0; i < this.#tickmarks.length; i++) {
                this.#tickmarks[i]?.remove();
            }
        }
        this.#tickmarks = [];
        // add tickmarks 
        let steps = StringToNumber(this.steps).clamp(MIN_TICKMARKS, MAX_TICKMARKS);
        if (steps.isEven()) { steps++; }
        for (let i = 0; i < steps; i++) {
            let tickmark = ui.CreateElement('span');
            this.#tickmarks.push(tickmark);
            this.#tickmarksContainer.appendChild(tickmark);
        }
        // regen text if tickmarks are regenerated
        if (!initialGeneration) {
            this.#updateText();
        }
    }

    constructor(componentTitle, onChangeCallback, initialValue = INITIAL_VALUE,
        minValue = MIN_VALUE, maxValue = MAX_VALUE, asPercentage = AS_PERCENTAGE,
        increment = INCREMENT, incrementParamIsSteps = INCREMENT_AS_STEPS) {

        super(componentTitle);

        if (increment == 0 || !isFinite(increment)) {
            console.warn(`WARNING: increment value ${increment} is invalid, must be nonzero finite number, setting to 1`, this, increment);
            increment = 1;
        }

        ui.AddClassesToDOM(this.div, 'slider', 'container');

        initialValue = initialValue.clamp(minValue, maxValue);
        this.initialValue = initialValue;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.asPercentage = asPercentage;

        // define increment and steps 
        if (incrementParamIsSteps) {
            // increment value is steps
            this.steps = increment;
            this.increment = (maxValue - minValue) / increment;
        } else {
            // increment is increment 
            this.increment = increment;
            this.steps = (maxValue - minValue) / increment;
        }

        // create slider input 
        this.#input = ui.CreateInputWithID('range', this.uniqueComponentName, 'sinput');
        this.#updateInput(); // update (set) input attributes before initial value 
        this.value = this.initialValue; // ensure we set initial value before bg or slider-value 
        this.#bg = ui.CreateElementWithClass('span', 'sbg');
        ui.AddElementAttribute(this.#bg, 'value', this.initialValue);
        this.#bg.style.setProperty('--slider-value', this.valueAsPercent);

        // generate text indicator
        this.#textIndicator = ui.CreateDivWithClass('stext');
        this.#updateText();
        this._titleElement.appendChild(this.#textIndicator);

        // generate tickmarks
        this.#generateTickMarks(true);

        // add callback event 
        this.#input.addEventListener('input', (e) => {
            this.#bg.style.setProperty('--slider-value', this.valueAsPercent);
            this.#updateText();
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
        let override = this.GetCurrentUniqueValueOverride();
        if (override != null) { return override; }
        if (!formatted) {
            if (this.disabled) {
                return this.disabledReturnsZero ? '0' : this.#input.value;
            } else {
                return this.#input.value;
            }
        }
        let value;
        if (this.disabled) {
            value = this.disabledReturnsZero ? '0' : this.initialValue;
        } else {
            value = this.#input.value;
            if (this.asPercentage) {
                value = this.valueAsPercent;
            }
        }
        return `${this.valuePrefix}${value}${this.valueSuffix}`;
    }

    #updateText(onlyIfUniqueOverrideFound = false) {
        if (this.#textIndicator == null) { return; }
        if (onlyIfUniqueOverrideFound && this.#input != null) {
            if (this.GetCurrentUniqueValueOverrideIndex() == -1) {
                return;
            }
        }
        this.#textIndicator.innerHTML = this.valueAsString();
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

const halfMaxTickmarks = 100;// 1/2 max tickmarks to add for detecting middle tickmark 
export function GenerateCSS() {
    const style = document.createElement('style');
    let content = '';
    for (let i = 1; i <= 100; i++) {
        content += `.slider .stickmarks span:nth-child(${i}):nth-last-child(${i})${i == 100 ? ' {' : ','}\n`;
    }
    content += '    opacity: var(--slider-tickmark-opacity-middle);\n}\n';
    style.textContent = content;
    document.head.appendChild(style);
}

/* Example HTML
    <div class="slider container">
        <input class="sinput" type="range" min="0" max="100" step="5" value="50" />
        <span class="sbg" value="50"> </span>
    </div>
*/
