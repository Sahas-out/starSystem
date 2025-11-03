import { mat4,vec3,mat3,vec4,quat} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
import { transform2 } from "../math/transformationStrategies.js";

export class Planet {

  constructor () {
    this.loaded = false;
    this.translateVec = vec3.fromValues(0.0,0.0,0.0);
    this.scaleVec = vec3.fromValues(1.0,1.0,1.0);
    this.quatRotation = quat.create();
  }

  addOrbit (orbit) {
    this.orbit = orbit;
  }
  
  translate (...delta) {
    let displacemet = vec3.fromValues(...delta);
    vec3.add(this.translateVec,this.translateVec,displacemet);
  }

  scale (scaleFactor) {
    let scaler = vec3.fromValues(scaleFactor,scaleFactor,scaleFactor);
    vec3.add(this.scaleVec,this.scaleVec,scaler);
  }

  quatRotate (q) {
    quat.multiply(this.quatRotation,this.quatRotation,q);
  }

  rendererSetUniform (uniformSetFunc) {
    this.uniformSet = uniformSetFunc;
  }

  getModelMatrix () {
    return transform2(this.translateVec,this.scaleVec,this.quatRotation);
  }

  rendererDraw (drawFunc) {
    this.drawFunc = drawFunc;
  }

  rendererLoad (loadFunc) {
    this.loadFunc = loadFunc;
  }

  loadPlanet () {
    this.loadFunc();
  }

  draw () {

  }

}
