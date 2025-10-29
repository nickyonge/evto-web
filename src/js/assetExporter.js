import { EnsureToNumber, isBlank, isString, isStringNotBlank, ReturnStringNotBlank } from "./lilutils";


/* Images Enum Map
                                            
╔═══════╗                                   
║  map  ║                                   [ src/assets/png/map... ] 
╚═══╤═══╝                                   
    │                                       
    ├─ gcs                                  [ ...map/gcs/ ] 
    │   ├─ complete » ..................... gcs-complete.png 
    │   ├─ equator » ...................... gcs-equator_dotted.png 
    │   │   ├─ dotted » ................... gcs-equator_dotted.png 
    │   │   ├─ solid » .................... gcs-equator_solid.png 
    │   │   └─ tropicsAndPolarCircles » ... gcs-equator_tropics_polar_circles.png 
    │   ├─ latitude » ..................... gcs-latitude.png 
    │   │   ├─ equator » .................. gcs-latitude_with_dotted_equator.png 
    │   │   └─ tropicsAndPolarCircles » ... gcs-latitude_with_tropics_and_polar_circles.png 
    │   ├─ latLong » ...................... gcs-latlong.png 
    │   │   ├─ deg15 » .................... gcs-latlong_15deg_dotted.png 
    │   │   ├─ deg30 » .................... gcs-latlong_30deg_dotted.png 
    │   │   └─ equatorAndMeridians » ...... gcs-latlong_with_dotted_equator_meridians.png 
    │   ├─ longitude » .................... gcs-longitude.png 
    │   │   └─ meridians » ................ gcs-longitude_with_dotted_meridians.png 
    │   ├─ tropics » ...................... gcs-tropics.png 
    │   │   └─ polarCircles » ............. gcs-tropics_and_polar_circles.png 
    │   │       └─ equator » .............. gcs-equator_tropics_polar_circles.png 
    │   └─ polarCircles » ................. gcs-polar_circles.png 
    │       └─ tropics » .................. gcs-tropics_and_polar_circles.png 
    │           └─ equator » .............. gcs-equator_tropics_polar_circles.png 
    │                                       
    ├─ labels                               [ ...map/labels/ ] 
    │   ├─ gcs                              
    │   │   ├─ latitude                     
    │   │   │   ├─ deg15 » ................ label-gcs_latitude_15deg.png 
    │   │   │   └─ deg30 » ................ label-gcs_latitude_30deg.png 
    │   │   ├─ latLong                      
    │   │   │   ├─ deg15 » ................ label-gcs_latlong_15deg.png 
    │   │   │   └─ deg30 » ................ label-gcs_latlong_30deg.png 
    │   │   ├─ longitude                    
    │   │   │   ├─ deg15 » ................ label-gcs_longitude_15deg.png 
    │   │   │   └─ deg30 » ................ label-gcs_longitude_30deg.png 
    │   │   ├─ meridian                     
    │   │   │   ├─ anti » ................. label-gcs_meridian_antimeridian.png 
    │   │   │   ├─ full » ................. label-gcs_meridian_full.png 
    │   │   │   └─ prime » ................ label-gcs_meridian_primemeridian.png 
    │   │   ├─ polarCircle                  
    │   │   │   ├─ antarctic » ............ label-gcs_polarcircle_antarctic.png 
    │   │   │   ├─ arctic » ............... label-gcs_polarcircle_arctic.png 
    │   │   │   └─ full » ................. label-gcs_polarcircle_full.png 
    │   │   ├─ poles                        
    │   │   │   ├─ full » ................. label-gcs_poles_full.png 
    │   │   │   ├─ north » ................ label-gcs_poles_north.png 
    │   │   │   └─ south » ................ label-gcs_poles_south.png 
    │   │   └─ tropic                       
    │   │       ├─ cancer » ............... label-gcs_tropic_cancer.png 
    │   │       ├─ capricorn » ............ label-gcs_tropic_capricorn.png 
    │   │       └─ full » ................. label-gcs_tropic_full.png 
    │   └─ land                             
    │       ├─ large » .................... label-land_large.png 
    │       ├─ normalized » ............... label-land_normalized.png 
    │       └─ relative » ................. label-land_relative.png 
    │                                       
    ├─ land                                 [ ...map/land/ ] 
    │   ├─ d1MajorDetails                   
    │   │   ├─ fill » ..................... land-d1major_fill.png 
    │   │   └─ stroke » ................... land-d1major_stroke.png 
    │   ├─ d2MinorDetails                   
    │   │   ├─ fill » ..................... land-d2minor_fill.png 
    │   │   └─ stroke » ................... land-d2minor_stroke.png 
    │   └─ d3TinyDetails                    
    │       ├─ fill » ..................... land-d3tiny_fill.png 
    │       └─ stroke » ................... land-d3tiny_stroke.png 
    │                                       
    ├─ landlines                            [ ...map/landlines/ ] 
    │   ├─ horizontal                       
    │   │   ├─ d1MajorDetails » ........... line-horz_d1major.png 
    │   │   ├─ d2MinorDetails » ........... line-horz_d2minor.png 
    │   │   └─ d3TinyDetails » ............ line-horz_d3tiny.png 
    │   ├─ latitudinal                      
    │   │   ├─ d1MajorDetails » ........... line-lat_d1major.png 
    │   │   ├─ d2MinorDetails » ........... line-lat_d2minor.png 
    │   │   └─ d3TinyDetails » ............ line-lat_d3tiny.png 
    │   ├─ longitudinal                     
    │   │   ├─ d1MajorDetails » ........... line-long_d1major.png 
    │   │   ├─ d2MinorDetails » ........... line-long_d2minor.png 
    │   │   └─ d3TinyDetails » ............ line-long_d3tiny.png 
    │   └─ vertical                         
    │       ├─ d1MajorDetails » ........... line-vert_d1major.png 
    │       ├─ d2MinorDetails » ........... line-vert_d2minor.png 
    │       └─ d3TinyDetails » ............ line-vert_d3tiny.png 
    │                                       
    └─ titlebox                             [ ...map/titlebox/... ] 
        ├─ frame                            
        │   ├─ combined                     [ ...titlebox/frame_combined ] 
        │   │   ├─ duck » ................. titlebox-frame_combined_duck.png 
        │   │   │   ├─ shadowA » .......... titlebox-frame_combined_duck_shadow.png 
        │   │   │   └─ shadowB » .......... titlebox-frame_combined_duck_shadow_alt.png 
        │   │   ├─ picframe » ............. titlebox-frame_combined_picframe.png 
        │   │   │   └─ shadow » ........... titlebox-frame_combined_picframe_shadow.png 
        │   │   ├─ rounded » .............. titlebox-frame_combined_rounded.png 
        │   │   │   └─ shadow » ........... titlebox-frame_combined_rounded_shadow.png 
        │   │   └─ square » ............... titlebox-frame_combined_square.png 
        │   │       └─ shadow » ........... titlebox-frame_combined_square_shadow.png 
        │   ├─ fill                         [ ...titlebox/frame_fill ] 
        │   │   ├─ duck » ................. titlebox-frame_fill_duck.png 
        │   │   │   ├─ mergedA » .......... titlebox-frame_fill_duck_merged.png 
        │   │   │   ├─ mergedB » .......... titlebox-frame_fill_duck_merged_alt.png 
        │   │   │   ├─ shadowA » .......... titlebox-frame_fill_duck_shadow.png 
        │   │   │   └─ shadowB » .......... titlebox-frame_fill_duck_shadow_alt.png 
        │   │   ├─ picframe » ............. titlebox-frame_fill_picframe.png 
        │   │   │   ├─ merged » ........... titlebox-frame_fill_picframe.png 
        │   │   │   └─ shadow » ........... titlebox-frame_fill_picframe_shadow.png 
        │   │   ├─ rounded » .............. titlebox-frame_fill_rounded.png 
        │   │   │   ├─ merged » ........... titlebox-frame_fill_rounded.png 
        │   │   │   └─ shadow » ........... titlebox-frame_fill_rounded_shadow.png 
        │   │   └─ square » ............... titlebox-frame_fill_square.png 
        │   │       ├─ merged » ........... titlebox-frame_fill_square.png 
        │   │       └─ shadow » ........... titlebox-frame_fill_square_shadow.png 
        │   └─ stroke                       
        │       ├─ black                    [ ...titlebox/frame_stroke_black ]
        │       │   ├─ duck » ............. titlebox-frame_stroke_black_duck.png 
        │       │   │   ├─ shadowA » ...... titlebox-frame_stroke_black_duck_shadow.png 
        │       │   │   └─ shadowB » ...... titlebox-frame_stroke_black_duck_shadow_alt.png 
        │       │   ├─ picframe » ......... titlebox-frame_stroke_black_picframe.png 
        │       │   │   └─ shadow » ....... titlebox-frame_stroke_black_picframe_shadow.png 
        │       │   ├─ rounded » .......... titlebox-frame_stroke_black_rounded.png 
        │       │   │   └─ shadow » ....... titlebox-frame_stroke_black_rounded_shadow.png 
        │       │   └─ square » ........... titlebox-frame_stroke_black_square.png 
        │       │       └─ shadow » ....... titlebox-frame_stroke_black_square_shadow.png 
        │       └─ white                    [ ...titlebox/frame_stroke_white ]
        │           ├─ duck » ............. titlebox-frame_stroke_white_duck.png 
        │           │   ├─ shadowA » ...... titlebox-frame_stroke_white_duck_shadow.png 
        │           │   └─ shadowB » ...... titlebox-frame_stroke_white_duck_shadow_alt.png 
        │           ├─ picframe » ......... titlebox-frame_stroke_white_picframe.png 
        │           │   └─ shadow » ....... titlebox-frame_stroke_white_picframe_shadow.png 
        │           ├─ rounded » .......... titlebox-frame_stroke_white_rounded.png 
        │           │   └─ shadow » ....... titlebox-frame_stroke_white_rounded_shadow.png 
        │           └─ square » ........... titlebox-frame_stroke_white_square.png 
        │               └─ shadow » ....... titlebox-frame_stroke_white_square_shadow.png 
        └─ text                             
            ├─ black                        [ .../text_black ]
            │   ├─ body » ................. titlebox-text_black_body.png 
            │   ├─ full » ................. titlebox-text_black_full.png 
            │   └─ title » ................ titlebox-text_black_title.png 
            └─ white                        [ .../text_white ]
                ├─ body » ................. titlebox-text_white_body.png 
                ├─ full » ................. titlebox-text_white_full.png 
                └─ title » ................ titlebox-text_white_title.png 
                                            
*/

