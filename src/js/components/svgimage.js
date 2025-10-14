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
        this.rect.GetShape().fillGradient = this.rect.gradient;
        this.#image.innerHTML = this.rect.html;
    }

    updateRect() {
        this.#image.innerHTML = this.rect.html;
    }
}