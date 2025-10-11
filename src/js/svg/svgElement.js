import * as svg from './index';
import { shape, rect, circle, ellipse, line, polyline, polygon, path, gradient } from "./index";
import { isBlank } from "../lilutils";

export class svgElement {

    /** unique identifier for this element @type {string} */
    id;
    // TODO: ensure all element IDs are unique 
    // Issue URL: https://github.com/nickyonge/evto-web/issues/49

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
        let d = isBlank(this.id) ? [] : [this.#ParseDatum('id', this.id)];
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

    /**
     * gets this element's {@linkcode id ID} formatted as an
     * SVG-attribute URL: `url(#id)`
     */
    get idURL() {
        if (isBlank(this.id)) {
            console.warn("WARNING: can't get id URL from blank/null ID, returning null", this);
            return null;
        }
        return `url(#${this.id})`;
    }
}

export class svgHTMLAsset extends svgElement {

    class;
    viewBox;
    /** Array of {@link svg.shape shapes} contained in this SVG 
     * (excluding any in {@link definitions `<defs>`}) @type {svg.shape[]} */
    shapes = [];
    /** Array of elements contained in this SVG's `<defs>` @type {svgElement[]} */
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
        if (this.definitions != null && this.definitions.length > 0) {
            if (svg.config.HTML_INDENT) { newSVG += '\t'; }
            newSVG += '<defs>';
            if (svg.config.HTML_NEWLINE) { newSVG += '\n'; }
            this.definitions.forEach(definition => {
                if (definition == null) { return; }
                if (svg.config.HTML_WARN_DEFS_NO_ID && definition.id == null) {
                    // check if definition lacks an ID 
                    console.warn(`WARNING: svgHTML[0] definition[1] does not have an ID. Defs need an ID to be used.`, this, definition);
                }
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
            ['preserveAspectRatio', this.preserveAspectRatio]
        ]);
        return [this.ParseData(this.metadata), d, this.viewBox.html].filter(Boolean).join(' ');
    }

    /**
     * Gets the {@link svg.shape shape} found in {@linkcode shapes} 
     * (or, optionally, in {@linkcode definitions})
     * at the given index (default `0`, first)
     * @param {number} [index = 0] index to return 
     * @param {boolean} [searchDefinitions=false] 
     * search `definitions` array instead of `shapes`?
     * If the value found at the given index in `definitions`
     * is not a shape, returns `null`.
     * @returns {svg.shape|null}
     */
    GetShape(index = 0, searchDefinitions = false) {
        if (searchDefinitions) {
            let s = this.GetDefinition(index);
            if (s == null || !(s instanceof svg.shape)) { return null; }
            return s;
        }
        if (this.shapes == null || this.shapes.length <= index) { return null; }
        return this.shapes[index];
    }
    /**
     * Gets the first {@link svg.shape shape} of the given `type`
     * found in {@linkcode shapes} (or, optionally, 
     * in {@linkcode definitions})
     * @see {@linkcode svg.IsValidShapeType IsValidShapeType}
     * @param {number} [index = 0] index to return 
     * @param {boolean} [searchDefinitions=false] 
     * search `definitions` array instead of `shapes`?
     * @returns {svg.shape|null}
     */
    GetFirstShapeOfType(type, searchDefinitions = false) {
        if (!svg.IsValidShapeType(type)) {
            console.warn(`WARNING: can't get first shape of invalid shape type ${type}`, this);
            return null;
        }
        if (searchDefinitions) {
            for (let i = 0; i < this.definitions.length; i++) {
                if (this.definitions[i].type == type) {
                    return this.definitions[i];
                }
            }
        } else {
            for (let i = 0; i < this.shapes.length; i++) {
                if (this.shapes[i].type == type) {
                    return this.shapes[i];
                }
            }
        }
        return null;
    }
    /**
     * Gets the first {@link svg.shape shape} with the given
     * {@linkcode svgElement.id ID} found in {@linkcode shapes}
     * (or, optionally, in {@linkcode definitions})
     * @param {string} id ID string to check
     * @param {boolean} [searchDefinitions=false] 
     * search `definitions` array instead of `shapes`?
     * @returns {svg.shape|null}
     */
    GetShapeWithID(id, searchDefinitions = false) {
        if (searchDefinitions) {
            for (let i = 0; i < this.definitions.length; i++) {
                if (this.definitions[i].id == id) {
                    return this.definitions[i];
                }
            }
        } else {
            for (let i = 0; i < this.shapes.length; i++) {
                if (this.shapes[i].id == id) {
                    return this.shapes[i];
                }
            }
        }
        return null;
    }

