import * as svg from './index';

/** Class representing an SVG defined linear or radial gradient */
export class svgGradient {

    /** if true, html outputs `radialGradient`; if false, `linearGradient` */
    isRadial = svg.default.GRADIENT_ISRADIAL;

    x1 = svg.default.GRADIENT_X1;
    y1 = svg.default.GRADIENT_Y1;
    x2 = svg.default.GRADIENT_X2;
    y2 = svg.default.GRADIENT_Y2;

    /** array for gradient stops @type {svgGradientStop[]} */
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
        this.isRadial = isRadial;
        this.stops = svgGradientStop.GenerateStops(color1, color2);
    }



    get html() { }
    get data() { }

}

class svgGradientStop {
    color = svg.default.GRADIENT_STOP_COLOR;
    opacity = svg.default.GRADIENT_STOP_OPACITY;
    offset = svg.default.GRADIENT_STOP_OFFSET;
    constructor(color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) {
        this.color = color;
        this.opacity = opacity;
        this.offset = offset;
    }
    get html() { }
    get data() { }

    /**
     * Converts an array of colours (and optionally opacities and offsets) to an array of 
     * {@link svgGradientStop svgGradientStops}. If offsets aren't provided, linearly assigns
     * it based on the length of the supplied array.
     * @see {@link GenerateStop}
     * @param {[string]|[string,number|string]|[string,number|string,number|string]} colors 2D
     * Array of 1-3 values representing `[color,opacity,offset]`. Arrays and strings can
     * be intertwined, eg `[string,[string,number],string]`. Solo strings are colors.
     * Both `opacity` or `offset` are optional, and if omitted or null, are not assigned 
     * as `<stop>` attributes and instead skipped.
     * @returns {svgGradientStop[]} Array of {@link svgGradientStop} classes
     * @example gradientStops = svgGradientStop.GenerateStops('skyblue','pink','white','pink','skyblue');
     */
    static GenerateStops(...colors) {
        if (colors == null) { return []; }
        colors = colors.flat();// convert to proper array
        let stops = [];
        for (let i = 0; i < colors.length; i++) {
            if (colors[i] == null) { continue; }
            let newStop;
            let calculateOffset = true;
            if (Array.isArray(colors[i])) {
                // array
                newStop = new svgGradientStop();
                switch (colors[i].length) {
                    case 0:
                        // empty array, continue
                        continue;
                    default:
                    case 3:
                        newStop.offset = colors[i][2];
                        calculateOffset = false;
                    case 2:
                        newStop.opacity = colors[i][1];
                    case 1:
                        if (colors[i][0] == null || typeof colors[i][0] == 'string') {
                            newStop.color = colors[i][0];
                        } else {
                            console.warn(`invalid color type ${typeof colors[i][0]}, value ${colors[i][0]}, must be string or null, using default color`);
                            newStop.color = svg.default.GRADIENT_STOP_COLOR;
                        }
                        break;
                }
            } else if (typeof colors[i] == 'string') {
                // string only, use as color
                newStop = new svgGradientStop(colors[i]);
            } else if (colors[i] instanceof svgGradientStop) {
                // it IS a gradient stop already, just add it to the array
                newStop = colors[i];
                // check if stop offset is default value
                calculateOffset = colors[i].offset == svg.default.GRADIENT_STOP_OFFSET;
            } else {
                // invalid type
                console.warn(`invalid type ${typeof colors[i]}, must be string/array/svgGradientStop (null is skipped), can't create svgGradientStop`);
                continue;
            }
            // check for offset calculation 
            if (calculateOffset) {
                newStop.offset = `${(i / (colors.length - 1)) * 100}%`;
            }
            stops.push(newStop);
        }
        return stops;
    }
    /**
     * 
     * @param {string} color 
     * @param {number|string} opacity 
     * @param {number|string} offset 
     */
    static GenerateStop(color, opacity, offset) {

    }
}