import * as three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LensflareElement,Lensflare } from 'three/addons/objects/Lensflare.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

const scene  = new three.Scene();

// ************* Camera Setup
const aspectRatio = window.innerWidth/window.innerHeight;
const camera = new three.PerspectiveCamera(75,aspectRatio,0.1,1000);
const cameraHelper = new three.CameraHelper(camera);
scene.add(cameraHelper);
camera.position.set(0,0,0);
//camera.lookAt(0,-500,-700);

const threeCanvas = document.getElementById('three-canvas');
const renderer = new three.WebGLRenderer({canvas:threeCanvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

//**************** Orbit Controls Setup
const orbitControls = new OrbitControls(camera,threeCanvas);
orbitControls.target.set(0,0,-700);

//********** First person controls setup
/*const firstPersonControls = new FirstPersonControls(camera,threeCanvas);
firstPersonControls.lookSpeed =0.01;
firstPersonControls.movementSpeed = 5;
var useFirstPerson = true;*/

// Exoplanet Setup
const exoPlanetSurfaceGeo = new three.SphereGeometry(500,128,128);
const exoPlanetTexturePath = 'media\\exoPlanetTexture.png';
const exoPlanetSurfaceTexture = new three.TextureLoader().load(exoPlanetTexturePath);
const exoPlanetMaterial = new three.MeshBasicMaterial({map:exoPlanetSurfaceTexture});
const exoPlanet = new three.Mesh(exoPlanetSurfaceGeo,exoPlanetMaterial);
exoPlanet.position.set(0,-500,-700);
//exoPlanet.rotation.x = -Math.PI / 2;
scene.add(exoPlanet);

function animate()
{
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene,camera);
}

animate();

//first person movement event handling
/*
document.addEventListener('keydown',(e)=>{
    switch(e.key){
        case 'ArrowUp':
            firstPersonControls._moveForward = true;
            break;
        case 'ArrowDown':
            firstPersonControls._moveBackward = true;
            break;
        case 'ArrowRight':
            firstPersonControls._moveRight = true;
            break;
        case 'ArrowLeft':
            firstPersonControls._moveLeft = true;
            break;
        case 'c':
            useFirstPerson = !useFirstPerson;                
    }
} );*/
 /*
document.addEventListener('keyup',(e)=>{
    switch(e.key){
        case 'ArrowUp':
            firstPersonControls._moveForward = false;
            break;
        case 'ArrowDown':
            firstPersonControls._moveBackward = false;
            break;
        case 'ArrowRight':
            firstPersonControls._moveRight = false;
            break;
        case 'ArrowLeft':
            firstPersonControls._moveLeft = false;            
    }
} );*/

// Handle window resizing
window.addEventListener('resize',()=>{
    camera.aspect =window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});