    /**
     * Gets the Nth {@link svg.gradient gradient} found in 
     * {@linkcode definitions}, where N (`index`) increments 
     * through just the gradient elements found. By default,
     * returns the first gradient found. 
     * 
     * Eg, if defs contains `[gradientA, elementA, elementB, 
     * gradientB, gradientC]`, `index=1` (zero inclusive) 
     * would return the second gradient found, `gradientB`.
     * @param {number} [gradientIndex = 0] Nth gradient to return
     * @returns {svg.gradient|null}
     */
    GetGradient(gradientIndex = 0) {
        if (this.definitions == null || this.definitions.length <= gradientIndex) { return null; }
        let g = 0;// gradients-only increment 
        for (let i = 0; i < this.definitions.length; i++) {
            if (this.definitions[i] instanceof svg.gradient) {
                if (g == gradientIndex) {
                    return this.definitions[i];
                }
                g++;
            }
        }
        return null;
    }
    /**
     * Gets the first {@link svg.gradient gradient} with the given
     * {@linkcode svgElement.id ID} found in {@linkcode definitions}
     * @param {string} id ID string to check
     * @returns {svg.shape|null}
     */
    GetGradientWithID(id) {
        for (let i = 0; i < this.definitions.length; i++) {
            if (this.definitions[i] instanceof svg.gradient &&
                this.definitions[i].id == id) {
                return this.definitions[i];
            }
        }
        return null;
    }

    /**
     * Gets the {@link svgElement element} found in {@linkcode definitions} 
     * at the given index (default `0`, first)
     * @param {number} [index = 0] index to return  
     * @returns {svgElement|null}
     */
    GetDefinition(index = 0) {
        if (this.definitions == null || this.definitions.length <= index) { return null; }
        return this.definitions[index];
    }
    /**
     * Gets the first {@link svg.shape element} with the given
     * {@linkcode svgElement.id ID} found in {@linkcode definitions}
     * @returns {svgElement|null}
     */
    GetDefinitionWithID(id) {
        for (let i = 0; i < this.definitions.length; i++) {
            if (this.definitions[i].id == id) {
                return this.definitions[i];
            }
        }
        return null;
    }

    /** 
     * convenience getter for first-found {@link gradient} 
     * (or `null` if no gradients are defined)
     * @see {@link GetGradient}
     * @returns {gradient|null} 
    */
    get gradient() { return this.GetGradient(0); }

