import * as ui from "../ui";
import { TitledComponent } from "./base";

export class Toggle extends TitledComponent {

    #input;
    #label;
    #cost;
    #switch;

    constructor(componentTitle, onChangeCallback, cost = null, initialState = false) {
        super(componentTitle);

        let useCost = (cost || cost === 0 || cost === '0');

        ui.AddClassesToDOM(this.div, 'toggle');
        this.#input = ui.CreateInputWithID('checkbox', this.uniqueComponentID, 'toggle');
        this.#label = ui.CreateElementWithClass('label', 'toggleLabel');
        ui.AddElementAttribute(this.#label, 'for', this.uniqueComponentID);
        this._titleElement = ui.CreateElement('span');
        this.#switch = ui.CreateElementWithClass('span', 'toggleSwitch');

        ui.MakeTabbableWithInputTo(this.#switch, this.#input);

        this.#input.checked = initialState;

        if (useCost) {

            // add costs field 
            this.#cost = ui.CreateDivWithClass('cost', 'inline', 'darkBG');
            this.#cost.innerHTML = `<p>${cost}</p>`;
            this._titleElement.appendChild(this.#cost);
            
            
        }
        
        this.div.appendChild(this.#input);
        this.div.appendChild(this.#label);
        this.#label.appendChild(this._titleElement);
        this.#label.appendChild(this.#switch);
        
        if (onChangeCallback) {
            this.#input.addEventListener('change', (event) => {
                onChangeCallback(event.target.checked);
            });
        }
        this._addHelpIcon(`help me! ${1}`, true, false);
    }

    // function exampleOnChangeCallback(isChecked) {
    //     console.log(`toggle state changed, checked: ${isChecked}`);
    // }

    // function exampleOnChangeCallbackNoParameters() {
    //     console.log(`checked: ${myToggle.checked}`);
    // }

    get checked() {
        if (!this.#input) {
            return false;
        }
        return this.#input.checked;
    }

    // this.div = ui.CreateDivWithClass("switchContainer");

    /* Example HTML

<div class="switchContainer">
<input type="checkbox" id="checkboxInput" />
<label for="checkboxInput" class="toggleLabel">
<span class="switchtitle">Toggle Me</span>
<span class="toggleSwitch"></span>
</label>
</div>

*/
}