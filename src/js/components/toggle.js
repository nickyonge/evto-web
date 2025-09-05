import { TitledComponent } from "./base";

export class Toggle extends TitledComponent {

    #input;
    #label;
    #switch;

    constructor(componentTitle) {
        super(componentTitle);
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