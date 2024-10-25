import * as THREE from 'three';
import { gsap } from 'gsap';

export class AntiUniverse {
  constructor() {
    this.group = new THREE.Group();
    this.createBlackCube();
    this.createStarfieldEnergies();
    this.createDimensionalRift();
    this.setupAnimations();
  }

  createBlackCube() {
    // Create the black cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
    // Add energy grid to cube faces
    const gridHelper = new THREE.GridHelper(2, 10, 0x444444, 0x444444);
    gridHelper.rotation.x = Math.PI / 2;
    this.cube.add(gridHelper);
    
    const gridHelper2 = new THREE.GridHelper(2, 10, 0x444444, 0x444444);
    this.cube.add(gridHelper2);
    
    const gridHelper3 = new THREE.GridHelper(2, 10, 0x444444, 0x444444);
    gridHelper3.rotation.z = Math.PI / 2;
    this.cube.add(gridHelper3);
    
    this.group.add(this.cube);
  }

  createStarfieldEnergies() {
    // Create anti-matter starfield
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Create spiral distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 4;
      const height = (Math.random() - 0.5) * 4;
      
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = height;
      positions[i + 2] = Math.sin(angle) * radius;
      
      // Dark energy colors
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.5, 1, Math.random() * 0.2 + 0.1);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    const starfieldGeometry = new THREE.BufferGeometry();
    starfieldGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starfieldGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starfieldMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.starfield = new THREE.Points(starfieldGeometry, starfieldMaterial);
    this.group.add(this.starfield);
  }

  createDimensionalRift() {
    // Create dimensional destruction effect
    const riftGeometry = new THREE.TorusGeometry(3, 0.1, 16, 100);
    const riftMaterial = new THREE.MeshBasicMaterial({
      color: 0x660000,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    this.rift = new THREE.Mesh(riftGeometry, riftMaterial);
    
    // Add energy tendrils
    this.tendrils = [];
    const tendrilCount = 8;
    
    for (let i = 0; i < tendrilCount; i++) {
      const points = [];
      const segments = 50;
      
      for (let j = 0; j < segments; j++) {
        const angle = (j / segments) * Math.PI * 4 + (i / tendrilCount) * Math.PI * 2;
        const radius = 2 + Math.sin(angle * 2) * 0.5;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 3) * 0.5,
          Math.sin(angle) * radius
        ));
      }
      
      const tendrilGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const tendrilMaterial = new THREE.LineBasicMaterial({
        color: 0x990000,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      
      const tendril = new THREE.Line(tendrilGeometry, tendrilMaterial);
      this.tendrils.push(tendril);
      this.group.add(tendril);
    }
    
    this.group.add(this.rift);
  }

  setupAnimations() {
    // Animate cube rotation
    gsap.to(this.cube.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    // Animate rift
    gsap.to(this.rift.rotation, {
      z: Math.PI * 2,
      duration: 15,
      repeat: -1,
      ease: "none"
    });
    
    // Animate tendrils
    this.tendrils.forEach((tendril, i) => {
      gsap.to(tendril.material, {
        opacity: 0.8,
        duration: 2 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  animate(time) {
    // Rotate starfield
    this.starfield.rotation.y += 0.001;
    
    // Pulse cube opacity
    this.cube.material.opacity = 0.8 + Math.sin(time) * 0.1;
    
    // Animate rift distortion
    this.rift.scale.y = 1 + Math.sin(time * 2) * 0.2;
    
    // Animate tendrils
    this.tendrils.forEach((tendril, i) => {
      tendril.rotation.z = Math.sin(time + i) * 0.1;
      tendril.scale.y = 1 + Math.sin(time * 2 + i) * 0.1;
    });
  }

  getMesh() {
    return this.group;
  }
}