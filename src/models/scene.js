export const SceneState = {
  idle:"idle",
  editing:"editing"
}

let _sceneInstance = null;

export class Scene {

  constructor () {
    this.star = null;
    this.planets = [];
    this.state = SceneState.idle;
  }
  addPlanet (planet) {
    let key = this.planets.length;
    planet.assignKey(key);
    this.planets.push(planet);
  }
  addRenderer (renderer) {
    this.renderer = renderer;
    return this;
  } 
  addStar (star) {
    this.star = star;
    return this;
  }
  addCamera (camera) {
    this.camera = camera;
    return this;
  }
  addPointLightSource (pointLightSource) {
    this.lightSource = pointLightSource;
    return this;
  }
  addEventRecorder (eventRecord) {
    this.eventRecord = eventRecord;
    return this;
  }
}

export function getScene () {
  if (!_sceneInstance) {
    _sceneInstance = new Scene();
  }
  return _sceneInstance;
}
