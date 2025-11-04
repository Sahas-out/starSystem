"use strict";
import { setup } from "./core/setup.js"
import { getScene } from "./models/scene.js";
import { eventLogic } from "./core/logic.js";
import { ViewKind } from "./models/camera.js";

await setup();

const scene = getScene();
scene.planets[0].scale(0.3);
scene.planets[1].scale(0.3);

function render(time){
  scene.renderer.clearScene();
  eventLogic();
  scene.camera.setCamera();
  scene.lightSource.illuminate();
  scene.star.draw();
  for (let i=0; i<scene.planets.length; i++){
    scene.planets[i].draw();
    scene.planets[i].revolve();
  }
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
