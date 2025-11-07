import { EventRecord } from "../eventHandlers/eventRecord.js";
import { getQuartRotation, getPickingRay, raySphereIntersect} from "../math/transformationStrategies.js";
import { getScene } from "../models/scene.js";
import { SceneState } from "../models/scene.js";
import { PlanetState } from "../models/planet.js";  
import { ViewKind } from "../models/camera.js";


export function eventLogic () {
  const scene = getScene();

  if (scene.eventRecord.dragging && scene.state === SceneState.idle) {
    const quart = getQuartRotation(scene.eventRecord.startDragTBVector,scene.eventRecord.currDragTBVector);
    scene.camera.quartRotation(quart);
  }

  if (scene.eventRecord.clicked) {
    const ray =  getPickingRay(
      scene.eventRecord.clickPos[0],
      scene.eventRecord.clickPos[1],
      scene.camera.getViewMatrix(),
      scene.camera.getProjectionMatrix()
    );
    if (scene.state === SceneState.editing && scene.selectedPlanet) {
      const intersected = raySphereIntersect(ray.origin,ray.dir,
        scene.selectedPlanet.getCollisionCenter(),scene.selectedPlanet.getCollisionRadius());
      if (intersected) {
        scene.selectedPlanet.setState(PlanetState.idle);
        scene.state = SceneState.idle;
        scene.selectedPlanet = null;
      }
    } else if (scene.state === SceneState.idle && scene.selectedPlanet === null) {
      for (const planet of scene.planets) {
        const intersected = raySphereIntersect(ray.origin,ray.dir,
          planet.getCollisionCenter(),planet.getCollisionRadius());
        if (intersected) {
          planet.setState(PlanetState.selected);
          scene.state = SceneState.editing;
          scene.selectedPlanet = planet;
          break;
        }
      }
    }
  }

  if (scene.eventRecord.dragging && scene.state === SceneState.editing && scene.selectedPlanet) {
    const quart = getQuartRotation(scene.eventRecord.startDragTBVector,scene.eventRecord.currDragTBVector);
    scene.selectedPlanet.quatRotate(quart);
  }

  if (scene.eventRecord.scrolling && scene.state === SceneState.editing && scene.selectedPlanet) {
    let wheelSensitivity = 0.000000000001/138;
    scene.selectedPlanet.scale(scene.eventRecord.scroll * wheelSensitivity);
  }

  if (scene.eventRecord.addPlanet) {
    for (const planet of scene.planets) {
      if (planet.state === PlanetState.invisible) {
        planet.setState(PlanetState.idle);
        break;
      }
    }
  }

  if (scene.state === SceneState.editing && scene.selectedPlanet && scene.eventRecord.deletePlanet) {
    let count = 0;
    for (const planet of scene.planets) {
      if (planet.state === PlanetState.idle) count+=1;
    }
    if (count + 1 > 3) {
      scene.selectedPlanet.setState(PlanetState.invisible);
      scene.state = SceneState.idle;
      scene.selectedPlanet = null;
    }
  }

  if (scene.eventRecord.view3D) {
    if (scene.camera.viewKind !== ViewKind.view3D) {
      scene.camera.setViewKind(ViewKind.view3D);
    }
  }

  if (scene.eventRecord.topView) {
    if (scene.camera.viewKind !== ViewKind.topView) {
      scene.camera.setViewKind(ViewKind.topView);
    }
  }

  if (scene.selectedPlanet) {
    let speedUp = (scene.eventRecord.speedSlider.value - 50) * 2;
    scene.selectedPlanet.increaseSpeed(speedUp);
    scene.eventRecord.speedValue.textContent = `${speedUp}%`;
  }
  if (!scene.selectedPlanet) {
    scene.eventRecord.speedSlider.value = 50;
    scene.eventRecord.speedValue.textContent = "0%";
  }

  scene.eventRecord.clicked = false;
  scene.eventRecord.scrolling = false;
  scene.eventRecord.addPlanet = false;
  scene.eventRecord.deletePlanet = false;
  scene.eventRecord.view3D = false;
  scene.eventRecord.topView = false;
}

export function frameUpdateLogic () {
  const scene = getScene();
  for (const planet of scene.planets) {
    if (planet.state === PlanetState.idle) {
      planet.revolve();
    }
  }
}

export function frameDrawLogic () {
  const scene = getScene();
  scene.renderer.clearScene();
  scene.camera.setCamera();
  scene.lightSource.illuminate();
  scene.star.draw();
  scene.axes.draw();
  for (const planet of scene.planets) {
    if (planet.state !== PlanetState.invisible) {
      planet.draw();
    }
  }
}
