// SplashCursor - pure JS port of React Bits WebGL2 fluid simulation
// Usage: createSplashCursor({ size, force, swirl, trail, rainbow, intensity, shading, glow, quality, clickSplash, intro, zIndex })
// Returns: { container, start(), stop(), update(opts) }

var createSplashCursor = (function () {

const QUALITY = {
  low: { sim: 64, dye: 512, iterations: 10 },
  medium: { sim: 96, dye: 1024, iterations: 16 },
  high: { sim: 128, dye: 1440, iterations: 20 }
};
const BLOOM_RESOLUTION = 256;
const BLOOM_ITERATIONS = 4;
const BLOOM_THRESHOLD = 0.3;
const BLOOM_KNEE = 0.7;

const VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 outColor;`;

const SHADERS = {
  copy: `uniform sampler2D uTexture; void main(){outColor=texture(uTexture,vUv);}`,
  clear: `uniform sampler2D uTexture; uniform float value; void main(){outColor=value*texture(uTexture,vUv);}`,
  splat: `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 pointA; uniform vec2 pointB; uniform float radius; void main(){vec2 scale=vec2(aspectRatio,1.0);vec2 pa=(vUv-pointA)*scale;vec2 ba=(pointB-pointA)*scale;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-9),0.0,1.0);vec2 d=pa-ba*h;vec3 base=texture(uTarget,vUv).xyz;outColor=vec4(base+exp(-dot(d,d)/radius)*color,1.0);}`,
  burst: `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec2 point; uniform float radius; uniform float strength; uniform float seed; void main(){vec2 d=(vUv-point)*vec2(aspectRatio,1.0);float distance=length(d);vec2 direction=d/max(distance,0.00001);float angle=atan(d.y,d.x);float petals=0.78+0.22*sin(angle*5.0+seed)*sin(angle*3.0-seed*1.7);vec2 twist=vec2(-direction.y,direction.x)*0.3*sin(angle*4.0+seed*2.3);float falloff=exp(-dot(d,d)/radius)*distance/sqrt(radius);outColor=vec4(texture(uTarget,vUv).xy+(direction*petals+twist)*falloff*strength,0.0,1.0);}`,
  crown: `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec2 point; uniform float radius; uniform vec3 colorA; uniform vec3 colorB; uniform float seed; void main(){vec2 d=(vUv-point)*vec2(aspectRatio,1.0);vec3 ink=exp(-dot(d,d)/(radius*0.45))*colorA;for(int i=0;i<7;i++){float index=float(i);float angle=seed+index*0.8975979+sin(seed*3.0+index*1.9)*0.35;float reach=sqrt(radius)*(0.75+0.45*fract(sin(seed*7.1+index*3.7)*43.7));float drop=radius*(0.08+0.12*fract(sin(seed*2.9+index*5.3)*31.9));vec2 q=d-vec2(cos(angle),sin(angle))*reach;ink+=exp(-dot(q,q)/drop)*mix(colorA,colorB,fract(index*0.37+0.2));}outColor=vec4(texture(uTarget,vUv).xyz+ink,1.0);}`,
  advection: `uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; void main(){vec2 coord=vUv-dt*texture(uVelocity,vUv).xy*texelSize;outColor=texture(uSource,coord)/(1.0+dissipation*dt);}`,
  divergence: `uniform sampler2D uVelocity; void main(){float L=texture(uVelocity,vL).x;float R=texture(uVelocity,vR).x;float T=texture(uVelocity,vT).y;float B=texture(uVelocity,vB).y;vec2 C=texture(uVelocity,vUv).xy;if(vL.x<0.0)L=-C.x;if(vR.x>1.0)R=-C.x;if(vT.y>1.0)T=-C.y;if(vB.y<0.0)B=-C.y;outColor=vec4(0.5*(R-L+T-B),0.0,0.0,1.0);}`,
  curl: `uniform sampler2D uVelocity; void main(){float L=texture(uVelocity,vL).y;float R=texture(uVelocity,vR).y;float T=texture(uVelocity,vT).x;float B=texture(uVelocity,vB).x;outColor=vec4(0.5*(R-L-T+B),0.0,0.0,1.0);}`,
  vorticity: `uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; void main(){float L=texture(uCurl,vL).x;float R=texture(uCurl,vR).x;float T=texture(uCurl,vT).x;float B=texture(uCurl,vB).x;float C=texture(uCurl,vUv).x;vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+0.0001;force*=curl*C;force.y*=-1.0;vec2 velocity=texture(uVelocity,vUv).xy+force*dt;outColor=vec4(clamp(velocity,-1000.0,1000.0),0.0,1.0);}`,
  pressure: `uniform sampler2D uPressure; uniform sampler2D uDivergence; void main(){float L=texture(uPressure,vL).x;float R=texture(uPressure,vR).x;float T=texture(uPressure,vT).x;float B=texture(uPressure,vB).x;float divergence=texture(uDivergence,vUv).x;outColor=vec4((L+R+B+T-divergence)*0.25,0.0,0.0,1.0);}`,
  gradient: `uniform sampler2D uPressure; uniform sampler2D uVelocity; void main(){float L=texture(uPressure,vL).x;float R=texture(uPressure,vR).x;float T=texture(uPressure,vT).x;float B=texture(uPressure,vB).x;vec2 velocity=texture(uVelocity,vUv).xy-vec2(R-L,T-B);outColor=vec4(velocity,0.0,1.0);}`,
  prefilter: `uniform sampler2D uTexture; uniform vec3 curve; uniform float threshold; void main(){vec3 c=texture(uTexture,vUv).rgb;float br=max(c.r,max(c.g,c.b));float rq=clamp(br-curve.x,0.0,curve.y);rq=curve.z*rq*rq;c*=max(rq,br-threshold)/max(br,0.0001);outColor=vec4(c,0.0);}`,
  blur: `uniform sampler2D uTexture; uniform float intensity; void main(){vec4 sum=texture(uTexture,vL)+texture(uTexture,vR)+texture(uTexture,vT)+texture(uTexture,vB);outColor=sum*0.25*intensity;}`,
  display: `uniform sampler2D uTexture; uniform sampler2D uBloom; uniform vec2 texelSize; uniform float shading; uniform float bloom; uniform float light; float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*0.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}void main(){vec3 c=texture(uTexture,vUv).rgb;if(shading>0.0){float dx=length(texture(uTexture,vR).rgb)-length(texture(uTexture,vL).rgb);float dy=length(texture(uTexture,vT).rgb)-length(texture(uTexture,vB).rgb);vec3 n=normalize(vec3(dx,dy,length(texelSize)));c*=mix(1.0,clamp(n.z+0.7,0.7,1.0),shading);}if(bloom>0.0){c+=max(texture(uBloom,vUv).rgb,0.0)*bloom;}c=max(c,0.0);float peak=max(c.r,max(c.g,c.b));float grain=(hash(gl_FragCoord.xy)-0.5)/255.0*smoothstep(0.0,0.03,peak);if(light>0.5){vec3 transmit=exp(-2.4*c);float low=min(transmit.r,min(transmit.g,transmit.b));float alpha=clamp(1.0-low+grain,0.0,1.0);outColor=vec4(min(transmit-low,vec3(alpha)),alpha);}else{c=max(c+grain,0.0);float alpha=clamp(max(c.r,max(c.g,c.b)),0.0,1.0);outColor=vec4(min(c,vec3(alpha)),alpha);}}`
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const parseColor = v => {
  let h = String(v).replace('#', '').trim();
  if (h.length === 3) h = [...h].map(c => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const hsv = (h, s, v) => {
  const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  const sec = ((i % 6) + 6) % 6;
  return [
    [v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]
  ][sec];
};

return function createSplashCursor(opts) {
  opts = opts || {};
  const settings = {
    palette: (Array.isArray(opts.colors) && opts.colors.length ? opts.colors : ['#ffffff']).map(parseColor),
    rainbow: opts.rainbow !== false,
    colorSpeed: Math.max(0, opts.colorSpeed != null ? opts.colorSpeed : 1),
    intensity: Math.max(0, opts.intensity != null ? opts.intensity : 1),
    size: Math.max(0.05, opts.size != null ? opts.size : 1),
    force: Math.max(0, opts.force != null ? opts.force : 1),
    swirl: Math.max(0, opts.swirl != null ? opts.swirl : 3),
    trail: Math.max(0.05, opts.trail != null ? opts.trail : 1),
    momentum: Math.max(0.05, opts.momentum != null ? opts.momentum : 1),
    shading: clamp(opts.shading != null ? opts.shading : 1, 0, 1),
    glow: clamp(opts.glow != null ? opts.glow : 0, 0, 1),
    quality: QUALITY[opts.quality] ? opts.quality : 'high',
    clickSplash: opts.clickSplash !== false,
    light: opts.theme === 'light'
  };

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:${opts.zIndex || 50};`;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';
  container.appendChild(canvas);

  let gl = null, programs = {}, buffer = null, vao = null;
  let dye, velocity, pressure, divergence, curl, bloom = null, bloomChain = [];
  let targets = new Set(), disposed = false, lost = false;
  let raf = 0, last = 0, lastActivity = 0;
  let introStart = -1;
  const pointers = new Map();
  const bursts = [];
  const introPointer = { x: 0, y: 0, px: 0, py: 0, ready: false, moved: false, offset: Math.random() };

  function release() {
    if (gl.isContextLost()) return;
    targets.forEach(t => { gl.deleteFramebuffer(t.fbo); gl.deleteTexture(t.texture); });
    targets.clear();
    Object.values(programs).forEach(p => gl.deleteProgram(p.program));
    if (buffer) gl.deleteBuffer(buffer);
    if (vao) gl.deleteVertexArray(vao);
  }

  const compile = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s;
  };

  function initGL() {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl) return false;
    gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('EXT_color_buffer_half_float');

    const renderable = (internal, format) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);
      return ok;
    };
    const rgba = { internal: gl.RGBA16F, format: gl.RGBA };
    if (!renderable(rgba.internal, rgba.format)) return false;
    const rg = renderable(gl.RG16F, gl.RG) ? { internal: gl.RG16F, format: gl.RG } : rgba;
    const r = renderable(gl.R16F, gl.RED) ? { internal: gl.R16F, format: gl.RED } : rg;

    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    let broken = false;
    Object.entries(SHADERS).forEach(([name, body]) => {
      const fragment = compile(gl.FRAGMENT_SHADER, HEADER + body);
      const program = gl.createProgram();
      gl.attachShader(program, vertex); gl.attachShader(program, fragment);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) broken = true;
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      programs[name] = { program, uniforms };
    });
    gl.deleteShader(vertex);
    if (broken) return false;

    buffer = gl.createBuffer();
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    return true;
  }

  const use = name => { const p = programs[name]; gl.useProgram(p.program); return p.uniforms; };
  const blit = target => {
    if (target) { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
    else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  function createTarget(w, h, fmt, filter) {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, w, h, 0, fmt.format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    const t = {
      texture, fbo, width: w, height: h, texelX: 1 / w, texelY: 1 / h,
      attach: unit => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, texture); return unit; }
    };
    targets.add(t);
    return t;
  }
  const destroyTarget = t => { if (!t) return; gl.deleteFramebuffer(t.fbo); gl.deleteTexture(t.texture); targets.delete(t); };
  const reshape = (t, w, h, fmt) => {
    gl.bindTexture(gl.TEXTURE_2D, t.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, w, h, 0, fmt.format, gl.HALF_FLOAT, null);
    t.width = w; t.height = h; t.texelX = 1 / w; t.texelY = 1 / h;
  };
  function createDouble(w, h, fmt, filter) {
    return {
      read: createTarget(w, h, fmt, filter),
      write: createTarget(w, h, fmt, filter),
      width: w, height: h, texelX: 1 / w, texelY: 1 / h,
      swap: () => { const c = this.read; this.read = this.write; this.write = c; }
    };
  }
  function resizeDouble(pair, w, h, fmt, filter, keep) {
    if (keep) {
      const next = createTarget(w, h, fmt, filter);
      const u = use('copy');
      gl.uniform1i(u.uTexture, pair.read.attach(0));
      blit(next); destroyTarget(pair.read); pair.read = next;
    } else { reshape(pair.read, w, h, fmt); }
    reshape(pair.write, w, h, fmt);
    pair.width = w; pair.height = h; pair.texelX = 1 / w; pair.texelY = 1 / h;
  }
  const resolution = base => {
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    const aspect = Math.max(w, h) / Math.max(1, Math.min(w, h));
    const short = Math.round(base), long = Math.round(base * aspect);
    return w > h ? { width: long, height: short } : { width: short, height: long };
  };
  const fit = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const h = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w; canvas.height = h;
  };
  const sizes = () => {
    const q = QUALITY[settings.quality];
    const shortSide = Math.min(gl.drawingBufferWidth, gl.drawingBufferHeight);
    return { sim: resolution(q.sim), ink: resolution(Math.max(q.sim, Math.min(q.dye, shortSide))) };
  };

  const radiusFor = scale => {
    const aspect = canvas.width / canvas.height;
    return ((0.2 * settings.size * scale) / 100) * (aspect > 1 ? aspect : 1);
  };

  const colorAt = (offset, now) => {
    const phase = (((offset + (now / 1000) * settings.colorSpeed * 0.6) % 1) + 1) % 1;
    if (settings.rainbow) return hsv(phase, 1, 1);
    const palette = settings.palette;
    if (palette.length === 1) return palette[0];
    const pos = phase * palette.length;
    const from = palette[Math.floor(pos) % palette.length];
    const to = palette[(Math.floor(pos) + 1) % palette.length];
    const t = pos - Math.floor(pos);
    const blend = t * t * (3 - 2 * t);
    return [ from[0] + (to[0] - from[0]) * blend, from[1] + (to[1] - from[1]) * blend, from[2] + (to[2] - from[2]) * blend ];
  };
  const inkFor = (color, amount) => color.map(c => (settings.light ? 1 - c : c) * amount);

  const splat = (ax, ay, bx, by, vx, vy, color, radius) => {
    let u = use('splat');
    gl.uniform1i(u.uTarget, velocity.read.attach(0));
    gl.uniform1f(u.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(u.pointA, ax, ay); gl.uniform2f(u.pointB, bx, by);
    gl.uniform3f(u.color, vx, vy, 0); gl.uniform1f(u.radius, radius);
    blit(velocity.write); velocity.swap();
    gl.uniform1i(u.uTarget, dye.read.attach(0));
    gl.uniform3f(u.color, color[0], color[1], color[2]);
    blit(dye.write); dye.swap();
  };
  const flush = (pointer, dt, now) => {
    const aspect = canvas.width / canvas.height;
    const length = Math.hypot((pointer.x - pointer.px) * aspect, pointer.y - pointer.py);
    if (length > 0.35) { pointer.px = pointer.x; pointer.py = pointer.y; return; }
    let dx = pointer.x - pointer.px, dy = pointer.y - pointer.py;
    if (aspect < 1) dx *= aspect; else dy /= aspect;
    const radius = radiusFor(1);
    const spread = 1 + length / (1.77 * Math.sqrt(radius));
    const push = (6000 * settings.force) / Math.sqrt(spread);
    const amount = (0.15 * settings.intensity * Math.min(dt * 60, 1)) / Math.sqrt(spread);
    const color = inkFor(colorAt(pointer.offset, now), amount);
    splat(pointer.px, pointer.py, pointer.x, pointer.y, dx * push, dy * push, color, radius);
    pointer.px = pointer.x; pointer.py = pointer.y;
  };
  const burst = (x, y, now) => {
    const seed = Math.random() * Math.PI * 2;
    const aspect = canvas.width / canvas.height;
    let u = use('burst');
    gl.uniform1i(u.uTarget, velocity.read.attach(0));
    gl.uniform1f(u.aspectRatio, aspect); gl.uniform2f(u.point, x, y);
    gl.uniform1f(u.radius, radiusFor(3)); gl.uniform1f(u.strength, 1100 * settings.force); gl.uniform1f(u.seed, seed);
    blit(velocity.write); velocity.swap();
    const offset = Math.random();
    const amount = 1.6 * settings.intensity;
    const first = inkFor(colorAt(offset, now), amount), second = inkFor(colorAt(offset + 0.3, now), amount);
    u = use('crown');
    gl.uniform1i(u.uTarget, dye.read.attach(0));
    gl.uniform1f(u.aspectRatio, aspect); gl.uniform2f(u.point, x, y);
    gl.uniform1f(u.radius, radiusFor(1.6));
    gl.uniform3f(u.colorA, first[0], first[1], first[2]);
    gl.uniform3f(u.colorB, second[0], second[1], second[2]);
    gl.uniform1f(u.seed, seed);
    blit(dye.write); dye.swap();
  };

  const step = dt => {
    const iterations = QUALITY[settings.quality].iterations;
    gl.disable(gl.BLEND);
    let u = use('curl');
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0)); blit(curl);
    u = use('vorticity');
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0)); gl.uniform1i(u.uCurl, curl.attach(1));
    gl.uniform1f(u.curl, settings.swirl); gl.uniform1f(u.dt, dt);
    blit(velocity.write); velocity.swap();
    u = use('divergence');
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0)); blit(divergence);
    u = use('clear');
    gl.uniform1i(u.uTexture, pressure.read.attach(0)); gl.uniform1f(u.value, 0.1);
    blit(pressure.write); pressure.swap();
    u = use('pressure');
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
    gl.uniform1i(u.uDivergence, divergence.attach(0));
    for (let i = 0; i < iterations; i++) { gl.uniform1i(u.uPressure, pressure.read.attach(1)); blit(pressure.write); pressure.swap(); }
    u = use('gradient');
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
    gl.uniform1i(u.uPressure, pressure.read.attach(0)); gl.uniform1i(u.uVelocity, velocity.read.attach(1));
    blit(velocity.write); velocity.swap();
    u = use('advection');
    gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
    gl.uniform1i(u.uVelocity, velocity.read.attach(0)); gl.uniform1i(u.uSource, velocity.read.attach(0));
    gl.uniform1f(u.dt, dt); gl.uniform1f(u.dissipation, 2 / settings.momentum);
    blit(velocity.write); velocity.swap();
    gl.uniform1i(u.uVelocity, velocity.read.attach(0)); gl.uniform1i(u.uSource, dye.read.attach(1));
    gl.uniform1f(u.dissipation, 3.5 / settings.trail);
    blit(dye.write); dye.swap();
  };

  const dropBloom = () => { if (bloom) { destroyTarget(bloom); bloomChain.forEach(destroyTarget); bloom = null; bloomChain = []; } };
  const ensureBloom = () => {
    if (bloom) return bloom;
    const size = resolution(BLOOM_RESOLUTION);
    bloom = createTarget(size.width, size.height, { internal: gl.RGBA16F, format: gl.RGBA }, gl.LINEAR);
    for (let i = 0; i < BLOOM_ITERATIONS; i++) {
      const w = size.width >> (i + 1), h = size.height >> (i + 1);
      if (w < 2 || h < 2) break;
      bloomChain.push(createTarget(w, h, { internal: gl.RGBA16F, format: gl.RGBA }, gl.LINEAR));
    }
    return bloom;
  };
  const resize = () => {
    fit();
    const next = sizes();
    if (dye.width !== next.ink.width || dye.height !== next.ink.height) resizeDouble(dye, next.ink.width, next.ink.height, { internal: gl.RGBA16F, format: gl.RGBA }, gl.LINEAR, true);
    if (velocity.width !== next.sim.width || velocity.height !== next.sim.height) {
      resizeDouble(velocity, next.sim.width, next.sim.height, { internal: gl.RG16F, format: gl.RG }, gl.LINEAR, true);
      resizeDouble(pressure, next.sim.width, next.sim.height, { internal: gl.R16F, format: gl.RED }, gl.NEAREST, false);
      reshape(divergence, next.sim.width, next.sim.height, { internal: gl.R16F, format: gl.RED });
      reshape(curl, next.sim.width, next.sim.height, { internal: gl.R16F, format: gl.RED });
    }
    const glowSize = resolution(BLOOM_RESOLUTION);
    if (bloom && (bloom.width !== glowSize.width || bloom.height !== glowSize.height)) dropBloom();
  };

  const applyBloom = amount => {
    const base = ensureBloom();
    if (!bloomChain.length) return;
    gl.disable(gl.BLEND);
    let u = use('prefilter');
    const knee = BLOOM_THRESHOLD * BLOOM_KNEE + 0.0001;
    gl.uniform3f(u.curve, BLOOM_THRESHOLD - knee, knee * 2, 0.25 / knee);
    gl.uniform1f(u.threshold, BLOOM_THRESHOLD);
    gl.uniform1i(u.uTexture, dye.read.attach(0)); blit(base);
    u = use('blur');
    gl.uniform1f(u.intensity, 1);
    let last = base;
    bloomChain.forEach(t => { gl.uniform2f(u.texelSize, last.texelX, last.texelY); gl.uniform1i(u.uTexture, last.attach(0)); blit(t); last = t; });
    gl.blendFunc(gl.ONE, gl.ONE); gl.enable(gl.BLEND);
    for (let i = bloomChain.length - 2; i >= 0; i--) { const t = bloomChain[i]; gl.uniform2f(u.texelSize, last.texelX, last.texelY); gl.uniform1i(u.uTexture, last.attach(0)); blit(t); last = t; }
    gl.disable(gl.BLEND);
    gl.uniform1f(u.intensity, amount);
    gl.uniform2f(u.texelSize, last.texelX, last.texelY);
    gl.uniform1i(u.uTexture, last.attach(0)); blit(base);
  };

  const render = () => {
    if (settings.glow > 0) applyBloom(2 * settings.glow);
    gl.disable(gl.BLEND);
    const u = use('display');
    gl.uniform2f(u.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
    gl.uniform1i(u.uTexture, dye.read.attach(0));
    gl.uniform1i(u.uBloom, (bloom || dye.read).attach(1));
    gl.uniform1f(u.shading, settings.shading);
    gl.uniform1f(u.bloom, settings.glow > 0 ? 1 : 0);
    gl.uniform1f(u.light, settings.light ? 1 : 0);
    blit(null);
  };
  const clearScreen = () => { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); };

  const frame = now => {
    raf = 0;
    if (disposed || lost) return;
    const dt = clamp((now - last) / 1000, 0, 1 / 60);
    last = now;
    resize();
    const quiet = (2.2 * settings.trail + 0.4) * 1000;
    if (introStart >= 0) {
      const prog = (now - introStart) / 1100;
      if (prog >= 0) {
        const t = Math.min(prog, 1);
        const eased = t * t * (3 - 2 * t);
        if (!introPointer.ready) { introPointer.x = introPointer.px = 0.2 + 0.6 * eased; introPointer.y = introPointer.py = 0.5 + 0.12 * Math.sin(eased * Math.PI * 2); introPointer.ready = true; }
        else { introPointer.x = 0.2 + 0.6 * eased; introPointer.y = 0.5 + 0.12 * Math.sin(eased * Math.PI * 2); introPointer.moved = true; }
        if (t >= 1) introStart = -1;
        lastActivity = now;
      }
    }
    if (introPointer.moved) { introPointer.moved = false; flush(introPointer, dt, now); }
    pointers.forEach(p => { if (!p.moved) return; p.moved = false; flush(p, dt, now); });
    bursts.splice(0).forEach(p => burst(p.x, p.y, now));
    step(dt);
    render();
    if (introStart >= 0 || now - lastActivity < quiet) raf = requestAnimationFrame(frame);
    else clearScreen();
  };
  const wake = () => { lastActivity = performance.now(); if (raf || disposed || lost) return; last = performance.now(); raf = requestAnimationFrame(frame); };

  const locate = (cx, cy) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = (cx - rect.left) / rect.width, y = 1 - (cy - rect.top) / rect.height;
    return { x, y };
  };
  const track = (id, cx, cy) => {
    const p = locate(cx, cy);
    let pointer = pointers.get(id);
    if (!p) { if (pointer) pointer.ready = false; return; }
    if (!pointer) { pointer = { x: 0, y: 0, px: 0, py: 0, ready: false, moved: false, offset: Math.random() }; pointers.set(id, pointer); }
    if (!pointer.ready) { pointer.x = pointer.px = p.x; pointer.y = pointer.py = p.y; pointer.ready = true; return; }
    pointer.x = p.x; pointer.y = p.y; pointer.moved = true; wake();
  };
  const press = (cx, cy) => {
    if (!settings.clickSplash) return;
    const p = locate(cx, cy); if (!p) return;
    bursts.push(p); wake();
  };

  let onPointerMove, onPointerDown, onTouchStart, onTouchMove, onTouchEnd;

  function start() {
    if (!initGL()) { console.warn('WebGL2 not available for SplashCursor'); return; }
    fit();
    const initSizes = sizes();
    dye = createDouble(initSizes.ink.width, initSizes.ink.height, { internal: gl.RGBA16F, format: gl.RGBA }, gl.LINEAR);
    velocity = createDouble(initSizes.sim.width, initSizes.sim.height, { internal: gl.RG16F, format: gl.RG }, gl.LINEAR);
    pressure = createDouble(initSizes.sim.width, initSizes.sim.height, { internal: gl.R16F, format: gl.RED }, gl.NEAREST);
    divergence = createTarget(initSizes.sim.width, initSizes.sim.height, { internal: gl.R16F, format: gl.RED }, gl.NEAREST);
    curl = createTarget(initSizes.sim.width, initSizes.sim.height, { internal: gl.R16F, format: gl.RED }, gl.NEAREST);
    resize();

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    introStart = opts.intro !== false && !reduced ? performance.now() + 150 : -1;

    onPointerMove = e => track(`p${e.pointerId}`, e.clientX, e.clientY);
    onPointerDown = e => press(e.clientX, e.clientY);
    onTouchStart = e => { Array.from(e.changedTouches).forEach(t => { pointers.delete(`t${t.identifier}`); track(`t${t.identifier}`, t.clientX, t.clientY); press(t.clientX, t.clientY); }); };
    onTouchMove = e => { Array.from(e.changedTouches).forEach(t => track(`t${t.identifier}`, t.clientX, t.clientY)); };
    onTouchEnd = e => { Array.from(e.changedTouches).forEach(t => pointers.delete(`t${t.identifier}`)); };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    wake();
  }

  function stop() {
    disposed = true;
    cancelAnimationFrame(raf);
    if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
    if (onPointerDown) window.removeEventListener('pointerdown', onPointerDown);
    if (onTouchStart) window.removeEventListener('touchstart', onTouchStart);
    if (onTouchMove) window.removeEventListener('touchmove', onTouchMove);
    if (onTouchEnd) window.removeEventListener('touchend', onTouchEnd);
    if (gl) release();
    gl = null;
  }

  return { container, start, stop };
};

})();
