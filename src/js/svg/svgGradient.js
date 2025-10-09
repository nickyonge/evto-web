import * as svg from './index';

export class svgGradient {

    /** if true, html outputs `radialGradient`; if false, `linearGradient` */
    isRadial = svg.default.GRADIENT_ISRADIAL;

    x1 = svg.default.GRADIENT_X1;
    y1 = svg.default.GRADIENT_Y1;
    x2 = svg.default.GRADIENT_X2;
    y2 = svg.default.GRADIENT_Y2;

    stops;

    /** radial only, X coord at gradient start circle, convenience, simply gets/sets {@link x1} @type {number} */
    get fx() { return this.x1; } set fx(i) { this.x1 = i; }
    /** radial only, Y coord at gradient start circle, convenience, simply gets/sets {@link y1} @type {number} */
    get fy() { return this.y1; } set fy(i) { this.y1 = i; }
    /** radial only, X coord at gradient end circle, convenience, simply gets/sets {@link x2} @type {number} */
    get cx() { return this.x2; } set cx(i) { this.x2 = i; }
    /** radial only, Y coord at gradient end circle, convenience, simply gets/sets {@link y2} @type {number} */
    get cy() { return this.y2; } set cy(i) { this.y2 = i; }

    /** radial-only, radius at end of the gradient @type {number} converted to % */
    fr = svg.default.GRADIENT_FR;
    /** radial-only, radius at end of the gradient @type {number} converted to % */
    r = svg.default.GRADIENT_R;

    gradientUnits = svg.default.GRADIENT_UNITS;
    gradientTransform = svg.default.GRADIENT_TRANSFORM;

    spreadMethod = svg.default.GRADIENT_SPREADMETHOD;

    href = svg.default.GRADIENT_HREF;
    xlinkhref = svg.default.GRADIENT_XLINKHREF;

    constructor(isRadial = svg.default.GRADIENT_ISRADIAL, color1 = svg.default.GRADIENT_COLOR1, color2 = svg.default.GRADIENT_COLOR2) {

    }

    GenerateStops(colors) {
        
    }

    get html() {}
    get data() {}

}

class svgGradientStop {
    offset = svg.default.GRADIENT_STOP_OFFSET;
    color = svg.default.GRADIENT_STOP_COLOR;
    opacity = svg.default.GRADIENT_STOP_OPACITY;
    constructor(offset = svg.default.GRADIENT_STOP_OFFSET, color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY) {
        this.offset = offset;
        this.color = color;
        this.opacity = opacity;
    }
    get html() { }
    get data() { }
}