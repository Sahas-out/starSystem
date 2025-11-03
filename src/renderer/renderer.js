"use strict";

import { Uniforms, Attributes} from "./shaderSource.js";

export class Renderer{
    
  constructor (canvas) {
    this.canvas = canvas;
    this.gl = this.canvas.getContext('webgl2');
    this.program = this.gl.createProgram();
    this.gl.enable(this.gl.DEPTH_TEST);
    // this.gl.enable(this.gl.CULL_FACE);
  }

  attachVertexShader (shaderSource) {
    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(this.vertexShader,shaderSource);
    this.gl.compileShader(this.vertexShader);
    this.gl.attachShader(this.program,this.vertexShader);
    return this;
  }

  attachFragmentShader (shaderSource) {
    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(this.fragmentShader,shaderSource);
    this.gl.compileShader(this.fragmentShader);
    this.gl.attachShader(this.program,this.fragmentShader);
    return this;
  }

  linkAndUseProgram () {
    this.gl.linkProgram(this.program)

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.log(this.gl.getShaderInfoLog(this.vertexShader));
      console.log(this.gl.getShaderInfoLog(this.fragmentShader));
      console.log(this.gl.getProgramInfoLog(this.program));
      throw new Error("failed to link: possibly cause shader cant compile");
    }
    this.gl.useProgram(this.program)
    return this;
  }
  
  fetchUniforms () {
    this.uniformsLoc = {};
    for (const key in Uniforms) {
      if (Uniforms.hasOwnProperty(key)) {
        this.uniformsLoc[Uniforms[key]] = this.gl.getUniformLocation(this.program, Uniforms[key]);
      }
    }
    return this;
  }
  
  clearScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  setUniform (uniform,value) {
    // console.log(uniform,"is updated with value",value);
    const loc = this.uniformsLoc[uniform];
    if (uniform === Uniforms.modelMatrix || uniform === Uniforms.viewMatrix || uniform === Uniforms.projectionMatrix){
      this.gl.uniformMatrix4fv(loc,false,value);
    } else if (uniform === Uniforms.illuminationMatrix || uniform === Uniforms.reflectionMatrix){
      this.gl.uniformMatrix3fv(loc,false,value);
    } else if (uniform === Uniforms.shininess){
      this.gl.uniform1f(loc,value);
    } else if (uniform === Uniforms.cameraPosition){
      this.gl.uniform3f(loc,...value)
    } else if (uniform === Uniforms.color) {
      this.gl.uniform4f(loc,...value);
    } else if (uniform === Uniforms.is3D) {
      this.gl.uniform1i(loc,value ? 1 : 0);
    }
  }

  loadStar (vertices,indicies) {

    this.nFacesStar = indicies.length;
    let verticiesArray = new Float32Array(vertices); 
    let indicesArray = new Uint16Array(indicies);

    this.bufferStarVertices = this.gl.createBuffer();

    this.bufferStarIndicies = this.gl.createBuffer();

    this.vaoStar = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vaoStar);

    // binding array buffer after binding vao doesnt change the state of vao its just a good practise   
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.bufferStarVertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,verticiesArray,this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.bufferStarIndicies);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,indicesArray,this.gl.STATIC_DRAW);

    this.gl.vertexAttribPointer(Attributes.position,3,this.gl.FLOAT,false,8 * 4,0);
    this.gl.vertexAttribPointer(Attributes.normal,3,this.gl.FLOAT,false,8*4,4*3);

    this.gl.enableVertexAttribArray(Attributes.position);
    this.gl.enableVertexAttribArray(Attributes.normal);

    this.gl.bindVertexArray(null);

  }

  drawStar () {
    this.gl.bindVertexArray(this.vaoStar);
    this.gl.drawElements(this.gl.TRIANGLES,this.nFacesStar,this.gl.UNSIGNED_SHORT,0);
  }

  loadOrbit (vertices,key) {
    if (!this.orbits) {
      this.orbits = {};
    }
    let verticesArray = new Float32Array(vertices);
    let vertCount = verticesArray.length;
    let bufferOrbit = this.gl.createBuffer();

    let vaoOrbit = this.gl.createVertexArray();
    this.gl.bindVertexArray(vaoOrbit);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,bufferOrbit);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,verticesArray,this.gl.STATIC_DRAW);

    this.gl.vertexAttribPointer(Attributes.position,3,this.gl.FLOAT,false,3*4,0);
    
    this.gl.enableVertexAttribArray(Attributes.normal);

    this.gl.bindVertexArray(null);

    this.orbits[key] = {vao:vaoOrbit,nvert:vertCount}

  }

  drawOrbit (key) {
    let vaoOrbit = this.orbits[key].vao;
    let nvert = this.orbits[key].nvert;
    this.gl.bindVertexArray(vaoOrbit);
    this.gl.drawArrays(gl.LINE_LOOP,0,nvert);
  }

}
