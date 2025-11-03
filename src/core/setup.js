import { Renderer } from "../renderer/renderer.js";
import { mainParser } from "../utils/modelFileParser.js";
import { Star } from "../models/star.js"
import { getScene } from "../models/scene.js";
import { PointLightSource } from "../models/pointSourceLight.js";
import { Camera } from "../models/camera.js"
import { EventRecord } from "../eventHandlers/eventRecord.js";
import { fragmentShaderSource,vertexShaderSource } from "../renderer/shaderSource.js";
import { transform1 } from "../math/transformationStrategies.js"
import { Orbit } from "../models/orbit.js";

export async function setup () {
  
  const scene = getScene();

  const canvas = document.getElementById("mainCanvas");
  
  let objects = await mainParser(
    "./modelFiles/try.obj",
  )
  let starObject = objects[0];

  const renderer = new Renderer(canvas)
  .attachVertexShader(vertexShaderSource)
  .attachFragmentShader(fragmentShaderSource)
  .linkAndUseProgram()
  .fetchUniforms();
  scene.addRenderer(renderer);


  const star = new Star(starObject.vertices, starObject.indices)
  .setTransformStrategy(transform1)
  .rendererSetUniform(scene.renderer.setUniform.bind(scene.renderer))
  .rendererDraw(scene.renderer.drawStar.bind(scene.renderer))
  .rendererLoad(scene.renderer.loadStar.bind(scene.renderer));
  scene.addStar(star);

  const camera = new Camera()
  .setAspectRatio(canvas.width,canvas.height)
  .rendererSetUniform(scene.renderer.setUniform.bind(scene.renderer))
  scene.addCamera(camera);

  //
  const pointLightSource = new PointLightSource()
  .rendererSetUniform(scene.renderer.setUniform.bind(scene.renderer))
  scene.addPointLightSource(pointLightSource);

  const eventRecord = new EventRecord()
  .startListening();
  scene.addEventRecorder(eventRecord);

  const orbit = new Orbit(7,1)
  .rendererSetUniform(scene.renderer.setUniform.bind(scene.renderer))
  .rendererDraw(scene.renderer.drawOrbit.bind(scene.renderer))
  .rendererLoad(scene.renderer.loadOrbit.bind(scene.renderer));
  
  return scene;
}
