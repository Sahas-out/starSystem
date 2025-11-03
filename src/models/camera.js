import {vec3,quat} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
import { generateViewMatrix, generateProjectionMatrix} from "../math/transformationStrategies.js";

export const ViewKind = {
  topView : "topView",
  view3D : "3DView"
};

export class Camera {
  
  constructor () {

    this.center = vec3.fromValues(0.0,0.0,0.0);
    this.up = vec3.fromValues(0.0,1.0,0.0);
    this.topEye = vec3.fromValues(0.0,3.5,0.0);

    this.fov = Math.PI / 1.5;
    this.near = 0.1;
    this.far = 10.0; 
    this.aspectRatio = 1;// change this to canvas height/canvas width

    this.viewKind = ViewKind.view3D;
    this.translateVec = vec3.fromValues(0.0,0.0,0.0);
    this.quatRotation = quat.create();

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
    // changes the center
    displacement = vec3.fromValues(...displacement);
    vec3.add(this.translateVec,this.translateVec,displacement);
  }

  quartRotation (q) {
    quat.multiply(this.quatRotation,this.quatRotation,q);
  }
  
  getEyePosition () {
    let eyeVec = vec3.fromValues(0.0,0.0,0.0);
    vec3.add(eyeVec,eyeVec,this.translateVec);
    vec3.transformQuat(eyeVec,eyeVec,this.quatRotation);
    return eyeVec;
  }
  changeView (viewKind) {
    if (viewKind == ViewKind.topView) {
      this.viewKind = ViewKind.topView;
    } else if (viewKind == ViewKind.view3D) {
      this.viewKind = ViewKind.view3D;
    }
  }

  getViewMatrix () {

    if (this.viewKind == ViewKind.view3D) {
      let eye = this.getEyePosition();
      return generateViewMatrix(eye,this.center,this.up);
    } else if (this.viewKind == ViewKind.topView) {
      return generateViewMatrix(this.topEye,this.center,this.up);
    } 
  }

  getProjectionMatrix() {
    return generateProjectionMatrix(this.fov,this.aspectRatio,this.near,this.far);
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
