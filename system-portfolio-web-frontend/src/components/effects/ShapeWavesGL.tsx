"use client";

// Versão WebGL2 do ShapeWaves, usada quando o navegador não oferece WebGPU
// (ex.: Chrome no Linux sem flag, Firefox). Mesmo shader de ruído, formas,
// ondas no hover, fade das bordas e intro; sem a passada de glow.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ShapeWavesShapes } from "./ShapeWaves";

const SHAPE_MODES = { mixed: 0, squares: 1, circles: 2, triangles: 3 } as const;
const MAX_DPR = 2;
const MAX_MASK_SIZE = 1024;
const NOISE_CELLS = 32;
const TIME_RATE = 0.1;
const SIMULATION_STEP = 1 / 60;
const WAVE_SPEED = 0.42;
const WAVE_FRICTION = 0.94;
const WAVE_DECAY = 0.972;
const SETTLED_THRESHOLD = 0.01;
const INTRO_BAND = 0.2;
const INTRO_WARP = 0.3;
const INTRO_JITTER = 0.16;
const INTRO_END = 1 + INTRO_WARP + INTRO_JITTER + INTRO_BAND;

const VERTEX_SHADER = `#version 300 es
void main() {
  // Triângulo que cobre a tela inteira, sem buffers
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform vec4 uPlacement;
uniform vec4 uGrid;
uniform vec4 uField;
uniform vec4 uMotion;
uniform vec3 uColor;
uniform vec3 uHover;
uniform vec3 uBackground;
uniform sampler2D uMask;
uniform sampler2D uCharges;

out vec4 outColor;

const vec2 SEED = vec2(12.9898, 78.233);

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fadeCurve(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 f = fadeCurve(Pf0);
  vec4 nz = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), f.z);
  vec2 ny = mix(nz.xy, nz.zw, f.y);
  return 2.2 * mix(ny.x, ny.y, f.x);
}

float fbm(vec3 p) {
  float total = 0.0;
  float amplitude = 1.0;
  float weight = 0.0;
  float frequency = 1.0;
  for (int i = 0; i < 2; i++) {
    total += amplitude * cnoise(p * frequency);
    weight += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return total / weight;
}

float sdIsoscelesTriangle(vec2 point, vec2 q) {
  vec2 p = vec2(abs(point.x), point.y);
  vec2 a = p - q * clamp(dot(p, q) / dot(q, q), 0.0, 1.0);
  vec2 b = p - q * vec2(clamp(p.x / q.x, 0.0, 1.0), 1.0);
  float s = -sign(q.y);
  vec2 d = min(vec2(dot(a, a), s * (p.x * q.y - p.y * q.x)), vec2(dot(b, b), s * (p.y - q.y)));
  return -sqrt(d.x) * sign(d.y);
}

float shapeDistance(vec2 p, int shape, float c) {
  if (shape == 0) { return max(abs(p.x), abs(p.y)) - c; }
  if (shape == 1) { return length(p) - c; }
  return sdIsoscelesTriangle(vec2(p.x, p.y + c), vec2(c, 2.0 * c));
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 resolution = uResolution;
  // Origem no topo, como no shader WGSL original
  vec2 pixel = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
  float cellPx = uGrid.x;
  float dotSize = uGrid.y;
  int mode = int(uGrid.z + 0.5);
  int cols = int(uGrid.w + 0.5);
  vec2 origin = uPlacement.xy;
  int rows = int(uPlacement.z + 0.5);
  vec2 cell = floor((pixel - origin) / cellPx);
  if (cell.y < 0.0 || int(cell.y) >= rows || cell.x < 0.0 || int(cell.x) >= cols) {
    outColor = vec4(uBackground, 1.0);
    return;
  }
  vec2 center = origin + (cell + 0.5) * cellPx;
  vec2 local = (pixel - center) / (cellPx * 0.5);
  vec2 cellUv = center / resolution;

  if (uMotion.z > 0.5 && texture(uMask, cellUv).r > 0.5) {
    outColor = vec4(uBackground, 1.0);
    return;
  }

  float level = 1.0;
  float fade = uMotion.w;
  if (fade > 0.0) {
    vec2 q = abs((pixel / resolution) * 2.0 - 1.0);
    float radius = pow(pow(q.x, 2.5) + pow(q.y, 2.5), 1.0 / 2.5) / pow(2.0, 1.0 / 2.5);
    level = 1.0 - smoothstep(max(0.0, 1.0 - fade * 2.2), 1.0, radius);
  }
  float noise = fbm(vec3((center + uMotion.xy) / uField.x + SEED, uField.w));
  float tone = clamp((noise * 0.5 + 0.5 - uField.y) * uField.z + 0.5, 0.0, 1.0);
  int band = int(min(tone, 0.999999) * 3.0);

  float charge = texelFetch(uCharges, ivec2(cell), 0).r;
  int stepped = (band + int(clamp(charge, 0.0, 0.999) * 3.0)) % 3;

  int shape = 2 - stepped;
  float size = dotSize;
  if (mode != 0) {
    shape = mode - 1;
    size = dotSize * mix(0.45, 1.0, float(stepped) / 2.0);
  }

  float introProgress = uPlacement.w;
  float front = 0.0;
  if (introProgress < ${INTRO_END.toFixed(2)}) {
    float radial = length((center - resolution * 0.5) / (resolution * 0.5)) * 0.70710678;
    float warp = cnoise(vec3(cellUv * vec2(3.2, 2.4) + SEED, 4.7)) * ${INTRO_WARP.toFixed(2)};
    float jitter = hash21(cell) * ${INTRO_JITTER.toFixed(2)};
    float spread = radial + warp + jitter + ${INTRO_WARP.toFixed(2)};
    float introBand = ${INTRO_BAND.toFixed(2)} * (0.6 + 0.8 * hash21(cell + vec2(17.0, 9.0)));
    float t = clamp((introProgress - spread) / introBand, 0.0, 1.0);
    if (t <= 0.0) {
      outColor = vec4(uBackground, 1.0);
      return;
    }
    float back = t - 1.0;
    size = max(size * (1.0 + 2.70158 * back * back * back + 1.70158 * back * back), 0.02);
    front = 1.0 - smoothstep(0.0, 1.0, abs(introProgress - spread) / introBand);
  }

  float aa = 2.0 / cellPx;
  // Equivalente a smoothstep(aa, -aa, d) sem bordas invertidas (indefinido em GLSL)
  float coverage = 1.0 - smoothstep(-aa, aa, shapeDistance(local, shape, size));
  vec3 tint = mix(uColor, uHover, max(smoothstep(0.15, 0.85, charge), front * 0.35));
  outColor = vec4(mix(uBackground, tint, coverage * level), 1.0);
}
`;

