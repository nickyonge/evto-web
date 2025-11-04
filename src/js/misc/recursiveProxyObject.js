import { ReturnStringNotBlank } from "../lilutils";

// script that creates a recursive proxy object - eg, an object with
// recursive values defined by its own reference.

// tbh i just put a lot of effort into this code and then realized a
// better way to achieve what I want to achieve (see assetExporter,
// the thing I'm using for nested reference to map images). I didn't
// wanna throw it away or even just delete it and lose it to the annals
// of the commit graph cuz tbh it could be useful someday! Maybe!
// So, /misc folder it is <3 

const defaultPath = '../../assets/png/map/';
const defaultExtension = '.png';

// const gcs = RecursiveProxyObject(AssetPath('gcs'), defaultExtension);

function testExport() {
    console.log("testing export");

    console.log("creating object");
    // let obj = RecursiveProxyObject("test", "end", '#');
    let gcs = RecursiveProxyObject(ReferenceAssetPath('gcs'), defaultExtension, '_', true);
    // let gcs = RecursiveProxyObject('pre', 'post', '.', true);
    // console.clear();
    console.log("testing: gcs.complete.equator");
    // console.log("test: " + obj.cookie.chocolatechip.mint);
    console.log(gcs.complete.equator); // object
    console.log(gcs["complete"]["equator"].toString());
    console.log(testValues(gcs, 'complete', 'equator'));
}

export function GetAssetPath(...assetPath) {
    assetPath
}

function testValues(object, ...values) {
    values = values.flat();
    return `${values.reduce((acc, key) => acc[key], object)}`;
}




function ReferenceAssetPath(reference) {
    switch (reference) {
        case 'gcs': return `${defaultPath}gcs/gcs-`;
    }
}

function Asset(assetFolderReference, assetName, assetExtension = defaultExtension) {
    let assetPath = '';
    switch (assetFolderReference) {
        case 'gcs':
            assetPath = '../../assets/png/map/gcs/gcs-';
            break;
    }
    return `${assetPath}${assetName}${assetExtension}`
}

// const gcs = {
//     complete: Asset('gcs', 'complete'),
//     equator: {
//         dotted: Asset('gcs', 'equator_dotted')
//     }
// }

/**
 * Take symbol values and recursively convert it to a string, or nested object
 * @param {string} [prefix=''] Optional prefix before values  
 * @param {string} [suffix=''] Optional suffix before values 
 * @param {boolean} [returnAsString=true] Return values converted to string? If not, returns directly as object 
 * @param {(string|symbol)[]} __path Internal reference to recursive path generation. Leave blank 
 * @returns {object|string} New object or string, with recursively-defined values  
 * @example 
 * let myObject = recursiveProxyObject()
 * console.log()
 */
function RecursiveProxyObject(prefix = '', suffix = '', separator = '.', returnAsString = true, __path = []) {
    return new Proxy({}, {
        get(_, property) {
            // porperty type conversion, in case of direct string casting+primitive, check to return final output 
            if (property === Symbol.toPrimitive || property === 'toString' || property === 'valueOf') {
                const result = `${ReturnStringNotBlank(prefix)}${__path.join(separator)}${ReturnStringNotBlank(suffix)}`;
                return () => (result);
            }
            return RecursiveProxyObject(prefix, suffix, separator, returnAsString, [...__path, property]);
        }
    });
}