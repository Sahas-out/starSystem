import { mat4,vec3,mat3,vec4,quat} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
import { transform2 } from "../math/transformationStrategies.js";

export const PlanetState = {
  selected : "selected",
  idle : "idle",
  invisible : "invisible"
};
export const PlanetShape = {
  sphere : "sphere",
  cube : "cube",
  regularSolid1:"regularSolid1",
  regularSolid2:"regularSolid2"
};
export class Planet {

  static collisonRadius = 1.7;

  constructor (inVertices,inIndices) {
    // recalculateNoramlsOutside(inVertices);
    this.vertices = inVertices;
    this.indices = inIndices;
    this.loaded = false;
    this.translateVec = vec3.fromValues(0.0,0.0,0.0);
    this.scaleVec = vec3.fromValues(0.7,0.7,0.7);
    this.quatRotation = quat.create();
    this.colorVec = vec4.fromValues(1.0,0.0,0.0,1.0);
    // this.selectedColorVec = vec4.fromValues(0.0,1.0,0.0,1.0);
    this.selectedColorVec = vec4.fromValues(1.0,1.0,1.0,1.0);

    this.reflectionMatrix = mat3.fromValues(
      0.5,0.5,0.5,
      0.7,0.7,0.7,
      0.4,0.4,0.4
    );
    this.shininess = 1.0;
    this.speeed = 0.1;
    this.speedIncrease = 0.0;
    this.oIdx = 0;
    this.state = PlanetState.idle;
  }

  setColor (...color) {
    this.colorVec = vec4.fromValues(...color);
    return this;
  }

  setSpeed (speed) {
    this.speeed = speed;
    return this;
  }
  increaseSpeed (percent) {
    this.speedIncrease = percent; 
  }
  setState (state) {
    if (state === PlanetState.idle) {
      this.state = PlanetState.idle;
      this.quatRotation = quat.create();
      this.scaleVec = vec3.fromValues(0.7,0.7,0.7);
    } else if (state === PlanetState.invisible) {
      this.oIdx = 0;
      this.state = PlanetState.invisible;
    } else if (state === PlanetState.selected) {
      this.state = PlanetState.selected;
    }
    return this;
  }

  addOrbit (orbit) {
    this.orbit = orbit;
    this.translateVec = vec3.fromValues(this.orbit.majorSize,0.0,0.0);
    return this;
  }

  assignKey (key) {
    this.key = key;
    this.orbit.assignKey(key);
  }

  translate (...delta) {
    let displacemet = vec3.fromValues(...delta);
    vec3.add(this.translateVec,this.translateVec,displacemet);
  }

  scale (scaleFactor) {
    vec3.scale(this.scaleVec, this.scaleVec, scaleFactor);
  }

  quatRotate (q) {
    quat.multiply(this.quatRotation,this.quatRotation,q);
  }

  revolve () {
    let tspeed = this.speeed + (this.speeed * this.speedIncrease / 100);
    let delta = Math.ceil(this.orbit.segments * tspeed / 60);
    this.oIdx = (delta + this.oIdx) % this.orbit.segments;
    this.translateVec = vec3.fromValues(
      this.orbit.vertices[(this.oIdx * 3)],
      this.orbit.vertices[(this.oIdx * 3)+1],
      this.orbit.vertices[(this.oIdx * 3)+2],
    );
  }

  rendererSetUniform (uniformSetFunc) {
    this.uniformSet = uniformSetFunc;
    return this;
  }

  getModelMatrix () {
    return transform2(this.translateVec,this.scaleVec,this.quatRotation);
  }

  rendererDraw (drawFunc) {
    this.drawFunc = drawFunc;
    return this;
  }

  rendererLoad (loadFunc) {
    this.loadFunc = loadFunc;
    return this;
  }

  loadPlanet () {
    this.loadFunc(this.vertices,this.indices,this.key);
    this.loaded = true;
  }
  
  getCollisionCenter () {
    return this.translateVec;
  }

  getCollisionRadius () {
    return Planet.collisonRadius;
  }

  draw () {
    if (!this.loaded) {
      this.loadPlanet();
    }
    this.uniformSet(Uniforms.modelMatrix,this.getModelMatrix());
    this.uniformSet(Uniforms.reflectionMatrix,this.reflectionMatrix);
    this.uniformSet(Uniforms.shininess,this.shininess);

    if (this.state === PlanetState.selected) {
      this.uniformSet(Uniforms.color,this.selectedColorVec);
    } else if (this.state === PlanetState.idle) {
      this.uniformSet(Uniforms.color,this.colorVec);
    }

    this.uniformSet(Uniforms.is3D,true);
    this.drawFunc(this.key);
    this.orbit.draw();
  }

}
