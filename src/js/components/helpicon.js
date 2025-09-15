import * as ui from "../ui";
import iconHelp from '../../assets/svg/icons-white/icon-help.svg';
import * as txt from "../text";
import { ToggleOverlay } from "../uiOverlay";

export class HelpIcon {

    #helpDiv;
    #helpExpansionDiv;
    #iconImg;
    #helpQIconDiv;

    helpText;

    constructor(parentDiv, helpText, togglePos = false, rightJustify = true) {

        this.helpText = helpText;

        if (rightJustify) {
            this.#helpExpansionDiv = ui.CreateDivWithClass('helpExpansionDiv');
            parentDiv.appendChild(this.#helpExpansionDiv);
            // this.#titleElement.appendChild(ui.CreateDivWithClass('expansionDiv'));
        }

        this.#helpDiv = togglePos ?
            ui.CreateDivWithClass('helpDiv', 'togglePos') :
                ui.CreateDivWithClass('helpDiv');

        //create icon
        // this.#iconImg = ui.CreateImage(iconHelp, txt.HELPICON_ALT);
        // ui.AddClassToDOMs('helpIcon', this.#iconImg);
        // this.#helpDiv.appendChild(this.#iconImg);

        this.#helpQIconDiv = ui.CreateDivWithClass('helpQIcon');
        this.#helpQIconDiv.innerHTML = '?';
        this.#helpDiv.appendChild(this.#helpQIconDiv);
        ui.DisableContentSelection(this.#helpQIconDiv);

        // prevent event propogation
        this.#helpDiv.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            // selected help icon 
            this.displayHelpText();
        });

        parentDiv.appendChild(this.#helpDiv);

        ui.MakeTabbableWithInputTo(this.#helpDiv, this.#helpDiv);

    }

    displayHelpText() {
        ToggleOverlay(txt.LIPSUM_FULL, this.helpText, this.#helpDiv);
    }
}