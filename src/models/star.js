import { mat4,vec3,mat3,vec4} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";
import { recalculateNoramlsOutside } from "../utils/recalculateNormalsOutside.js";

export class Star {

  constructor(inVertices,inIndicies) {
    recalculateNoramlsOutside(inVertices);
    this.vertices = inVertices;
    this.indicies = inIndicies;
    this.scaleVec = vec3.fromValues(1.0,1.0,1.0);
    this.modelMatrix = mat4.create();
    this.ReflectionMatrix = mat3.fromValues(
      0.2, 0.2, 0.2,
      0.7, 0.7, 0.7,
      0.5, 0.5, 0.5
    );
    this.loaded = false;
    this.shininess = 1.0;
    this.color = vec4.fromValues(1.0,1.0,0.0,1.0);
  }


  setTransformStrategy (strategy) {
    this.transformStrategy = strategy;
    return this;
  }

  rendererSetUniform (uniformSetter) {
    this.uniformSetter = uniformSetter;
    return this;
  }

  rendererDraw (drawFunc) {
    this.drawFunc = drawFunc;
    return this;
  }

  rendererLoad (loadFunc) {
    this.loadFunc = loadFunc;
    return this;
  }

  scale (scaleFactor) {
    scaleFactor = vec3.fromValues(scaleFactor,scaleFactor,scaleFactor);
    vec3.add(this.scaleVec,this.scaleVec,this.scaleFactor);
  }

  getModelMatrix () {
    return this.transformStrategy(this.scaleVec); 
  }

  draw () {
    if (!this.loaded) {
      this.loadFunc(this.vertices,this.indicies);
      this.loaded = true;
    }
    this.modelMatrix = this.getModelMatrix();
    this.uniformSetter(Uniforms.modelMatrix,this.modelMatrix);
    this.uniformSetter(Uniforms.reflectionMatrix,this.ReflectionMatrix);
    this.uniformSetter(Uniforms.shininess,this.shininess);
    this.uniformSetter(Uniforms.color,this.color);
    this.uniformSetter(Uniforms.is3D,true);
    this.drawFunc();
  }


}
