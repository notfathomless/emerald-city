import * as THREE from "three";
//import { Key } from "ts-key-enum";

export interface KeyState {
  forward: boolean;
  left: boolean;
  backward: boolean;
  right: boolean;
  jump: boolean;
}

export class EditorControls {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;

  forwardMovementSpeed: number;
  backwardMovementSpeed: number;
  leftMovementSpeed: number;
  rightMovementSpeed: number;
  jumpMovementSpeed: number;

  horizontalRotationSpeed: number;
  verticalRotationSpeed: number;

  toMoveForward: number;
  toMoveRight: number;
  toMoveJump: number;
  toRotate: THREE.Vector2;

  keyState: KeyState;

  movementOn: boolean;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    console.log("Controller attached");

    this.camera = camera;
    this.domElement = domElement;

    this.forwardMovementSpeed = 0.5;
    this.backwardMovementSpeed = 0.5;
    this.leftMovementSpeed = 0.5;
    this.rightMovementSpeed = 0.5;
    this.jumpMovementSpeed = 0.5;

    this.horizontalRotationSpeed = 0.001;
    this.verticalRotationSpeed = 0.001;

    this.toMoveForward = 0;
    this.toMoveRight = 0;
    this.toMoveJump = 0;

    this.toRotate = new THREE.Vector2(0, 0);
    this.movementOn = false;
    this.keyState = {
      forward: false,
      left: false,
      backward: false,
      right: false,
      jump: false,
    };

    this.domElement.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.domElement.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.domElement.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
    this.domElement.addEventListener(
      "mouseenter",
      this.handleMouseEnter.bind(this)
    );
    this.domElement.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this)
    );
    this.domElement.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    this.domElement.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /*     const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    this.camera.position.addScaledVector(direction, multiplier); */
  moveForward(delta: number) {
    this.camera.translateZ(delta * -this.forwardMovementSpeed);
  }

  moveBackward(delta: number) {
    this.camera.translateZ(delta * this.backwardMovementSpeed);
  }

  moveRight(delta: number) {
    this.camera.translateX(delta * this.rightMovementSpeed);
  }

  moveLeft(delta: number) {
    this.camera.translateX(delta * -this.leftMovementSpeed);
  }

  moveUp(delta: number) {
    this.camera.translateY(delta * this.jumpMovementSpeed);
  }

  /*   handleKeyDown(ev: KeyboardEvent) {
    if (this.movementOn)
      switch (ev.code) {
        case "KeyW":
          this.moveForward(-this.forwardMovementSpeed);
          break;
        case "KeyA":
          this.moveRight(-this.leftMovementSpeed);
          break;
        case "KeyS":
          this.moveForward(this.backwardMovementSpeed);
          break;
        case "KeyD":
          this.moveRight(this.rightMovementSpeed);
          break;
        case "Space":
          this.moveUp(this.jumpMovementSpeed);
          break;
        case "Tab":
          (document.activeElement! as HTMLElement).blur();
          break;
        default:
          break;
      }
  } */

  handleKeyDown(ev: KeyboardEvent) {
    console.log("key down");
    if (this.movementOn)
      switch (ev.code) {
        case "KeyW":
          this.keyState.forward = true;
          break;
        case "KeyA":
          this.keyState.left = true;
          break;
        case "KeyS":
          this.keyState.backward = true;
          break;
        case "KeyD":
          this.keyState.right = true;
          break;
        case "Space":
          this.keyState.jump = true;
          break;
        /* case "Tab":
          (document.activeElement! as HTMLElement).blur();
          break; */
        default:
          break;
      }
  }

  handleKeyUp(ev: KeyboardEvent) {
    console.log("key up");
    if (this.movementOn)
      switch (ev.code) {
        case "KeyW":
          this.keyState.forward = false;
          break;
        case "KeyA":
          this.keyState.left = false;
          break;
        case "KeyS":
          this.keyState.backward = false;
          break;
        case "KeyD":
          this.keyState.right = false;
          break;
        case "Space":
          this.keyState.jump = false;
          break;
        default:
          break;
      }
  }

  handleMouseMove(ev: MouseEvent) {
    if (this.movementOn) {
      this.camera.rotateY(-this.horizontalRotationSpeed * ev.movementX);
      this.camera.rotateX(-this.verticalRotationSpeed * ev.movementY);
    }
    ev.preventDefault();
  }

  handleMouseEnter() {
    //console.log("mouse enter");
  }

  handleMouseLeave() {
    //console.log("mouse leave");
  }

  handleMouseDown(ev: MouseEvent) {
    if (ev.button === 2) {
      this.movementOn = true;
      this.domElement.requestPointerLock();
    }
  }

  handleMouseUp(ev: MouseEvent) {
    if (ev.button === 2) {
      this.movementOn = false;
      document.exitPointerLock();
    }
  }

  update(delta: number) {
    if (this.keyState.forward) this.moveForward(delta);
    if (this.keyState.left) this.moveLeft(delta);
    if (this.keyState.backward) this.moveBackward(delta);
    if (this.keyState.right) this.moveRight(delta);
    if (this.keyState.jump) this.moveUp(delta);
  }
}
