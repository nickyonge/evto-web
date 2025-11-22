import type { pathNode as _pathNode } from './src/js/assetExporter';
import { _baseNode } from '../js/assetExporter';
import { EnsureColorValid, ColorToRGBA, ColorToHex, ColorToArray } from '../js/lilutils';

declare global {
    /**
     * Any type of node created via `nestedPath` in `assetExporter.js`
     * 
     * Node types, for reference:  
     * - {@linkcode nestedNode}: node with both a {@linkcode _baseNode.URL URL} and {@linkcode _baseNode.Children Children} 
     * - {@linkcode containerNode}: node with no {@linkcode _baseNode.URL URL} but with {@linkcode _baseNode.Children Children} 
     * - {@linkcode leafNode}: node with a {@linkcode _baseNode.URL URL} but no {@linkcode _baseNode.Children Children} 
     * - {@linkcode deadNode}: node with neither a {@linkcode _baseNode.URL URL} nor {@linkcode _baseNode.Children Children} 
     * @param {string} URL Filepath URL to the given asset, eg `assets/png/myImage.png' 
     * @param {string[]} Children Array of nodes, by name reference, childed to this node
     */
    declare type pathNode = _pathNode;

    /**
     * The `<blend-mode>` CSS data type describes how colors should appear when elements overlap. If unspecified, the default value is typically `normal`. 
     * - **Note:** remember that the attribute name must be `"blend-mode"`, not `"blendMode"` or `"BlendMode"`.
     * @see {@linkcode blendMode blendMode} typedef
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/blend-mode
     */
    declare enum BlendMode {
        /** The final color is the top color, regardless of what the bottom color is. The effect is like two opaque pieces of paper overlapping. */
        Normal = 'normal',
        /** The final color is the result of multiplying the top and bottom colors. A black layer leads to a black final layer, and a white layer leads to no change. The effect is like two images printed on transparent film overlapping. */
        Multiply = 'multiply',
        /** The final color is the result of inverting the colors, multiplying them, and inverting that value. A black layer leads to no change, and a white layer leads to a white final layer. The effect is like two images shining onto a projection screen. */
        Screen = 'screen',
        /** The final color is the result of {@linkcode Multiply multiply} if the bottom color is darker, or {@linkcode Screen screen} if the bottom color is lighter. This blend mode is equivalent to {@linkcode HardLight hard-light} but with the layers swapped. */
        Overlay = 'overlay',
        /** The final color is composed of the darkest values of each color channel. */
        Darken = 'darken',
        /** The final color is composed of the lightest values of each color channel. */
        Lighten = 'lighten',
        /** The final color is the result of dividing the bottom color by the inverse of the top color. A black foreground leads to no change. A foreground with the inverse color of the backdrop leads to a fully lit color. This blend mode is similar to {@linkcode Screen screen}, but the foreground only needs to be as light as the inverse of the backdrop to create a fully lit color. */
        ColorDodge = 'color-dodge',
        /** The final color is the result of inverting the bottom color, dividing the value by the top color, and inverting that value. A white foreground leads to no change. A foreground with the inverse color of the backdrop leads to a black final image. This blend mode is similar to {@linkcode Multiply multiply}, but the foreground only needs to be as dark as the inverse of the backdrop to make the final image black. */
        ColorBurn = 'color-burn',
        /** The final color is the result of {@linkcode Multiply multiply} if the top color is darker, or {@linkcode Screen screen} if the top color is lighter. This blend mode is equivalent to overlay but with the layers swapped. The effect is similar to shining a harsh spotlight on the backdrop. */
        HardLight = 'hard-light',
        /** The final color is similar to {@linkcode HardLight hard-light}, but softer. This blend mode behaves similar to {@linkcode HardLight hard-light}. The effect is similar to shining a diffused spotlight on the backdrop. */
        SoftLight = 'soft-light',
        /** The final color is the result of subtracting the darker of the two colors from the lighter one. A black layer has no effect, while a white layer inverts the other layer's color. */
        Difference = 'difference',
        /** The final color is similar to {@linkcode Difference difference}, but with less contrast. As with {@linkcode Difference difference}, a black layer has no effect, while a white layer inverts the other layer's color. */
        Exclusion = 'exclusion',
        /** The final color has the *hue* of the top color, while using the *saturation* and *luminosity* of the bottom color. */
        Hue = 'hue',
        /** The final color has the *saturation* of the top color, while using the *hue* and *luminosity* of the bottom color. A pure gray backdrop, having no saturation, will have no effect. */
        Saturation = 'saturation',
        /** The final color has the *hue* and *saturation* of the top color, while using the *luminosity* of the bottom color. The effect preserves gray levels and can be used to colorize the foreground. */
        Color = 'color',
        /** The final color has the *luminosity* of the top color, while using the *hue* and *saturation* of the bottom color. This blend mode is equivalent to {@linkcode Color color}, but with the layers swapped. */
        Luminosity = 'luminosity',
    }

    /**
     * The `<blend-mode>` CSS data type describes how colors should appear when elements overlap. If unspecified, the default value is typically `normal`. 
     * @see {@linkcode BlendMode} enum
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/blend-mode
     */
    declare type blendMode =
        'normal' |
        'multiply' |
        'screen' |
        'overlay' |
        'darken' |
        'lighten' |
        'color-dodge' |
        'color-burn' |
        'hard-light' |
        'soft-light' |
        'difference' |
        'exclusion' |
        'hue' |
        'saturation' |
        'color' |
        'luminosity';
    
    /**
     * SVG value used to specify one, or optionally two, paired numbers. 
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Content_type#number-optional-number
     */
    declare type numberOptionalNumber = number | [number, number?];

    /** Single-char string representing one of the RGBA channels */
    declare type rgbaChannel = 'R' | 'G' | 'B' | 'A';

    /**
     * CSS-valid color string. Can technically by any string value, but this type implies it should be a color. 
     * but intended to be a CSS appropriate color. 
     * @see {@linkcode EnsureColorValid} to check if a string value is a valid color 
     * @see {@linkcode ColorToRGBA}, {@linkcode ColorToHex}, and {@linkcode ColorToArray} for usable type conversion 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color
     */
    declare type color = string;
}

export { };