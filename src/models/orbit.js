import { generateOrbitVertices } from "../math/transformationStrategies.js";
import { mat4,vec3,mat3,vec4} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
export class Orbit {

  static ratio = 0.6;
  static segmentSizeRatio = 128 / 2;

  constructor (size) {
    this.size = size;
    this.majorSize = this.size / 2;
    this.minorSize = this.majorSize * Orbit.ratio;
    this.segments = this.size * Orbit.segmentSizeRatio;
    this.color = vec4.fromValues(1.0,1.0,1.0,1.0);
    this.loaded = false;
    this.getVertices();
  }

  assignKey (key) {
    this.key = key;
    return this;
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
    this.loaded = true;
  }

  draw () {
    if (!this.loaded) {
      this.loadOrbit(this.key);
    }
    this.setUniform(Uniforms.modelMatrix,this.getModelMatrix());
    this.setUniform(Uniforms.color,this.color);
    this.setUniform(Uniforms.is3D,false);
    this.drawFunc(this.key);
  }

}
