// @ts-check

import { EnsureToNumber, isBlank, isString } from "./lilutils";

/** debug output to confirm getMapAsset functionality */
const DEBUG_GET_MAP_ASSET = false;

// #region Map Viz

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

// #endregion Map Viz

// #region Assets Retrieval

// @ts-ignore generate a list of all the PNGs in the png/map folder (path, incl subfolders, extension regexp) 
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
 * 
 * **Note:** so long as image is a valid png in the `src/assets/png/map/` directory, 
 * you should be able to simply type the name of the asset and it will be retrieved - eg, `gcs-complete`.
 * @param {string} path Path to the image, relative to `src/assets/png/map/` (does not have to end in `.png`, added if missing)
 * @returns {string}
 */
export const getMapAsset = (path) => {
    // ensure path is valid
    console.if(DEBUG_GET_MAP_ASSET, "Attempting to parse path: \n" + path);
    if (path == null || typeof path !== 'string') {
        console.warn(`can't get map asset from null/invalid path ${path}, returning null`, path);
        return null;
    }
    // ensure path starts with valid subfolder 
    let hyphenIndex = path.indexOf('-');
    if (hyphenIndex == -1) { console.warn(`WARNING: map asset path MUST contain a hyphen to indicate target folder, path: ${path}`, path); }
    let folderIndex = path.indexOf('/');
    let lastFolderIndex = path.lastIndexOf('/');
    let targetFolder = path.slice(lastFolderIndex + 1, hyphenIndex);
    let asset = path.slice(lastFolderIndex + 1); // filename without png 
    if (asset.toLowerCase().endsWith('png')) {
        asset = asset.slice(0, asset.length - (asset.toLowerCase().endsWith('.png') ? 4 : 3))
    }
    if (folderIndex == -1) {
        // no subfolder specified
        if (hyphenIndex > 0) {
            // yes, path has a hyphen
            let targetFolder = path.slice(0, hyphenIndex);
            switch (targetFolder) {
                case 'gcs':
                    path = 'gcs/' + path;
                    break;
                case 'label':
                    path = 'labels/' + path;
                    break;
                case 'land':
                    path = 'land/' + path;
                    break;
                case 'line':
                    path = 'landlines/' + path;
                    break;
                case 'titlebox':
                    // more complex, check titlebox subfolders
                    let pathPrefix = 'titlebox/';
                    let dir = path.slice(hyphenIndex + 1)?.split('_');
                    if (dir == null) { console.warn(`WARNING: invalid path ${path} in titlebox subdir, dir null`, path); return null; }
                    if (dir.length == 0) { console.warn(`WARNING: invalid path ${path} in titlebox subdir, dir empty`, path); return null; }
                    // iteratively check subfolders, adding path prefixes as we go 
                    switch (dir[0]) {
                        case 'frame':
                            pathPrefix += 'frame_';
                            switch (dir[1]) {
                                case 'combined':
                                case 'fill':
                                    pathPrefix += dir[1];
                                    break;
                                case 'stroke':
                                    pathPrefix += 'stroke_';
                                    switch (dir[2]) {
                                        case 'black':
                                            pathPrefix += 'black';
                                            break;
                                        case 'white':
                                            pathPrefix += 'white';
                                            break;
                                        default:
                                            console.warn(`WARNING: invalid path ${path} in titlebox/frame/stroke subdir, dir[2] ${dir[2]} invalid, dir: ${dir}`, path);
                                            return null;
                                    }
                                    break;
                                default:
                                    console.warn(`WARNING: invalid path ${path} in titlebox/frame subdir, dir[1] ${dir[1]} invalid, dir: ${dir}`, path);
                                    return null;
                            }
                            break;
                        case 'text':
                            pathPrefix += 'text_';
                            switch (dir[1]) {
                                case 'black':
                                    pathPrefix += 'black';
                                    break;
                                case 'white':
                                    pathPrefix += 'white';
                                    break;
                                default:
                                    console.warn(`WARNING: invalid path ${path} in titlebox/text subdir, dir[1] ${dir[1]} invalid, dir: ${dir}`, path);
                                    return null;
                            }
                            break;
                        default:
                            console.warn(`WARNING: invalid path ${path} in titlebox subdir, dir[0] ${dir[0]} invalid, dir: ${dir}`, path);
                            return null;
                    }
                    // add determined path prefix
                    path = `${pathPrefix}/${path}`;
                    break;
            }
        }
    } else {
        // path does start with a folder, ensure valid
        let folder = path.slice(0, folderIndex);
        switch (targetFolder) {
            // compare folder (the first defined value before /) and targetFolder (the value between the last / and - )
            case 'gcs': if (folder != 'gcs') { console.warn(`WARNING: folder ${folder} and targetFolder ${targetFolder} mismatch, can't get png map asset`, path); return null; } break;
            case 'label': if (folder != 'labels') { console.warn(`WARNING: folder ${folder} and targetFolder ${targetFolder} mismatch, can't get png map asset`, path); return null; } break;
            case 'land': if (folder != 'land') { console.warn(`WARNING: folder ${folder} and targetFolder ${targetFolder} mismatch, can't get png map asset`, path); return null; } break;
            case 'line': if (folder != 'landlines') { console.warn(`WARNING: folder ${folder} and targetFolder ${targetFolder} mismatch, can't get png map asset`, path); return null; } break;
            case 'titlebox':
                if (folderIndex == lastFolderIndex) {
                    // failed to insert specific titlebox subfolder
                    console.warn(`WARNING: failed to specify unique titlebox subfolder, ensure to specify it, attempting to infer from asset name: ${asset}`, path);
                    return getMapAsset(asset);
                }
                let subfolder = path.slice(folderIndex + 1, lastFolderIndex);
                if (subfolder.indexOf('/') == -1) { console.warn(`WARNING: too many titlebox subfolders specified: ${subfolder}`, path); return null; }
                switch (subfolder) {
                    case 'frame_combined':
                    case 'frame_fill':
                    case 'frame_stroke_black':
                    case 'frame_stroke_white':
                    case 'text_black':
                    case 'text_white':
                        // valid!
                        break;
                    default:
                        console.warn(`WARNING: Invalid titlebox subfolder ${subfolder}`, path);
                        return null;
                }
                break;
        }
    }
    // ensure path ends with .png 
    if (!path.endsWith('.png')) {
        path += path.endsWith('.') ? 'png' : '.png';
    }
    console.if(DEBUG_GET_MAP_ASSET, "Success! Attempting to get map asset from path: \n" + path);
    path = mapAssetPNGs[path];
    if (path == null || isBlank(path)) { console.warn(`WARNING: mapAssetPNG not found at path ${path}, ensure asset ${asset}.png exists in mapAssetPNGs \n`, mapAssetPNGs); return undefined; }
    return path;
};

