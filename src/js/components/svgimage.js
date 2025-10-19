import { isBlank, isString, Lerp, StringAlphanumericOnly, StringContainsAlpha, StringContainsAlphanumeric, StringNumericOnly, StringRemoveAlpha, StringRemoveAlphanumeric } from "../lilutils";
import { BasicGradientRect } from "../svg/svgGenerator";
import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

// export class SVGImage extends BasicComponent {
export class SVGImage extends TitledComponent {

    
    #image;

    rect;

    constructor(componentTitle) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'svgImage', 'container');

        this.#image = ui.CreateDivWithClass('image', 'canvasSizedImg');
        this.div.appendChild(this.#image);

        // this.rect = BasicGradientRect('skyblue', 'white', 'pink');

        // this.rect.GetShape().fillGradient = this.rect.gradient;
        // this.#image.innerHTML = this.rect.html;

        let d = this.demoRect;

    }

    get demoRect() {
        if (this.#_demoRect == null) {
            this.#_demoRect = BasicGradientRect('skyblue', 'white', 'pink');
            this.#_demoRect.id = '_DemoRect ' + Date.now.toString();
            this.#_demoRect.onChange = function (valueChanged, newValue, previousValue, changedElement) {
                console.log(`SVGAsset value ${valueChanged} changed to ${newValue} from ${previousValue} on ${changedElement.constructor.name}`);
                
                changedElement.parent?.NewRect?.();
            }
            this.#_demoRect.GetShape().fillGradient = this.#_demoRect.gradient;
            this.updateDemoRect();
        }
        return this.#_demoRect;
    }
    updateDemoRect() {
        if (this.#_demoImg == null) {
            this.#_demoImg = ui.CreateDivWithClass('image', 'canvasSizedImg');
            this.div.appendChild(this.#_demoImg);
        }
        this.#_demoImg.innerHTML = this.demoRect.html;
    }
    #_demoRect;
    #_demoImg;
}