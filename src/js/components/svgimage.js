import { isBlank, isString, Lerp, StringAlphanumericOnly, StringContainsAlpha, StringContainsAlphanumeric, StringNumericOnly, StringRemoveAlpha, StringRemoveAlphanumeric } from "../lilutils";
import { BasicGradientRect } from "../svg/svgGenerator";
import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

// export class SVGImage extends BasicComponent {
export class SVGImage extends TitledComponent {

    #image;

    rect;

    // constructor() {
    //     super();
    constructor(componentTitle) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'svgImage', 'container');

        this.#image = ui.CreateDivWithClass('image', 'canvasSizedImg');
        this.div.appendChild(this.#image);
        
        this.rect = BasicGradientRect('skyblue', 'white', 'pink');
        this.rect.onChange = function (valueChanged, newValue, previousValue, changedElement) {
            console.log(`SVGAsset value ${valueChanged} changed to ${newValue} from ${previousValue} on ${changedElement.constructor.name}`);
        }

        this.rect.GetShape().fillGradient = this.rect.gradient;
        this.#image.innerHTML = this.rect.html;

    }

    get demoRect() {
        if (this.#_demoRect == null) {
            this.#_demoRect = BasicGradientRect('skyblue', 'white', 'pink');
            this.#_demoRect.GetShape().fillGradient = this.rect.gradient;
            
        }
    }
    #_demoRect;
    updateRect() {
        this.#image.innerHTML = this.rect.html;
    }
}