"use strict";
import { setup } from "./core/setup.js"
import { eventLogic , frameDrawLogic ,frameUpdateLogic} from "./core/logic.js";

await setup();

function render(time){
  eventLogic();
  frameUpdateLogic();
  frameDrawLogic();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