// generate a list of all the PNGs in the png/map folder (path, incl subfolders, extension regexp)
const pngMapContext = require.context('../assets/png/map', true, /\.png$/);

export const mapAssetPNGs = Object.fromEntries(
    pngMapContext.keys().map((_path) => {
        // first, ensure path is a string
        const path = _path == null ? '' : String(_path);
        // next, normalze path by removing 
        const normalizedPath = path.startsWith('./') ? path.slice(2) : path;
        // next, create a Webpack-friendly asset module out of the path 
        const assetModule = pngMapContext(path);
        // last, extract the URL from the asset module, and return the normalized path plus url 
        const url = assetModule == null ? null : assetModule.default == null ? assetModule : assetModule.default;
        return [normalizedPath, url];
    })
);

/**
 * Gets an asset URL for a map PNG, able to be directly assigned to img.src
 * @param {string} path Path to the image, relative to `src/assets/png/map/` (does not have to end in `.png`, added if missing)
 * @returns {string}
 */
export const getMapAsset = (path) => {
    if (!path.endsWith('.png')) {
        path += path.endsWith('.') ? 'png' : '.png';
    }
    return mapAssetPNGs[path];
};

console.log(mapAssetPNGs);
console.log(getMapAsset('gcs/gcs-complete'));

// import {
//     'gcs-complete.png' as gcsComplete,
// 'gcs-equator_dotted.png',
// 'gcs-equator_solid.png',
// 'gcs-equator_tropics_polar_circles.png',
// 'gcs-latitude_with_dotted_equator.png',
// 'gcs-latitude_with_tropics_and_polar_circles.png',
// 'gcs-latitude.png',
// 'gcs-latlong_15deg_dotted.png',
// 'gcs-latlong_30deg_dotted.png',
// 'gcs-latlong_with_dotted_equator_meridians.png',
// 'gcs-latlong.png',
// 'gcs-longitude_with_dotted_meridians.png',
// 'gcs-longitude.png',
// 'gcs-polar_circles.png',
// 'gcs-tropics_and_polar_circles.png',
// 'gcs-tropics.png'
// } from '../assets/png/map/gcs/';



