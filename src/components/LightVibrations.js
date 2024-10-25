import * as THREE from 'three';
import { gsap } from 'gsap';

export class LightVibrations {
  constructor() {
    this.group = new THREE.Group();
    this.createVibrationPatterns();
    this.createFrequencyWaves();
    this.createLightMeasures();
    this.createLightTraces();
    this.createFireLetters();
    this.setupAnimations();
  }

  createVibrationPatterns() {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 100;
    const radius = 3;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.sin(angle * 4) * 0.5;
      points.push(new THREE.Vector3(x, y, z));
    }

    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(geometry, material);
    this.group.add(line);
  }

  createFrequencyWaves() {
    const waveCount = 8;
    this.waves = [];

    for (let i = 0; i < waveCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      const segments = 50;
      const radius = 2 + i * 0.3;

      for (let j = 0; j < segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = Math.sin(angle * (i + 2)) * 0.3;
        points.push(new THREE.Vector3(x, y, z));
      }

      geometry.setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(i / waveCount, 0.8, 0.6),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });

      const wave = new THREE.Line(geometry, material);
      this.waves.push(wave);
      this.group.add(wave);
    }
  }

  createLightMeasures() {
    const measureCount = 6;
    this.measures = [];

    for (let i = 0; i < measureCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      const segments = 40;
      const radius = 1.5 + i * 0.4;

      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        const angle = t * Math.PI * 4;
        const x = Math.cos(angle) * radius * (1 - t * 0.3);
        const y = Math.sin(angle) * radius * (1 - t * 0.3);
        const z = t * 2;
        points.push(new THREE.Vector3(x, y, z));
      }

      geometry.setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(i / measureCount, 0.9, 0.6),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });

      const measure = new THREE.Line(geometry, material);
      this.measures.push(measure);
      this.group.add(measure);
    }
  }

  createLightTraces() {
    const traceCount = 12;
    this.traces = [];

    for (let i = 0; i < traceCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      const segments = 30;
      const radius = 2.5;
      const angle = (i / traceCount) * Math.PI * 2;

      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        const x = Math.cos(angle + t * Math.PI * 2) * radius * (1 - t * 0.2);
        const y = Math.sin(angle + t * Math.PI * 2) * radius * (1 - t * 0.2);
        const z = t * 1.5;
        points.push(new THREE.Vector3(x, y, z));
      }

      geometry.setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(i / traceCount, 0.7, 0.5),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });

      const trace = new THREE.Line(geometry, material);
      this.traces.push(trace);
      this.group.add(trace);
    }
  }

  createFireLetters() {
    const letterCount = 12;
    this.fireLetters = [];
    
    for (let i = 0; i < letterCount; i++) {
      const points = [];
      const segments = 32;
      const radius = 4;
      const angle = (i / letterCount) * Math.PI * 2;
      
      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        const spiralRadius = radius * (1 - t * 0.5);
        const x = Math.cos(angle + t * Math.PI * 4) * spiralRadius;
        const y = Math.sin(angle + t * Math.PI * 4) * spiralRadius;
        const z = t * 2;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(i / letterCount, 0.9, 0.7),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      const letter = new THREE.Line(geometry, material);
      this.fireLetters.push(letter);
      this.group.add(letter);
      
      const particleCount = 10;
      const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      
      for (let k = 0; k < particleCount; k++) {
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: material.color,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const position = points[Math.floor(k * points.length / particleCount)];
        particle.position.copy(position);
        this.fireLetters.push(particle);
        letter.add(particle);
      }
    }
  }

  setupAnimations() {
    this.waves.forEach((wave, i) => {
      gsap.to(wave.rotation, {
        z: Math.PI * 2,
        duration: 10 + i * 2,
        repeat: -1,
        ease: "none"
      });
    });

    this.measures.forEach((measure, i) => {
      gsap.to(measure.rotation, {
        z: Math.PI * 2,
        duration: 15 + i * 1.5,
        repeat: -1,
        ease: "none"
      });
    });
  }

  animate(time) {
    this.waves.forEach((wave, i) => {
      wave.material.opacity = 0.3 + Math.sin(time + i) * 0.1;
    });

    this.measures.forEach((measure, i) => {
      measure.material.opacity = 0.4 + Math.sin(time * 1.5 + i) * 0.1;
    });

    this.traces.forEach((trace, i) => {
      trace.rotation.z = Math.sin(time * 0.5 + i) * 0.1;
      trace.material.opacity = 0.2 + Math.sin(time + i) * 0.1;
    });

    this.fireLetters.forEach((element, i) => {
      if (element instanceof THREE.Line) {
        element.rotation.z = Math.sin(time + i * 0.5) * 0.2;
        element.material.opacity = 0.4 + Math.sin(time * 2 + i) * 0.2;
      } else {
        element.position.z += Math.sin(time * 3 + i) * 0.01;
        element.material.opacity = 0.6 + Math.sin(time * 4 + i) * 0.2;
      }
    });
  }

  getMesh() {
    return this.group;
  }
}