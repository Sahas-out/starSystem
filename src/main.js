"use strict";
import { setup } from "./core/setup.js"
import { getScene } from "./models/scene.js";
import { eventLogic } from "./core/logic.js";

await setup();

const scene = getScene();
scene.camera.translate(0.0,0.0,3.5);

function render(time){
  scene.renderer.clearScene();
  eventLogic();
  scene.camera.setCamera();
  scene.lightSource.illuminate();
  scene.star.draw();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
