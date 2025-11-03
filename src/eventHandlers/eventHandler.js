
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
}
