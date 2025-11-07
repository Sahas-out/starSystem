import { Uniforms } from "../renderer/shaderSource.js";
import {mat4,vec4} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
export class Axes {
  static len = 10.0;
  constructor () {
    this.axisVertices = new Float32Array([
      // X-axis
      0.0, 0.0, 0.0,
      Axes.len, 0.0, 0.0,

      // Y-axis
      0.0, 0.0, 0.0,
      0.0, Axes.len, 0.0,

      // Z-axis
      0.0, 0.0, 0.0,
      0.0, 0.0, Axes.len
    ]);
    this.loaded = false;
    this.xAxisColor = vec4.fromValues(1.0,0.0,0.0,1.0);
    this.yAxisColor = vec4.fromValues(0.0,1.0,0.0,1.0);
    this.zAxisColor = vec4.fromValues(0.0,0.0,1.0,1.0);
  }

  rendererLoadFunc (loadFunc) {
    this.loadFunc = loadFunc;
    return this;
  }

  rendererDrawFunc (drawFunc) {
    this.drawFunc = drawFunc;
    return this;
  }

  rendererSetUniform (setUniform) {
    this.setUniform = setUniform;
    return this;
  }

  loadAxes () {
    this.loadFunc(this.axisVertices);
    this.loaded = true;
  }
  
  draw() {
    if (!this.loaded) {
      this.loadAxes();
    }
    this.setUniform(Uniforms.modelMatrix, mat4.create())
    this.setUniform(Uniforms.is3D,false);

    this.setUniform(Uniforms.color,this.xAxisColor);
    this.drawFunc(0);

    this.setUniform(Uniforms.color,this.yAxisColor);
    this.drawFunc(1);

    this.setUniform(Uniforms.color,this.zAxisColor);
    this.drawFunc(2);
  }
}

