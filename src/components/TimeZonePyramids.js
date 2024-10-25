import * as THREE from 'three';
import { gsap } from 'gsap';

export class TimeZonePyramids {
  constructor() {
    this.group = new THREE.Group();
    this.timeZones = [];
    this.createTimeZoneSystem();
    this.createElohimThrone();
    this.createTimeCells();
    this.setupAnimations();
  }

  createTimeZoneSystem() {
    const pyramidCount = 12;
    const radius = 6;
    
    for (let i = 0; i < pyramidCount; i++) {
      const angle = (i / pyramidCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const geometry = new THREE.ConeGeometry(0.3, 2, 4);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / pyramidCount, 0.9, 0.7),
        transparent: true,
        opacity: 0.6,
        wireframe: true
      });
      
      const pyramid = new THREE.Mesh(geometry, material);
      pyramid.position.set(x, y, 0);
      pyramid.lookAt(new THREE.Vector3(0, 0, 0));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, 0)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: material.color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      
      this.timeZones.push({ pyramid, line });
      this.group.add(pyramid);
      this.group.add(line);
    }
  }

  createElohimThrone() {
    // Create central throne energy structure
    const throneGeometry = new THREE.OctahedronGeometry(1.5, 2);
    const throneMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      wireframe: true
    });
    this.throne = new THREE.Mesh(throneGeometry, throneMaterial);
    
    // Add energy beams emanating from throne
    const beamCount = 8;
    this.beams = [];
    
    for (let i = 0; i < beamCount; i++) {
      const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      const angle = (i / beamCount) * Math.PI * 2;
      beam.position.x = Math.cos(angle) * 2;
      beam.position.z = Math.sin(angle) * 2;
      beam.lookAt(new THREE.Vector3(0, 0, 0));
      
      this.beams.push(beam);
      this.throne.add(beam);
    }
    
    this.group.add(this.throne);
  }

  createTimeCells() {
    // Create geometric time cell structures
    const cellCount = 6;
    this.timeCells = [];
    
    for (let i = 0; i < cellCount; i++) {
      const cellGeometry = new THREE.IcosahedronGeometry(0.5, 1);
      const cellMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / cellCount, 0.8, 0.6),
        transparent: true,
        opacity: 0.4,
        wireframe: true
      });
      
      const cell = new THREE.Mesh(cellGeometry, cellMaterial);
      const angle = (i / cellCount) * Math.PI * 2;
      const radius = 4;
      cell.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.sin(angle * 2) * 2
      );
      
      // Add membrane effect
      const membraneGeometry = new THREE.SphereGeometry(0.7, 16, 16);
      const membraneMaterial = new THREE.MeshBasicMaterial({
        color: cellMaterial.color,
        transparent: true,
        opacity: 0.2,
        wireframe: true
      });
      const membrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
      cell.add(membrane);
      
      this.timeCells.push({ cell, membrane });
      this.group.add(cell);
    }
  }

  setupAnimations() {
    // Animate throne
    gsap.to(this.throne.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    // Animate time cells
    this.timeCells.forEach((timeCell, i) => {
      gsap.to(timeCell.cell.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 10 + i,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(timeCell.membrane.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 2 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  animate(time) {
    // Animate throne energy
    this.throne.rotation.y += 0.001;
    this.throne.material.opacity = 0.6 + Math.sin(time) * 0.2;
    
    // Animate beams
    this.beams.forEach((beam, i) => {
      beam.scale.y = 1 + Math.sin(time * 2 + i) * 0.2;
      beam.material.opacity = 0.2 + Math.sin(time * 3 + i) * 0.1;
    });
    
    // Animate time cells
    this.timeCells.forEach((timeCell, i) => {
      timeCell.cell.position.y += Math.sin(time + i) * 0.01;
      timeCell.membrane.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1;
    });
  }

  getMesh() {
    return this.group;
  }
}