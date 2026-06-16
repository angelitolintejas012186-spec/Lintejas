/**
 * LiquidGold — raw WebGL fragment shader rendering molten gold.
 * No Three.js dependency (keeps this chunk tiny).
 *
 * Desktop-only (≥ 1024px).  Reduced-motion: static golden gradient.
 * Mounts as a canvas that fills its CSS container.
 */
import { useRef, useEffect } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

/* ── GLSL source ───────────────────────────────────────────────── */
const VERT = /* glsl */ `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;

  /* Simple value noise — fast, no Simplex dependency */
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),             hash(i + vec2(1, 0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1, 1)), u.x),
      u.y
    );
  }

  /* Fractional Brownian Motion — 4 octaves */
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p  = p * 2.03 + vec2(0.53, 0.84);
      a *= 0.5;
    }
    return v;
  }

  /* Gold color palette */
  vec3 goldPalette(float t) {
    vec3 dark   = vec3(0.15, 0.07, 0.01);   /* deep amber  */
    vec3 mid    = vec3(0.71, 0.51, 0.11);   /* #B5821B     */
    vec3 bright = vec3(0.91, 0.78, 0.38);   /* #E8C761     */
    vec3 spec   = vec3(0.98, 0.96, 0.76);   /* near-white  */

    vec3 c = mix(dark, mid,    smoothstep(0.18, 0.48, t));
         c = mix(c,   bright,  smoothstep(0.46, 0.70, t));
         c = mix(c,   spec,    smoothstep(0.75, 0.92, t));
    return c;
  }

  void main() {
    vec2 uv  = gl_FragCoord.xy / u_res;
    float ar = u_res.x / u_res.y;

    /* Aspect-corrected noise UV */
    vec2 nuv = vec2(uv.x * ar, uv.y);

    float t  = u_time * 0.34;

    /* Two warp passes — creates viscous flow feel */
    float n1 = fbm(nuv * 1.9 + vec2( t * 0.38,  t * 0.22));
    float n2 = fbm(nuv * 2.4 + vec2(-t * 0.26,  t * 0.41) + n1 * 0.55);
    float wave = fbm(nuv * 1.6 + vec2( t * 0.22, -t * 0.18) + n2 * 0.38);

    vec3 color = goldPalette(wave);

    /* Radial vignette — fades to transparent at edges */
    vec2 cv   = (uv - 0.5) * vec2(ar, 1.0);
    float vig = 1.0 - smoothstep(0.28, 0.72, length(cv));

    /* Left-edge gradient so it doesn't hard-clip against hero text */
    float leftFade = smoothstep(0.0, 0.25, uv.x);

    gl_FragColor = vec4(color, wave * vig * leftFade * 0.26);
  }
`

/* ── WebGL bootstrap ───────────────────────────────────────────── */
function makeProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  function compile(type: number, src: string) {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER,   vert))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(prog)
  return prog
}

/* ── Component ─────────────────────────────────────────────────── */
interface Props { className?: string; style?: React.CSSProperties }

export default function LiquidGold({ className = '', style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced   = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const canvas  = canvasRef.current!
    const glRaw   = canvas.getContext('webgl', { alpha: true, antialias: false })
    if (!glRaw) return
    const gl = glRaw   // narrow to WebGLRenderingContext for closures

    const prog   = makeProgram(gl, VERT, FRAG)
    const posLoc = gl.getAttribLocation(prog,  'a_pos')
    const timeLoc = gl.getUniformLocation(prog, 'u_time')
    const resLoc  = gl.getUniformLocation(prog, 'u_res')

    /* Full-screen quad */
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
       1, -1,  1,  1,  -1, 1,
    ]), gl.STATIC_DRAW)

    gl.useProgram(prog)
    gl.enableVertexAttribArray(posLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    function resize() {
      canvas.width  = canvas.clientWidth  * Math.min(window.devicePixelRatio, 2)
      canvas.height = canvas.clientHeight * Math.min(window.devicePixelRatio, 2)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()

    let rafId = 0
    let start = performance.now()

    function frame(now: number) {
      if (document.hidden) { rafId = requestAnimationFrame(frame); return }

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(timeLoc, (now - start) * 0.001)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
    }
  }, [reduced])

  /* Reduced-motion fallback: static CSS gradient */
  if (reduced) {
    return (
      <div
        className={className}
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(212,168,67,0.12) 0%, rgba(154,122,46,0.06) 50%, transparent 75%)',
          ...style,
        }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
