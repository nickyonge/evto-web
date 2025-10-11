import { isBlank } from '../lilutils';
import * as svg from './index';

/** Class representing an SVG defined linear or radial gradient */
export class svgGradient extends svg.element {

    /** if true, html outputs `radialGradient`; if false, `linearGradient` @type {boolean} */
    isRadial = svg.default.GRADIENT_ISRADIAL;

    /** if true, ignores given offsets and outputs a sharp-edged gradient @type {boolean} */
    sharpGradient = svg.default.GRADIENT_SHARPGRADIENT;

    x1 = svg.default.GRADIENT_X1;
    y1 = svg.default.GRADIENT_Y1;
    x2 = svg.default.GRADIENT_X2;
    y2 = svg.default.GRADIENT_Y2;

    /** array for gradient stops @type {svgGradientStop[]} */
    stops;

    /** radial only, X coord at gradient start circle, convenience, simply gets/sets {@link x1} @type {number|string} */
    get fx() { return this.x1; } set fx(i) { this.x1 = i; }
    /** radial only, Y coord at gradient start circle, convenience, simply gets/sets {@link y1} @type {number|string} */
    get fy() { return this.y1; } set fy(i) { this.y1 = i; }
    /** radial only, X coord at gradient end circle, convenience, simply gets/sets {@link x2} @type {number|string} */
    get cx() { return this.x2; } set cx(i) { this.x2 = i; }
    /** radial only, Y coord at gradient end circle, convenience, simply gets/sets {@link y2} @type {number|string} */
    get cy() { return this.y2; } set cy(i) { this.y2 = i; }

    /** radial-only, radius at end of the gradient @type {number|string} */
    fr = svg.default.GRADIENT_FR;
    /** radial-only, radius at end of the gradient @type {number|string} */
    r = svg.default.GRADIENT_R;

    gradientUnits = svg.default.GRADIENT_UNITS;
    gradientTransform = svg.default.GRADIENT_TRANSFORM;
    spreadMethod = svg.default.GRADIENT_SPREADMETHOD;
    href = svg.default.GRADIENT_HREF;

    constructor(id, isRadial = svg.default.GRADIENT_ISRADIAL, ...colors) {
        super();
        this.id = id;
        this.isRadial = isRadial;
        colors = svg.default.EnsureGradientDefaultColors(...colors);
        this.SetStops(...colors);
    }

    get type() { return this.isRadial ? 'radialGradient' : 'linearGradient'; }

    get html() {
        let d = this.data;
        let newGradient = `<${this.type}${isBlank(d) ? '' : ` ${d}`}>`;
        if (svg.config.HTML_NEWLINE) { newGradient += '\n'; }
        if (this.stops != null && this.stops.length > 0) {
            let initialLength = this.stops.length;
            let sharpIncrement = 0;
            for (let i = 0; i < this.stops.length; i++) {
                if (this.stops[i] == null) { continue; }
                // check for auto offset calculation, changing 'auto' to a linearly-assigned % based on array size 
                if (this.sharpGradient) {
                    let initialOffset = this.stops[i].offset;
                    // sharp gradient - add 1 to entire length, duplicate non-edge gradients, offset the offsets 
                    let newStop = svgGradientStop.Clone(this.stops[i]);
                    this.stops[i].offset = `${((sharpIncrement / initialLength) * 100).toMax()}%`;
                    sharpIncrement++;
                    newStop.offset = `${((sharpIncrement / initialLength) * 100).toMax()}%`;
                    let h1 = this.stops[i].html;
                    let h2 = newStop.html;
                    if (!isBlank.h1) {
                        if (svg.config.HTML_INDENT) { newGradient += '\t'; }
                        newGradient += h1;
                        if (svg.config.HTML_NEWLINE) { newGradient += '\n'; }
                    }
                    if (!isBlank.h2) {
                        if (svg.config.HTML_INDENT) { newGradient += '\t'; }
                        newGradient += h2;
                        if (svg.config.HTML_NEWLINE) { newGradient += '\n'; }
                    }
                    this.stops[i].offset = initialOffset;
                } else {
                    // non-sharp gradient
                    let autoOffset = typeof this.stops[i].offset == 'string' &&
                        this.stops[i].offset.toLowerCase().trim() == 'auto';
                    if (autoOffset) {
                        // smooth gradient 
                        this.stops[i].offset = `${((i / (this.stops.length - 1)) * 100).toMax()}%`;
                    }
                    let h = this.stops[i].html;
                    // ensure offset value is reset 
                    if (autoOffset) { this.stops[i].offset = 'auto'; }
                    if (!isBlank.h) {
                        if (svg.config.HTML_INDENT) { newGradient += '\t'; }
                        newGradient += h;
                        if (svg.config.HTML_NEWLINE) { newGradient += '\n'; }
                    }
                }
            }
        }
        return `${newGradient}</${this.type}>`;
    }
    get data() {
        return this.isRadial ? this.ParseData([
            // radial gradient 
            ['fx', this.fx],
            ['fy', this.fy],
            ['cx', this.cx],
            ['cy', this.cy],
            ['fr', this.fr],
            ['r', this.r],
            ['gradientUnits', this.gradientUnits],
            ['gradientTransform', this.gradientTransform],
            ['spreadMethod', this.spreadMethod],
            ['href', this.href]
        ]) : this.ParseData([
            // linear gradient 
            ['x1', this.x1],
            ['y1', this.y1],
            ['x2', this.x2],
            ['y2', this.y2],
            ['gradientUnits', this.gradientUnits],
            ['gradientTransform', this.gradientTransform],
            ['spreadMethod', this.spreadMethod],
            ['href', this.href]
        ]);
    }

