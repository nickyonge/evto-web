import * as ui from "../ui";
import { TitledComponent } from "./base";

export class Toggle extends TitledComponent {

    #input;
    #label;
    #switch;

    constructor(componentTitle, onChangeCallback, initialState = false) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'toggle');
        this.#input = ui.CreateInputWithID('checkbox', this.uniqueComponentID, 'toggle');
        this.#label = ui.CreateElementWithClass('label', 'toggleLabel');
        ui.AddElementAttribute(this.#label, 'for', this.uniqueComponentID);
        this._titleElement = ui.CreateElement('span');
        this.#switch = ui.CreateElementWithClass('span', 'toggleSwitch');

        ui.MakeTabbableWithInputTo(this.#switch, this.#input);

        this.#input.checked = initialState;

        this.div.appendChild(this.#input);
        this.div.appendChild(this.#label);
        this.#label.appendChild(this._titleElement);
        this.#label.appendChild(this.#switch);

        if (onChangeCallback) {
            this.#input.addEventListener('change', (event) => { 
                onChangeCallback(event.target.checked);
            });
        }
        this._addHelpIcon(`help me! ${1}`, true);
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