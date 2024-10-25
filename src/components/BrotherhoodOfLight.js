import * as THREE from 'three';
import { gsap } from 'gsap';

export class BrotherhoodOfLight {
  constructor() {
    this.group = new THREE.Group();
    this.createBrotherhood();
    this.createQuantumParticles();
    this.createGravitationalFlux();
    this.setupAnimations();
  }

  createBrotherhood() {
    // Create Brotherhood members
    const memberCount = 12;
    this.members = [];
    
    for (let i = 0; i < memberCount; i++) {
      const angle = (i / memberCount) * Math.PI * 2;
      const radius = 8;
      
      const geometry = new THREE.ConeGeometry(0.5, 2, 8);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / memberCount, 0.8, 0.6),
        transparent: true,
        opacity: 0.7,
        wireframe: true
      });
      
      const member = new THREE.Mesh(geometry, material);
      member.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      member.lookAt(new THREE.Vector3(0, 0, 0));
      
      // Add light aura
      const auraGeometry = new THREE.SphereGeometry(1, 16, 16);
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: material.color,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      const aura = new THREE.Mesh(auraGeometry, auraMaterial);
      member.add(aura);
      
      this.members.push({ member, aura });
      this.group.add(member);
    }
  }

  createQuantumParticles() {
    // Create quantum mechanical cropicles
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 6 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i + 2] = radius * Math.cos(theta);
      
      const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.group.add(this.particles);
  }

  createGravitationalFlux() {
    // Create gravitational flux lines
    const fluxCount = 24;
    this.fluxLines = [];
    
    for (let i = 0; i < fluxCount; i++) {
      const points = [];
      const segments = 50;
      const radius = 10;
      const angle = (i / fluxCount) * Math.PI * 2;
      
      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        const spiralRadius = radius * (1 - t * 0.5);
        const x = Math.cos(angle + t * Math.PI * 4) * spiralRadius;
        const y = Math.sin(angle + t * Math.PI * 4) * spiralRadius;
        const z = (t - 0.5) * 5;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(i / fluxCount, 0.8, 0.5),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      
      const line = new THREE.Line(geometry, material);
      this.fluxLines.push(line);
      this.group.add(line);
    }
  }

  setupAnimations() {
    // Animate Brotherhood members
    this.members.forEach(({ member, aura }, i) => {
      gsap.to(member.rotation, {
        y: Math.PI * 2,
        duration: 20 + i,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(aura.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 2 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  animate(time) {
    // Rotate particles
    this.particles.rotation.y += 0.001;
    
    // Animate Brotherhood members
    this.members.forEach(({ member, aura }, i) => {
      member.position.y += Math.sin(time + i) * 0.01;
      aura.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1;
    });
    
    // Animate flux lines
    this.fluxLines.forEach((line, i) => {
      line.rotation.z = Math.sin(time * 0.5 + i * 0.1) * 0.2;
      line.material.opacity = 0.2 + Math.sin(time * 2 + i * 0.1) * 0.1;
    });
  }

  getMesh() {
    return this.group;
  }
}