
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

export function countCloseVertexPairs(vertices, epsilon = 1e-5) {
  const n = vertices.length / 8;
  let count = 0;

  for (let i = 0; i < n; i++) {
    const ix = vertices[8 * i];
    const iy = vertices[8 * i + 1];
    const iz = vertices[8 * i + 2];

    for (let j = i + 1; j < n; j++) {
      const jx = vertices[8 * j];
      const jy = vertices[8 * j + 1];
      const jz = vertices[8 * j + 2];

      const dx = ix - jx;
      const dy = iy - jy;
      const dz = iz - jz;

      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < epsilon * epsilon) {
        count++;
      }
    }
  }
  console.log("close Vertices ",count)
  return count;
}
