import * as ui from "../ui";
import { isBlank } from "../lilutils";

export class BasicComponent {
    div;
    constructor() { 
        this.div = ui.CreateDivWithClass("uiComponent");
    }
}
export class TitledComponent extends BasicComponent {

    #titleElement;
    #titleText;

    constructor(componentTitle) {
        super();
        if (componentTitle) {
            this.title = componentTitle;
        }
        
    }

    /** Get/set the title text for this toggle switch. Automatically updates HTML.
     * @type {string} Title text to assign */
    set title(text) {
        this.#titleText = text;
        if (this.#titleElement) {
            if (!text || text.isBlank) {
                this.#titleElement.style.visibility = 'hidden';
            } else {
                this.#titleElement.style.visibility = 'visible';
                this.#titleElement.innerHTML = text;
            }
        }
    }
    /** @returns {string} title of this component */
    get title() {
        return this.#titleText;
    }

    /** get/set the title HTML element, auto-updates the text on set 
     * @type {HTMLElement} */
    set _titleElement(titleElement) {
        if (!titleElement) { return; }
        ui.AddClassToDOMs('componentTitle', titleElement);
        ui.DisableContentSelection(titleElement);// disable selecting text
        this.#titleElement = titleElement;
        this._updateTitle();
    }
    /** @returns {HTMLElement} Element for the title */
    get _titleElement() { return this.#titleElement; }

    /** Reassigns `title` to itself, re-invoking the setter method */
    _updateTitle() { this.title = this.title; }
}
