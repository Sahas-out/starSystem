import { getQuartRotation } from "../math/transformationStrategies.js";
import { getScene } from "../models/scene.js";
import { SceneState } from "../models/scene.js";


export function eventLogic () {
  const scene = getScene();
  if (scene.eventRecord.dragging && scene.state === SceneState.idle) {
    const quart = getQuartRotation(scene.eventRecord.currDragTBVector,scene.eventRecord.startDragTBVector);
      scene.camera.quartRotation(quart);
  }
}
