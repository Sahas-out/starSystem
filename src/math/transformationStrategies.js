import { mat4,vec3,mat3,quat} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";

export function transform1 (scaleVec) {
  let modelMatrix = mat4.create();
  mat4.scale(modelMatrix,modelMatrix,scaleVec);
  return modelMatrix;
}

export function transform2 (translateVec,scaleVec,quatRotation) {
  const modelMatrix = mat4.create();

  const translationMatrix = mat4.create();
  const rotationMatrix = mat4.create();
  const scaleMatrix = mat4.create();

  mat4.fromTranslation(translationMatrix, translateVec);   // translation
  mat4.fromQuat(rotationMatrix, quatRotation);             // rotation
  mat4.fromScaling(scaleMatrix, scaleVec);                 // scaling

  mat4.multiply(modelMatrix, rotationMatrix, scaleMatrix); // R * S
  mat4.multiply(modelMatrix, translationMatrix, modelMatrix); // T * (R * S)

  return modelMatrix;
}

export function generateViewMatrix (eye,center,up) {
  let viewMatrix = mat4.create();
  mat4.lookAt(
    viewMatrix,
    eye,
    center,
    up);
  return viewMatrix
}

export function generateProjectionMatrix (fov,aspectRatio,near,far) {
  let projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    fov,
    aspectRatio,
    near,
    far);
  return projectionMatrix;
}

export function generateOrbitVertices (majorSize,minorSize,segments) {
  let vertices = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = majorSize * Math.cos(theta);
    const z = minorSize * Math.cos(theta);
    const y = 0.0;
    vertices.push(x,y,z);
  }
  return vertices;
}

export function getQuartRotation (lastPos,currPos) {
  const axis = vec3.create();
  vec3.cross(axis, lastPos, currPos);
  const dot = Math.min(1.0, vec3.dot(lastPos, currPos));
  const angle = Math.acos(dot);
  const rotationSpeed = 0.3;
  const q = quat.create();
  quat.setAxisAngle(q, axis, angle * rotationSpeed);
  quat.normalize(q, q);

  return q;
}
