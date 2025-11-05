import type { pathNode as _pathNode } from './src/js/assetExporter';
import { _baseNode } from '../js/assetExporter';

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
    type pathNode = _pathNode;
}

export { };