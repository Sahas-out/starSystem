import { mat4,vec3,mat3,vec4,quat} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
import { transform2, planetRevolve } from "../math/transformationStrategies.js";
import { recalculateNoramlsOutside } from "../utils/recalculateNormalsOutside.js";

export const PlanetState = {
  stationary : "stationary",
  moving : "moving"
};

export class Planet {

  constructor (inVertices,inIndices) {
    recalculateNoramlsOutside(inVertices);
    this.vertices = inVertices;
    this.indices = inIndices;
    this.loaded = false;
    this.translateVec = vec3.fromValues(0.0,0.0,0.0);
    this.scaleVec = vec3.fromValues(1.0,1.0,1.0);
    this.quatRotation = quat.create();
    this.colorVec = vec4.fromValues(1.0,0.0,0.0,1.0);
    this.reflectionMatrix = mat3.fromValues(
      0.5,0.5,0.5,
      0.3,0.3,0.3,
      0.2,0.2,0.2
    );
    this.shininess = 1;
    this.speeed = 0.1;
    this.theta = 0.0;
    this.oIdx = 0;
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
    let delta = Math.ceil(this.orbit.segments * this.speeed / 60);
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

  draw () {
    if (!this.loaded) {
      this.loadPlanet();
    }
    this.uniformSet(Uniforms.modelMatrix,this.getModelMatrix());
    this.uniformSet(Uniforms.reflectionMatrix,this.reflectionMatrix);
    this.uniformSet(Uniforms.shininess,this.shininess);
    this.uniformSet(Uniforms.color,this.colorVec);
    this.uniformSet(Uniforms.is3D,true);
    this.drawFunc(this.key);
    this.orbit.draw();
  }

}
