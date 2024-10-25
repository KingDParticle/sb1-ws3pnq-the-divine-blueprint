import * as THREE from 'three';
import { gsap } from 'gsap';

export class PyramidsOfLight {
  constructor() {
    this.group = new THREE.Group();
    this.pyramids = [];
    this.createPyramidField();
    this.createEnergyField();
    this.setupAnimations();
  }

  createPyramidField() {
    const pyramidCount = 8;
    const radius = 4;

    for (let i = 0; i < pyramidCount; i++) {
      const angle = (i / pyramidCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Create pyramid geometry
      const geometry = new THREE.ConeGeometry(0.5, 1, 4);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / pyramidCount, 0.8, 0.6),
        transparent: true,
        opacity: 0.4,
        wireframe: true
      });
      
      const pyramid = new THREE.Mesh(geometry, material);
      pyramid.position.set(x, y, 0);
      pyramid.lookAt(new THREE.Vector3(0, 0, 0));
      
      // Add energy beam
      const beamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 8, 8);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: material.color,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.z = 4;
      pyramid.add(beam);
      
      this.pyramids.push({ pyramid, beam });
      this.group.add(pyramid);
    }
  }

  createEnergyField() {
    const fieldGeometry = new THREE.IcosahedronGeometry(6, 1);
    const fieldMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    
    this.energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    this.group.add(this.energyField);
  }

  setupAnimations() {
    this.pyramids.forEach((obj, i) => {
      // Pyramid breathing animation
      gsap.to(obj.pyramid.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2
      });
      
      // Beam pulsing animation
      gsap.to(obj.beam.material, {
        opacity: 0.4,
        duration: 1 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1
      });
    });
  }

  animate(time) {
    // Rotate pyramids
    this.pyramids.forEach((obj, i) => {
      obj.pyramid.rotation.y += 0.002;
      obj.beam.rotation.y -= 0.001;
      
      // Modulate beam opacity
      obj.beam.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1;
    });
    
    // Rotate and pulse energy field
    this.energyField.rotation.y += 0.001;
    this.energyField.rotation.z += 0.0005;
    this.energyField.material.opacity = 0.1 + Math.sin(time) * 0.05;
  }

  getMesh() {
    return this.group;
  }
}