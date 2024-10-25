import * as THREE from 'three';
import { gsap } from 'gsap';

export class CivilizationConnections {
  constructor() {
    this.group = new THREE.Group();
    this.createCivilizationSymbols();
    this.createTimeWarps();
    this.createConnections();
    this.setupAnimations();
  }

  createCivilizationSymbols() {
    const civilizations = [
      { name: 'Egyptian', color: 0xFFD700 },
      { name: 'Hebrew', color: 0x4169E1 },
      { name: 'Sanskrit', color: 0xFF4500 },
      { name: 'Tibetan', color: 0x9370DB },
      { name: 'Chinese', color: 0x32CD32 }
    ];

    this.symbols = [];
    const radius = 4;

    civilizations.forEach((civ, i) => {
      const angle = (i / civilizations.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const platformGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
      const platformMaterial = new THREE.MeshBasicMaterial({
        color: civ.color,
        transparent: true,
        opacity: 0.6
      });
      
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.set(x, y, 0);

      const auraGeometry = new THREE.SphereGeometry(0.8, 16, 16);
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: civ.color,
        transparent: true,
        opacity: 0.2,
        wireframe: true
      });
      
      const aura = new THREE.Mesh(auraGeometry, auraMaterial);
      platform.add(aura);

      this.symbols.push({ platform, aura });
      this.group.add(platform);
    });
  }

  createTimeWarps() {
    this.timeWarps = [];
    const warpCount = 5;
    const warpRadius = 6;

    for (let i = 0; i < warpCount; i++) {
      const angle = (i / warpCount) * Math.PI * 2;
      const x = Math.cos(angle) * warpRadius;
      const y = Math.sin(angle) * warpRadius;

      const ringGeometry = new THREE.TorusGeometry(1, 0.1, 16, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / warpCount, 0.8, 0.5),
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(x, y, 0);
      ring.lookAt(new THREE.Vector3(0, 0, 0));

      const vortexGeometry = new THREE.ConeGeometry(0.8, 2, 32);
      const vortexMaterial = new THREE.MeshBasicMaterial({
        color: ringMaterial.color,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      
      const vortex = new THREE.Mesh(vortexGeometry, vortexMaterial);
      ring.add(vortex);

      this.timeWarps.push({ ring, vortex });
      this.group.add(ring);
    }
  }

  createConnections() {
    this.connections = [];

    this.symbols.forEach((symbol, i) => {
      this.timeWarps.forEach((warp, j) => {
        const points = [];
        const start = symbol.platform.position;
        const end = warp.ring.position;
        
        for (let t = 0; t <= 1; t += 0.1) {
          const point = new THREE.Vector3().lerpVectors(start, end, t);
          point.z = Math.sin(t * Math.PI) * 2;
          points.push(point);
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL((i + j) / (this.symbols.length + this.timeWarps.length), 0.8, 0.5),
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending
        });
        
        const connection = new THREE.Mesh(geometry, material);
        this.connections.push(connection);
        this.group.add(connection);
      });
    });
  }

  setupAnimations() {
    this.symbols.forEach((symbol, i) => {
      gsap.to(symbol.platform.rotation, {
        y: Math.PI * 2,
        duration: 10 + i,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(symbol.aura.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 2 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    this.timeWarps.forEach((warp, i) => {
      gsap.to(warp.ring.rotation, {
        z: Math.PI * 2,
        duration: 8 + i,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(warp.vortex.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 1.5 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  animate(time) {
    this.symbols.forEach((symbol, i) => {
      symbol.aura.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1;
    });

    this.timeWarps.forEach((warp, i) => {
      warp.vortex.rotation.y += 0.02;
      warp.vortex.material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.1;
    });

    this.connections.forEach((connection, i) => {
      connection.material.opacity = 0.3 + Math.sin(time * 2 + i * 0.1) * 0.1;
    });
  }

  getMesh() {
    return this.group;
  }
}