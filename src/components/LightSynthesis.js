import * as THREE from 'three';
import { gsap } from 'gsap';

export class LightSynthesis {
  constructor() {
    this.group = new THREE.Group();
    this.createDivineWord();
    this.createAdamCadman();
    this.createFirmament();
    this.setupAnimations();
  }

  createDivineWord() {
    // Create divine word energy structure
    const wordGeometry = new THREE.TorusKnotGeometry(2, 0.3, 128, 16);
    const wordMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    });
    
    this.divineWord = new THREE.Mesh(wordGeometry, wordMaterial);
    
    // Add energy streams
    const streamCount = 12;
    this.streams = [];
    
    for (let i = 0; i < streamCount; i++) {
      const streamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
      const streamMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / streamCount, 1, 0.7),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      
      const stream = new THREE.Mesh(streamGeometry, streamMaterial);
      const angle = (i / streamCount) * Math.PI * 2;
      stream.position.x = Math.cos(angle) * 2;
      stream.position.z = Math.sin(angle) * 2;
      stream.lookAt(new THREE.Vector3(0, 0, 0));
      
      this.streams.push(stream);
      this.divineWord.add(stream);
    }
    
    this.group.add(this.divineWord);
  }

  createAdamCadman() {
    // Create first and last Adam Cadman representations
    const adamGeometry = new THREE.DodecahedronGeometry(1, 1);
    
    // First Adam
    const firstAdamMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ffff,
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    this.firstAdam = new THREE.Mesh(adamGeometry, firstAdamMaterial);
    this.firstAdam.position.x = -3;
    
    // Last Adam
    const lastAdamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa88,
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    this.lastAdam = new THREE.Mesh(adamGeometry, lastAdamMaterial);
    this.lastAdam.position.x = 3;
    
    this.group.add(this.firstAdam);
    this.group.add(this.lastAdam);
  }

  createFirmament() {
    // Create firmament star field
    const starCount = 1000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      starPositions[i] = radius * Math.sin(theta) * Math.cos(phi);
      starPositions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
      starPositions[i + 2] = radius * Math.cos(theta);
      
      const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8);
      starColors[i] = color.r;
      starColors[i + 1] = color.g;
      starColors[i + 2] = color.b;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.firmament = new THREE.Points(starGeometry, starMaterial);
    this.group.add(this.firmament);
  }

  setupAnimations() {
    // Animate divine word
    gsap.to(this.divineWord.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    // Animate Adam forms
    [this.firstAdam, this.lastAdam].forEach((adam, i) => {
      gsap.to(adam.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 15 + i * 5,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(adam.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 2 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  animate(time) {
    // Animate divine word streams
    this.streams.forEach((stream, i) => {
      stream.scale.y = 1 + Math.sin(time * 2 + i) * 0.2;
      stream.material.opacity = 0.3 + Math.sin(time * 3 + i) * 0.1;
    });
    
    // Pulse Adam forms
    [this.firstAdam, this.lastAdam].forEach((adam) => {
      adam.material.opacity = 0.4 + Math.sin(time * 2) * 0.1;
    });
    
    // Animate firmament
    this.firmament.rotation.y += 0.0005;
    this.firmament.material.opacity = 0.7 + Math.sin(time) * 0.1;
  }

  getMesh() {
    return this.group;
  }
}