/** Original liquid-glass transition: refraction travels only along the moving boundary. */
export const liquidVertex = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const liquidFragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v_uv;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform float u_direction;
uniform float u_strength;

vec3 glassSample(sampler2D photo, vec2 uv, vec2 bend, float fringe) {
  vec2 pos = clamp(uv + bend, vec2(0.0), vec2(1.0));
  return vec3(
    texture2D(photo, clamp(pos + vec2(fringe, 0.0), vec2(0.0), vec2(1.0))).r,
    texture2D(photo, pos).g,
    texture2D(photo, clamp(pos - vec2(fringe, 0.0), vec2(0.0), vec2(1.0))).b
  );
}
void main() {
  vec2 uv = v_uv;
  float p = u_progress;
  float envelope = sin(p * 3.14159265);
  float axis = u_direction > 0.0 ? uv.x : 1.0 - uv.x;
  float wave = sin(uv.y * 6.0 + p * 4.0) * 0.055
             + sin(uv.y * 13.0 - p * 6.0) * 0.012;
  float boundary = mix(-0.22, 1.22, p) + wave * envelope;
  float distance = axis - boundary;
  float lens = exp(-pow(distance / 0.12, 2.0));
  float ripple = sin(distance * 22.0) * lens;
  float strength = u_strength * envelope;
  vec2 bend = vec2((lens * 0.022 + ripple * 0.009) * u_direction,
                   cos(uv.y * 7.0 + p * 4.0) * lens * 0.007) * strength;
  float fringe = lens * strength * 0.0015;
  vec3 before = glassSample(u_from, uv, bend, fringe);
  vec3 after = glassSample(u_to, uv, -bend * 0.75, -fringe);
  float reveal = 1.0 - smoothstep(-0.035, 0.035, distance);
  vec3 color = mix(before, after, reveal);
  float light = exp(-pow((distance + 0.045) / 0.024, 2.0)) * 0.085;
  float shadow = exp(-pow((distance - 0.035) / 0.065, 2.0)) * 0.025;
  color += (light - shadow) * strength;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

export function createLiquidTransition(
  canvas: HTMLCanvasElement,
  images: HTMLImageElement[],
  initialIndex: number,
) {
  const stage = canvas.parentElement!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 760px), (hover: none), (pointer: coarse)");
  let current = initialIndex;
  let requested = initialIndex;
  let visible = true;
  let disposed = false;
  let loading = false;
  let loadVersion = 0;
  let pendingLoad: AbortController | null = null;
  let frame = 0;
  let deadline = 0;
  let gl: WebGLRenderingContext | null = null;
  let attempted = false;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  let progressUniform: WebGLUniformLocation | null = null;
  let directionUniform: WebGLUniformLocation | null = null;
  let strengthUniform: WebGLUniformLocation | null = null;
  let active: {
    to: number;
    started: number;
    duration: number;
    progress: number;
    direction: number;
  } | null = null;

  function release() {
    if (!gl) return;
    for (const texture of textures) gl.deleteTexture(texture);
    for (const shader of shaders) gl.deleteShader(shader);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    textures.length = shaders.length = 0;
    buffer = program = null;
    gl = null;
  }
  function setup() {
    if (attempted) return Boolean(gl);
    attempted = true;
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
      });
      if (!gl) return false;
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
      const vertex = compile(gl.VERTEX_SHADER, liquidVertex);
      const fragment = compile(gl.FRAGMENT_SHADER, liquidFragment);
      program = gl.createProgram();
      buffer = gl.createBuffer();
      if (!program || !buffer) throw new Error("Renderer unavailable");
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error("Shader linking failed");
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
      for (let i = 0; i < 2; i++) {
        const texture = gl.createTexture();
        if (!texture) throw new Error("Texture unavailable");
        textures.push(texture);
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.uniform1i(gl.getUniformLocation(program, i ? "u_to" : "u_from"), i);
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      progressUniform = gl.getUniformLocation(program, "u_progress");
      directionUniform = gl.getUniformLocation(program, "u_direction");
      strengthUniform = gl.getUniformLocation(program, "u_strength");
      stage.dataset.enhanced = "true";
      resize();
      return true;
    } catch {
      release();
      delete stage.dataset.enhanced;
      return false;
    }
  }
  function show(index: number) {
    for (let i = 0; i < images.length; i++) images[i].dataset.visible = String(i === index);
    current = index;
  }
  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    window.clearTimeout(deadline);
    deadline = 0;
    frame = 0;
  }
  function paint() {
    if (!gl || !active) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(progressUniform, active.progress);
    gl.uniform1f(directionUniform, active.direction);
    gl.uniform1f(strengthUniform, compact.matches ? 0.45 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function resize() {
    if (!gl) return;
    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(
      window.devicePixelRatio || 1,
      compact.matches ? 1.5 : 2,
      (compact.matches ? 900 : 1536) / Math.max(bounds.width, 1),
    );
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    try {
      paint();
    } catch {
      release();
      delete stage.dataset.enhanced;
      finish();
    }
  }
  function finish() {
    stop();
    if (active) show(active.to);
    active = null;
    delete canvas.dataset.active;
    void update();
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || !active) return;
    if (!active.started) active.started = now;
    const fraction = Math.min(1, (now - active.started) / active.duration);
    active.progress = fraction * fraction * (3 - 2 * fraction);
    try {
      paint();
    } catch {
      release();
      delete stage.dataset.enhanced;
      finish();
      return;
    }
    if (fraction === 1) finish();
    else frame = window.requestAnimationFrame(tick);
  }
  function ready(image: HTMLImageElement, signal: AbortSignal): Promise<boolean> {
    if (signal.aborted) return Promise.resolve(false);
    if (image.complete) return Promise.resolve(image.naturalWidth > 0);
    return new Promise((resolve) => {
      let settled = false;
      const settle = (success: boolean) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        image.removeEventListener("load", loaded);
        image.removeEventListener("error", failed);
        signal.removeEventListener("abort", cancelled);
        resolve(success);
      };
      const loaded = () => settle(image.naturalWidth > 0);
      const failed = () => settle(false);
      const cancelled = () => settle(false);
      const timeout = window.setTimeout(
        () => settle(image.complete && image.naturalWidth > 0),
        2500,
      );
      image.addEventListener("load", loaded);
      image.addEventListener("error", failed);
      signal.addEventListener("abort", cancelled, { once: true });
      try {
        image.decode().then(loaded, () => {
          if (image.complete) settle(image.naturalWidth > 0);
        });
      } catch {
        // Load/error events and the deadline also cover browsers without decode().
      }
    });
  }
  async function update() {
    if (disposed || loading || active || requested === current) return;
    const next = requested;
    const version = ++loadVersion;
    pendingLoad = new AbortController();
    loading = true;
    const [fromReady, toReady] = await Promise.all([
      ready(images[current], pendingLoad.signal),
      ready(images[next], pendingLoad.signal),
    ]);
    if (disposed || version !== loadVersion) return;
    loading = false;
    pendingLoad = null;
    if (next !== requested) return void update();
    // Retain the last successful image if a requested asset cannot load.
    if (!toReady) return;
    if (!fromReady || reduced.matches || document.hidden || !visible || !setup()) {
      show(next);
      return;
    }
    try {
      for (const [slot, index] of [current, next].entries()) {
        gl!.activeTexture(gl!.TEXTURE0 + slot);
        gl!.bindTexture(gl!.TEXTURE_2D, textures[slot]);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, images[index]);
      }
      const distance = (next - current + images.length) % images.length;
      active = {
        to: next,
        started: 0,
        duration: compact.matches ? 580 : 820,
        progress: 0,
        direction: distance <= images.length / 2 ? 1 : -1,
      };
      paint();
      canvas.dataset.active = "true";
      frame = window.requestAnimationFrame(tick);
      // Even a suspended or failed animation frame cannot lock all subsequent slides.
      deadline = window.setTimeout(finish, active.duration + 400);
    } catch {
      stop();
      active = null;
      delete canvas.dataset.active;
      release();
      delete stage.dataset.enhanced;
      show(next);
    }
  }
  function sync() {
    if (reduced.matches || document.hidden || !visible) finish();
  }
  function contextLost(event: Event) {
    event.preventDefault();
    release();
    delete stage.dataset.enhanced;
    finish();
  }
  function retryLoadedImage() {
    if (!loading) void update();
  }
  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        })
      : null;
  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
  observer?.observe(stage);
  resizeObserver?.observe(stage);
  window.addEventListener("resize", resize, { passive: true });
  reduced.addEventListener("change", sync);
  compact.addEventListener("change", resize);
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", contextLost);
  for (const image of images) image.addEventListener("load", retryLoadedImage);

  return {
    goTo(index: number) {
      if (!Number.isInteger(index) || index < 0 || index >= images.length || disposed) return;
      if (index !== requested && pendingLoad) {
        loadVersion++;
        pendingLoad.abort();
        pendingLoad = null;
        loading = false;
      }
      requested = index;
      void update();
    },
    dispose() {
      disposed = true;
      loadVersion++;
      pendingLoad?.abort();
      pendingLoad = null;
      stop();
      active = null;
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      reduced.removeEventListener("change", sync);
      compact.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", contextLost);
      for (const image of images) image.removeEventListener("load", retryLoadedImage);
      delete canvas.dataset.active;
      delete stage.dataset.enhanced;
      release();
    },
  };
}
