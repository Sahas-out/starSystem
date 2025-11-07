export function eventListner (eventRecord) {

  const canvas = document.getElementById("mainCanvas");
  const speedSlider = document.getElementById("valueSlider");
  const speedValue = document.getElementById("sliderValue");
  canvas.addEventListener('mousedown', (e) => {
    eventRecord.startDrag = eventRecord.getMouseNDC(e);
    eventRecord.startDragTBVector = eventRecord.getTrackballVector(e);
    eventRecord.currDragTBVector = eventRecord.startDragTBVector;
    eventRecord.dragging = true;
  });

  canvas.addEventListener("mousemove",(e) =>{
    if (!eventRecord.dragging) return;
    eventRecord.currDrag = eventRecord.getMouseNDC(e);
    eventRecord.currDragTBVector = eventRecord.getTrackballVector(e);
  });

  canvas.addEventListener("mouseup",(e) =>{
    eventRecord.dragging = false;
  });

  canvas.addEventListener("click", (e) => {
    eventRecord.clicked = true;
    eventRecord.clickPos = eventRecord.getMouseNDC(e);
  });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    eventRecord.scroll = e.deltaY;
    eventRecord.scrolling = true;

  },{"passive":false});

  addPlanet.addEventListener('click', () => {
    eventRecord.addPlanet = true;
  });
  
  deletePlanet.addEventListener('click',() => {
    eventRecord.deletePlanet = true;
  });


  view3D.addEventListener('click',() => {
    eventRecord.view3D = true;
  });

  topView.addEventListener('click',() => {
    eventRecord.topView = true;
  });

}
