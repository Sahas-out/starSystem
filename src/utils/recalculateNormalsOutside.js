
export function recalculateNoramlsOutside(flatArray) {
  let inwardCount = 0;
  let outwardCount = 0;

  for (let i = 0; i < flatArray.length; i += 8) {

    const vx = flatArray[i];
    const vy = flatArray[i + 1];
    const vz = flatArray[i + 2];
    const nx = flatArray[i + 3];
    const ny = flatArray[i + 4];
    const nz = flatArray[i + 5];

    const dot = (vx * nx + vy * ny + vz * nz) ;

    if (dot < 0) {
      flatArray[i+3] *= -1;
      flatArray[i+4] *= -1;
      flatArray[i+5] *= -1;
      inwardCount++;
    } else {
      outwardCount++;
    }
  }
  // console.log("inward facing",inwardCount);
} 
