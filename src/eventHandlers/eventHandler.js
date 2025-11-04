import { getScene } from "../models/scene.js";
import { ViewKind } from "../models/camera.js";

export function eventListner (eventRecord) {

  const canvas = document.getElementById("mainCanvas");
  canvas.addEventListener('mousedown', (e) => {
    eventRecord.startDrag = eventRecord.getMousePosCanvas(e);
    eventRecord.startDragTBVector = eventRecord.getTrackballVector(e);
    eventRecord.currDragTBVector = eventRecord.startDragTBVector;
    eventRecord.dragging = true;
  });

  canvas.addEventListener("mousemove",(e) =>{
    if (!eventRecord.dragging) return;
    eventRecord.currDrag = eventRecord.getMousePosCanvas(e);
    eventRecord.currDragTBVector = eventRecord.getTrackballVector(e);
  });

  canvas.addEventListener("mouseup",(e) =>{
    eventRecord.dragging = false;
  });

  addPlanet.addEventListener('click', () => {
  });

  deletePlanet.addEventListener('click',() => {

  });


  view3D.addEventListener('click',() => {
    const scene = getScene();
    if (scene.camera.viewKind !== ViewKind.view3D) {
      scene.camera.setViewKind(ViewKind.view3D);
    }
  });

  topView.addEventListener('click',() => {
    const scene = getScene();
    if (scene.camera.viewKind !== ViewKind.topView) {
      scene.camera.setViewKind(ViewKind.topView);
    }
  });

}
