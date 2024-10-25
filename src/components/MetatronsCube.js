import * as THREE from 'three';
import { gsap } from 'gsap';

export class MetatronsCube {
  constructor() {
    this.group = new THREE.Group();
    this.createMetatronsCube();
    this.createMerkaba();
    this.createMetronKey();
    this.setupAnimations();
  }

  createMetatronsCube() {
    const vertices = [
      new THREE.Vector3(0, 0, 0),
      ...Array(6).fill(0).map((_, i) => {
        const angle = (i * Math.PI * 2) / 6;
        return new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
      }),
      ...Array(12).fill(0).map((_, i) => {
        const angle = (i * Math.PI * 2) / 12;
        return new THREE.Vector3(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
      })
    ];

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x88ffff,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 1; i <= 6; i++) {
      const geometry = new THREE.BufferGeometry().setFromPoints([vertices[0], vertices[i]]);
      const line = new THREE.Line(geometry, lineMaterial.clone());
      this.group.add(line);
    }

    for (let i = 1; i <= 6; i++) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        vertices[i],
        vertices[i % 6 + 1]
      ]);
      const line = new THREE.Line(geometry, lineMaterial.clone());
      this.group.add(line);
    }

    for (let i = 7; i <= 18; i++) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        vertices[Math.floor((i - 7) / 2) + 1],
        vertices[i]
      ]);
      const line = new THREE.Line(geometry, lineMaterial.clone());
      this.group.add(line);
    }
  }

  createMerkaba() {
    const tetraGeometry = new THREE.TetrahedronGeometry(1.2, 0);
    
    const upMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ffff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    this.upTetra = new THREE.Mesh(tetraGeometry, upMaterial);
    
    const downMaterial = new THREE.MeshBasicMaterial({
      color: 0xff88ff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    this.downTetra = new THREE.Mesh(tetraGeometry, downMaterial);
    this.downTetra.rotation.x = Math.PI;
    
    this.merkaba = new THREE.Group();
    this.merkaba.add(this.upTetra);
    this.merkaba.add(this.downTetra);
    this.group.add(this.merkaba);
  }

  createMetronKey() {
    // Create the Metron Key structure
    const keyGroup = new THREE.Group();

    // Central light column
    const columnGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const columnMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.lightColumn = new THREE.Mesh(columnGeometry, columnMaterial);
    keyGroup.add(this.lightColumn);

    // Create ascending pyramids
    const pyramidCount = 7; // Seven ascending pyramids
    this.keyPyramids = [];
    
    for (let i = 0; i < pyramidCount; i++) {
      const pyramidGeometry = new THREE.ConeGeometry(0.3 - i * 0.03, 0.5, 4);
      const pyramidMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / pyramidCount, 1, 0.7),
        transparent: true,
        opacity: 0.4,
        wireframe: true
      });
      
      const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
      pyramid.position.y = i * 0.6 - 1.5;
      this.keyPyramids.push(pyramid);
      keyGroup.add(pyramid);

      // Add energy rings around pyramids
      const ringGeometry = new THREE.TorusGeometry(0.4, 0.02, 16, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: pyramidMaterial.color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(pyramid.position);
      this.keyPyramids.push(ring);
      keyGroup.add(ring);
    }

    // Create connection beam to next universe
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.2, 8, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    this.universeBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    this.universeBeam.position.y = 4;
    this.universeBeam.rotation.x = Math.PI / 2;
    keyGroup.add(this.universeBeam);

    keyGroup.position.z = 2;
    this.metronKey = keyGroup;
    this.group.add(keyGroup);
  }

  setupAnimations() {
    gsap.to(this.merkaba.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    gsap.to([this.upTetra.material, this.downTetra.material], {
      opacity: 0.6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Animate Metron Key elements
    this.keyPyramids.forEach((element, i) => {
      gsap.to(element.rotation, {
        y: Math.PI * 2,
        duration: 3 + i,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(element.material, {
        opacity: 0.7,
        duration: 1.5 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  animate(time) {
    this.upTetra.rotation.y += 0.002;
    this.downTetra.rotation.y -= 0.002;
    
    const scale = 1 + Math.sin(time * 0.5) * 0.05;
    this.group.scale.setScalar(scale);
    
    this.group.children.forEach(line => {
      if (line instanceof THREE.Line) {
        line.material.opacity = 0.4 + Math.sin(time * 2) * 0.2;
      }
    });

    // Animate Metron Key
    this.lightColumn.material.opacity = 0.4 + Math.sin(time * 3) * 0.2;
    this.universeBeam.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
    this.universeBeam.scale.y = 1 + Math.sin(time) * 0.2;
    
    this.metronKey.rotation.y += 0.001;
    this.keyPyramids.forEach((element, i) => {
      element.position.y += Math.sin(time * 2 + i) * 0.001;
    });
  }

  getMesh() {
    return this.group;
  }
}