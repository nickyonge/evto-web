import * as svg from './index';

export const PRESERVEASPECTRATIO = null;
export const METADATA = [
    ['xmlns', 'http://www.w3.org/2000/svg'],
    ['xmlns:xlink', 'http://www.w3.org/1999/xlink'],
];

export const BUBBLE_ONCHANGE = true;
export const UPDATE_DEFINITIONS_ON_ID_CHANGE = true;

export const X = 0;
export const Y = 0;
export const WIDTH = 200;
export const HEIGHT = 100;
export const FILL = '#beeeef';
export const STROKE = null;

export const RECT_RX = null;
export const RECT_RY = null;

export const R = HEIGHT;
export const CX = X;
export const CY = Y;

export const ELLIPSE_RX = 100;
export const ELLIPSE_RY = R;

export const X1 = X;
export const Y1 = Y;
export const X2 = WIDTH;
export const Y2 = HEIGHT;

export const POINTS = [[X1, Y1], [X1, Y2], [X2, Y2], [X2, Y1]];

export const D = 'M0,0 L20,0 L20,10 L0,10 Z';
export const PATHLENGTH = null;

export const GRADIENT_ISRADIAL = false;
export const GRADIENT_SHARPNESS = 0;
export const GRADIENT_X1 = null;
export const GRADIENT_Y1 = null;
export const GRADIENT_X2 = null;
export const GRADIENT_Y2 = null;
export const GRADIENT_X1_SCALEDEFAULT = '0%';// default value of an undefined linearGradiant x1, used for scaling 
export const GRADIENT_Y1_SCALEDEFAULT = '0%';// default value of an undefined linearGradiant y1, used for scaling 
export const GRADIENT_X2_SCALEDEFAULT = '100%';// default value of an undefined linearGradiant x2, used for scaling 
export const GRADIENT_Y2_SCALEDEFAULT = '0%';// default value of an undefined linearGradiant y2, used for scaling 
export const GRADIENT_FR = null;
export const GRADIENT_R = null;
export const GRADIENT_FR_SCALEDEFAULT = '0%';// default value of an undefined radialGradiant fr, used for scaling 
export const GRADIENT_R_SCALEDEFAULT = '50%';// default value of an undefined radialGradiant r, used for scaling 
export const GRADIENT_MIRROR = false;
export const GRADIENT_SCALE = 1;
export const GRADIENT_ANGLE = 0;
export const GRADIENT_ANGLEPIVOTPOINT = { x: 50, y: 50 };
export const GRADIENT_UNITS = null;
export const GRADIENT_TRANSFORM = null;
export const GRADIENT_SPREADMETHOD = null;
export const GRADIENT_HREF = null;

export const GRADIENT_COLOR1 = 'black';
export const GRADIENT_COLOR2 = 'white';
export const GRADIENT_COLORARRAY = [GRADIENT_COLOR1, GRADIENT_COLOR2];

export const GRADIENT_STOP_OFFSET = 'auto';
export const GRADIENT_STOP_COLOR = null;
export const GRADIENT_STOP_OPACITY = null;

/**
 * Ensures that the given values either have content
 * @param  {...string} colors 
 * @returns 
 */
export function EnsureGradientDefaultColors(...colors) {
    if (colors == null) { colors = []; }
    colors = colors.flat();
    switch (colors.length) {
        case 0: return GRADIENT_COLORARRAY;
        case 1: return svg.config.DEFAULT_COLORARRAY_FORCE_TWO_VALUES ?
            [colors[0], GRADIENT_COLOR2] : colors;
        default: return colors;
    }
}