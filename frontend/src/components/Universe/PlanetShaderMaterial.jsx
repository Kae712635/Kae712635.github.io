import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// 3D Simplex Noise from: https://github.com/stegu/psrdnoise/blob/master/src/psrdnoise3.glsl
const noiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const PlanetShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorWaterDeep: new THREE.Color('#002b59'),
    uColorWaterShallow: new THREE.Color('#006994'),
    uColorSand: new THREE.Color('#d4a373'),
    uColorGrass: new THREE.Color('#2d6a4f'),
    uColorForest: new THREE.Color('#1b4332'),
    uColorRock: new THREE.Color('#4a4e69'),
    uColorSnow: new THREE.Color('#f8f9fa'),
    uSeed: 0.0,
    uSunPosition: new THREE.Vector3(10, 0, 0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position; 
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColorWaterDeep;
    uniform vec3 uColorWaterShallow;
    uniform vec3 uColorSand;
    uniform vec3 uColorGrass;
    uniform vec3 uColorForest;
    uniform vec3 uColorRock;
    uniform vec3 uColorSnow;
    uniform float uSeed;
    uniform vec3 uSunPosition;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    ${noiseGLSL}

    // FBM for Terrain
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.5;
      for (int i = 0; i < 5; i++) {
        value += amplitude * snoise(p * frequency);
        p.xy *= mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    // FBM for Clouds (softer, fewer octaves)
    float fbmClouds(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 3; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.2;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      // 1. Terrain Height
      vec3 seedOffset = vec3(uSeed * 10.0);
      float noiseVal = fbm(vPosition + seedOffset);
      float height = noiseVal * 0.5 + 0.5;

      // 2. Base Color Mixing
      vec3 color = uColorWaterDeep;
      float waterLevel = 0.5;

      if (height > waterLevel) {
          float t = smoothstep(waterLevel, waterLevel + 0.05, height);
          color = mix(uColorWaterDeep, uColorWaterShallow, t); // Water gradient
      }
      if (height > waterLevel + 0.02) {
           float t = smoothstep(waterLevel + 0.02, waterLevel + 0.06, height);
           color = mix(color, uColorSand, t);
      }
      if (height > waterLevel + 0.08) {
           float t = smoothstep(waterLevel + 0.08, waterLevel + 0.15, height);
           color = mix(color, uColorGrass, t);
      }
      if (height > waterLevel + 0.25) {
           float t = smoothstep(waterLevel + 0.25, waterLevel + 0.35, height);
           color = mix(color, uColorForest, t);
      }
      if (height > waterLevel + 0.45) {
           float t = smoothstep(waterLevel + 0.45, waterLevel + 0.55, height);
           color = mix(color, uColorRock, t);
      }
      if (height > waterLevel + 0.60) {
           float t = smoothstep(waterLevel + 0.60, waterLevel + 0.70, height);
           color = mix(color, uColorSnow, t);
      }

      // 3. Clouds
      // Animate clouds by rotating position over time
      float cloudTime = uTime * 0.1;
      vec3 cloudPos = vPosition;
      // Simple rotation around Y axis
      float s = sin(cloudTime);
      float c = cos(cloudTime);
      float xTmp = cloudPos.x * c - cloudPos.z * s;
      cloudPos.z = cloudPos.x * s + cloudPos.z * c;
      cloudPos.x = xTmp;
      
      float cloudNoise = fbmClouds(cloudPos * 2.0 + vec3(100.0 + uSeed));
      float cloudCover = smoothstep(0.4, 0.6, cloudNoise * 0.5 + 0.5);
      
      // Shadow from clouds on terrain (fake)
      color = mix(color, color * 0.7, cloudCover * 0.5); 
      // Add clouds on top
      color = mix(color, vec3(1.0), cloudCover * 0.9);

      // 4. Lighting
      // Basic Rim Light / Atmosphere
      vec3 viewDir = normalize(vViewPosition); // Camera to point
      float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
      vec3 atmosphereColor = mix(uColorWaterDeep, vec3(0.5, 0.7, 1.0), 0.5);
      
      // Simple directional light
      vec3 lightDir = normalize(uSunPosition); 
      // Just assume light is roughly from camera/top-right for visibility
      float NdotL = max(dot(vNormal, vec3(0.5, 0.5, 1.0)), 0.0);
      
      vec3 finalColor = color * (NdotL * 0.8 + 0.2); // Ambient + Diffuse
      
      // Add atmosphere glow
      finalColor += atmosphereColor * fresnel * 0.6;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ PlanetShaderMaterial });

export { PlanetShaderMaterial };
