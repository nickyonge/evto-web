import * as ui from "../ui";
import { TitledComponent } from "./base";
import * as cost from '../costs';

export class Toggle extends TitledComponent {

    #input;
    #label;
    #cost;
    #costP;
    #switch;

    #costArray;

    constructor(componentTitle, onChangeCallback, cost, initialState = false) {
        super(componentTitle);

        this.#costArray = cost;

        ui.AddClassesToDOM(this.div, 'toggle');
        this.#input = ui.CreateInputWithID('checkbox', this.uniqueComponentID, 'toggle');
        this.#label = ui.CreateElementWithClass('label', 'toggleLabel');
        ui.AddElementAttribute(this.#label, 'for', this.uniqueComponentID);
        this._titleElement = ui.CreateElement('span');
        this.#switch = ui.CreateElementWithClass('span', 'toggleSwitch');

        ui.MakeTabbableWithInputTo(this.#switch, this.#input);

        this.#input.checked = initialState;

        // add costs field 
        this.#cost = ui.CreateDivWithClass('cost', 'inline', 'darkBG');
        this.#costP = ui.CreateElement('p');
        this.#cost.appendChild(this.#costP);
        this._titleElement.appendChild(this.#cost);
        this.#cost.hidden = true;

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

        this.UpdateCosts();
    }

    UpdateCosts() {
        if (this.#costArray == null || !Array.isArray(this.#costArray)) {
            return;
        }
        let costArray = cost.GetCostArray(this.#costArray);
        console.log("cost array before: " + this.#costArray);
        console.log("cost array after: " + costArray);

        if (costArray == null) {
            this.#cost.hidden = true;
        } else {
            this.#cost.hidden = false;
            let cost = costArray;
            if (cost < -99) { cost = -99; } else if (cost > 999) { cost = 999; }
            if (cost < -9 || cost > 99) {
                ui.AddClassToDOMs('tinyText', this.#cost);
            } else if (cost < 0 || cost > 9) {
                ui.AddClassToDOMs('smallText', this.#cost);
            } else {
                ui.RemoveClassesFromDOM(this.#cost, 'smallText', 'tinyText');
            }
            this.#costP.innerText = cost;
        }
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