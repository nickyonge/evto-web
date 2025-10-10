import * as svg from './index';
import { shape, rect, circle, ellipse, line, polyline, polygon, path } from "./index";
import { isBlank } from "../lilutils";

export class svgElement {

    /** Parse array of SVG data into HTML-attribute-style `name="value"` format, 
     * with spaces between attributes as needed. 
     * @param {Array<[string, any]>} data 2d array of properties, `[name,value]` 
     * @returns {string} data formatted like `first="1" second="2" third="3"`
     * @example 
     * let myVar = 1;
     * let myVarName = 'first';
     * let array = [[myVarName,myVar], ['two',null], ['third',3], ['blank',''], [null,'null']];
     * let myData = ParseData(array);
     * console.log(myData); // Outputs string: first="1" third="3" blank="" */
    ParseData(data) {
        let d = [];
        data.forEach(datum => {
            let out = this.#ParseDatum(datum[0], datum[1]);
            if (!isBlank(out)) { d.push(out); }
        });
        return d.join(' ');
    }
    /** Parse individual property data for use as an SVG attribute. Returns `''` if invalid.
     * @param {string} name name of property. Can't be null or blank or whitespace
     * @param {*} value value of property. Can't be null, but CAN be blank or whitespace
     * @returns {string} datum formatted like `myName="myValue"`, or `''` if name is empty/null or value is null
     * @example
     * console.log(#ParseDatum('myNumber', 123));  // Output: 'myNumber="123"'
     * console.log(#ParseDatum('isBlank', ''));    // Output: 'isBlank=""'
     * console.log(#ParseDatum('isNull', null));   // Output: 'isNull=""'
     * console.log(#ParseDatum(null, 'nullName')); // Output: ''
     * */
    #ParseDatum(name, value) { return `${value == null || isBlank(name) ? '' : `${name}="${value}"`}`; }

    /**
     * add indentation (`\t`) to the give html string, 
     * if {@link svg.config.HTML_INDENT HTML_INDENT} is true
     * @param {string} html input html string 
     * @param {number} indentCount number of indentations to add 
     * @returns original string with indentation
     */
    IndentHTML(html, indentCount = 1) {
        if (!svg.config.HTML_INDENT || isBlank(html)) { return html; }
        let indent = '';
        for (let i = 0; i < indentCount; i++) { indent += '\t'; }
        console.log(indentCount);
        html = indent + html;
        if (svg.config.HTML_NEWLINE) {
            // check if ends with newline - if so, don't indent it
            let newlineEnd = html.endsWith('\n');
            if (newlineEnd) { html = html.slice(0, -1); }
            html = html.replaceAll('\n', '\n' + indent);
            if (newlineEnd) { html += '\n'; }
        }
        return html;
    }
}

export class svgHTML extends svgElement {

    class;
    id;
    definitions;
    viewBox;
    shapes;
    preserveAspectRatio = svg.default.PRESERVEASPECTRATIO;
    metadata = svg.default.METADATA;

    constructor(shapes = [], viewBox = new svgViewBox()) {
        super();
        this.shapes = shapes;
        this.viewBox = viewBox;
        this.metadata = svg.default.METADATA;
    }
    get html() {
        let d = this.data;
        let newSVG = isBlank(d) ? '<svg>' : `<svg ${d}>`;
        if (svg.config.HTML_NEWLINE) { newSVG += '\n'; }
        // add SVG definitions
        // TODO: svg definitions in own <defs> dropdown
        // Issue URL: https://github.com/nickyonge/evto-web/issues/46
        // add SVG shapes 
        if (this.shapes != null && this.shapes.length > 0) {
            this.shapes.forEach(shape => {
                if (shape == null) { return; }
                let h = shape.html;
                if (!isBlank.h) {
                    if (svg.config.HTML_INDENT) { newSVG += '\t'; }
                    newSVG += h;
                    if (svg.config.HTML_NEWLINE) { newSVG += '\n'; }
                }
            });
        }
        return `${newSVG}</svg>`;
    }
    get data() {
        if (this.viewBox == null) { this.viewBox = new svgViewBox(); }
        if (this.metadata == null) { this.metadata = svg.default.METADATA; }
        let d = this.ParseData([
            ['class', this.class],
            ['id', this.id],
            ['preserveAspectRatio', this.preserveAspectRatio]
        ]);
        return [this.ParseData(this.metadata), d, this.viewBox.html].filter(Boolean).join(' ');
    }

    /** 
     * add an {@link svg.shape} to shapes array (recommend using another shape; 
     * else, must manually assign `type`) @param {shape} shape */
    AddShape(shape) { this.shapes.push(shape); }
    AddShape(fill = svg.default.FILL) { this.shapes.push(new shape(fill)); }

    /** add an {@link svg.rect} to shapes array @param {svg.rect} rect */
    AddRect(rect) { this.shapes.push(rect); }
    AddRect(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT, fill = svg.default.FILL) {
        this.shapes.push(new rect(x, y, width, height, fill));
    }

    /** add an {@link svg.circle} to shapes array @param {circle} circle */
    AddCircle(circle) { this.shapes.push(circle); }
    AddCircle(r = svg.default.R, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL) {
        this.shapes.push(new circle(r, cx, cy, fill));
    }

    /** add an {@link svg.ellipse} to shapes array @param {ellipse} ellipse */
    AddEllipse(ellipse) { this.shapes.push(ellipse); }
    AddEllipse(rx = svg.default.ELLIPSE_RX, ry = svg.default.ELLIPSE_RY, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL) {
        this.shapes.push(new ellipse(rx, ry, cx, cy, fill));
    }

    /** add an {@link svg.line} to shapes array @param {line} line */
    AddLine(line) { this.shapes.push(line); }
    AddLine(x1 = svg.default.X1, y1 = svg.default.Y1, x2 = svg.default.X2, y2 = svg.default.Y2, fill = svg.default.FILL) {
        this.shapes.push(new line(x1, y1, x2, y2, fill));
    }

    /** add an {@link svg.polyline} to shapes array @param {polyline} polyline */
    AddPolyline(polyline) { this.shapes.push(polyline); }
    AddPolyline(points = svg.default.POINTS, fill = svg.default.FILL) {
        this.shapes.push(new polyline(points, fill));
    }

    /** add an {@link svg.polygon} to shapes array @param {polygon} polygon */
    AddPolygon(polygon) { this.shapes.push(polygon); }
    AddPolygon(points = svg.default.POINTS, fill = svg.default.FILL) {
        this.shapes.push(new polygon(points, fill));
    }

    /** add an {@link svg.path} to shapes array @param {path} path */
    AddPath(path) { this.shapes.push(path); }
    AddPath(d = svg.default.D, fill = svg.default.FILL) {
        this.shapes.push(new path(d, fill));
    }

}

export class svgViewBox extends svgElement {
    x; y; width; height;
    constructor(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT) {
        super(); this.x = x; this.y = y; this.width = width; this.height = height;
    }
    get html() { return `viewBox="${this.data}"`; }
    get data() { return `${this.x} ${this.y} ${this.width} ${this.height}`; }
}