export function testExport() {
}




/**
 * Create a nested hierarchy of nodes and children, to hold the given values in a tree structure
 * @param {any} value 
 * @param {object[]} children 
 * @returns {object}
 */
function nestedPath(path, children = {}) {
    // create new node 
    const node = Object.create(null);

    if (path == null || !isString(path)) { path = ''; }

    // define the path property 
    Object.defineProperty(node, 'path', {
        get: () => path,
        enumerable: true,
    });

    // define default methods to retrieve the path
    node.toString = () => path;
    node.valueOf = () => path;
    node.value = path == null ? '' : String(path);
    // node.path = path == null ? '' : String(path);

    // define the implicit primitive value based on hint 
    node[Symbol.toPrimitive] = (hint) => {
        // return null/undefined value directly 
        if (value == null) { return value; }
        switch (hint) {
            case 'number':
                // seeking a number 
                return EnsureToNumber(value);
            case 'string':
                // seeking a string 
                return String(value);
            case 'boolean':
                // seeking a boolean 
                switch (typeof value) {
                    case 'boolean':
                        return value;
                    case 'string':
                        if (isBlank(value)) { return false; }
                        let v = value.toLowerCase();
                        if (v == '0' || v.startsWith('f')) { return false; }
                        if (v == '1' || v.startsWith('t')) { return false; }
                        return Boolean(value);
                    default:
                        return Boolean(value);
                }
            case 'object':
            default:
                // seeking an object, or something else - just return the value  
                return value;
        }
    }

    // ensure children are appropriately assigned 
    Object.assign(node, children);

    // freeze and return node 
    return Object.freeze(node);
}