function parseColor(value: string, fallback: [number, number, number]): [number, number, number] {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(value.trim());
  if (!match) return fallback;
  let hex = match[1];
  if (hex.length === 3) hex = hex.replace(/./g, (char) => char + char);
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255) as [number, number, number];
}

export type ShapeWavesGLProps = {
  text?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  textSize?: number;
  shapes?: ShapeWavesShapes;
  cellSize?: number;
  dotSize?: number;
  color?: string;
  hoverColor?: string;
  backgroundColor?: string;
  speed?: number;
  scale?: number;
  contrast?: number;
  brightness?: number;
  fade?: number;
  interactive?: boolean;
  splashRadius?: number;
  splashStrength?: number;
  intro?: boolean;
  introDuration?: number;
  onError?: (error: Error) => void;
  className?: string;
};

type Settings = Required<Omit<ShapeWavesGLProps, "onError" | "className">>;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Falha ao criar shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Erro ao compilar shader");
  }
  return shader;
}

export default function ShapeWavesGL({
  text = "",
  fontFamily = 'Geist, "Geist Sans", system-ui, sans-serif',
  fontWeight = 500,
  textSize = 0.6,
  shapes = "mixed",
  cellSize = 10,
  dotSize = 0.75,
  color = "#929292",
  hoverColor = "#ffffff",
  backgroundColor = "#000000",
  speed = 1,
  scale = 1,
  contrast = 1,
  brightness = 0.4,
  fade = 0.25,
  interactive = true,
  splashRadius = 40,
  splashStrength = 0.4,
  intro = true,
  introDuration = 1.6,
  onError,
  className = "",
}: ShapeWavesGLProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const settingsRef = useRef<Settings | null>(null);
  const onErrorRef = useRef(onError);
  const wakeRef = useRef<(remask?: boolean) => void>(() => {});

  const settings: Settings = {
    text,
    fontFamily,
    fontWeight,
    textSize,
    shapes,
    cellSize: Math.max(2, cellSize),
    dotSize,
    color,
    hoverColor,
    backgroundColor,
    speed,
    scale: Math.max(0.05, scale),
    contrast,
    brightness,
    fade,
    interactive,
    splashRadius,
    splashStrength,
    intro,
    introDuration: Math.max(0.1, introDuration),
  };
  const signature = JSON.stringify(settings);

  useLayoutEffect(() => {
    const previous = settingsRef.current;
    settingsRef.current = settings;
    onErrorRef.current = onError;
    if (previous) {
      const remask =
        previous.text !== settings.text ||
        previous.fontFamily !== settings.fontFamily ||
        previous.fontWeight !== settings.fontWeight ||
        previous.textSize !== settings.textSize;
      wakeRef.current(remask);
    }
    // Reaplica só quando algum valor muda de fato
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, onError]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    let disposed = false;
    let frameId = 0;
    let lastFrameTime = 0;
    let time = 0;
    let dpr = 1;
    let visible = true;
    let presented = false;
    let cols = 1;
    let rows = 1;
    let cellPx = 10;
    let gridOrigin: [number, number] = [0, 0];
    let charges = new Float32Array(1);
    let chargeBytes = new Uint8Array(1);
    let heights = new Float32Array(1);
    let previousHeights = new Float32Array(1);
    let simulationBacklog = 0;
    let introStart = 0;
    let introProgress = INTRO_END;
    let chargesActive = false;
    let bounds: DOMRect | null = null;
    const pointer = { x: 0, y: 0, at: 0, inside: false };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const fail = (error: unknown) => {
      if (disposed) return;
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      onErrorRef.current?.(error instanceof Error ? error : new Error(String(error)));
    };

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      fail(new Error("WebGL2 indisponível"));
      return undefined;
    }

    let program: WebGLProgram;
    try {
      program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "Erro ao linkar programa");
      }
    } catch (error) {
      fail(error);
      return undefined;
    }

    gl.useProgram(program);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      resolution: uniform("uResolution"),
      placement: uniform("uPlacement"),
      grid: uniform("uGrid"),
      field: uniform("uField"),
      motion: uniform("uMotion"),
      color: uniform("uColor"),
      hover: uniform("uHover"),
      background: uniform("uBackground"),
      mask: uniform("uMask"),
      charges: uniform("uCharges"),
    };

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    const createTexture = (unit: number, filter: number) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };
    const maskTexture = createTexture(0, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 1, 1, 0, gl.RED, gl.UNSIGNED_BYTE, new Uint8Array([0]));
    const chargeTexture = createTexture(1, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 1, 1, 0, gl.RED, gl.UNSIGNED_BYTE, new Uint8Array([0]));
    gl.uniform1i(u.mask, 0);
    gl.uniform1i(u.charges, 1);

    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d") as CanvasRenderingContext2D;

    const current = () => settingsRef.current as Settings;

    const uploadCharges = () => {
      for (let i = 0; i < charges.length; i++) chargeBytes[i] = Math.round(charges[i] * 255);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, chargeTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, cols, rows, 0, gl.RED, gl.UNSIGNED_BYTE, chargeBytes);
    };

    const configureGrid = () => {
      const width = canvas.width;
      const height = canvas.height;
      const nextCols = Math.max(1, Math.round(width / (current().cellSize * dpr)));
      cellPx = width / nextCols;
      const nextRows = Math.max(1, Math.floor(height / cellPx));
      gridOrigin = [0, (height - nextRows * cellPx) / 2];
      if (nextCols === cols && nextRows === rows && charges.length === cols * rows) return;
      cols = nextCols;
      rows = nextRows;
      charges = new Float32Array(cols * rows);
      chargeBytes = new Uint8Array(cols * rows);
      heights = new Float32Array(cols * rows);
      previousHeights = new Float32Array(cols * rows);
      chargesActive = false;
      uploadCharges();
    };

    const drawMask = () => {
      const s = current();
      const content = s.text.trim();
      const width = canvas.width;
      const height = canvas.height;
      const maskScale = content ? Math.min(1, MAX_MASK_SIZE / Math.max(width, height)) : 0;
      const maskWidth = content ? Math.max(1, Math.round(width * maskScale)) : 1;
      const maskHeight = content ? Math.max(1, Math.round(height * maskScale)) : 1;
      maskCanvas.width = maskWidth;
      maskCanvas.height = maskHeight;
      maskContext.fillStyle = "#000";
      maskContext.fillRect(0, 0, maskWidth, maskHeight);
      if (content) {
        let fontPx = Math.max(1, s.textSize * maskHeight);
        maskContext.font = `${s.fontWeight} ${fontPx}px ${s.fontFamily}`;
        const measured = maskContext.measureText(content).width;
        const maxWidth = maskWidth * 0.9;
        if (measured > maxWidth) {
          fontPx = Math.max(1, (fontPx * maxWidth) / measured);
          maskContext.font = `${s.fontWeight} ${fontPx}px ${s.fontFamily}`;
        }
        maskContext.textAlign = "center";
        maskContext.textBaseline = "alphabetic";
        const metrics = maskContext.measureText(content);
        const x = (maskWidth + metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2;
        const y = (maskHeight + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
        maskContext.fillStyle = "#fff";
        maskContext.fillText(content, x, y);
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas);
    };

    const splash = (x: number, y: number, strength: number) => {
      const sigma = Math.max(0.5, ((current().splashRadius * dpr) / cellPx) * 0.5);
      const reach = Math.ceil(sigma * 2.5);
      const centerCol = (x * dpr - gridOrigin[0]) / cellPx - 0.5;
      const centerRow = (y * dpr - gridOrigin[1]) / cellPx - 0.5;
      const minRow = Math.max(0, Math.floor(centerRow - reach));
      const maxRow = Math.min(rows - 1, Math.ceil(centerRow + reach));
      const minCol = Math.max(0, Math.floor(centerCol - reach));
      const maxCol = Math.min(cols - 1, Math.ceil(centerCol + reach));
      for (let row = minRow; row <= maxRow; row++) {
        const dy = row - centerRow;
        for (let col = minCol; col <= maxCol; col++) {
          const dx = col - centerCol;
          const bump = strength * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
          const index = row * cols + col;
          heights[index] = Math.min(1.2, heights[index] + bump);
        }
      }
      chargesActive = true;
    };

    const stepRipples = () => {
      const lastCol = cols - 1;
      const lastRow = rows - 1;
      let peak = 0;
      for (let row = 0; row < rows; row++) {
        const up = (row === 0 ? row : row - 1) * cols;
        const down = (row === lastRow ? row : row + 1) * cols;
        const base = row * cols;
        for (let col = 0; col < cols; col++) {
          const index = base + col;
          const left = base + (col === 0 ? col : col - 1);
          const right = base + (col === lastCol ? col : col + 1);
          const height = heights[index];
          const laplacian = heights[left] + heights[right] + heights[up + col] + heights[down + col] - 4 * height;
          const velocity = (height - previousHeights[index]) * WAVE_FRICTION;
          const next = (height + velocity + WAVE_SPEED * laplacian) * WAVE_DECAY;
          previousHeights[index] = next;
          const charge = Math.min(1, Math.max(0, next));
          charges[index] = charge;
          if (charge > peak) peak = charge;
        }
      }
      const swap = heights;
      heights = previousHeights;
      previousHeights = swap;
      return peak;
    };

    const updateCharges = (deltaSeconds: number) => {
      if (!chargesActive) return false;
      simulationBacklog = Math.min(simulationBacklog + deltaSeconds, SIMULATION_STEP * 4);
      let peak = 1;
      while (simulationBacklog >= SIMULATION_STEP) {
        simulationBacklog -= SIMULATION_STEP;
        peak = stepRipples();
      }
      if (peak < SETTLED_THRESHOLD) {
        heights.fill(0);
        previousHeights.fill(0);
        charges.fill(0);
        chargesActive = false;
      }
      uploadCharges();
      return chargesActive;
    };

    const isAnimating = () =>
      visible && !document.hidden && current().speed > 0 && !reduceMotion.matches;

    const render = (now: number) => {
      frameId = 0;
      if (disposed) return;
      const s = current();
      const deltaSeconds = lastFrameTime ? Math.min(0.1, (now - lastFrameTime) / 1000) : 0;
      lastFrameTime = now;
      const animating = isAnimating();
      if (animating) time += deltaSeconds * TIME_RATE * s.speed;
      const hovering = visible && !document.hidden && updateCharges(deltaSeconds);

      if (introStart < 0) introStart = now;
      const introPlaying = introProgress < INTRO_END;
      if (introPlaying) {
        introProgress = Math.min(INTRO_END, ((now - introStart) / 1000 / s.introDuration) * INTRO_END);
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform4f(u.placement, gridOrigin[0], gridOrigin[1], rows, introProgress);
      gl.uniform4f(
        u.grid,
        cellPx,
        Math.min(1, Math.max(0.1, s.dotSize)),
        SHAPE_MODES[s.shapes] ?? 0,
        cols,
      );
      gl.uniform4f(
        u.field,
        NOISE_CELLS * cellPx * s.scale,
        0.5 - (s.brightness - 0.5) * 0.4,
        2.8 * s.contrast,
        time,
      );
      gl.uniform4f(u.motion, 0, 0, s.text.trim() ? 1 : 0, s.fade);
      gl.uniform3fv(u.color, parseColor(s.color, [0.573, 0.573, 0.573]));
      gl.uniform3fv(u.hover, parseColor(s.hoverColor, [1, 1, 1]));
      gl.uniform3fv(u.background, parseColor(s.backgroundColor, [0, 0, 0]));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!presented) {
        presented = true;
        setReady(true);
      }
      if (animating || hovering || introPlaying) frameId = requestAnimationFrame(render);
      else lastFrameTime = 0;
    };

    const wake = () => {
      if (disposed || frameId) return;
      frameId = requestAnimationFrame(render);
    };

    const resize = () => {
      if (disposed) return;
      bounds = null;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      configureGrid();
      drawMask();
      wake();
    };

    wakeRef.current = (remask = false) => {
      if (disposed) return;
      configureGrid();
      if (remask) drawMask();
      wake();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!current().interactive) return;
      if (!bounds) bounds = root.getBoundingClientRect();
      const now = performance.now();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const inside = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
      if (inside) {
        const elapsed = pointer.inside ? Math.max(8, now - pointer.at) : 16;
        const travelled = pointer.inside ? Math.hypot(x - pointer.x, y - pointer.y) : 0;
        const pointerSpeed = (travelled / elapsed) * 1000;
        splash(x, y, Math.min(1, 0.22 + pointerSpeed * 0.0006) * current().splashStrength);
        wake();
      }
      pointer.x = x;
      pointer.y = y;
      pointer.at = now;
      pointer.inside = inside;
    };
    const invalidateBounds = () => {
      bounds = null;
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      fail(new Error("Contexto WebGL perdido"));
    };

    if (current().intro && !reduceMotion.matches) {
      introProgress = 0;
      introStart = -1;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) wake();
    });
    visibilityObserver.observe(root);
    document.addEventListener("visibilitychange", wake);
    reduceMotion.addEventListener("change", wake);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", invalidateBounds, { capture: true, passive: true });
    canvas.addEventListener("webglcontextlost", handleContextLost);

    resize();
    if (current().text.trim() && document.fonts?.load) {
      const s = current();
      document.fonts
        .load(`${s.fontWeight} 32px ${s.fontFamily}`)
        .then(() => {
          if (disposed) return;
          drawMask();
          wake();
        })
        .catch(() => {});
    }

    return () => {
      disposed = true;
      wakeRef.current = () => {};
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", wake);
      reduceMotion.removeEventListener("change", wake);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", invalidateBounds, { capture: true } as EventListenerOptions);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      gl.deleteTexture(maskTexture);
      gl.deleteTexture(chargeTexture);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none relative isolate h-full w-full overflow-hidden ${className}`}
      data-ready={ready}
      data-renderer="webgl2"
      style={{ backgroundColor }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 block h-full w-full transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
