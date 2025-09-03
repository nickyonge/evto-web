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

let lastCameraUpdate = 0;
let queueCameraUpdate = false;
const cameraUpdateInterval = 50;// min time in MS between camera updates

/** enables 3JS renderer antialiasing and premultiplied alpha. Expensive. @type {Boolean} */
const hqVisuals = true;

const useDemoCube = true;

function Create3DScene() {
    scene = new THREE.Scene();
    UpdateCamera();
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

    window.onresize = UpdateCamera;
    UpdateRendererSize();

    renderer.setAnimationLoop(ThreeJSFrame);
    ui.AddClassToDOMs('threeJS', canvas);
    canvasInner.appendChild(canvas);
}

export function UpdateCamera() {
    if (queueCameraUpdate) {
        return;
    }
    if (lastCameraUpdate == 0) {
        console.log("first camera update");
    } else {
        let camUpdateInterval = performance.now() - lastCameraUpdate;
        if (camUpdateInterval < cameraUpdateInterval) {
            queueCameraUpdate = true;
            console.log("Queueing update...");
            return;
        }
    }
    console.log("UPDATING CAMERA");
    if (useOrthographicCamera) {
        camera = new THREE.OrthographicCamera(sceneWidth() / - camOrthoDivFactor, sceneWidth() / camOrthoDivFactor, sceneHeight() / camOrthoDivFactor, sceneHeight() / - camOrthoDivFactor, cameraNearClip, cameraFarClip);
    } else {
        camera = new THREE.PerspectiveCamera(camPerspectiveFOV, sceneAspect(), cameraNearClip, cameraFarClip);
    }
    camera.position.z = 6.9;
    lastCameraUpdate = performance.now();
}
export function UpdateRendererSize() {
    renderer.setSize(sceneWidth() * upscaleFactor, sceneHeight() * upscaleFactor, false);
}

export function ThreeJSFrame() {

    if (useDemoCube) {
        demoCube.rotation.x += 0.01;
        demoCube.rotation.y += 0.015;
    }

    renderer.render(scene, camera);

    if (queueCameraUpdate) {
        if (performance.now() - lastCameraUpdate >= cameraUpdateInterval) {
            queueCameraUpdate = false;
            lastCameraUpdate = 0;// reset last cam update to force update
            UpdateCamera();
        }
    }
}


function sceneWidth() { return canvasInner.offsetWidth; }
function sceneHeight() { return canvasInner.offsetHeight; }
function sceneAspect() { sceneHeight(); return !sceneHeight() ? 0 : sceneWidth() / sceneHeight(); }
