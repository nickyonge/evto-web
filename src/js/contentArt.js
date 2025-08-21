/* functionality related to the Art window */

import * as THREE from 'three';
import * as ui from './ui';
import { canvasInner } from './uiArt';

export function SetupArtWindow() {
    Create3DScene();
}

let scene;
let camera;
let renderer;
let canvas;
let demoCube;

const upscaleFactor = 2;

const cameraNearClip = 1;
const cameraFarClip = 12;
const useOrthographicCamera = false;
const camOrthoDivFactor = 128;
const camPerspectiveFOV = 25;

/** enables 3JS renderer antialiasing and premultiplied alpha. Expensive. @type {Boolean} */
const hqVisuals = true;

const useDemoCube = true;

function Create3DScene() {
    scene = new THREE.Scene();
    if (useOrthographicCamera) {
        camera = new THREE.OrthographicCamera(sceneWidth() / - camOrthoDivFactor, sceneWidth() / camOrthoDivFactor, sceneHeight() / camOrthoDivFactor, sceneHeight() / - camOrthoDivFactor, cameraNearClip, cameraFarClip);
    } else {
        camera = new THREE.PerspectiveCamera(camPerspectiveFOV, sceneAspect(), cameraNearClip, cameraFarClip);
    }
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: hqVisuals,
        premultipliedAlpha: hqVisuals
    });
    canvas = renderer.domElement;
    if (useDemoCube) {
        const demoCubeGeo = new THREE.BoxGeometry(1, 1, 1);
        const demoCubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        demoCube = new THREE.Mesh(demoCubeGeo, demoCubeMat);
        scene.add(demoCube);
    }

    renderer.setSize(sceneWidth() * upscaleFactor, sceneHeight() * upscaleFactor, false);

    camera.position.z = 6.9;
    renderer.setAnimationLoop(ThreeJSFrame);
    ui.AddClassToDOMs('threeJS', canvas);
    canvasInner.appendChild(canvas);
}

export function ThreeJSFrame() {
    
    if (useDemoCube) {
        demoCube.rotation.x += 0.01;
        demoCube.rotation.y += 0.015;
    }

    renderer.render(scene, camera);
}


function sceneWidth() { return canvasInner.offsetWidth; }
function sceneHeight() { return canvasInner.offsetHeight; }
function sceneAspect() { sceneHeight(); return !sceneHeight() ? 0 : sceneWidth() / sceneHeight(); }
