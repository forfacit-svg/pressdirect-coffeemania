/** Original light/shadow study inspired by the visual direction of Soffit 003.
 * No third-party shader code, assets, or runtime requests are used. */
export const soffitVertex = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const soffitFragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform vec2 u_edge_width;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}
float field(vec2 p) {
  float n = 0.0, weight = 0.5;
  mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    n += weight * noise(p);
    p = turn * p * 2.05 + 3.1;
    weight *= 0.5;
  }
  return n;
}
void main() {
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  float aspect = clamp(u_resolution.x / u_resolution.y, 0.6, 2.5);
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.055;
  vec2 drift = u_pointer * vec2(0.075, 0.055);
  vec2 warp = vec2(field(p * 2.3 + vec2(t, -t * 0.4)),
                   field(p * 2.3 + vec2(4.7, 1.3) - t * 0.35));
  float folded = field(p * 3.0 + warp * 2.6 + drift + vec2(-t * 0.35, t * 0.2));
  // Keep every colored reflection inside the empty side gutters.
  float width = uv.x < 0.5 ? u_edge_width.x : u_edge_width.y;
  float side = min(uv.x, 1.0 - uv.x) / max(width, 0.00001);
  float edge = (1.0 - smoothstep(0.10, 1.0, side)) * step(0.00001, width);
  float ribbon = exp(-abs(side - 0.28 + (folded - 0.48) * 0.75) * 4.0);
  float shade = smoothstep(0.30, 0.75, folded);
  vec3 paper = vec3(0.992, 0.989, 0.982);
  vec3 brand = vec3(0.7216, 0.1333, 0.2118);
  vec3 color = mix(paper, vec3(0.84, 0.83, 0.82), shade * 0.065 * edge);
  float reflection = 1.20 * (0.11 * pow(ribbon, 1.5) + 0.035 * warp.y) * edge;
  color = mix(color, brand, reflection);
  color = mix(color, vec3(1.0, 0.998, 0.994), smoothstep(0.25, 0.7, warp.x) * 0.22 * edge);
  float grain = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(clamp(color + grain, 0.0, 1.0), 1.0);
}`;

export function createSoffitRenderer(canvas: HTMLCanvasElement, host: HTMLElement) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  function release() {
    if (buffer) gl!.deleteBuffer(buffer);
    if (program) gl!.deleteProgram(program);
    for (const shader of shaders) gl!.deleteShader(shader);
  }
  try {
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error("Shader unavailable");
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS))
        throw new Error("Shader compilation failed");
      return shader;
    }
    const vertex = compile(gl.VERTEX_SHADER, soffitVertex);
    const fragment = compile(gl.FRAGMENT_SHADER, soffitFragment);
    program = gl.createProgram();
    buffer = gl.createBuffer();
    if (!program || !buffer) throw new Error("Renderer unavailable");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader linking failed");
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  } catch {
    release();
    return null;
  }

  const resolution = gl.getUniformLocation(program!, "u_resolution");
  const pointerUniform = gl.getUniformLocation(program!, "u_pointer");
  const timeUniform = gl.getUniformLocation(program!, "u_time");
  const edgeWidthUniform = gl.getUniformLocation(program!, "u_edge_width");
  let leftWidth = 0.03;
  let rightWidth = 0.03;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  let playing = false;
  let visible = true;
  let lost = false;
  let disposed = false;
  let frame = 0;
  let lastTime = 0;
  let time = 0;
  let x = 0,
    y = 0,
    targetX = 0,
    targetY = 0;
  const running = () =>
    playing && visible && !document.hidden && !reduced.matches && !lost && !disposed;

  function paint() {
    if (lost || disposed) return;
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(resolution, canvas.width, canvas.height);
    gl!.uniform2f(pointerUniform, x, y);
    gl!.uniform1f(timeUniform, time);
    gl!.uniform2f(edgeWidthUniform, leftWidth, rightWidth);
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    canvas.dataset.ready = "true";
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    // Shared measured limits also constrain the CSS fallback without WebGL.
    const style = window.getComputedStyle(canvas.parentElement!);
    leftWidth =
      (parseFloat(style.getPropertyValue("--soffit-left")) || 0) / Math.max(bounds.width, 1);
    rightWidth =
      (parseFloat(style.getPropertyValue("--soffit-right")) || 0) / Math.max(bounds.width, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, fine.matches ? 1.25 : 1);
    const scale = Math.min(
      dpr,
      (fine.matches ? 1440 : 720) / Math.max(bounds.width, 1),
      900 / Math.max(bounds.height, 1),
    );
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    paint();
  }
  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }
  function tick(now: number) {
    frame = 0;
    if (!running()) return;
    const elapsed = lastTime ? now - lastTime : 1000 / (fine.matches ? 30 : 24);
    if (elapsed >= 1000 / (fine.matches ? 30 : 24)) {
      const delta = Math.min(elapsed, 80) / 1000;
      lastTime = now;
      time += delta;
      const easing = 1 - Math.exp(-delta * 5);
      x += (targetX - x) * easing;
      y += (targetY - y) * easing;
      paint();
    }
    frame = window.requestAnimationFrame(tick);
  }
  function sync() {
    stop();
    if (reduced.matches || !fine.matches) x = y = targetX = targetY = 0;
    if (!document.hidden && visible) paint();
    if (running()) frame = window.requestAnimationFrame(tick);
  }
  function move(event: PointerEvent) {
    if (!running() || !fine.matches || event.pointerType !== "mouse") return;
    const bounds = canvas.getBoundingClientRect();
    targetX = Math.max(
      -1,
      Math.min(1, (2 * (event.clientX - bounds.left)) / Math.max(bounds.width, 1) - 1),
    );
    targetY = Math.max(
      -1,
      Math.min(1, (2 * (event.clientY - bounds.top)) / Math.max(bounds.height, 1) - 1),
    );
  }
  function leave() {
    targetX = targetY = 0;
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    stop();
    delete canvas.dataset.ready;
  }
  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        })
      : null;
  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
  observer?.observe(canvas);
  resizeObserver?.observe(canvas);
  if (!resizeObserver) window.addEventListener("resize", resize, { passive: true });
  host.addEventListener("pointermove", move, { passive: true });
  host.addEventListener("pointerleave", leave);
  canvas.addEventListener("webglcontextlost", contextLost);
  reduced.addEventListener("change", sync);
  fine.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  resize();

  return {
    resize,
    setPlaying(value: boolean) {
      playing = value;
      sync();
    },
    dispose() {
      disposed = true;
      stop();
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("webglcontextlost", contextLost);
      reduced.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      delete canvas.dataset.ready;
      release();
    },
  };
}
