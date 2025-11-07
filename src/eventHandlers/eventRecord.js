import { eventListner } from "./eventHandler.js"
import { vec3} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";

export class EventRecord  {
  constructor () {
    this.startDrag = null;
    this.currDrag = null;
    this.clickPos = null;
    this.scroll = null;
    this.dragging = false;
    this.clicked = false;
    this.scrolling = false;
    this.startDragTBVector = null;
    this.currDragTBVector = null;
    this.addPlanet = false;
    this.deletePlanet = false;
    this.view3D = false;
    this.topView = false;
    this.speedSlider = document.getElementById("valueSlider");
    this.speedValue = document.getElementById("sliderValue");
    this.canvas = document.getElementById("mainCanvas");
  }
  startListening () {
    eventListner(this);
    return this;
  }

  getMouseNDC(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / this.canvas.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / this.canvas.height) * 2 + 1;
    return [x, y];
  }

  getTrackballVector(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (2 * (event.clientX - rect.left) / rect.width - 1);
    const y = (1 - 2 * (event.clientY - rect.top) / rect.height);
    const z2 = 1 - x * x - y * y;
    const z = z2 > 0 ? Math.sqrt(z2) : 0;
    return vec3.fromValues(x, y, z);
  }

}
