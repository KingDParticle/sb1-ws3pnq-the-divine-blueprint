import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';
import { FlowerOfLife } from './components/FlowerOfLife';
import { LightVibrations } from './components/LightVibrations';
import { BrotherhoodOfLight } from './components/BrotherhoodOfLight';
import { CosmicBackground } from './components/CosmicBackground';
import { MetatronsCube } from './components/MetatronsCube';
import { LightSynthesis } from './components/LightSynthesis';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
composer.addPass(renderPass);
composer.addPass(bloomPass);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.z = 15;

// Create components
const background = new CosmicBackground();
scene.add(background.getMesh());

const flowerOfLife = new FlowerOfLife();
scene.add(flowerOfLife.getMesh());

const lightVibrations = new LightVibrations();
scene.add(lightVibrations.getMesh());

const brotherhood = new BrotherhoodOfLight();
scene.add(brotherhood.getMesh());

const metatronsCube = new MetatronsCube();
scene.add(metatronsCube.getMesh());

const lightSynthesis = new LightSynthesis();
scene.add(lightSynthesis.getMesh());

// Animation
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.005;
  
  background.animate(time);
  flowerOfLife.animate(time);
  lightVibrations.animate(time);
  brotherhood.animate(time);
  metatronsCube.animate(time);
  lightSynthesis.animate(time);
  
  controls.update();
  composer.render();
}

// Show text overlay
setTimeout(() => {
  document.getElementById('overlay').style.opacity = 1;
}, 1000);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

animate();