    /** 
     * add a {@link svg.shape shape} to shapes array (recommend using another shape; 
     * else, must manually assign `type`) @param {shape} shape 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddShape(shape, asDefinition = false) { this.#PushShape(shape, asDefinition); return shape; }
    NewShape(fill = svg.default.FILL, asDefinition = false) {
        let shape = new svg.shape(fill);
        this.#PushShape(shape, asDefinition); return shape;
    }
    DefaultShape(asDefinition = false) { return this.NewShape(svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.rect rect} to shapes array @param {svg.rect} rect 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddRect(rect, asDefinition = false) { this.#PushShape(rect, asDefinition); return rect; }
    NewRect(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT, fill = svg.default.FILL, asDefinition = false) {
        let rect = new svg.rect(x, y, width, height, fill);
        this.#PushShape(rect, asDefinition); return rect;
    }
    DefaultRect(asDefinition = false) { return this.NewRect(svg.default.X, svg.default.Y, svg.default.WIDTH, svg.default.HEIGHT, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.circle circle} to shapes array @param {circle} circle 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddCircle(circle, asDefinition = false) { this.#PushShape(circle, asDefinition); return circle; }
    NewCircle(r = svg.default.R, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL, asDefinition = false) {
        let circle = new svg.circle(r, cx, cy, fill);
        this.#PushShape(circle, asDefinition); return circle;
    }
    DefaultCircle(asDefinition = false) { return this.NewCircle(svg.default.R, svg.default.CX, svg.default.CY, svg.default.FILL, asDefinition); };
    /** 
     * add an {@link svg.ellipse ellipse} to shapes array @param {ellipse} ellipse 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddEllipse(ellipse, asDefinition = false) { this.#PushShape(ellipse, asDefinition); return ellipse; }
    NewEllipse(rx = svg.default.ELLIPSE_RX, ry = svg.default.ELLIPSE_RY, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL, asDefinition = false) {
        let ellipse = new svg.ellipse(rx, ry, cx, cy, fill);
        this.#PushShape(ellipse, asDefinition); return ellipse;
    }
    DefaultEllipse(asDefinition = false) { return this.NewEllipse(svg.default.ELLIPSE_RX, svg.default.ELLIPSE_RY, svg.default.CX, svg.default.CY, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.line line} to shapes array @param {line} line 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddLine(line, asDefinition = false) { return this.#PushShape(line, asDefinition); return line; }
    NewLine(x1 = svg.default.X1, y1 = svg.default.Y1, x2 = svg.default.X2, y2 = svg.default.Y2, fill = svg.default.FILL, asDefinition = false) {
        let line = new svg.line(x1, y1, x2, y2, fill);
        this.#PushShape(line, asDefinition); return line;
    }
    DefaultLine(asDefinition = false) { return this.NewLine(svg.default.X1, svg.default.Y1, svg.default.X2, svg.default.Y2, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.polyline polyline} to shapes array @param {polyline} polyline 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddPolyline(polyline, asDefinition = false) { this.#PushShape(polyline, asDefinition); return polyline; }
    NewPolyline(points = svg.default.POINTS, fill = svg.default.FILL, asDefinition = false) {
        let polyline = new svg.polyline(points, fill);
        this.#PushShape(polyline, asDefinition); return polyline;
    }
    DefaultPolyline(asDefinition = false) { return this.NewPolyline(svg.default.POINTS, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.polygon polygon} to shapes array @param {polygon} polygon 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddPolygon(polygon, asDefinition = false) { this.#PushShape(polygon, asDefinition); return polygon; }
    NewPolygon(points = svg.default.POINTS, fill = svg.default.FILL, asDefinition = false) {
        let polygon = new svg.polygon(points, fill);
        this.#PushShape(polygon, asDefinition); return polygon;
    }
    DefaultPolygon(asDefinition = false) { return this.NewPolygon(svg.default.POINTS, svg.default.FILL, asDefinition); };
    /** 
     * add a {@link svg.path path} to shapes array @param {path} path 
     * @param {boolean} [asDefinition=false] add the shape to SVG `<defs>`? */
    AddPath(path, asDefinition = false) { this.#PushShape(path, asDefinition); return path; }
    NewPath(d = svg.default.D, fill = svg.default.FILL, asDefinition = false) {
        let path = new svg.path(d, fill);
        this.#PushShape(path, asDefinition); return path;
    }
    DefaultPath(asDefinition = false) { return this.NewPath(svg.default.D, svg.default.FILL, asDefinition); };

    /** 
     * Create and add a new {@link svg.gradient gradient} 
     * to the {@linkcode definitions} array
     * 
     * @param {string} id {@link svg.element.id ID} to assign to this gradient
     * @param {boolean} isRadial is this a radial gradient, or linear?
     * @param {string} color1 Default gradient start color
     * @param {string} color2 Default gradient end color
     * @returns {svg.gradient} The newly-created, newly-added gradient
     * */
    NewGradient(id, isRadial = svg.default.GRADIENT_ISRADIAL, color1 = svg.default.GRADIENT_COLOR1, color2 = svg.default.GRADIENT_COLOR2) {
        if (this.definitions == null) { this.definitions = []; }
        let gradient = new svg.gradient(id, isRadial, color1, color2);
        gradient.id = id;
        this.definitions.push(gradient);
        return gradient;
    }
    /**
     * Add the given {@link svg.gradient gradient} 
     * to the {@linkcode definitions} array
     * @param {svg.gradient} [gradient] Pre-existing gradient to import
     * @returns {svg.gradient} The now-added gradient
     */
    AddGradient(gradient) {
        if (this.definitions == null) { this.definitions = []; }
        this.definitions.push(gradient);
        return gradient;
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
