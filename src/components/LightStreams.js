import * as THREE from 'three';

export class LightStreams {
  constructor() {
    this.group = new THREE.Group();
    this.curves = [];
    this.createStreams();
  }

  createStreams() {
    const streamCount = 12;
    const colors = [
      0xff3366, 0x33ff66, 0x3366ff,
      0xff6633, 0x66ff33, 0x6633ff,
      0x33ff66, 0x6633ff, 0xff3366,
      0xff33ff, 0x33ffff, 0xffff33
    ];

    for (let i = 0; i < streamCount; i++) {
      const points = [];
      const angle = (i / streamCount) * Math.PI * 2;
      const radius = 2;
      
      for (let j = 0; j < 50; j++) {
        const t = j / 49;
        const spiralFactor = 5 + Math.sin(i * 0.5) * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(angle + t * spiralFactor) * (radius + t),
            Math.sin(angle + t * spiralFactor) * (radius + t),
            t * 2
          )
        );
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
      const material = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      this.curves.push(mesh);
      this.group.add(mesh);
    }
  }

  animate(time) {
    this.curves.forEach((curve, i) => {
      curve.material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.2;
      curve.rotation.z = time * 0.1;
      curve.scale.setScalar(1 + Math.sin(time * 2 + i * 0.5) * 0.1);
    });
  }

  getMeshes() {
    return [this.group];
  }
}