/*

export {
    'gcs-complete.png',
    'gcs-equator_dotted.png',
    'gcs-equator_solid.png',
    'gcs-equator_tropics_polar_circles.png',
    'gcs-latitude_with_dotted_equator.png',
    'gcs-latitude_with_tropics_and_polar_circles.png',
    'gcs-latitude.png',
    'gcs-latlong_15deg_dotted.png',
    'gcs-latlong_30deg_dotted.png',
    'gcs-latlong_with_dotted_equator_meridians.png',
    'gcs-latlong.png',
    'gcs-longitude_with_dotted_meridians.png',
    'gcs-longitude.png',
    'gcs-polar_circles.png',
    'gcs-tropics_and_polar_circles.png',
    'gcs-tropics.png'
} from '../../assets/png/map/gcs/';

export {
    'label-gcs_equator',
    'label-gcs_latitude_15deg',
    'label-gcs_latitude_30deg',
    'label-gcs_latlong_15deg',
    'label-gcs_latlong_30deg',
    'label-gcs_longitude_15deg',
    'label-gcs_longitude_30deg',
    'label-gcs_meridian_antimeridian',
    'label-gcs_meridian_full',
    'label-gcs_meridian_primemeridian',
    'label-gcs_polarcircle_antarctic',
    'label-gcs_polarcircle_arctic',
    'label-gcs_polarcircle_full',
    'label-gcs_poles_full',
    'label-gcs_poles_north',
    'label-gcs_poles_south',
    'label-gcs_tropic_cancer',
    'label-gcs_tropic_capricorn',
    'label-gcs_tropic_full',
    'label-land_large',
    'label-land_normalized',
    'label-land_relative'
} from '../../assets/png/map/land/labels';

export {
    'land-d1major_fill.png',
    'land-d2minor_fill.png',
    'land-d3tiny_fill.png',
    'land-d1major_stroke.png',
    'land-d2minor_stroke.png',
    'land-d3tiny_stroke.png'
} from '../../assets/png/map/land/';

export {
    'line-horz_d1major.png',
    'line-horz_d2minor.png',
    'line-horz_d3tiny.png',
    'line-lat_d1major.png',
    'line-lat_d2minor.png',
    'line-lat_d3tiny.png',
    'line-long_d1major.png',
    'line-long_d2minor.png',
    'line-long_d3tiny.png',
    'line-vert_d1major.png',
    'line-vert_d2minor.png',
    'line-vert_d3tiny.png'
} from '../../assets/png/map/landlines/';

export {

    'border_combined/titlebox-frame_combined_duck_shadow_alt.png',
    'border_combined/titlebox-frame_combined_duck_shadow.png',
    'border_combined/titlebox-frame_combined_duck.png',
    'border_combined/titlebox-frame_combined_picframe_shadow.png',
    'border_combined/titlebox-frame_combined_picframe.png',
    'border_combined/titlebox-frame_combined_rounded_shadow.png',
    'border_combined/titlebox-frame_combined_rounded.png',
    'border_combined/titlebox-frame_combined_square_shadow.png',
    'border_combined/titlebox-frame_combined_square.png',

    'border_fill/titlebox-frame_fill_duck_merged_alt.png',
    'border_fill/titlebox-frame_fill_duck_merged.png',
    'border_fill/titlebox-frame_fill_duck_shadow_alt.png',
    'border_fill/titlebox-frame_fill_duck_shadow.png',
    'border_fill/titlebox-frame_fill_duck.png',
    'border_fill/titlebox-frame_fill_picframe_merged.png',
    'border_fill/titlebox-frame_fill_picframe_shadow.png',
    'border_fill/titlebox-frame_fill_picframe.png',
    'border_fill/titlebox-frame_fill_rounded_merged.png',
    'border_fill/titlebox-frame_fill_rounded_shadow.png',
    'border_fill/titlebox-frame_fill_rounded.png',
    'border_fill/titlebox-frame_fill_square_merged.png',
    'border_fill/titlebox-frame_fill_square_shadow.png',
    'border_fill/titlebox-frame_fill_square.png',

    'border_stroke_black/titlebox-frame_stroke_black_duck_shadow_alt.png',
    'border_stroke_black/titlebox-frame_stroke_black_duck_shadow.png',
    'border_stroke_black/titlebox-frame_stroke_black_duck.png',
    'border_stroke_black/titlebox-frame_stroke_black_picframe_shadow.png',
    'border_stroke_black/titlebox-frame_stroke_black_picframe.png',
    'border_stroke_black/titlebox-frame_stroke_black_rounded_shadow.png',
    'border_stroke_black/titlebox-frame_stroke_black_rounded.png',
    'border_stroke_black/titlebox-frame_stroke_black_square_shadow.png',
    'border_stroke_black/titlebox-frame_stroke_black_square.png',

    'border_stroke_white/titlebox-frame_stroke_white_duck_shadow_alt.png',
    'border_stroke_white/titlebox-frame_stroke_white_duck_shadow.png',
    'border_stroke_white/titlebox-frame_stroke_white_duck.png',
    'border_stroke_white/titlebox-frame_stroke_white_picframe_shadow.png',
    'border_stroke_white/titlebox-frame_stroke_white_picframe.png',
    'border_stroke_white/titlebox-frame_stroke_white_rounded_shadow.png',
    'border_stroke_white/titlebox-frame_stroke_white_rounded.png',
    'border_stroke_white/titlebox-frame_stroke_white_square_shadow.png',
    'border_stroke_white/titlebox-frame_stroke_white_square.png',

    'text_black/titlebox-text_black_body.png',
    'text_black/titlebox-text_black_full.png',
    'text_black/titlebox-text_black_title.png',

    'text_white/titlebox-text_white_body.png',
    'text_white/titlebox-text_white_full.png',
    'text_white/titlebox-text_white_title.png'

} from '../../assets/png/map/titlebox/';
*/
