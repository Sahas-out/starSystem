import { generateOrbitVertices } from "../math/transformationStrategies.js";
import { mat4,vec3,mat3,vec4} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
export class Orbit {

  static ratio = 0.8;
  static segmentSizeRatio = 2 / 128;

  constructor (size,key) {
    this.size = size;
    this.key = key;
    this.majorSize = this.size / 2;
    this.minorSize = this.majorSize * Orbit.ratio;
    this.segments = this.size * Orbit.segmentSizeRatio;
    this.color = vec3.fromValues(1.0,1.0,1.0);
    this.loaded = false;
  }

  assignKey (key) {
    this.key = key;
  }

  getVertices () {
    if (!this.vertices) {
      this.vertices = generateOrbitVertices(this.majorSize,this.minorSize,this.segments);
    }
    return this.vertices;
  }

  rendererSetUniform (setUniformFunc) {
    this.setUniform = setUniformFunc;
    return this;
  }
  
  getModelMatrix () {
    return mat4.create();
  }

  rendererLoad (loadFunc) {
    this.loadFunc = loadFunc;
    return this;
  }

  rendererDraw (drawFunc) {
    this.drawFunc = drawFunc;
    return this;
  }

  loadOrbit () {
    this.loadFunc(this.getVertices(),this.key);
  }

  drawOrbit () {
    if (!this.loaded) {
      this.loadOrbit(this.key);
    }
    this.setUniform(Uniforms.modelMatrix,this.getModelMatrix());
    this.setUniform(Uniforms.color,this.color);
    this.setUniform(Uniforms.is3D,false);
    this.drawFunc(this.key);
  }

}
