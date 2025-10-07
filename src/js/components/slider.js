import * as ui from "../ui";
import { TitledComponent } from "./base";

/**
 * Slider component with range input
 * @see https://codepen.io/nickyonge/pen/EaPWMRe
 * @see https://uiverse.io/nickyonge/evil-mole-95
 */
export class Slider extends TitledComponent {

    constructor(componentTitle) {
        super(componentTitle);
        this._addHelpIcon(componentTitle);
    }

    /* Example HTML
<div class="slider container">
    <input class="sinput" type="range" min="0" max="100" step="5" value="50" />
    <span class="sbg" value="50"> </span>
</div>
*/
}