// #endregion Assets Retrieval

// #region Construction & Typedef

/**
 * @typedef {{}} deadNode Node of a {@link nestedPath}, with neither a filepath URL nor children
 */
/**
 * @typedef {{URL:string}} leafNode Node of a {@link nestedPath}, with a filepath URL and no children
 * @property {string} URL Filepath stored into this node 
 */
/**
 * @typedef {{Children:string[]}} containerNode Node of a {@link nestedPath}, with children but no filepath URL 
 * @property {string[]} Children Array of all child nodes nested in this node 
 */
/**
 * @typedef {{URL:string,Children:string[]}} nestedNode Node of a {@link nestedPath}, with both a filepath URL and children
 * @property {string} URL Filepath stored into this node 
 * @property {string[]} Children Array of all child nodes nested in this node 
 */

//* ------------------ deadNode (no url, no children) 
/**
 * Gets a {@linkcode deadNode} via {@linkcode nestedPath}, 
 * which contains neither `URL` nor any child nodes.
 * @overload containerNode - no url, no children 
 * @returns {deadNode}
 */
//* ------------------ deadNode (undefined url, no children) 
/**
 * Gets a {@linkcode deadNode} via {@linkcode nestedPath}, 
 * which contains neither `URL` nor any child nodes.
 * @overload containerNode - no url, no children 
 * @param {undefined|null} assetPath `undefined`/`null` path, passed directly to {@linkcode nestedAsset} 
 * @returns {deadNode}
 */
