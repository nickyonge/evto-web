import * as svg from './index';
import { shape, rect, circle, ellipse, line, polyline, polygon, path, gradient } from "./index";
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
    viewBox;
    shapes = [];
    definitions = [];
    preserveAspectRatio = svg.default.PRESERVEASPECTRATIO;
    metadata = svg.default.METADATA;

    constructor(shapes = [], viewBox = new svgViewBox()) {
        super();
        this.shapes = shapes;
        this.definitions = [];
        this.viewBox = viewBox;
        this.metadata = svg.default.METADATA;
    }
    get html() {
        let d = this.data;
        let newSVG = isBlank(d) ? '<svg>' : `<svg ${d}>`;
        if (svg.config.HTML_NEWLINE) { newSVG += '\n'; }
        // add SVG definitions
        // TODO: ensure any added SVG definitions have an ID
        // Issue URL: https://github.com/nickyonge/evto-web/issues/48
        if (this.definitions != null && this.definitions.length > 0) {
            if (svg.config.HTML_INDENT) { newSVG += '\t'; }
            newSVG += '<defs>';
            if (svg.config.HTML_NEWLINE) { newSVG += '\n'; }
            this.definitions.forEach(definition => {
                if (definition == null) { return; }
                let h = this.IndentHTML(definition.html, 2);
                if (!isBlank.h) {
                    newSVG += h;
                    if (svg.config.HTML_NEWLINE) { newSVG += '\n'; }
                }
            });
            if (svg.config.HTML_INDENT) { newSVG += '\t'; }
            newSVG += '</defs>';
            if (svg.config.HTML_NEWLINE) { newSVG += '\n'; }
        }
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
     * add a {@link svg.shape shape} to shapes array (recommend using another shape; 
     * else, must manually assign `type`) @param {shape} shape 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddShape(shape, asDefinition = false) { this.#PushShape(shape, asDefinition); }
    AddShape(fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new shape(fill), asDefinition);
    }
    AddDefaultShape(asDefinition = false) { this.AddShape(svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.rect rect} to shapes array @param {svg.rect} rect 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddRect(rect, asDefinition = false) { this.#PushShape(rect, asDefinition); }
    AddRect(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT, fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new rect(x, y, width, height, fill), asDefinition);
    }
    AddDefaultRect(asDefinition = false) { this.AddRect(svg.default.X, svg.default.Y, svg.default.WIDTH, svg.default.HEIGHT, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.circle circle} to shapes array @param {circle} circle 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddCircle(circle, asDefinition = false) { this.#PushShape(circle, asDefinition); }
    AddCircle(r = svg.default.R, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new circle(r, cx, cy, fill), asDefinition);
    }
    AddDefaultCircle(asDefinition = false) { this.AddCircle(svg.default.R, svg.default.CX, svg.default.CY, svg.default.FILL, asDefinition); };
    /** 
     * add an {@link svg.ellipse ellipse} to shapes array @param {ellipse} ellipse 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddEllipse(ellipse, asDefinition = false) { this.#PushShape(ellipse, asDefinition); }
    AddEllipse(rx = svg.default.ELLIPSE_RX, ry = svg.default.ELLIPSE_RY, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new ellipse(rx, ry, cx, cy, fill), asDefinition);
    }
    AddDefaultEllipse(asDefinition = false) { this.AddEllipse(svg.default.ELLIPSE_RX, svg.default.ELLIPSE_RY, svg.default.CX, svg.default.CY, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.line line} to shapes array @param {line} line 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddLine(line, asDefinition = false) { this.#PushShape(line, asDefinition); }
    AddLine(x1 = svg.default.X1, y1 = svg.default.Y1, x2 = svg.default.X2, y2 = svg.default.Y2, fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new line(x1, y1, x2, y2, fill), asDefinition);
    }
    AddDefaultLine(asDefinition = false) { this.AddLine(svg.default.X1, svg.default.Y1, svg.default.X2, svg.default.Y2, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.polyline polyline} to shapes array @param {polyline} polyline 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddPolyline(polyline, asDefinition = false) { this.#PushShape(polyline, asDefinition); }
    AddPolyline(points = svg.default.POINTS, fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new polyline(points, fill), asDefinition);
    }
    AddDefaultPolyline(asDefinition = false) { this.AddPolyline(svg.default.POINTS, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.polygon polygon} to shapes array @param {polygon} polygon 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddPolygon(polygon, asDefinition = false) { this.#PushShape(polygon, asDefinition); }
    AddPolygon(points = svg.default.POINTS, fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new polygon(points, fill), asDefinition);
    }
    AddDefaultPolygon(asDefinition = false) { this.AddPolygon(svg.default.POINTS, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.path path} to shapes array @param {path} path 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddPath(path, asDefinition = false) { this.#PushShape(path, asDefinition); }
    AddPath(d = svg.default.D, fill = svg.default.FILL, asDefinition = false) {
        this.#PushShape(new path(d, fill), asDefinition);
    }
    AddDefaultPath(asDefinition = false) { this.AddPath(svg.default.D, svg.default.FILL, asDefinition); };

    /** 
     * add a {@link svg.gradient gradient} to definitions array @param {gradient} gradient 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddGradient(gradient, asDefinition = false) {
        if (this.definitions == null, asDefinition = false) { this.definitions = []; }
        this.definitions.push(gradient);
    }
    AddGradient(isRadial = svg.default.GRADIENT_ISRADIAL, color1 = svg.default.GRADIENT_COLOR1, color2 = svg.default.GRADIENT_COLOR2, asDefinition = false) {
        if (this.definitions == null, asDefinition = false) { this.definitions = []; }
        this.definitions.push(new gradient(isRadial, color1, color2));
    }

    #PushShape(element, asDefinition) {
        if (asDefinition) { this.definitions.push(element); }
        else { this.shapes.push(element); }
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
