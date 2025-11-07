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
import { Planet } from "../models/planet.js";
import { planetsMetaData } from "../utils/customPlanetsMetaData.js";
import { Axes} from "../models/axes.js";
import { PlanetShape } from "../models/planet.js";  


function addPlanet (shape,size,color,speed,state,objMap) {
  const scene = getScene();
  const obj = objMap[shape];
  const orbit = new Orbit(size)
  .rendererSetUniform(scene.renderer.setUniform.bind(scene.renderer))
  .rendererDraw(scene.renderer.drawOrbit.bind(scene.renderer))
  .rendererLoad(scene.renderer.loadOrbit.bind(scene.renderer));
  
  const planet = new Planet(obj.vertices, obj.indices)
  .rendererSetUniform(scene.renderer.setUniform.bind(scene.renderer))
  .rendererDraw(scene.renderer.drawPlanet.bind(scene.renderer))
  .rendererLoad(scene.renderer.loadPlanet.bind(scene.renderer))
  .setSpeed(speed)
  .setColor(...color)
  .setState(state)

  planet.addOrbit(orbit);
  scene.addPlanet(planet);
}

export async function setup () {
  
  const scene = getScene();

  const canvas = document.getElementById("mainCanvas");
  
  const [sphereObj,regularSolid1,cube,regularSolid2] = await mainParser(
    "./modelFiles/sphere.obj",
    "./modelFiles/regularSolid1.obj",
    "./modelFiles/cube.obj",
    "./modelFiles/regularSolid2.obj",
  )
  const objMap  = {
    [PlanetShape.sphere] : sphereObj,
    [PlanetShape.cube] : cube,
    [PlanetShape.regularSolid1] : regularSolid1,
    [PlanetShape.regularSolid2] : regularSolid2,
  }
  const renderer = new Renderer(canvas)
  .attachVertexShader(vertexShaderSource)
  .attachFragmentShader(fragmentShaderSource)
  .linkAndUseProgram()
  .fetchUniforms();
  scene.addRenderer(renderer);


  const star = new Star(sphereObj.vertices, sphereObj.indices)
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

  const axes = new Axes()
  .rendererSetUniform(scene.renderer.setUniform.bind(scene.renderer))
  .rendererDrawFunc(scene.renderer.drawAxes.bind(scene.renderer))
  .rendererLoadFunc(scene.renderer.loadAxes.bind(scene.renderer));
  scene.addAxes(axes);

  for (const p of planetsMetaData) {
    addPlanet(p.shape,p.size,p.color,p.speed,p.state,objMap);
  }
  
  return scene;
}