//* ------------------ deadNode (undefined url, undefined children) 
/**
 * Gets a {@linkcode deadNode} via {@linkcode nestedPath}, 
 * which contains neither `URL` nor any child nodes.
 * @overload containerNode - no url, no children 
 * @param {undefined|null} assetPath `undefined`/`null` path, passed directly to {@linkcode nestedAsset} 
 * @param {undefined|null} children `undefined`/`null` children, node has no children 
 * @returns {deadNode}
 */
//* ------------------ leafNode (yes url, no children) 
/**
 * Gets a {@linkcode leafNode} via {@linkcode nestedPath}, 
 * which contains a `URL` parsed via {@linkcode getMapAsset}.
 * @overload nestedAsset(assetPath); // yes url, no children 
 * @param {string} assetPath path, passed thru {@linkcode getMapAsset} before passing to {@linkcode nestedAsset} 
 * @returns {leafNode} 
*/
//* ------------------ leafNode (yes url, undefined children) 
/**
 * Gets a {@linkcode leafNode} via {@linkcode nestedPath}, 
 * which contains a `URL` parsed via {@linkcode getMapAsset}.
 * @overload nestedAsset(assetPath); // yes url, no children 
 * @param {string} assetPath path, passed thru {@linkcode getMapAsset} before passing to {@linkcode nestedAsset} 
 * @param {undefined|null} children `undefined`/`null` children, node has no children 
 * @returns {leafNode} 
*/
//* ------------------ containerNode (no url, yes children) 
/**
 * Gets a {@linkcode containerNode} via {@linkcode nestedPath}, 
 * which contains child nodes but does not itself have a `URL`. 
 * @template {Record<string, any>} nestedChildren 
 * @overload containerNode - no url, yes children
 * @param {nestedChildren} children Children of this node 
 * @returns {containerNode & { [key in keyof nestedChildren]: nestedChildren[key] }}
 */
//* ------------------ containerNode (undefined url, yes children) 
/**
 * Gets a {@linkcode containerNode} via {@linkcode nestedPath}, 
 * which contains child nodes but does not itself have a `URL`. 
 * @template {Record<string, any>} nestedChildren 
 * @overload containerNode - no url, yes children
 * @param {undefined|null} assetPath `undefined`/`null` path, passed directly to {@linkcode nestedAsset} 
 * @param {nestedChildren} children Children of this node 
 * @returns {containerNode & { [key in keyof nestedChildren]: nestedChildren[key] }}
 */
//* ------------------ nestedNode (yes url, yes children) 
/**
 * Gets a {@linkcode nestedNode} via {@linkcode nestedPath}, which contains
 * children of its own, and a `URL` parsed via {@linkcode getMapAsset}.
 * @template {Record<string, any>} nestedChildren 
 * @overload nestedNode - yes url, yes children 
 * @param {string} assetPath path, passed thru {@linkcode getMapAsset} before passing to {@linkcode nestedAsset} 
 * @param {nestedChildren} children Children of this node 
 * @returns {nestedNode & { [key in keyof nestedChildren]: nestedChildren[key] }}
 */
//* ------------------ general node fallback implementation 
/**
 * @template {Record<string, any>} [nestedChildren=Record<string, never>]
 * @param {string|undefined|null} assetPath path, passed thru {@linkcode getMapAsset} before passing to {@linkcode nestedAsset} 
 * @param {nestedChildren|undefined|null} [children = undefined] Optional children of this node 
 * @returns {(nestedNode | nestedNode & { [key in keyof nestedChildren]: nestedChildren[key] } | containerNode | containerNode & { [key in keyof nestedChildren]: nestedChildren[key] } | leafNode | deadNode)}
 */
function nestedAsset(assetPath, children = undefined) {
    if (assetPath === undefined) {
        return nestedPath(undefined, children);
    }
    return nestedPath(getMapAsset(assetPath), children);
}

