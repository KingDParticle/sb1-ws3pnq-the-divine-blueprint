import * as THREE from 'three';

export class CosmicBackground {
  constructor() {
    this.group = new THREE.Group();
    this.createStarfield();
    this.createNebula();
    this.createPleiades();
    this.createLightSynthesis();
  }

  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 100;
      starPositions[i + 1] = (Math.random() - 0.5) * 100;
      starPositions[i + 2] = (Math.random() - 0.5) * 100;
      
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.5, 0.8);
      starColors[i] = color.r;
      starColors[i + 1] = color.g;
      starColors[i + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.group.add(this.stars);
  }

  createNebula() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 20 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      
      positions[i] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i + 2] = radius * Math.cos(theta);
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.6);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.5,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    this.nebula = new THREE.Points(geometry, material);
    this.group.add(this.nebula);
  }

  createPleiades() {
    // Create the Pleiades star cluster
    const pleiadesGroup = new THREE.Group();
    const starPositions = [
      [0, 0, 0], [1, 0.5, 0], [-0.5, 1, 0],
      [0.5, -1, 0], [-1, -0.5, 0], [1, 1, 0],
      [-1, -1, 0]
    ];

    starPositions.forEach((pos) => {
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      
      const star = new THREE.Mesh(geometry, material);
      star.position.set(pos[0], pos[1], pos[2]);
      pleiadesGroup.add(star);
    });

    pleiadesGroup.position.set(0, 15, -20);
    this.pleiades = pleiadesGroup;
    this.group.add(pleiadesGroup);
  }

  createLightSynthesis() {
    // Create light synthesis beam
    const beamGeometry = new THREE.CylinderGeometry(0.5, 2, 30, 16, 10, true);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xaaddff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    this.synthesisBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    this.synthesisBeam.position.set(0, 0, -10);
    this.synthesisBeam.rotation.x = Math.PI / 2;
    
    // Create light particles within the beam
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const t = i / (particleCount * 3);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.5;
      
      particlePositions[i] = Math.cos(angle) * radius;
      particlePositions[i + 1] = (Math.random() - 0.5) * 30;
      particlePositions[i + 2] = Math.sin(angle) * radius;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xaaddff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.synthesisParticles = new THREE.Points(particleGeometry, particleMaterial);
    this.synthesisBeam.add(this.synthesisParticles);
    
    this.group.add(this.synthesisBeam);
  }

  animate(time) {
    this.stars.rotation.y += 0.0002;
    this.nebula.rotation.y -= 0.0001;
    this.nebula.material.opacity = 0.4 + Math.sin(time * 0.5) * 0.2;
    
    // Animate Pleiades
    this.pleiades.children.forEach((star, i) => {
      star.material.opacity = 0.6 + Math.sin(time * 2 + i) * 0.2;
      star.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.1);
    });
    
    // Animate synthesis beam
    this.synthesisBeam.material.opacity = 0.2 + Math.sin(time) * 0.1;
    this.synthesisBeam.rotation.z = Math.sin(time * 0.5) * 0.1;
    this.synthesisParticles.rotation.y += 0.01;
    
    // Move particles up the beam
    const positions = this.synthesisParticles.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += 0.1;
      if (positions[i] > 15) positions[i] = -15;
    }
    this.synthesisParticles.geometry.attributes.position.needsUpdate = true;
  }

  getMesh() {
    return this.group;
  }
}