/* functionality related to the Art window */

import * as THREE from 'three';
import * as ui from './ui';
import { canvasInner } from './uiArt';

export function SetupArtWindow() {
    CreateDemo3DScene();
}

function CreateDemo3DScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        premultipliedAlpha: false
    });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    
    // renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setSize(canvasInner.offsetWidth * 1, canvasInner.offsetHeight * 1, false);
    
    scene.add(cube);
    camera.position.z = 5;
    renderer.setAnimationLoop(Animate);
    function Animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;
        renderer.render(scene, camera);
    }
    // renderer.domElement.id = 'threeJS';
    ui.AddClassToDOMs('threeJS', renderer.domElement);
    canvasInner.appendChild(renderer.domElement);
}
