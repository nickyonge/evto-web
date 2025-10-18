import { isBlank } from '../lilutils';
import * as svg from './index';

// TODO add <use> as an svgShape
// Issue URL: https://github.com/nickyonge/evto-web/issues/47

const _RECT = 'rect';
const _CIRCLE = 'circle';
const _ELLIPSE = 'ellipse';
const _LINE = 'line';
const _POLYLINE = 'polyline';
const _POLYGON = 'polygon';
const _PATH = 'path';
const _ALL_SHAPES = [_RECT, _CIRCLE, _ELLIPSE,
    _LINE, _POLYLINE, _POLYGON, _PATH];

export class svgShape extends svg.element {
    /** 
     * SVG shape type, assigned in {@link svgShape} constructor.
     * @see {@linkcode _ALL_SHAPES}
     * @returns {string} */
    get type() { return this.#_type; }
    set type(v) { // can only set shape type once 
        if (this.type != null) { console.warn(`cannot reassign set shape type ${this.type} to ${v}`, this); return; }
        if (!IsValidShapeType(v)) { return; }
        this.#_type = v;
    }
    #_type = null;

    /** 
     * SVG parent {@link svg.asset asset}, assigned by the parent 
     * @returns {svg.asset} */
    get parent() { return this.#_parent; }
    set parent(v) {
        if (this.parent == v) { return; }
        this.#_parent = v;
        if (!this.#_firstParentAssigned) {
            this.#changed('parent', v);
            this.#_firstParentAssigned = true;
        }
    }
    /** @type {svg.asset} */
    #_parent = null;
    #_firstParentAssigned = false;
    /** Should changes to this asset bubble up to its {@link parent} asset? @type {boolean} */
    get bubbleOnChange() { return this.#_bubbleOnChange; }
    set bubbleOnChange(v) { this.#_bubbleOnChange = v; this.#changed('bubbleOnChange', v); }
    #_bubbleOnChange = svg.default.BUBBLEONCHANGE;

    get fill() { return this.#_fill; }
    set fill(v) { this.#_fill = v; console.log(v); this.onChange?.('fill', v); }
    #_fill = svg.default.FILL;
    get stroke() { return this.#_stroke; }
    set stroke(v) { this.#_stroke = v; this.#changed('stroke', v); }
    #_stroke = svg.default.STROKE;
    /** Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<[string, any]>} */
    get extraAttributes() { return this.#_extraAttributes; }
    set extraAttributes(v) { this.#_extraAttributes = v; this.#changed('extraAttributes', v); }
    #_extraAttributes = [];
    // TODO: svg shapes onChange callback for if extraAttributes array is modified, not just directly set 
    constructor(fill = svg.default.FILL) { super(); this.fill = fill; }
    get html() {
        if (this.type == null) {
            console.error("ERROR: can't get svgShape of null type, specify shape via subclass, returning null");
            return null;
        }
        return `<${this.type} ${this.data}/>`;
    }
    // get data() { return `${fill != null ? ` fill="${fill}"` : ''}${stroke != null ? ` stroke="${stroke}"` : ''}` }
    // get data() { return `${_pd('fill', this.fill)}${_pd('stroke', this.stroke)}` }
    get data() {
        let d = this.ParseData([
            ['fill', this.fill],
            ['stroke', this.stroke]]);
        // check for and include extraAttributes
        if (this.extraAttributes != null && this.extraAttributes.length > 0) {
            let ea = this.ParseData(this.extraAttributes);
            if (!isBlank(ea)) { d = `${d} ${ea}`; }
        }
        return d;
    }
    
    /**
     * Sets the {@linkcode fill} property to a URL pointing 
     * to the given targetID, typically an SVG definition, 
     * assigning `"url(#targetID)"`
     * @param {string} targetID ID of the url definition
     */
    set fillURL(targetID) {
        this.fill = targetID.startsWith('url(#') ? targetID : `url(#${targetID})`;
    }

    /**
     * @param {svg.gradient} gradient 
     */
    set fillGradient(gradient) {
        if (!gradient) { return; }
        if (isBlank(gradient.id)) {
            console.warn(`WARNING: can't assign a gradient without an ID to an SVG shape`, gradient, this);
            return;
        }
        this.fillURL = gradient.id;
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // shape 
export class svgRect extends svgShape {
    get x() { return this.#_x; }
    set x(v) { this.#_x = v; this.#changed('x', v); }
    #_x = svg.default.X;
    get y() { return this.#_y; }
    set y(v) { this.#_y = v; this.#changed('y', v); }
    #_y = svg.default.Y;
    get width() { return this.#_width; }
    set width(v) { this.#_width = v; this.#changed('width', v); }
    #_width = svg.default.WIDTH;
    get height() { return this.#_height; }
    set height(v) { this.#_height = v; this.#changed('height', v); }
    #_height = svg.default.HEIGHT;
    get rx() { return this.#_rx; }
    set rx(v) { this.#_rx = v; this.#changed('rx', v); }
    #_rx = svg.default.RECT_RX;
    get ry() { return this.#_ry; }
    set ry(v) { this.#_ry = v; this.#changed('ry', v); }
    #_ry = svg.default.RECT_RY;
    constructor(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT, fill = svg.default.FILL) {
        super(fill);
        this.type = _RECT;
        this.x = x; this.y = y; this.width = width; this.height = height;
    }
    get data() {
        // cast this shape's unique properties to data string
        let d = this.ParseData([
            ['x', this.x],
            ['y', this.y],
            ['width', this.width],
            ['height', this.height],
            ['rx', this.rx],
            ['ry', this.ry]]);
        // combine both this data and superclass data to array, filter null values, join w/ space 
        return [d, super.data].filter(Boolean).join(' ');
    }
    /**
     * Convert this rect to a `d` {@link svg.path path} attribute  
     * @param {boolean} [relativeStart=false] If false, start `d` path with an `M` command; if true, `m`
     * @param {boolean} [closePath=true] End `d` path with a `Z` command?
     * @returns {string} Path `d` attribute for a rectangle of the given parameters
     */
    AsPath(relativeStart = false, closePath = true) {
        return svg.gen.BoxPath(this.x, this.y, this.width, this.height, relativeStart, closePath);
    }
    /** sets both {@linkcode rx} and {@linkcode ry} corner radii @param {number} radius */
    set r(radius) { this.rx = radius; this.ry = radius; }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // rect 
export class svgCircle extends svgShape {
    get r() { return this.#_r; }
    set r(v) { this.#_r = v; this.#changed('r', v); }
    #_r = svg.default.R;
    get cx() { return this.#_cx; }
    set cx(v) { this.#_cx = v; this.#changed('cx', v); }
    #_cx = svg.default.CX;
    get cy() { return this.#_cy; }
    set cy(v) { this.#_cy = v; this.#changed('cy', v); }
    #_cy = svg.default.CY;
    constructor(r = svg.default.R, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL) {
        super(fill);
        this.type = _CIRCLE;
        this.r = r; this.cx = cx; this.cy = cy;
    }
    get data() {
        let d = this.ParseData([
            ['r', this.r],
            ['cx', this.cx],
            ['cy', this.cy]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // circle 
export class svgEllipse extends svgShape {
    get rx() { return this.#_rx; }
    set rx(v) { this.#_rx = v; this.#changed('rx', v); }
    #_rx = svg.default.ELLIPSE_RX;
    get ry() { return this.#_ry; }
    set ry(v) { this.#_ry = v; this.#changed('ry', v); }
    #_ry = svg.default.ELLIPSE_RY;
    get cx() { return this.#_cx; }
    set cx(v) { this.#_cx = v; this.#changed('cx', v); }
    #_cx = svg.default.CX;
    get cy() { return this.#_cy; }
    set cy(v) { this.#_cy = v; this.#changed('cy', v); }
    #_cy = svg.default.CY;
    constructor(rx = svg.default.ELLIPSE_RX, ry = svg.default.ELLIPSE_RY, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL) {
        super(fill);
        this.type = _ELLIPSE;
        this.rx = rx; this.ry = ry; this.cx = cx; this.cy = cy;
    }
    get data() {
        let d = this.ParseData([
            ['rx', this.rx],
            ['ry', this.ry],
            ['cx', this.cx],
            ['cy', this.cy]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // ellipse 
export class svgLine extends svgShape {
    get x1() { return this.#_x1; }
    set x1(v) { this.#_x1 = v; this.#changed('x1', v); }
    #_x1 = svg.default.X1;
    get y1() { return this.#_y1; }
    set y1(v) { this.#_y1 = v; this.#changed('y1', v); }
    #_y1 = svg.default.Y1;
    get x2() { return this.#_x2; }
    set x2(v) { this.#_x2 = v; this.#changed('x2', v); }
    #_x2 = svg.default.X2;
    get y2() { return this.#_y2; }
    set y2(v) { this.#_y2 = v; this.#changed('y2', v); }
    #_y2 = svg.default.Y2;
    constructor(x1 = svg.default.X1, y1 = svg.default.Y1, x2 = svg.default.X2, y2 = svg.default.Y2, fill = svg.default.FILL) {
        super(fill);
        this.type = _LINE;
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    }
    get data() {
        let d = this.ParseData([
            ['x1', this.x1],
            ['y1', this.y1],
            ['x2', this.x2],
            ['y2', this.y2]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // line 
export class svgPolyline extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    get points() { return this.#_points; }
    set points(v) { this.#_points = v; this.#changed('points', v); }
    #_points = svg.default.POINTS;
    constructor(points = svg.default.POINTS, fill = svg.default.FILL) {
        super(fill);
        this.type = _POLYLINE;
        this.points = points;
    }
    get data() {
        let pts = [];
        if (this.points != null) {
            this.points.forEach(pt => { pts.push(pt.join(',')); });
        }
        let d = this.ParseData([['points', pts.length > 0 ? pts.join(' ') : null]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // polyline 
export class svgPolygon extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    get points() { return this.#_points; }
    set points(v) { this.#_points = v; this.#changed('points', v); }
    #_points = svg.default.POINTS;
    constructor(points = svg.default.POINTS, fill = svg.default.FILL) {
        super(fill);
        this.type = _POLYGON;
        this.points = points;
    }
    get data() {
        let pts = [];
        if (this.points != null) {
            this.points.forEach(pt => { pts.push(pt.join(',')); });
        }
        let d = this.ParseData([['points', pts.length > 0 ? pts.join(' ') : null]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // polygon 
export class svgPath extends svgShape {
    get d() { return this.#_d; }
    set d(v) { this.#_d = v; this.#changed('d', v); }
    #_d = svg.default.D;
    get pathLength() { return this.#_pathLength; }
    set pathLength(v) { this.#_pathLength = v; this.#changed('pathLength', v); }
    #_pathLength = svg.default.PATHLENGTH;
    constructor(d = svg.default.D, fill = svg.default.FILL) {
        super(fill);
        this.type = _PATH;
        this.d = d;
    }
    get data() {
        let d = this.ParseData([
            ['d', this.d],
            ['pathLength', this.pathLength]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue) { this.onChange?.(valueChanged, newValue, this); if (this.bubbleOnChange) { this.parent?.onChange?.(valueChanged, newValue, this); } }
} // path

/**
 * Checks if the supplied `type` specifies a valid shape.
 * 
 * Valid shape strings are: 
 * {@linkcode svgRect 'rect'}, 
 * {@linkcode svgCircle 'circle'}, 
 * {@linkcode svgEllipse 'ellipse'}, 
 * {@linkcode svgLine 'line'}, 
 * {@linkcode svgPolyline 'polyline'}, 
 * {@linkcode svgPolygon 'polygon'}, and 
 * {@linkcode svgPath 'path'} 
 * @param {string} type Shape type to check
 * @see {@linkcode _ALL_SHAPES}
 * @returns {boolean}
 */
export function IsValidShapeType(type) {
    if (isBlank(type)) { return false; }
    for (let i = 0; i < _ALL_SHAPES.length; i++) {
        if (_ALL_SHAPES[i] == type) { return true; }
    }
    return false;
}

