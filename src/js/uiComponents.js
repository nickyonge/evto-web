import * as ui from "./ui";

/**
 * TEST
 */
export class ToggleSwitch extends TitledComponent {

    #input;
    #label;
    #switch;

    constructor() {

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

    /** 
     * Get/set the title text for this toggle switch. Automatically updates HTML.
     * @type {string} Title text to assign
     */
    set title(text) {
        this._titleText = text;
        if (this._title) {
            this._title.innerHTML = text;
        }
    }
    /** 
     * @returns {HTMLElement} newly made HTfykML <div> element
     */
    get title() {
        return this._titleText;
    }
}
export class MutliOptionList {

}
export class DropdownList {

}
class TitledComponent {
    
    div;
    _title;
    _titleText;

}