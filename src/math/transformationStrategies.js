import { mat4,vec3,mat3,quat,vec4} from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm";

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

export function generateOrthoProjection (left, right, bottom, top, near, far) {
  const projectionMatrix = mat4.create();
  mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
  return projectionMatrix;
}


export function generateOrbitVertices (majorSize,minorSize,segments) {
  let vertices = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = majorSize * Math.cos(theta);
    const z = minorSize * Math.sin(theta);
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
  const rotationSpeed = 0.2;
  const q = quat.create();
  quat.setAxisAngle(q, axis, angle * rotationSpeed);
  quat.normalize(q, q);

  return q;
}

export function transformVec1 (translateVec,quatRotation) {
  let eyeVec = vec3.fromValues(0.0,0.0,0.0);
  vec3.add(eyeVec,eyeVec,translateVec);
  vec3.transformQuat(eyeVec,eyeVec,quatRotation);
  return eyeVec;
}

export function computeUpVector(eye, center) {

  const viewDir = vec3.create();
  vec3.subtract(viewDir, center, eye);
  vec3.normalize(viewDir, viewDir);

  const worldUp = vec3.fromValues(0, 1, 0);
  let right = vec3.create();
  vec3.cross(right, worldUp, viewDir);

  if (vec3.length(right) < 1e-3) {
    // avoid degenerate case by using Z as fallback
    const altUp = vec3.fromValues(0, 0, 1);
    vec3.cross(right, altUp, viewDir);
  }

  vec3.normalize(right, right);
  const up = vec3.create();
  vec3.cross(up, viewDir, right);
  vec3.normalize(up, up);

  return up;
}

export function planetRevolve (theta, speed, minorSize, majorSize) {
  let deltaTheta = Math.PI * 2 * speed / 60;
  let newTheta = deltaTheta + theta;
  let newPos = vec3.fromValues(
    Math.cos(newTheta) * majorSize,
    0.0,
    Math.sin(newTheta) * minorSize
  )
  return [newPos,newTheta];
}

export function getPickingRay(ndcX, ndcY, viewMatrix, projectionMatrix) {
  // Inverse of combined matrix
  const invVP = mat4.create();
  mat4.multiply(invVP, projectionMatrix, viewMatrix);
  mat4.invert(invVP, invVP);

  // Start and end points in clip space
  const pNear = vec4.fromValues(ndcX, ndcY, -1.0, 1.0);
  const pFar  = vec4.fromValues(ndcX, ndcY,  1.0, 1.0);

  // Unproject to world space
  vec4.transformMat4(pNear, pNear, invVP);
  vec4.transformMat4(pFar,  pFar,  invVP);

  // Divide by w to get real world coordinates
  for (let p of [pNear, pFar]) {
    p[0] /= p[3]; p[1] /= p[3]; p[2] /= p[3];
  }

  // Ray = origin + t * direction
  const origin = vec3.fromValues(pNear[0], pNear[1], pNear[2]);
  const dir = vec3.create();
  vec3.sub(dir, vec3.fromValues(pFar[0], pFar[1], pFar[2]), origin);
  vec3.normalize(dir, dir);

  return { origin, dir };
}

export function raySphereIntersect(rayOrigin, rayDir, sphereCenter, radius) {
  const oc = vec3.create();
  vec3.sub(oc, rayOrigin, sphereCenter);

  const a = vec3.dot(rayDir, rayDir);
  const b = 2.0 * vec3.dot(oc, rayDir);
  const c = vec3.dot(oc, oc) - radius * radius;

  const discriminant = b * b - 4 * a * c;
  return discriminant > 0; // true → ray hit sphere
}