/**
 * Create a nested hierarchy of {@link nestedNode nestedNodes}, to hold the given values in a tree structure
 * @param {string} path Filepath stored into this node 
 * @param {object} children Optional children of this node 
 * @returns {nestedNode}
 */
function nestedPath(path, children = undefined) {
    // create new node 
    const node = Object.create(null);

    if (path == null || !isString(path)) { path = ''; }

    // define the path property 
    Object.defineProperty(node, 'URL', {
        get: () => path,
        enumerable: path != '', // only enumerable if path exists 
    });

    // define default methods to retrieve the path
    node.toString = () => path;
    node.valueOf = () => path;
    node.value = path == null ? '' : String(path);

    // define the implicit primitive value based on hint 
    node[Symbol.toPrimitive] = (hint) => {
        // return null/undefined value directly 
        if (path == null) { return path; }
        switch (hint) {
            case 'number':
                // seeking a number 
                return EnsureToNumber(path);
            case 'string':
                // seeking a string 
                return String(path);
            case 'boolean':
                // seeking a boolean 
                switch (typeof path) {
                    case 'boolean':
                        return path;
                    case 'string':
                        if (isBlank(path)) { return false; }
                        let p = path.toLowerCase();
                        if (p == '0' || p.startsWith('f')) { return false; }
                        if (p == '1' || p.startsWith('t')) { return false; }
                        return Boolean(path);
                    default:
                        return Boolean(path);
                }
            case 'object':
            default:
                // seeking an object, or something else - just return the value 
                return path;
        }
    }

    // make children references accessible 
    let childList = children ? Object.keys(children) : [];
    Object.defineProperty(node, 'Children', {
        value: childList,
        writable: false,
        // get: () => childList,
        // enumerable: false, // skip enumeration altogether 
        enumerable: childList.length > 0, // only enumerable if children are present 
    });
    // ensure children are appropriately assigned
    Object.assign(node, children);

    // freeze and return node 
    return Object.freeze(node);
}

// #endregion Construction & Typedef

// #region Map Declaration 

/**
 * Nested map of all map PNG assets and their URL references (use `.URL`, or parse output as string)
 */