    AddStop(stop) {
        if (stop != null) { this.stops.push(stop); }
        return stop;
    }
    AddStop(color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) {
        let stop = new svgGradientStop(color, opacity, offset);
        this.stops.push(stop);
        return stop;
    }

    SetStops(...stops) {
        this.stops = svgGradientStop.GenerateStops(...stops);
    }
    SetStop(index, stop) {
        return this.#setStop(index, stop);
    }
    SetStop(index, color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) {
        let stop = new svgGradientStop(color, opacity, offset);
        return this.#setStop(index, stop);
    }
    #setStop(index, stop) {
        // local reference to avoid recursion errors =_=
        if (index == -1) {
            for (let i = 0; i < this.stops.length; i++) {
                this.SetStop(i, stop);
            }
            return stop;
        }
        else if (index < -1) { return stop; }
        if (this.stops.length < index + 1) { this.stops.length = index + 1; }
        this.stops[index] = stop;
        return stop;
    }

    InsertStop(index, stop) {
        return this.#insertStop(index, stop);
    }
    InsertStop(index, color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) {
        let stop = new svgGradientStop(color, opacity, offset);
        return this.#insertStop(index, stop);
    }
    #insertStop(index, stop) {
        // local reference to avoid recursion errors =_=
        if (index == -1) {
            for (let i = 0; i < this.stops.length; i++) {
                this.SetStop(i, stop);
            }
            return stop;
        }
        else if (index < -1) { return stop; }
        if (this.stops.length < index + 1) {
            this.stops.length = index + 1;
            this.stops[index] = stop;
        } else {
            this.stops.splice(index, 0, stop);
        }
        return stop;
    }

    // alt spellings for convenience 
    AddColor(color) { return this.AddStop(color); }
    AddColor(color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) { return this.AddStop(color, opacity, offset); }
    SetColors(...colors) { this.SetStops(...colors); }
    SetColor(index, color) { return this.SetStop(index, color); }
    SetColor(index, color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) { return this.SetStop(index, color, opacity, offset); }
    InsertColor(index, stop) { return this.InsertColor(index, stop); }
    InsertColor(index, color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) { return this.InsertColor(index, color, opacity, offset); }

}

class svgGradientStop extends svg.element {
    color = svg.default.GRADIENT_STOP_COLOR;
    opacity = svg.default.GRADIENT_STOP_OPACITY;
    offset = svg.default.GRADIENT_STOP_OFFSET;
    constructor(color = svg.default.GRADIENT_STOP_COLOR, opacity = svg.default.GRADIENT_STOP_OPACITY, offset = svg.default.GRADIENT_STOP_OFFSET) {
        super();
        this.color = color;
        this.opacity = opacity;
        this.offset = offset;
    }
    get html() { return `<stop ${this.data} />`; }
    get data() {
        return this.ParseData([
            ['stop-color', this.color],
            ['stop-opacity', this.opacity],
            ['offset', this.offset]
        ]);
    }

    /**
     * Converts an array of colours (and optionally opacities and offsets) to an array of 
     * {@link svgGradientStop svgGradientStops}. If offsets aren't provided, linearly assigns
     * it based on the length of the supplied array.
     * @see {@link GenerateStop}
     * @param {[string]|[string,number|string]|[string,number|string,number|string]} colors 1D/2D
     * array of 1-3 values representing `[color,opacity,offset]`. Arrays and strings can
     * be intertwined, eg `[string,[string,number],string]`. Solo strings are colors.
     * Both `opacity` or `offset` are optional, and if omitted or null, are not assigned 
     * as `<stop>` attributes and instead skipped.
     * @returns {svgGradientStop[]} Array of {@link svgGradientStop} classes
     * @example gradientStops = svgGradientStop.GenerateStops('skyblue','pink','white','pink','skyblue');
     */
    static GenerateStops(...colors) {
        if (colors == null) { return []; }
        // colors = colors.flat(); // actually don't flatten, ...colors can contain strings alongside 2d arrays // // convert to proper array 
        let stops = [];
        for (let i = 0; i < colors.length; i++) {
            if (colors[i] == null) { continue; }
            let newStop;
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
            } else {
                // invalid type
                console.warn(`invalid type ${typeof colors[i]}, must be string/array/svgGradientStop (null is skipped), can't create svgGradientStop`);
                continue;
            }
            stops.push(newStop);
        }
        return stops;
    }

    /**
     * Creates a clone (duplicate) of the given svgGradientStop
     * @param {svgGradientStop} stop gradient stop to clone  
     * @returns {svgGradientStop|null} cloned stop, or null if given stop is null
     */
    static Clone(stop) {
        return stop == null ? null : new svgGradientStop(stop.color, stop.opacity, stop.offset);
    }
}