import {vec3,quat} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
import { generateViewMatrix, generateProjectionMatrix,transformVec1, computeUpVector} from "../math/transformationStrategies.js";

export const ViewKind = {
  topView : "topView",
  view3D : "3DView"
};

export class Camera {
  
  constructor () {

    this.center = vec3.fromValues(0.0,0.0,0.0);
    this.up = vec3.fromValues(0.0,1.0,0.0);

    this.topEye = vec3.fromValues(0.0,25.0,0.0);

    // this.fov = Math.PI / 3; 
    this.fov = 60 * Math.PI / 180 
    this.near = 0.1;
    this.far = 60.0; 
    this.aspectRatio = 1;

    this.viewKind = ViewKind.view3D;
    this.translateVec = this.topEye;
    this.quatRotation = quat.create();

  }

  setViewKind (viewKind) {
    this.viewKind = viewKind;
    if (viewKind === ViewKind.topView){
      this.translateVec = this.topEye;
      this.quatRotation = quat.create();
    }
  }

  setAspectRatio (canvasWidth,canvasHeight) {
    this.aspectRatio = canvasWidth / canvasHeight;
    return this;
  }

  rendererSetUniform(setterFunc){
    this.uniformSetter =  setterFunc;
    return this;
  }

  translate (...displacement) {
    displacement = vec3.fromValues(...displacement);
    vec3.add(this.translateVec,this.translateVec,displacement);
  }

  quartRotation (q) {
    quat.multiply(this.quatRotation,this.quatRotation,q);
  }
  
  getEyePosition () {
    if (this.viewKind === ViewKind.topView) {
      return this.topEye; 
    } 
    return transformVec1(this.translateVec,this.quatRotation);
  }

  getUpVec () {
    return computeUpVector(this.getEyePosition(),this.center);
  }

  changeView (viewKind) {
    if (viewKind == ViewKind.topView) {
      this.viewKind = ViewKind.topView;
    } else if (viewKind == ViewKind.view3D) {
      this.viewKind = ViewKind.view3D;
    }
  }

  getViewMatrix () {
    return generateViewMatrix(
      this.getEyePosition(),
      this.center,
      this.getUpVec());
  }

  getProjectionMatrix() {
    return generateProjectionMatrix(
      this.fov,
      this.aspectRatio,
      this.near,
      this.far);
  }


  setCamera () {
    let viewMatrix = this.getViewMatrix();
    let projectionMatrix = this.getProjectionMatrix();
    let cameraPosition = this.getEyePosition();
    this.uniformSetter(Uniforms.viewMatrix,viewMatrix);
    this.uniformSetter(Uniforms.projectionMatrix,projectionMatrix);
    this.uniformSetter(Uniforms.cameraPosition,cameraPosition);
  }

}