export const map = Object.freeze({
    gcs: nestedAsset(undefined, {
        complete: nestedAsset('gcs-complete'),
        equator: nestedAsset('gcs-equator_dotted', {
            dotted: nestedAsset('gcs-equator_dotted'),
            solid: nestedAsset('gcs-equator_solid'),
            tropicsAndPolarCircles: nestedAsset('gcs-equator_tropics_polar_circles'),
        }),
        latitude: nestedAsset('gcs-latitude', {
            equator: nestedAsset('gcs-latitude_with_dotted_equator'),
            tropicsAndPolarCircles: nestedAsset('gcs-latitude_with_tropics_and_polar_circles'),
        }),
        latLong: nestedAsset('gcs-latlong', {
            deg15: nestedAsset('gcs-latlong_15deg_dotted'),
            deg30: nestedAsset('gcs-latlong_30deg_dotted'),
            equatorAndMeridians: nestedAsset('gcs-latlong_with_dotted_equator_meridians'),
        }),
        longitude: nestedAsset('gcs-longitude', {
            meridians: nestedAsset('gcs-longitude_with_dotted_meridians'),
        }),
        tropics: nestedAsset('gcs-latitude', {
            polarCircles: nestedAsset('gcs-tropics_and_polar_circles', {
                equator: nestedAsset('gcs-equator_tropics_polar_circles')
            }),
        }),
        polarCircles: nestedAsset('gcs-latitude', {
            tropics: nestedAsset('gcs-tropics_and_polar_circles', {
                equator: nestedAsset('gcs-equator_tropics_polar_circles')
            }),
        }),
    }),

    labels: nestedAsset(undefined, {
        gcs: nestedAsset(undefined, {
            latitude: nestedAsset(undefined, {
                deg15: nestedAsset('label-gcs_latitude_15deg'),
                deg30: nestedAsset('label-gcs_latitude_15deg'),
            }),
            latLong: nestedAsset(undefined, {
                deg15: nestedAsset('label-gcs_latlong_15deg'),
                deg30: nestedAsset('label-gcs_latlong_30deg'),
            }),
            longitude: nestedAsset(undefined, {
                deg15: nestedAsset('label-gcs_longitude_15deg'),
                deg30: nestedAsset('label-gcs_longitude_30deg'),
            }),
            meridian: nestedAsset(undefined, {
                anti: nestedAsset('label-gcs_meridian_antimeridian'),
                full: nestedAsset('label-gcs_meridian_full'),
                prime: nestedAsset('label-gcs_meridian_primemeridian'),
            }),
            polarCircle: nestedAsset(undefined, {
                antarctic: nestedAsset('label-gcs_polarcircle_antarctic'),
                arctic: nestedAsset('label-gcs_polarcircle_arctic'),
                full: nestedAsset('label-gcs_polarcircle_full'),
            }),
            poles: nestedAsset(undefined, {
                full: nestedAsset('label-gcs_poles_full'),
                north: nestedAsset('label-gcs_poles_north'),
                south: nestedAsset('label-gcs_poles_south'),
            }),
            tropic: nestedAsset(undefined, {
                capricorn: nestedAsset('label-gcs_tropic_cancer'),
                cancer: nestedAsset('label-gcs_tropic_capricorn'),
                full: nestedAsset('label-gcs_tropic_full'),
            }),
        }),
        land: nestedAsset(undefined, {
            large: nestedAsset('label-land_large'),
            normalzed: nestedAsset('label-land_normalized'),
            relative: nestedAsset('label-land_relative'),
        }),
    }),

    land: nestedAsset(undefined, {
        d1MajorDetails: nestedAsset(undefined, {
            fill: nestedAsset('land-d1major_fill'),
            stroke: nestedAsset('land-d1major_stroke'),
        }),
        d2MinorDetails: nestedAsset(undefined, {
            fill: nestedAsset('land-d2minor_fill'),
            stroke: nestedAsset('land-d2minor_stroke'),
        }),
        d3TinyDetails: nestedAsset(undefined, {
            fill: nestedAsset('land-d3tiny_fill'),
            stroke: nestedAsset('land-d3tiny_stroke'),
        }),
    }),

    landlines: nestedAsset(undefined, {
        horizontal: nestedAsset(undefined, {
            d1MajorDetails: nestedAsset('line-horz_d1major'),
            d2MinorDetails: nestedAsset('line-horz_d2minor'),
            d3TinyDetails: nestedAsset('line-horz_d3tiny'),
        }),
        latitudinal: nestedAsset(undefined, {
            d1MajorDetails: nestedAsset('line-lat_d1major'),
            d2MinorDetails: nestedAsset('line-lat_d2minor'),
            d3TinyDetails: nestedAsset('line-lat_d3tiny'),
        }),
        longitudinal: nestedAsset(undefined, {
            d1MajorDetails: nestedAsset('line-long_d1major'),
            d2MinorDetails: nestedAsset('line-long_d2minor'),
            d3TinyDetails: nestedAsset('line-long_d3tiny'),
        }),
        vertical: nestedAsset(undefined, {
            d1MajorDetails: nestedAsset('line-vert_d1major'),
            d2MinorDetails: nestedAsset('line-vert_d2minor'),
            d3TinyDetails: nestedAsset('line-vert_d3tiny'),
        }),
    }),

    titlebox: nestedAsset(undefined, {
        frame: nestedAsset(undefined, {
            combined: nestedAsset(undefined, {
                duck: nestedAsset('titlebox-frame_combined_duck', {
                    shadowA: nestedAsset('titlebox-frame_combined_duck_shadow'),
                    shadowB: nestedAsset('titlebox-frame_combined_duck_shadow_alt'),
                }),
                picframe: nestedAsset('titlebox-frame_combined_picframe', {
                    shadow: nestedAsset('titlebox-frame_combined_picframe_shadow'),
                }),
                rounded: nestedAsset('titlebox-frame_combined_rounded', {
                    shadow: nestedAsset('titlebox-frame_combined_rounded_shadow'),
                }),
                square: nestedAsset('titlebox-frame_combined_square', {
                    shadow: nestedAsset('titlebox-frame_combined_square_shadow'),
                }),
            }),
            fill: nestedAsset(undefined, {
                duck: nestedAsset('titlebox-frame_fill_duck', {
                    mergedA: nestedAsset('titlebox-frame_fill_duck_merged'),
                    mergedB: nestedAsset('titlebox-frame_fill_duck_merged_alt'),
                    shadowA: nestedAsset('titlebox-frame_fill_duck_shadow'),
                    shadowB: nestedAsset('titlebox-frame_fill_duck_shadow_alt'),
                }),
                picframe: nestedAsset('titlebox-frame_fill_picframe', {
                    merged: nestedAsset('titlebox-frame_fill_picframe'),
                    shadow: nestedAsset('titlebox-frame_fill_picframe_shadow'),
                }),
                rounded: nestedAsset('titlebox-frame_fill_rounded', {
                    merged: nestedAsset('titlebox-frame_fill_rounded'),
                    shadow: nestedAsset('titlebox-frame_fill_rounded_shadow'),
                }),
                square: nestedAsset('titlebox-frame_fill_square', {
                    merged: nestedAsset('titlebox-frame_fill_square'),
                    shadow: nestedAsset('titlebox-frame_fill_square_shadow'),
                }),
            }),
            stroke: nestedAsset(undefined, {
                black: nestedAsset(undefined, {
                    duck: nestedAsset('titlebox-frame_stroke_black_duck', {
                        shadowA: nestedAsset('titlebox-frame_stroke_black_duck_shadow'),
                        shadowB: nestedAsset('titlebox-frame_stroke_black_duck_shadow_alt'),
                    }),
                    picframe: nestedAsset('titlebox-frame_stroke_black_picframe', {
                        shadow: nestedAsset('titlebox-frame_stroke_black_picframe_shadow'),
                    }),
                    rounded: nestedAsset('titlebox-frame_stroke_black_rounded', {
                        shadow: nestedAsset('titlebox-frame_stroke_black_rounded_shadow'),
                    }),
                    square: nestedAsset('titlebox-frame_stroke_black_square', {
                        shadow: nestedAsset('titlebox-frame_stroke_black_square_shadow'),
                    }),
                }),
                white: nestedAsset(undefined, {
                    duck: nestedAsset('titlebox-frame_stroke_white_duck', {
                        shadowA: nestedAsset('titlebox-frame_stroke_white_duck_shadow'),
                        shadowB: nestedAsset('titlebox-frame_stroke_white_duck_shadow_alt'),
                    }),
                    picframe: nestedAsset('titlebox-frame_stroke_white_picframe', {
                        shadow: nestedAsset('titlebox-frame_stroke_white_picframe_shadow'),
                    }),
                    rounded: nestedAsset('titlebox-frame_stroke_white_rounded', {
                        shadow: nestedAsset('titlebox-frame_stroke_white_rounded_shadow'),
                    }),
                    square: nestedAsset('titlebox-frame_stroke_white_square', {
                        shadow: nestedAsset('titlebox-frame_stroke_white_square_shadow'),
                    }),
                }),
            }),
        }),
        text: nestedAsset(undefined, {
            black: nestedAsset(undefined, {
                body: nestedAsset('titlebox-text_black_body'),
                full: nestedAsset('titlebox-text_black_full'),
                title: nestedAsset('titlebox-text_black_title'),
            }),
            white: nestedAsset(undefined, {
                body: nestedAsset('titlebox-text_white_body'),
                full: nestedAsset('titlebox-text_white_full'),
                title: nestedAsset('titlebox-text_white_title'),
            }),
        }),
    }),
    // regex used to get the start of all values and prefx "_"
    //   find: ^(\s+)([a-zA-Z0-9]+[:]\s\bnested[AP])
    //   replace: $1_$2
    // regex to undo that change:
    //   find: ^(\s+)([_])([a-zA-Z0-9]+[:]\s\bnested[AP])
    //   replace: $1$3
});

// #endregion Map Declaration 
