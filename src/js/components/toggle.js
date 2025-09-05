import * as ui from "../ui";
import { TitledComponent } from "./base";

export class Toggle extends TitledComponent {

    #input;
    #label;
    #switch;

    constructor(componentTitle) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'toggle');
        this.#input = ui.CreateInputWithID('checkbox', 'checkboxInput');
        this._titleElement = ui.CreateElementWithClass('span', 'switchtitle');
        this.#switch = ui.CreateElementWithClass('span', 'toggleSwitch');

        this.div.appendChild(this.#input);
        this.div.appendChild(this._titleElement);
        this.div.appendChild(this.#switch);

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