export const Uniforms = {
  modelMatrix : "uModelMatrix",
  viewMatrix : "uViewMatrix",
  projectionMatrix : "uProjectionMatrix",
  illuminationMatrix : "uIlluminationMatrix",
  reflectionMatrix : "uReflectionMatrix",
  shininess : "uShininess",
  cameraPosition : "uCameraPosition",
  color : "uColor",
  is3D : "uIs3D"
};

export const Attributes = {
  position : 1,
  normal : 2,
  color : 3
}

export const vertexShaderSource = `#version 300 es
layout(location = ${Attributes.position}) in vec3 aPosition;
layout(location = ${Attributes.normal}) in vec3 aNormal;
// layout(location = ${Attributes.color}) in vec3 aColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool uIs3D;


out vec3 vNormal;
out vec3 vPositionWorld;

void main() {
    vec4 pWorld = uModelMatrix * vec4(aPosition, 1.0);
    vPositionWorld = pWorld.xyz;

    // compute normal matrix on GPU (mat3 of model's top-left)
    mat3 nMat = mat3(transpose(inverse(uModelMatrix)));
    vNormal = uIs3D ? normalize(nMat * aNormal) : vec3(0.0,1.0,0.0);

    gl_Position = uProjectionMatrix * uViewMatrix * pWorld;
}
` ;

export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 vNormal;
in vec3 vPositionWorld;

uniform mat3 uIlluminationMatrix;
uniform mat3 uReflectionMatrix;
uniform float uShininess;
uniform vec3 uCameraPosition;
uniform vec4 uColor;
uniform bool uIs3D;

out vec4 outColor;

void main() {
    if (!uIs3D) {
        outColor = uColor;
        return;
    }
    vec3 Ia = uIlluminationMatrix[0].xyz;
    vec3 Id = uIlluminationMatrix[1].xyz;
    vec3 lightPos = uIlluminationMatrix[2].xyz;

    vec3 ka = uReflectionMatrix[0];
    vec3 kd = uReflectionMatrix[1];
    vec3 ks = uReflectionMatrix[2];

    vec3 N = normalize(vNormal);
    vec3 L = normalize(lightPos - vPositionWorld);
    vec3 V = normalize(uCameraPosition - vPositionWorld);
    vec3 R = reflect(-L, N);

    vec3 ambient = Ia * ka * uColor.rgb;
    float NdotL = max(dot(N, L), 0.0);
    vec3 diffuse = Id * kd * uColor.rgb * NdotL;

    float specFactor = 0.0;
    if (NdotL > 0.0) {
        specFactor = pow(max(dot(R, V), 0.0), uShininess);
    }
    vec3 specular = Id * ks * specFactor;

    vec3 color = ambient + diffuse + specular;
    color = clamp(color, 0.0, 1.0);

    outColor = vec4(color, 1.0);
}
`
