import * as THREE from 'three';
import { gsap } from 'gsap';

export class FlowerOfLife {
  constructor() {
    this.group = new THREE.Group();
    this.circles = [];
    this.createPattern();
    this.createEnergyField();
    this.setupAnimations();
  }

  createPattern() {
    const radius = 1;
    const segments = 64;
    const geometry = new THREE.CircleGeometry(radius, segments);
    
    // Center circle
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    
    const centerCircle = new THREE.Mesh(geometry, centerMaterial);
    this.circles.push(centerCircle);
    this.group.add(centerCircle);

    // Outer circles
    for (let ring = 0; ring < 2; ring++) {
      const circleCount = 6 * (ring + 1);
      for (let i = 0; i < circleCount; i++) {
        const angle = (i * Math.PI * 2) / circleCount;
        const ringRadius = radius * (ring + 1);
        const x = ringRadius * Math.cos(angle);
        const y = ringRadius * Math.sin(angle);
        
        const material = centerMaterial.clone();
        material.color.setHSL(i / circleCount, 0.8, 0.6);
        
        const circle = new THREE.Mesh(geometry, material);
        circle.position.set(x, y, 0);
        this.circles.push(circle);
        this.group.add(circle);
      }
    }
  }

  createEnergyField() {
    const radius = 3;
    const segments = 128;
    const geometry = new THREE.RingGeometry(radius - 0.1, radius, segments);
    const material = new THREE.MeshBasicMaterial({
      color: 0x88ffff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    
    this.energyRing = new THREE.Mesh(geometry, material);
    this.group.add(this.energyRing);
  }

  setupAnimations() {
    this.circles.forEach((circle, i) => {
      gsap.to(circle.material, {
        opacity: 0.2,
        duration: 1 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1
      });
    });
  }

  animate(time) {
    this.group.rotation.z += 0.001;
    this.energyRing.rotation.z -= 0.002;
    
    // Pulse effect for energy ring
    this.energyRing.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
    this.energyRing.scale.setScalar(1 + Math.sin(time) * 0.05);
  }

  getMesh() {
    return this.group;
  }
}