import { eventListner } from "./eventHandler.js"
import { vec3} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";

export class EventRecord  {
  constructor () {
    this.startDrag = null;
    this.currDrag = null;
    this.clickPos = null;
    this.scroll = null;
    this.dragging = false;
    this.startDragTBVector = null;
    this.currDragTBVector = null;
    this.canvas = document.getElementById("mainCanvas");
  }
  startListening () {
    eventListner(this);
    return this;
  }

  getMousePosCanvas(e){
    const rect = this.canvas.getBoundingClientRect();
    return [
      e.clientX - rect.left, 
      rect.height - (e.clientY - rect.top)];
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
