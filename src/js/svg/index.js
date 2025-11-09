export {
    svgElement, svgElement as element,
} from './svgElement';

export {
    svgHTMLAsset, svgHTMLAsset as htmlAsset,
    svgViewBox, svgViewBox as viewbox
} from './svgHTMLAsset';

export {
    svgDefinition, svgDefinition as definition,
} from './svgDefinition';

export {
    svgShape, svgShape as shape,
    svgRect, svgRect as rect,
    svgCircle, svgCircle as circle,
    svgEllipse, svgEllipse as ellipse,
    svgLine, svgLine as line,
    svgPolyline, svgPolyline as polyline,
    svgPolygon, svgPolygon as polygon,
    svgPath, svgPath as path,
    IsValidShapeType
} from './svgShapes';

export { svgGradient as gradient } from './svgGradient';

export * as config from './svgConfig';
export * as svgConfig from './svgConfig';

export * as defaults from './svgDefaults';
export * as svgDefaults from './svgDefaults';

export * as generator from './svgGenerator';
export * as svgGenerator from './svgGenerator';

import { svgElement } from './svgElement'; 

/**
 * Callback for when a value in an {@link svgElement} has changed
 * @callback onChange
 * @param {string} valueChanged The name of the value that was changed 
 * @param {any} newValue The newly assigned value 
 * @param {any} previousValue The old value, for reference  
 * @param {svgElement} [changedElement=undefined] The {@link svgElement} that was changed 
 * @returns {void}
 */
