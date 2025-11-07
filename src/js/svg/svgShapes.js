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

/** Base class for all SVG shapes */
export class svgShape extends svg.definition {
    /** 
     * SVG shape type, assigned in {@link svgShape} subclass constructor.
     * @see {@linkcode _ALL_SHAPES}
     * @returns {string} */
    get shapeType() { return this.#_shapeType; }
    set shapeType(v) { // can only set shape type once, does not call OnChange 
        if (this.shapeType != null) { console.warn(`cannot reassign set shape type ${this.shapeType} to ${v}`, this); return; }
        if (!IsValidShapeType(v)) { return; }
        this.#_shapeType = v;
    }
    #_shapeType = null;

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
    /** local flag for first shapes parent assignment @type {boolean} */
    #_firstParentAssigned = false;
    /** Should changes to this asset bubble up to its {@link parent} asset? @type {boolean} */
    get bubbleOnChange() { return this.#_bubbleOnChange; }
    set bubbleOnChange(v) { let prev = this.#_bubbleOnChange; this.#_bubbleOnChange = v; this.#changed('bubbleOnChange', v, prev); }
    #_bubbleOnChange = svg.defaults.BUBBLE_ONCHANGE;

    get fill() { return this.#_fill; }
    set fill(v) { let prev = this.#_fill; this.#_fill = v; this.#changed('fill', v, prev); }
    #_fill = svg.defaults.FILL;
    get stroke() { return this.#_stroke; }
    set stroke(v) { let prev = this.#_stroke; this.#_stroke = v; this.#changed('stroke', v, prev); }
    #_stroke = svg.defaults.STROKE;
    /**
     * base class for all SVG Shapes 
     * @param {string|svg.gradient} [fill] Fill colour (default {@linkcode svg.defaults.FILL svgDefaults.FILL})
     * @param {string} [shapeType] 
     */
    constructor(fill = svg.defaults.FILL, shapeType) {
        super(undefined, shapeType);
        if (shapeType == null) {
            console.warn("WARNING: svgShape must have a defined shapeType, see svgShapes for all valid types", this);
        }
        if (fill != null) {
            if (typeof fill === 'string') { this.fill = fill; }
            else if (fill instanceof svg.gradient) { this.fillGradient = fill; }
        }
    }
    get html() {
        if (this.shapeType == null) {
            console.error("ERROR: can't get svgShape of null type, specify shape via subclass, returning null");
            return null;
        }
        return `<${this.shapeType} ${this.data}/>`;
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
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
} // shape 
export class svgRect extends svgShape {
    get x() { return this.#_x; }
    set x(v) { let prev = this.#_x; this.#_x = v; this.#changed('x', v, prev); }
    #_x = svg.defaults.X;
    get y() { return this.#_y; }
    set y(v) { let prev = this.#_y; this.#_y = v; this.#changed('y', v, prev); }
    #_y = svg.defaults.Y;
    get width() { return this.#_width; }
    set width(v) { let prev = this.#_width; this.#_width = v; this.#changed('width', v, prev); }
    #_width = svg.defaults.WIDTH;
    get height() { return this.#_height; }
    set height(v) { let prev = this.#_height; this.#_height = v; this.#changed('height', v, prev); }
    #_height = svg.defaults.HEIGHT;
    get rx() { return this.#_rx; }
    set rx(v) { let prev = this.#_rx; this.#_rx = v; this.#changed('rx', v, prev); }
    #_rx = svg.defaults.RECT_RX;
    get ry() { return this.#_ry; }
    set ry(v) { let prev = this.#_ry; this.#_ry = v; this.#changed('ry', v, prev); }
    #_ry = svg.defaults.RECT_RY;
    constructor(x = svg.defaults.X, y = svg.defaults.Y, width = svg.defaults.WIDTH, height = svg.defaults.HEIGHT, fill = svg.defaults.FILL) {
        const st = _RECT;
        super(fill, st);
        this.shapeType = st;
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
        return svg.generator.BoxPath(this.x, this.y, this.width, this.height, relativeStart, closePath);
    }
    /** sets both {@linkcode rx} and {@linkcode ry} corner radii @param {number} radius */
    set r(radius) { this.rx = radius; this.ry = radius; }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
} // rect 
export class svgCircle extends svgShape {
    get r() { return this.#_r; }
    set r(v) { let prev = this.#_r; this.#_r = v; this.#changed('r', v, prev); }
    #_r = svg.defaults.R;
    get cx() { return this.#_cx; }
    set cx(v) { let prev = this.#_cx; this.#_cx = v; this.#changed('cx', v, prev); }
    #_cx = svg.defaults.CX;
    get cy() { return this.#_cy; }
    set cy(v) { let prev = this.#_cy; this.#_cy = v; this.#changed('cy', v, prev); }
    #_cy = svg.defaults.CY;
    constructor(r = svg.defaults.R, cx = svg.defaults.CX, cy = svg.defaults.CY, fill = svg.defaults.FILL) {
        const st = _CIRCLE;
        super(fill, st);
        this.shapeType = st;
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
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
} // circle 
export class svgEllipse extends svgShape {
    get rx() { return this.#_rx; }
    set rx(v) { let prev = this.#_rx; this.#_rx = v; this.#changed('rx', v, prev); }
    #_rx = svg.defaults.ELLIPSE_RX;
    get ry() { return this.#_ry; }
    set ry(v) { let prev = this.#_ry; this.#_ry = v; this.#changed('ry', v, prev); }
    #_ry = svg.defaults.ELLIPSE_RY;
    get cx() { return this.#_cx; }
    set cx(v) { let prev = this.#_cx; this.#_cx = v; this.#changed('cx', v, prev); }
    #_cx = svg.defaults.CX;
    get cy() { return this.#_cy; }
    set cy(v) { let prev = this.#_cy; this.#_cy = v; this.#changed('cy', v, prev); }
    #_cy = svg.defaults.CY;
    constructor(rx = svg.defaults.ELLIPSE_RX, ry = svg.defaults.ELLIPSE_RY, cx = svg.defaults.CX, cy = svg.defaults.CY, fill = svg.defaults.FILL) {
        const st = _ELLIPSE;
        super(fill, st);
        this.shapeType = st;
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
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
} // ellipse 
export class svgLine extends svgShape {
    get x1() { return this.#_x1; }
    set x1(v) { let prev = this.#_x1; this.#_x1 = v; this.#changed('x1', v, prev); }
    #_x1 = svg.defaults.X1;
    get y1() { return this.#_y1; }
    set y1(v) { let prev = this.#_y1; this.#_y1 = v; this.#changed('y1', v, prev); }
    #_y1 = svg.defaults.Y1;
    get x2() { return this.#_x2; }
    set x2(v) { let prev = this.#_x2; this.#_x2 = v; this.#changed('x2', v, prev); }
    #_x2 = svg.defaults.X2;
    get y2() { return this.#_y2; }
    set y2(v) { let prev = this.#_y2; this.#_y2 = v; this.#changed('y2', v, prev); }
    #_y2 = svg.defaults.Y2;
    constructor(x1 = svg.defaults.X1, y1 = svg.defaults.Y1, x2 = svg.defaults.X2, y2 = svg.defaults.Y2, fill = svg.defaults.FILL) {
        const st = _LINE;
        super(fill, st);
        this.shapeType = st;
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
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
} // line 
export class svgPolyline extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {number[][]} */
    get points() { return this.#_points; }
    set points(v) { let prev = this.#_points; this.#_points = v; this.#changed('points', v, prev); }
    #_points = svg.defaults.POINTS;
    constructor(points = svg.defaults.POINTS, fill = svg.defaults.FILL) {
        const st = _POLYLINE;
        super(fill, st);
        this.shapeType = st;
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
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
} // polyline 
export class svgPolygon extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {number[][]} */
    get points() { return this.#_points; }
    set points(v) { let prev = this.#_points; this.#_points = v; this.#changed('points', v, prev); }
    #_points = svg.defaults.POINTS;
    constructor(points = svg.defaults.POINTS, fill = svg.defaults.FILL) {
        const st = _POLYGON;
        super(fill, st);
        this.shapeType = st;
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
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
} // polygon 
export class svgPath extends svgShape {
    get d() { return this.#_d; }
    set d(v) { let prev = this.#_d; this.#_d = v; this.#changed('d', v, prev); }
    #_d = svg.defaults.D;
    get pathLength() { return this.#_pathLength; }
    set pathLength(v) { let prev = this.#_pathLength; this.#_pathLength = v; this.#changed('pathLength', v, prev); }
    #_pathLength = svg.defaults.PATHLENGTH;
    constructor(d = svg.defaults.D, fill = svg.defaults.FILL) {
        const st = _PATH;
        super(fill, st);
        this.shapeType = st;
        this.d = d;
    }
    get data() {
        let d = this.ParseData([
            ['d', this.d],
            ['pathLength', this.pathLength]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
    /** @type {svg.onChange} Local changed callback that calls {@link onChange} on both this element and its {@link parent}. */
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }
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

