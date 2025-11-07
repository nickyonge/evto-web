import { arePoints, EnsureToNumber, isBlank, isPoint, Lerp, RotatePointsAroundPivot, StringContainsNumeric, StringNumericDivider, StringOnlyNumeric, StringToNumber, toPoint } from '../lilutils';
import * as svg from './index';

/** Class representing an SVG defined linear or radial gradient */
export class svgGradient extends svg.definition {

    /**
     * Templates for gradient arrays 
     * @readonly
     * @enum {string[]}
     */
    static templates = {
        bw: ['black', 'white'],
        rainbow: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
        lightrainbow: ['lightcoral', 'sandybrown', 'moccasin', 'lightgreen', 'paleturquoise', 'plum'],
        softrainbow: ['indianred', 'coral', 'khaki', 'mediumseagreen', 'cornflowerblue', 'mediumpurple'],
        trans: ['skyblue', 'white', 'pink', 'white', 'skyblue'],
    };

    /** if true, html outputs `radialGradient`; if false, `linearGradient` @type {boolean} */
    get isRadial() { return this.#_isRadial; }
    set isRadial(v) { let prev = this.#_isRadial; this.#_isRadial = v; this.#changed('isRadial', v, prev); }
    #_isRadial = svg.defaults.GRADIENT_ISRADIAL;

    /** 
     * How sharp is the gradient? If 0, fully smooth. If 1, completely sharp. 
     * Clamped between 0 and 1. @type {number} */
    get sharpness() { return this.#_sharpness; }
    set sharpness(v) { let prev = this.#_sharpness; this.#_sharpness = v; this.#changed('sharpness', v, prev); }
    #_sharpness = svg.defaults.GRADIENT_SHARPNESS;
    get mirror() { return this.#_mirror; }
    set mirror(v) { let prev = this.#_mirror; this.#_mirror = v; this.#changed('mirror', v, prev); }
    #_mirror = svg.defaults.GRADIENT_MIRROR;
    get scale() { return this.#_scale; }
    set scale(v) { let prev = this.#_scale; this.#_scale = v; this.#changed('scale', v, prev); }
    #_scale = svg.defaults.GRADIENT_SCALE;
    /** angle, in degrees, a linear gradient should be rotated by. Does not affect radial gradients. 
     * 
     * **NOTE:** also affects xy12 properties, but only invokes {@link svg.element.onChange} once, for property `angle`. 
     * @type {number} */
    get angle() { return this.#_angle; }
    set angle(v) { let prev = this.#_angle; this.#_angle = v; this.#changed('angle', v, prev); }
    #_angle = svg.defaults.GRADIENT_ANGLE;
    /**
     * Pivot XY {@link isPoint point} around which angle values will be rotated  
     * @see {@link isPoint} XY point object reference
     * @see {@linkcode svg.defaults.GRADIENT_ANGLEPIVOTPOINT GRADIENT_ANGLEPIVOTPOINT}
     * @type {{x:number, y:number}}
     */
    get anglePivotPoint() { return this.#_anglePivotPoint; }
    set anglePivotPoint(v) { let prev = this.#_anglePivotPoint; this.#_anglePivotPoint = v; this.#changed('anglePivotPoint', v, prev); }
    #_anglePivotPoint = svg.defaults.GRADIENT_ANGLEPIVOTPOINT;

    /** Overall opacity for this gradient. 
     * Multiplied to the opacity of each {@link svgGradientStop} in {@link stops}.
     * Should typically be between values 0-1, `null` is considered 1. */
    get opacity() { return this.#_opacity; }
    set opacity(v) { let prev = this.#_opacity; this.#_opacity = v; this.#changed('opacity', v, prev); }
    #_opacity = svg.defaults.GRADIENT_OPACITY;

    get x1() { return this.#_x1; }
    set x1(v) { let prev = this.#_x1; this.#_x1 = v; this.#changed('x1', v, prev); }
    #_x1 = svg.defaults.GRADIENT_X1;
    get y1() { return this.#_y1; }
    set y1(v) { let prev = this.#_y1; this.#_y1 = v; this.#changed('y1', v, prev); }
    #_y1 = svg.defaults.GRADIENT_Y1;
    get x2() { return this.#_x2; }
    set x2(v) { let prev = this.#_x2; this.#_x2 = v; this.#changed('x2', v, prev); }
    #_x2 = svg.defaults.GRADIENT_X2;
    get y2() { return this.#_y2; }
    set y2(v) { let prev = this.#_y2; this.#_y2 = v; this.#changed('y2', v, prev); }
    #_y2 = svg.defaults.GRADIENT_Y2;

    get #x1Default() { return this.x1 == null ? svg.defaults.GRADIENT_X1_SCALEDEFAULT : this.x1; }
    get #y1Default() { return this.y1 == null ? svg.defaults.GRADIENT_Y1_SCALEDEFAULT : this.y1; }
    get #x2Default() { return this.x2 == null ? svg.defaults.GRADIENT_X2_SCALEDEFAULT : this.x2; }
    get #y2Default() { return this.y2 == null ? svg.defaults.GRADIENT_Y2_SCALEDEFAULT : this.y2; }

    /** array for gradient stops @type {svgGradientStop[]} */
    get stops() { return this.#_stops; }
    set stops(v) {
        if (v == null) { return; }
        let prev = this.#_stops;
        this.#_stops = v;
        this.#_stops.name = 'definitions';
        this.#_stops['parent'] = this;
        this.#_stops.onChange = this.#arrayChanged;
        v.forEach(stop => { stop.parent = this; });
        this.#changed('stops', v, prev);
    }
    #_stops;

    /** radial only, X coord at gradient start circle, convenience, simply gets/sets {@link x1} @type {number|string} */
    get fx() { return this.x1; }
    set fx(i) { let prev = this.#_x1; this.#_x1 = i; this.#changed('fx', i, prev); }
    /** radial only, Y coord at gradient start circle, convenience, simply gets/sets {@link y1} @type {number|string} */
    get fy() { return this.y1; }
    set fy(i) { let prev = this.#_y1; this.#_y1 = i; this.#changed('fy', i, prev); }
    /** radial only, X coord at gradient end circle, convenience, simply gets/sets {@link x2} @type {number|string} */
    get cx() { return this.x2; }
    set cx(i) { let prev = this.#_x2; this.#_x2 = i; this.#changed('cx', i, prev); }
    /** radial only, Y coord at gradient end circle, convenience, simply gets/sets {@link y2} @type {number|string} */
    get cy() { return this.y2; }
    set cy(i) { let prev = this.#_y2; this.#_y2 = i; this.#changed('cy', i, prev); }

    /** radial-only, radius at end of the gradient @type {number|string} */
    get fr() { return this.#_fr; }
    set fr(v) { let prev = this.#_fr; this.#_fr = v; this.#changed('fr', v, prev); }
    #_fr = svg.defaults.GRADIENT_FR;
    /** radial-only, radius at end of the gradient @type {number|string} */
    get r() { return this.#_r; }
    set r(v) { let prev = this.#_r; this.#_r = v; this.#changed('r', v, prev); }
    #_r = svg.defaults.GRADIENT_R;

    get gradientUnits() { return this.#_gradientUnits; }
    set gradientUnits(v) { let prev = this.#_gradientUnits; this.#_gradientUnits = v; this.#changed('gradientUnits', v, prev); }
    #_gradientUnits = svg.defaults.GRADIENT_UNITS;
    get gradientTransform() { return this.#_gradientTransform; }
    set gradientTransform(v) { let prev = this.#_gradientTransform; this.#_gradientTransform = v; this.#changed('gradientTransform', v, prev); }
    #_gradientTransform = svg.defaults.GRADIENT_TRANSFORM;
    get spreadMethod() { return this.#_spreadMethod; }
    set spreadMethod(v) { let prev = this.#_spreadMethod; this.#_spreadMethod = v; this.#changed('spreadMethod', v, prev); }
    #_spreadMethod = svg.defaults.GRADIENT_SPREADMETHOD;
    get href() { return this.#_href; }
    set href(v) { let prev = this.#_href; this.#_href = v; this.#changed('href', v, prev); }
    #_href = svg.defaults.GRADIENT_HREF;

    /** 
     * SVG parent {@link svg.asset asset}, assigned by the parent 
     * @returns {svg.asset} */
    get parent() { return this.#_parent; }
    set parent(v) {
        if (this.parent == v) { return; }
        let prev = this.#_parent;
        this.#_parent = v;
        if (!this.#_firstParentAssigned) {
            this.#_firstParentAssigned = true;
        } else {
            this.#changed('parent', v, prev);
        }
    }
    /** @type {svg.asset} */
    #_parent = null;
    /** local flag for first gradient parent assignment @type {boolean} */
    #_firstParentAssigned = false;

    /**
     * 
     * @param {string} id 
     * @param {boolean} isRadial 
     * @param  {spreadString} colors 
     */
    constructor(id, isRadial = svg.defaults.GRADIENT_ISRADIAL, ...colors) {
        super(id, svgGradient.GetGradientTypeFrom(isRadial));
        this.isRadial = isRadial;
        colors = svg.defaults.EnsureGradientDefaultColors(...colors);
        this.SetStops(...colors);
    }

    /**
     * Scale the given numeric/representative value by 
     * this gradient's {@linkcode scale} property. Preserves 
     * non-numeric text, eg with `scale=2`, `10px` becomes `20px`.
     * 
     * For a linear gradient, multiplies the {@linkcode x1}, 
     * {@linkcode y1}, {@linkcode x2}, and {@linkcode y2} values. 
     * 
     * For a radial gradient, multiplies the {@linkcode r}
     * and {@linkcode fr} values.
     * @param {number|string} value value to scale
     * @param {number|string} [defaultValue = 0] default value if scaling is unsuccessful (will also attempt to scale this value)
     * @returns {number|string}
     */
    ScaleValue(value, defaultValue = null) {
        // TODO: replace duplicate code in ScaleValue with DeconstructNumericParam and process there 
        // Issue URL: https://github.com/nickyonge/evto-web/issues/50
        // no need to scale if scale is 1
        if (this.scale == 1) { return value; }
        else if (this.scale < 0) {
            // negative values are invalid, error 
            console.error(`ERROR: scale cannot be negative, current value is ${this.scale}, can't scale value ${value}, returning null`, this);
            return null;
        }
        if (value == null) {
            // value is null, return the scaled defaultValue or just null 
            if (defaultValue == null) { return null; }
            return this.ScaleValue(defaultValue, null);
        }
        switch (typeof value) {
            case 'number':
                // number - simply multiply and return 
                return (value * this.scale).toMax();
            case 'string':
                // string - remove non-numeric chars 
                if (isBlank(value)) { return value; } // return value '' as-is
                if (StringContainsNumeric(value)) {
                    // yup, string contains numbers alright 
                    if (StringOnlyNumeric(value)) {
                        // ONLY numbers, convert to number, multiply, return
                        return (StringToNumber(value) * this.scale).toMax();
                    }
                    // split into alternating array 
                    let a = StringNumericDivider(value);
                    value = '';
                    for (let i = 0; i < a.length; i++) {
                        if (a[i] == null) { continue; }
                        switch (typeof a[i]) {
                            case 'string':
                                value += a[i];
                                break;
                            case 'number':
                                let aScale = this.scale * /** @type {number} */ (a[i]);
                                value += aScale.toMax();
                                break;
                        }
                    }
                }
                // done - either string contained no numbers, or if it did, they've been scaled  
                break;
            case 'boolean':
                // boolean value, don't convert it to a 0 or 1, just return it
                return value;
            default:
                // other type - attempt to coerce to number, and return as string
                const v = Number(value);
                if (v == null || typeof v != 'number' || !Number.isFinite(v)) {
                    return value; // invalid number output 
                }
                return (v * this.scale).toMax();
        }
        return value;
    }

    /**
     * Gets the string tag associated with this gradient's type, 
     * either `"radialGradient"` or `"linearGradient"`.
     * @see {@linkcode svgGradient.isRadial} Flag that determines the returned type 
     * @returns {string}
     */
    get gradientType() { return svgGradient.GetGradientTypeFrom(this.isRadial); }
    /**
     * Gets the string tag associated with this gradient type, 
     * either `"radialGradient"` or `"linearGradient"`
     * @param {boolean} isRadial Local `isRadial` ref. Also see {@linkcode svgGradient.prototype.isRadial svgGradient.isRadial}
     * @returns {string}
     */
    static GetGradientTypeFrom(isRadial) { return isRadial ? 'radialGradient' : 'linearGradient'; }


    get html() {
        // collect data, generate base gradient element 
        let d = this.data;
        let newGradient = `<${this.gradientType}${isBlank(d) ? '' : ` ${d}`}>`;
        if (svg.config.HTML_NEWLINE) { newGradient += '\n'; }
        // iterate through stops 
        if (this.stops != null && this.stops.length > 0) {
            let sharpIncrement = 0;
            // apply mirroring, reverse stops array 
            if (this.mirror) { this.stops = this.stops.reverse(); }
            // apply iterated stops 
            let sharpness = EnsureToNumber(this.sharpness).clamp(0, 1);
            for (let i = 0; i < this.stops.length; i++) {
                if (this.stops[i] == null) { continue; }
                // check for auto offset calculation, changing 'auto' to a linearly-assigned % based on array size 
                if (sharpness > 0) {
                    let initialOffset = this.stops[i].offset;
                    // sharp gradient - add 1 to entire length, duplicate non-edge gradients, offset the offsets 
                    let newStop = svgGradientStop.Clone(this.stops[i]);
                    let currentOffset = (sharpIncrement / this.stops.length) * 100;
                    sharpIncrement++;
                    let newOffset = (sharpIncrement / this.stops.length) * 100;
                    if (sharpness < 1) {
                        let smoothOffset = (i / (this.stops.length - 1)) * 100;
                        currentOffset = Lerp(smoothOffset, currentOffset, sharpness);
                        newOffset = Lerp(smoothOffset, newOffset, sharpness);
                    }
                    this.stops[i].offset = `${currentOffset.toMax()}%`;
                    newStop.offset = `${newOffset.toMax()}%`;
                    let h1 = this.stops[i].html;
                    let h2 = newStop.html;
                    if (!isBlank(h1)) {
                        if (svg.config.HTML_INDENT) { newGradient += '\t'; }
                        newGradient += h1;
                        if (svg.config.HTML_NEWLINE) { newGradient += '\n'; }
                    }
                    if (!isBlank(h2)) {
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
                        let offset = (i / (this.stops.length - 1)) * 100;
                        this.stops[i].offset = `${offset.toMax()}%`;
                    }
                    let h = this.stops[i].html;
                    // ensure offset value is reset 
                    if (autoOffset) { this.stops[i].offset = 'auto'; }
                    if (!isBlank(h)) {
                        if (svg.config.HTML_INDENT) { newGradient += '\t'; }
                        newGradient += h;
                        if (svg.config.HTML_NEWLINE) { newGradient += '\n'; }
                    }
                }
            }
            // undo mirroring 
            if (this.mirror) { this.stops = this.stops.reverse(); }
        }
        // done! return new gradient html 
        return `${newGradient}</${this.gradientType}>`;
    }

    get data() {
        // process angle (must be done before collecting data)
        const ProcessAngle = () => {
            if (this.isRadial || this.angle == 0) { return false; } // skip, not modifying the angle
            // determine if all x1/2 y1/2 coords are valid 
            let deX1 = this.DeconstructNumericParam(this.x1, svg.defaults.GRADIENT_X1_SCALEDEFAULT);
            let deY1 = this.DeconstructNumericParam(this.y1, svg.defaults.GRADIENT_Y1_SCALEDEFAULT);
            let deX2 = this.DeconstructNumericParam(this.x2, svg.defaults.GRADIENT_X2_SCALEDEFAULT);
            let deY2 = this.DeconstructNumericParam(this.y2, svg.defaults.GRADIENT_Y2_SCALEDEFAULT);
            // determine if all coordinates are the same type and non-null
            if (deX1 == null || deY1 == null || deX2 == null || deY2 == null) { return false; } // at least one param is null 
            if (deX1.length != deY1.length || deX1.length != deX2.length || deX2.length != deY2.length) { return false; }
            let numberIndices = []; // store indices of all numbers found 
            for (let i = 0; i < deX1.length; i++) {
                if (typeof deX1[i] != typeof deY1[i] || typeof deX1[i] != typeof deX2[i] || typeof deX2[i] != typeof deY2[i]) { return false; } // data type mismatch
                // all string values must match 
                switch (typeof deX1[i]) {
                    case 'string':
                        if (deX1[i] != deY1[i] || deX1[i] != deX2[i] || deX2[i] != deY2[i]) { return false; } // unit type mismatch
                        break;
                    case 'number':
                        numberIndices.push(i);
                        break;
                    default:
                        console.warn(`WARNING: non-number, non-string, type: ${typeof deX1[i]} issue with DeconstructNumericParam? ignoring`, deX1, this);
                        continue;
                }
            }
            if (numberIndices.length == 0) { return false; } // no numbers to calculate
            // NOW do calculations, so we don't calculate a bunch of numbers before finding out half are % and half are px 
            for (let i = 0; i < numberIndices.length; i++) {
                let n = numberIndices[i];
                let nx1 = /** @type {number} */ (deX1[n]);
                let ny1 = /** @type {number} */ (deY1[n]);
                let nx2 = /** @type {number} */ (deX2[n]);
                let ny2 = /** @type {number} */ (deY2[n]);
                let xy1 = toPoint(nx1, ny1);
                let xy2 = toPoint(nx2, ny2);
                // rotate around pivot
                let rotated = RotatePointsAroundPivot([xy1, xy2], this.anglePivotPoint, this.angle);
                // reassign points
                xy1 = rotated[0];
                xy2 = rotated[1];
                deX1[n] = xy1.x;
                deY1[n] = xy1.y;
                deX2[n] = xy2.x;
                deY2[n] = xy2.y;
            }
            let xyArray = [
                this.ReconstructNumericParam(deX1),
                this.ReconstructNumericParam(deY1),
                this.ReconstructNumericParam(deX2),
                this.ReconstructNumericParam(deY2)];
            this.xy12 = xyArray;
            return true;
        };

        this.__suppressOnChange = true;
        let xyOrig = this.xy12;
        let useAngle = ProcessAngle();
        this.__suppressOnChange = false;

        // collect data 
        let d = this.isRadial ? this.ParseData([
            // radial gradient 
            ['fx', this.fx],
            ['fy', this.fy],
            ['cx', this.cx],
            ['cy', this.cy],
            ['fr', this.ScaleValue(this.fr, svg.defaults.GRADIENT_FR_SCALEDEFAULT)],
            ['r', this.ScaleValue(this.r, svg.defaults.GRADIENT_R_SCALEDEFAULT)],
            ['gradientUnits', this.gradientUnits],
            ['gradientTransform', this.gradientTransform],
            ['spreadMethod', this.spreadMethod],
            ['href', this.href]
        ]) : this.ParseData([
            // linear gradient 
            ['x1', this.ScaleValue(this.x1, svg.defaults.GRADIENT_X1_SCALEDEFAULT)],
            ['y1', this.ScaleValue(this.y1, svg.defaults.GRADIENT_Y1_SCALEDEFAULT)],
            ['x2', this.ScaleValue(this.x2, svg.defaults.GRADIENT_X2_SCALEDEFAULT)],
            ['y2', this.ScaleValue(this.y2, svg.defaults.GRADIENT_Y2_SCALEDEFAULT)],
            ['gradientUnits', this.gradientUnits],
            ['gradientTransform', this.gradientTransform],
            ['spreadMethod', this.spreadMethod],
            ['href', this.href]
        ]);

        // undo angle 
        if (useAngle) {
            this.__suppressOnChange = true;
            this.xy12 = xyOrig;
            this.__suppressOnChange = false;
        }

        // done, return data 
        return d;
    }

    /**
     * get/set X1/2 and Y1/2 values (or FX/Y and CX/Y on radial gradient).
     * - Get: returns four-number array, `[x1, y1, x2, y2]`
     * - Set: set by one of the following: 
     *   - number `[x1, y1, x2, y2]`
     *   - comma-split string `"x1,x2,y1,y2"`
     *   - XY {@link toPoint point} objects array `[{x:x1,y:y1},{x:x2,y:y2}]`
     * 
     * **NOTE:** `null` setter values are accepted 
     * @returns {[number,number,number,number]}
     */
    get xy12() { return [this.x1, this.y1, this.x2, this.y2]; }
    /** @param {*} values should be a string, array of numbers, or array of XY points */
    set xy12(values) {
        if (values == null) { this.x1 = null; this.y1 = null; this.x2 = null; this.y2 = null; }
        if (Array.isArray(values)) {
            if (values.length == 0) { this.xy12 = null; }// no values, reset all
            // check values in order
            if (values.length >= 2 && arePoints(values[0], values[1])) {
                this.xy12 = [values[0].x, values[0].y, values[1].x, values[1].y];
                return;
            }
            if (values.length < 4) { values.length = 4; }
            for (let i = 0; i < values.length; i++) {
                // direct null assignment, don't wanna screw around with undefined
                if (values[i] == null) { values[i] = null; }
                if (isPoint(values[i])) {
                    values[i + 1] = values[i].y;
                    values[i] = values[i].x;
                    i++;
                    continue;
                }
            }
            this.x1 = values[0];
            this.y1 = values[1];
            this.x2 = values[2];
            this.y2 = values[3];
        } else if (typeof values == 'string') {
            if (values.indexOf(',') >= 0) {
                this.xy12 = values.split(',');
                return;
            }
            console.warn(`WARNING: couldn't set xy12 to values: ${values}`, this);
            return;
        }
    }
    /**
     * get/set FX/Y and CX/Y values (or X1/2 and Y1/2 on radial gradient).
     * - Get: returns four-number array, `[fx, fy, cx, cy]`
     * - Set: set by one of the following: 
     *   - number `[fx, fy, cx, cy]`
     *   - comma-split string `"fx,cx,fy,cy"`
     *   - XY {@link toPoint point} objects array `[{x:fx,y:fy},{x:cx,y:cy}]`
     * 
     * **NOTE:** `null` setter values are accepted 
     * @returns {[number,number,number,number]}
     */
    get fcxy() { return this.xy12; }
    set fcxy(values) { this.xy12 = values; }

    /** string output for X1/2 and Y1/2 values (or FX/Y and CX/Y on radial gradient) @returns {string} */
    get xy12String() {
        return this.isRadial ?
            `fx:${this.fx},fy:${this.fy},cx:${this.cx},cy:${this.cy}` :
            `x1:${this.x1},y1:${this.y1},x2:${this.x2},y2:${this.y2}`;
    }
    /** string output for FX/Y and CX/Y values (or X1/2 and Y1/2 on linear gradient) @returns {string} */
    get fcxyString() { return this.xy12String; }

    /** string output for X1/2 and Y1/2 values (or FX/Y and CX/Y on radial gradient) with local default backups if `null` @returns {string} */
    get #xy12Default() {
        return this.isRadial ?
            `fx:${this.#x1Default},fy:${this.#y1Default},cx:${this.#x2Default},cy:${this.#y2Default}` :
            `x1:${this.#x1Default},y1:${this.#y1Default},x2:${this.#x2Default},y2:${this.#y2Default}`;
    }
    /** string output for FX/Y and CX/Y values (or X1/2 and Y1/2 on linear gradient) with local default backups if `null` @returns {string} */
    get #fcxyDefault() { return this.#xy12Default; }

    AddStop(stop) {
        if (stop == null) { return stop; }
        let prev = this.stops;
        this.stops.push(stop);
        stop.parent = this;
        if (!this.stops.hasOwnProperty('onChange')) {
            this.#changed('stops#push', this.stops, prev);
        }
        return stop;
    }
    AddNewStop(color = svg.defaults.GRADIENT_STOP_COLOR, opacity = svg.defaults.GRADIENT_STOP_OPACITY, offset = svg.defaults.GRADIENT_STOP_OFFSET) {
        let prev = this.stops;
        let stop = new svgGradientStop(color, opacity, offset);
        this.stops.push(stop);
        stop.parent = this;
        if (!this.stops.hasOwnProperty('onChange')) {
            this.#changed('stops#push', this.stops, prev);
        }
        return stop;
    }

    SetStops(...stops) {
        this.stops = svgGradientStop.GenerateStops(...stops);
    }
    SetStop(index, stop) {
        return this.#setStop(index, stop);
    }
    SetNewStop(index, color = svg.defaults.GRADIENT_STOP_COLOR, opacity = svg.defaults.GRADIENT_STOP_OPACITY, offset = svg.defaults.GRADIENT_STOP_OFFSET) {
        let stop = this.GetStop(index);
        if (stop == null) {
            stop = new svgGradientStop(color, opacity, offset);
            return this.#setStop(index, stop);
        }
        stop.color = color;
        stop.opacity = opacity;
        stop.offset = offset;
        return stop;
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
        let prev = this.stops;
        if (this.stops.length < index + 1) { this.stops.length = index + 1; }
        this.stops[index] = stop;
        stop.parent = this;
        this.#changed('stops#index', this.stops, prev);
        return stop;
    }

    GetStop(index) {
        if (index < 0 || index >= this.stops.length) { return null; }
        return this.stops[index];
    }

    InsertStop(index, stop) {
        return this.#insertStop(index, stop);
    }
    InsertNewStop(index, color = svg.defaults.GRADIENT_STOP_COLOR, opacity = svg.defaults.GRADIENT_STOP_OPACITY, offset = svg.defaults.GRADIENT_STOP_OFFSET) {
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
        let prev = this.stops;
        if (this.stops.length < index + 1) {
            this.stops.length = index + 1;
            this.stops[index] = stop;
            stop.parent = this;
            this.#changed('stops#index', this.stops, prev);
        } else {
            this.stops.splice(index, 0, stop);
            stop.parent = this;
            if (!this.stops.hasOwnProperty('onChange')) {
                this.#changed('stops#splice', this.stops, prev);
            }
        }
        return stop;
    }

    // alt spellings for convenience 
    AddColor(color) { return this.AddStop(color); }
    AddNewColor(color = svg.defaults.GRADIENT_STOP_COLOR, opacity = svg.defaults.GRADIENT_STOP_OPACITY, offset = svg.defaults.GRADIENT_STOP_OFFSET) { return this.AddNewStop(color, opacity, offset); }
    SetColors(...colors) { this.SetStops(...colors); }
    SetColor(index, color) { return this.SetStop(index, color); }
    SetNewColor(index, color = svg.defaults.GRADIENT_STOP_COLOR, opacity = svg.defaults.GRADIENT_STOP_OPACITY, offset = svg.defaults.GRADIENT_STOP_OFFSET) { return this.SetNewStop(index, color, opacity, offset); }
    GetColor(index) { return this.GetStop(index); }
    InsertColor(index, stop) { return this.InsertStop(index, stop); }
    InsertNewColor(index, color = svg.defaults.GRADIENT_STOP_COLOR, opacity = svg.defaults.GRADIENT_STOP_OPACITY, offset = svg.defaults.GRADIENT_STOP_OFFSET) { return this.InsertNewStop(index, color, opacity, offset); }

    // Local change and bubble-on-change settings 
    /** Should changes to this asset bubble up to its {@link svgGradient.parent parent} asset? @type {boolean} */
    get bubbleOnChange() { return this.#_bubbleOnChange; }
    set bubbleOnChange(v) { let prev = this.#_bubbleOnChange; this.#_bubbleOnChange = v; this.#changed('bubbleOnChange', v, prev); }
    #_bubbleOnChange = svg.defaults.BUBBLE_ONCHANGE;

    /** Callback for {@linkplain Array.prototype.onChange onChange} for local arrays. Omitted `parameters` param. @param {string} type type of method called @param {[]} source array object @param {any} returnValue returned value from method */
    #arrayChanged(type, source, returnValue) { if (source.hasOwnProperty('parent')) { source['parent'].#changed?.(`${source.name}#${type}`, source, returnValue); } };
    /** Local changed callback that calls {@link onChange} on this element and (if {@linkcode bubbleOnChange} is `true`) its  {@link svgGradient.parent parent}. @type {svg.onChange} */
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
}

class svgGradientStop extends svg.element {
    get color() { return this.#_color; }
    set color(v) { let prev = this.#_color; this.#_color = v; this.#changed('color', v, prev); }
    #_color = svg.defaults.GRADIENT_STOP_COLOR;
    /** 
     * Get/set opacity of this gradient. Should be between 0-1. Null = 1.
     * Multiplied with the {@link parent} gradent {@link svgGradient.opacity opacity}, if its value is assigned. 
     * @see {@linkcode opacityInherited this.opacityInherited} for opacity value that also accounts for parent opacity.*/
    get opacity() { return this.#_opacity; }
    set opacity(v) { let prev = this.#_opacity; this.#_opacity = v; this.#changed('opacity', v, prev); }
    #_opacity = svg.defaults.GRADIENT_STOP_OPACITY;
    get offset() { return this.#_offset; }
    set offset(v) { let prev = this.#_offset; this.#_offset = v; this.#changed('offset', v, prev); }
    #_offset = svg.defaults.GRADIENT_STOP_OFFSET;

    /** 
     * SVG parent {@link svgGradient gradient}, assigned by the gradient 
     * @returns {svgGradient} */
    get parent() { return this.#_parent; }
    set parent(v) {
        if (this.parent == v) { return; }
        let prev = this.#_parent;
        this.#_parent = v;
        if (!this.#_firstParentAssigned) {
            this.#_firstParentAssigned = true;
        } else {
            this.#changed('parent', v, prev);
        }
    }
    /** @type {svg.gradient} */
    #_parent = null;
    /** local flag for first gradient stop parent assignment @type {boolean} */
    #_firstParentAssigned = false;

    constructor(color = svg.defaults.GRADIENT_STOP_COLOR, opacity = svg.defaults.GRADIENT_STOP_OPACITY, offset = svg.defaults.GRADIENT_STOP_OFFSET) {
        super();
        this.color = color;
        this.opacity = opacity;
        this.offset = offset;
    }
    get html() { return `<stop ${this.data} />`; }
    get data() {
        return this.ParseData([
            ['stop-color', this.color],
            ['stop-opacity', this.opacityInherited],
            ['offset', this.offset]
        ]);
    }

    /**
     * Gets this stop's opacity, and also multiplies it by the 
     * {@link parent} gradent {@link svgGradient.opacity opacity},
     * as needed. 
     * 
     * Returns `null` if the opacity value is exactly 1, because
     * 1 is the implied default value. This will return `null` even if 
     * opacity value is assigned to 1, and even as a result of the parent
     * opacity calculation. (Eg, if stop opacity is 0.5 and parent 
     * opacity is 2, the result will be 1, and this will return `null`.)
     * @returns {Number|null}
     */
    get opacityInherited() {
        function calculateInheritedOpacity(opacity, parentOpacity) {
            if (parentOpacity == null || parentOpacity == 1 ||
                (typeof parentOpacity)?.toLowerCase() !== 'number') { return opacity; }
            if (opacity == null && (typeof parentOpacity)?.toLowerCase() === 'number') { return parentOpacity; }
            return opacity * parentOpacity;
        }
        let opacity = calculateInheritedOpacity(this.opacity, this.parent?.opacity);
        return opacity === 1 ? null : opacity;
    }

    /**
     * Converts an array of colours (and optionally opacities and offsets) to an array of 
     * {@link svgGradientStop svgGradientStops}. If offsets aren't provided, linearly assigns
     * it based on the length of the supplied array.
     * @see {@link GenerateStop}
     * @param {spreadValue} colors 
     * Array of 1-3 values representing `[color,opacity,offset]`. Arrays and strings can
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
        // TODO: re-use existing stops instead of generating new ones where possible
        // Issue URL: https://github.com/nickyonge/evto-web/issues/56
        // detect and flatten nested array 
        // colors = colors.flattenSpread(); // flattenSpread might work but also might screw with array nesting, dw for now 
        let failsafe = 999;
        while (colors.length == 1 && Array.isArray(colors[0])) {
            colors = colors.flat();
            failsafe--;
            if (failsafe <= 0) { console.error("ERROR: should NOT have been able to hit this, investigate", colors, this); break; }
        }
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
                            newStop.color = svg.defaults.GRADIENT_STOP_COLOR;
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
     * @param {boolean} [cloneParentage=true] also clone initial stop's {@linkcode parent} value? Default true 
     * @returns {svgGradientStop|null} cloned stop, or null if given stop is null
     */
    static Clone(stop, cloneParentage = true) {
        if (stop == null) { return null; }
        let newStop = new svgGradientStop(stop.color, stop.opacity, stop.offset);
        if (cloneParentage) { newStop.parent = stop.parent; }
        return newStop;
    }

    // Local change and bubble-on-change settings 
    /** Should changes to this asset bubble up to its {@link svgGradientStop.parent parent} asset? @type {boolean} */
    get bubbleOnChange() { return this.#_bubbleOnChange; }
    set bubbleOnChange(v) { let prev = this.#_bubbleOnChange; this.#_bubbleOnChange = v; this.#changed('bubbleOnChange', v, prev); }
    #_bubbleOnChange = svg.defaults.BUBBLE_ONCHANGE;

    /** Local changed callback that calls {@link onChange} on both this element and its {@link svgGradientStop.parent parent}. @type {svg.onChange} */
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
}