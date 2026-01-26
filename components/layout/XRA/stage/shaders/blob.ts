export const blobVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const blobFragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uHover;
  uniform float uPress;
  uniform float uRadius;
  uniform vec3 uColor;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float d = length(uv);
    float radius = min(0.96, uRadius + uPress * 0.18);
    float edge = d - radius;

    float edgeMask = smoothstep(0.18, 0.02, abs(edge));

    float interaction = clamp(uHover, 0.0, 1.0);
    float boost = 1.0 + uHover * 1.1;

    vec2 p = uv * 3.2 + vec2(uTime * 0.18, uTime * 0.14);
    float n = fbm(p + uPointer * 0.9);
    float wobble = (n - 0.5) * 0.23 * interaction * edgeMask * boost;

    vec2 dir = normalize(uPointer + vec2(0.0001));
    float alignment = dot(normalize(uv + vec2(0.0001)), dir);
    float pinch = exp(-pow(1.0 - alignment, 2.0) * 14.0) * clamp(length(uPointer), 0.0, 1.0) * 0.12 * interaction * edgeMask * boost;

    float e = edge + wobble - pinch;
    float alpha = 1.0 - smoothstep(-0.006, 0.016, e);
    gl_FragColor = vec4(uColor, alpha);
  }
`;
