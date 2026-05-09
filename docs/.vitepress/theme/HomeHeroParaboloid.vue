<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const layerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let cleanup: (() => void) | undefined

function attachParaboloid(
  layer: HTMLDivElement,
  surface: HTMLCanvasElement,
  cx: CanvasRenderingContext2D,
): () => void {
  let animId = 0
  let t0: number | null = null
  let targetMx = 0
  let targetMy = 0
  let mx = 0
  let my = 0

  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reduceMotion = mqReduce.matches

  const onReduceChange = () => {
    reduceMotion = mqReduce.matches
  }
  mqReduce.addEventListener('change', onReduceChange)

  function positionLayer() {
    gsap.set(layer, {
      xPercent: -50,
      y: 0,
    })
    const top = layer.getBoundingClientRect().top
    gsap.set(layer, {
      xPercent: -50,
      y: -top,
    })
  }

  function resize() {
    positionLayer()
    surface.width = surface.offsetWidth
    surface.height = surface.offsetHeight
  }

  resize()
  window.addEventListener('resize', resize)

  const onMouseMove = (e: MouseEvent) => {
    const r = surface.getBoundingClientRect()
    targetMx = ((e.clientX - r.left) / r.width - 0.5) * 2
    targetMy = ((e.clientY - r.top) / r.height - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouseMove)

  function isDarkTheme() {
    return document.documentElement.classList.contains('dark')
  }

  function strokeRgba(alpha: number) {
    const a = Math.min(alpha, 1)
    return isDarkTheme()
      ? `rgba(255,255,255,${a.toFixed(3)})`
      : `rgba(55,65,81,${a.toFixed(3)})`
  }

  function project(x: number, y: number, z: number, rz: number, rx: number) {
    const x1 = x * Math.cos(rz) - y * Math.sin(rz)
    const y1 = x * Math.sin(rz) + y * Math.cos(rz)
    const y2 = y1 * Math.cos(rx) - z * Math.sin(rx)
    const z2 = y1 * Math.sin(rx) + z * Math.cos(rx)
    const fov = 560
    const scale = Math.min(surface.width * 0.72, surface.height * 1.18)
    const dz = fov + z2 * 50
    const anchorY = surface.height * 0.2
    return {
      sx: surface.width / 2 + (x1 * scale * fov) / dz,
      sy: anchorY + (y2 * scale * fov) / dz,
      d: z2,
    }
  }

  function edgeFade(param: number) {
    const abs = Math.abs(param)
    const start = 0.62
    if (abs < start) return 1
    const t = (abs - start) / (1 - start)
    return 1 - t * t
  }

  function drawPolyline(
    pts: { sx: number; sy: number }[],
    alphas: number[],
    lineWidth: number,
  ) {
    cx.lineWidth = lineWidth
    for (let k = 1; k < pts.length; k++) {
      const a = (alphas[k - 1] + alphas[k]) * 0.5
      if (a < 0.008) continue
      cx.beginPath()
      cx.moveTo(pts[k - 1].sx, pts[k - 1].sy)
      cx.lineTo(pts[k].sx, pts[k].sy)
      cx.strokeStyle = strokeRgba(Math.min(a, 1))
      cx.stroke()
    }
  }

  const N = 28
  const STEPS = 80

  function drawFrame(ts: number) {
    if (!t0) t0 = ts
    const t = reduceMotion ? 0 : (ts - t0) / 1000

    mx += (targetMx - mx) * 0.055
    my += (targetMy - my) * 0.055

    const rz = Math.PI / 4 + t * 0.05 + mx * 0.6
    const rx = -Math.PI / 4 + my * 0.34

    const W = surface.width
    const H = surface.height
    cx.clearRect(0, 0, W, H)

    for (let j = 0; j <= N; j++) {
      const yp = (j / N) * 2 - 1
      const fy = edgeFade(yp)
      if (fy < 0.01) continue

      const pts: { sx: number; sy: number; d: number }[] = []
      const alphas: number[] = []
      for (let i = 0; i <= STEPS; i++) {
        const xp = (i / STEPS) * 2 - 1
        const zp = (xp * xp - yp * yp) * 0.88
        const p = project(xp, yp, zp, rz, rx)
        const fx = edgeFade(xp)
        const depth = Math.max(0, Math.min(1, 0.2 + p.d * 0.28))
        pts.push(p)
        alphas.push(depth * fx * fy * 0.55)
      }
      drawPolyline(pts, alphas, 0.6)
    }

    for (let i = 0; i <= N; i++) {
      const xp = (i / N) * 2 - 1
      const fx = edgeFade(xp)
      if (fx < 0.01) continue

      const pts: { sx: number; sy: number; d: number }[] = []
      const alphas: number[] = []
      for (let j = 0; j <= STEPS; j++) {
        const yp = (j / STEPS) * 2 - 1
        const zp = (xp * xp - yp * yp) * 0.88
        const p = project(xp, yp, zp, rz, rx)
        const fy = edgeFade(yp)
        const depth = Math.max(0, Math.min(1, 0.24 + p.d * 0.32))
        pts.push(p)
        alphas.push(depth * fx * fy)
      }
      drawPolyline(pts, alphas, 1)
    }
  }

  function frame(ts: number) {
    animId = requestAnimationFrame(frame)
    drawFrame(ts)
  }

  animId = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouseMove)
    mqReduce.removeEventListener('change', onReduceChange)
    gsap.set(layer, { clearProps: 'transform' })
  }
}

onMounted(() => {
  const layer = layerRef.value
  const surface = canvasRef.value
  if (!layer || !surface) return
  const cx = surface.getContext('2d')
  if (!cx) return
  cleanup = attachParaboloid(layer, surface, cx)
})

onUnmounted(() => {
  cleanup?.()
})
</script>

<template>
  <div ref="layerRef" class="hpp" aria-hidden="true">
    <canvas ref="canvasRef" class="hpp__canvas" />
    <div class="hpp__vignette" />
  </div>
</template>

<style scoped>
.hpp {
  pointer-events: none;
  position: absolute;
  z-index: 0;
  left: 50%;
  top: 0;
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
}

.hpp__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.hpp__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--vp-c-bg) 34%, transparent) 0%,
      color-mix(in srgb, var(--vp-c-bg) 18%, transparent) 5%,
      transparent 14%,
      transparent 78%,
      color-mix(in srgb, var(--vp-c-bg) 72%, transparent) 94%,
      var(--vp-c-bg) 100%
    ),
    linear-gradient(
      to right,
      var(--vp-c-bg) 0%,
      transparent 14%,
      transparent 86%,
      var(--vp-c-bg) 100%
    ),
    radial-gradient(
      ellipse 86% 82% at 50% 50%,
      transparent 26%,
      color-mix(in srgb, var(--vp-c-bg) 42%, transparent) 70%,
      var(--vp-c-bg) 100%
    );
}
</style>
