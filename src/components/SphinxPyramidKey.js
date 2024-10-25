import * as THREE from 'three';
import { gsap } from 'gsap';

export class SphinxPyramidKey {
  constructor() {
    this.group = new THREE.Group();
    this.createSphinxPyramid();
    this.createSolarVehicle();
    this.createEnergyField();
    this.setupAnimations();
  }

  createSphinxPyramid() {
    // Create main pyramid structure
    const pyramidGeometry = new THREE.ConeGeometry(2, 3, 4);
    const pyramidMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    });
    
    this.pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    this.group.add(this.pyramid);

    // Create internal energy channels
    const channelCount = 4;
    this.channels = [];
    
    for (let i = 0; i < channelCount; i++) {
      const channelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
      const channelMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff88,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      
      const channel = new THREE.Mesh(channelGeometry, channelMaterial);
      channel.position.x = Math.cos((i / channelCount) * Math.PI * 2) * 0.5;
      channel.position.z = Math.sin((i / channelCount) * Math.PI * 2) * 0.5;
      
      this.channels.push(channel);
      this.pyramid.add(channel);
    }
  }

  createSolarVehicle() {
    // Create solar vehicle representation
    const vehicleGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 64, 8);
    const vehicleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    
    this.solarVehicle = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
    this.solarVehicle.position.y = 2;
    this.group.add(this.solarVehicle);

    // Add energy aura
    const auraGeometry = new THREE.SphereGeometry(1, 16, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff88,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      wireframe: true
    });
    
    this.aura = new THREE.Mesh(auraGeometry, auraMaterial);
    this.aura.scale.y = 0.5;
    this.solarVehicle.add(this.aura);
  }

  createEnergyField() {
    // Create surrounding energy field
    const fieldGeometry = new THREE.OctahedronGeometry(3, 1);
    const fieldMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    
    this.energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    this.group.add(this.energyField);
  }

  setupAnimations() {
    // Animate solar vehicle
    gsap.to(this.solarVehicle.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "none"
    });

    // Animate energy channels
    this.channels.forEach((channel, i) => {
      gsap.to(channel.material, {
        opacity: 0.8,
        duration: 1 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  animate(time) {
    // Rotate pyramid
    this.pyramid.rotation.y += 0.001;
    
    // Pulse energy field
    this.energyField.rotation.y += 0.0005;
    this.energyField.material.opacity = 0.2 + Math.sin(time) * 0.1;
    
    // Animate aura
    this.aura.scale.setScalar(1 + Math.sin(time * 2) * 0.2);
    
    // Animate channels
    this.channels.forEach((channel, i) => {
      channel.scale.y = 1 + Math.sin(time * 2 + i) * 0.1;
    });
  }

  getMesh() {
    return this.group;
  }
}