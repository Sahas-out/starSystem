import { mat4,vec3,mat3} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";
import { Uniforms } from "../renderer/shaderSource.js";

export class PointLightSource {
  
  constructor () {
    this.position = vec3.fromValues(0.0,0.0,0.0);
    // this.position = vec3.fromValues(2.0, 2.0, 2.0);
    this.ambientIntensity = vec3.fromValues(1.0,1.0,1.0);
    // this.ambientIntensity = vec3.fromValues(0.2,0.2,0.2);
    // this.directIntensity = vec3.fromValues(1.0,1.0,1.0);
    this.directIntensity = vec3.fromValues(0.6,0.6,0.6);
    this.attenuationCoefficents = vec3.fromValues(1.0,1.0,1.0);
  }

  getIlluminationMatrix () {
    let illuminationMatrix = mat3.fromValues(
      ...this.ambientIntensity,
      ...this.directIntensity,
      ...this.position
    ) 
    // mat4.transpose(illuminationMatrix,illuminationMatrix);
    return illuminationMatrix;
  }

  getAttenuationCoefficents () {
    return this.attenuationCoefficents;
  }

  rendererSetUniform (setUniformFunc) {
    this.setUniformFunc = setUniformFunc;
    return this;
  }
  
  illuminate () {
    let illuminationMatrix = this.getIlluminationMatrix();
    this.setUniformFunc(Uniforms.illuminationMatrix,illuminationMatrix);
  }
}
