import * as THREE from 'three';
import { gsap } from 'gsap';

export class DivineFlame {
  constructor() {
    this.group = new THREE.Group();
    this.createFlame();
    this.createLightChildren();
    this.createDivineConnections();
    this.setupAnimations();
  }

  createFlame() {
    // Create central Yahweh flame
    const flameGeometry = new THREE.ConeGeometry(0.5, 2, 32);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.flame = new THREE.Mesh(flameGeometry, flameMaterial);
    
    // Add inner glow
    const glowGeometry = new THREE.ConeGeometry(0.6, 2.2, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd88,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    
    this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.flame.add(this.glow);
    this.group.add(this.flame);
  }

  createLightChildren() {
    this.children = [];
    const childCount = 12;
    const radius = 3;

    for (let i = 0; i < childCount; i++) {
      const angle = (i / childCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Create light being representation
      const childGeometry = new THREE.OctahedronGeometry(0.3, 1);
      const childMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / childCount, 0.8, 0.6),
        transparent: true,
        opacity: 0.6,
        wireframe: true
      });
      
      const child = new THREE.Mesh(childGeometry, childMaterial);
      child.position.set(x, y, 0);

      // Add aura
      const auraGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: childMaterial.color,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      
      const aura = new THREE.Mesh(auraGeometry, auraMaterial);
      child.add(aura);

      this.children.push({ child, aura });
      this.group.add(child);
    }
  }

  createDivineConnections() {
    this.connections = [];

    this.children.forEach(({ child }) => {
      const points = [];
      const start = child.position;
      const end = new THREE.Vector3(0, 0, 0);
      
      for (let t = 0; t <= 1; t += 0.1) {
        const point = new THREE.Vector3().lerpVectors(start, end, t);
        point.z = Math.sin(t * Math.PI) * 0.5;
        points.push(point);
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffaa33,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      
      const connection = new THREE.Mesh(geometry, material);
      this.connections.push(connection);
      this.group.add(connection);
    });
  }

  setupAnimations() {
    // Animate flame
    gsap.to(this.flame.scale, {
      x: 1.2,
      z: 1.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Animate children
    this.children.forEach(({ child, aura }, i) => {
      gsap.to(child.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 10 + i,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(aura.scale, {
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
    // Animate flame
    this.flame.rotation.y += 0.02;
    this.glow.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;

    // Animate children
    this.children.forEach(({ child, aura }, i) => {
      child.position.y += Math.sin(time + i) * 0.002;
      aura.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1;
    });

    // Animate connections
    this.connections.forEach((connection, i) => {
      connection.material.opacity = 0.2 + Math.sin(time * 2 + i * 0.1) * 0.1;
    });
  }

  getMesh() {
    return this.group;
  }
}