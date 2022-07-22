import * as THREE from "three";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import maskImg from "./img/mask.jpeg";
import textureImg from "./img/texture.jpg";

export default class Sketch {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );

    this.camera.position.z = 1000;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.textures = [new THREE.TextureLoader().load(textureImg)];

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    document.body.appendChild(this.renderer.domElement);

    this.addMesh();
    this.time = 0;
    this.render();
  }

  render() {
    this.time++;
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }

  addMesh() {
    const size = 512;
    let numberOfParticles = size * size;

    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        progress: {
          type: "f",
          value: 0,
        },
        textureImg: { type: "t", value: this.textures[0] },
        side: THREE.DoubleSide,
      },
    });

    this.geometry = new THREE.BufferGeometry();
    this.positions = new THREE.BufferAttribute(
      new Float32Array(numberOfParticles * 3),
      3
    );

    let index = 0;

    for (let i = 0; i < size; i++) {
      let posX = i - size / 2;

      for (let j = 0; j < size; j++) {
        let posY = j - size / 2;

        this.positions.setXYZ(index, posX * 2, posY * 2, 0);

        index++;
      }
    }

    this.geometry.setAttribute("position", this.positions);

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}

new Sketch();
