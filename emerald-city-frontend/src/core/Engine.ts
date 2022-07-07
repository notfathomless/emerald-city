import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing//UnrealBloomPass.js";
import * as dat from "dat.gui";
import { setupScene } from "./scene/BaseScene";
import Stats from "stats.js";

export class Engine {
  container: HTMLDivElement | null;
  canvas: HTMLCanvasElement | null;
  isDomRenderTargetAttached: boolean;
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  clockSpeed: number;
  delta: number;
  isPlaying: boolean;
  scene: THREE.Scene;
  width: number;
  height: number;
  controls: OrbitControls | FirstPersonControls | FlyControls | null;
  renderScene!: RenderPass;
  bloomPass!: UnrealBloomPass;
  composer!: EffectComposer;
  settings;
  gui!: dat.GUI;
  material!: THREE.ShaderMaterial;
  geometry!: THREE.PlaneBufferGeometry | THREE.BufferGeometry;
  mesh!: THREE.Mesh | THREE.Points;
  renderer: THREE.WebGLRenderer | null;
  stats: Stats;

  constructor() {
    console.warn("Engine Loaded");

    this.container = null;
    this.canvas = null;
    this.isDomRenderTargetAttached = false;
    this.clock = new THREE.Clock();
    this.clockSpeed = 25;
    this.delta = 0;
    this.isPlaying = false;
    this.height = 0;
    this.width = 0;
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.renderer = null;
    this.controls = null;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.001,
      5000
    );
    this.camera.position.set(0, 0, 1500);

    this.settings = {};
    this.setupResize();
    this.setupScene();

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  }
  async setupScene() {
    return setupScene(this);
  }

  attachDomRenderTarget(container: HTMLDivElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;
    this.isDomRenderTargetAttached = true;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!,
      antialias: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.resize();
    this.setupResize();
  }

  detachDomRenderTarget() {
    this.container = null;
    this.canvas = null;
    this.isDomRenderTargetAttached = false;

    this.renderer = null;
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    if (this.container && this.renderer) {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;

      this.camera.updateProjectionMatrix();
    }
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying && !this.renderer) return;

    requestAnimationFrame(this.render.bind(this));

    this.stats.begin();
    this.delta = this.clock.getDelta();
    this.controls!.update(this.delta * this.clockSpeed);
    this.renderer!.render(this.scene, this.camera);
    this.stats.end();
    //this.composer.render();
  }
}