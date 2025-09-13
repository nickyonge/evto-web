import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

export class TextField extends BasicComponent {

    // #text;

    constructor(text) {
        super();

        ui.AddClassesToDOM(this.div, 'textField');
        this.div.innerText = text;
        
        // this.div.appendChild(this.#text);
        
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