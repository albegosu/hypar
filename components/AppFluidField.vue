<template>
  <div class="hypar-fluid" aria-hidden="true">
    <canvas ref="masterRef" class="hypar-fluid__master" />
    <div class="hypar-fluid__vignette" />

    <svg class="hypar-fluid__defs" width="0" height="0" focusable="false">
      <defs>
        <filter
          id="hypar-liquid-glass"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.015" numOctaves="3" result="noise" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            result="boosted_alpha"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 100 0"
          />
          <feGaussianBlur in="boosted_alpha" stdDeviation="36" result="blurred_alpha" />
          <feComponentTransfer in="blurred_alpha" result="edge_mask">
            <feFuncA type="linear" slope="-1.3" intercept="1" />
          </feComponentTransfer>
          <feComposite
            in="noise"
            in2="edge_mask"
            operator="arithmetic"
            k1="1"
            k2="0"
            k3="0"
            k4="0"
            result="masked_noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="masked_noise"
            scale="48"
            xChannelSelector="R"
            yChannelSelector="G"
            result="red_displaced"
          />
          <feColorMatrix
            in="red_displaced"
            type="matrix"
            result="red"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="masked_noise"
            scale="40"
            xChannelSelector="R"
            yChannelSelector="G"
            result="green_displaced"
          />
          <feColorMatrix
            in="green_displaced"
            type="matrix"
            result="green"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="masked_noise"
            scale="32"
            xChannelSelector="R"
            yChannelSelector="G"
            result="blue_displaced"
          />
          <feColorMatrix
            in="blue_displaced"
            type="matrix"
            result="blue"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="chromatic_dispersion" />
        </filter>
      </defs>
    </svg>

    <div
      v-for="shape in shapes"
      :key="shape.id"
      class="hypar-fluid__geo"
      :class="`hypar-fluid__geo--${shape.id}`"
      :data-fluid-geo="shape.id"
      :style="shape.style"
    >
      <div class="hypar-fluid__dup">
        <canvas class="hypar-fluid__canvas" />
      </div>
      <div class="hypar-fluid__frost" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { theme } = useTerminalPrefs()

const shapes = [
  { id: 'a', style: {} },
  { id: 'b', style: {} },
  { id: 'c', style: {} },
  { id: 'd', style: {} },
  { id: 'e', style: {} },
  { id: 'f', style: {} },
]

/** Bayer 4×4 thresholds in [0, 1) — ordered dither, not soft alpha. */
const BAYER4 = [
  [0.03125, 0.53125, 0.15625, 0.65625],
  [0.78125, 0.28125, 0.90625, 0.40625],
  [0.21875, 0.71875, 0.09375, 0.59375],
  [0.96875, 0.46875, 0.84375, 0.34375],
] as const

const STEP = 5
const ARM = 1.65
const PIXEL = 1

const masterRef = ref<HTMLCanvasElement | null>(null)

let raf = 0
let masterW = 0
let masterH = 0
let masterTheme = ''
let reducedMotion = false

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
  return s - Math.floor(s)
}

/** Multi-blob luminosity + cheap value noise → smoke-like map in [0, 1]. */
function sampleLum(nx: number, ny: number): number {
  const d1 = Math.hypot(nx - 0.28, ny - 0.30)
  const d2 = Math.hypot(nx - 0.74, ny - 0.20)
  const d3 = Math.hypot(nx - 0.60, ny - 0.74)
  const d4 = Math.hypot(nx - 0.14, ny - 0.70)
  const d5 = Math.hypot(nx - 0.48, ny - 0.50)

  let v =
    Math.exp(-d1 * d1 * 4.2) * 0.98
    + Math.exp(-d2 * d2 * 5.0) * 0.88
    + Math.exp(-d3 * d3 * 3.8) * 0.92
    + Math.exp(-d4 * d4 * 6.2) * 0.72
    + Math.exp(-d5 * d5 * 7.5) * 0.42

  const n =
    hash2(nx * 3.2, ny * 2.8) * 0.20
    + hash2(nx * 7.4 + 1.7, ny * 6.2 + 0.9) * 0.11
  v = v * 0.78 + n

  return Math.min(1, Math.max(0, v))
}

function paintMaster(w: number, h: number, mode: string) {
  const canvas = masterRef.value
  if (!canvas) return

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const light = mode === 'light'
  ctx.fillStyle = light ? '#f3f3f1' : '#0b0b0b'
  ctx.fillRect(0, 0, w, h)

  // Hard marks only — density from dither, never soft globalAlpha blooms
  ctx.strokeStyle = light ? 'rgba(20,20,18,0.52)' : 'rgba(235,235,232,0.72)'
  ctx.lineWidth = 1
  ctx.lineCap = 'square'
  ctx.globalAlpha = 1

  const threshold = light ? 0.78 : 0.70
  ctx.beginPath()

  for (let yi = 0, y = 0; y < h; yi++, y += STEP) {
    const by = BAYER4[yi & 3]!
    for (let xi = 0, x = 0; x < w; xi++, x += STEP) {
      const lum = sampleLum(x / w, y / h)
      const bayer = by[xi & 3]!
      if (lum + bayer < threshold) continue

      const cx = x + STEP * 0.5
      const cy = y + STEP * 0.5
      ctx.moveTo(cx - ARM, cy)
      ctx.lineTo(cx + ARM, cy)
      ctx.moveTo(cx, cy - ARM)
      ctx.lineTo(cx, cy + ARM)
    }
  }
  ctx.stroke()

  masterW = w
  masterH = h
  masterTheme = mode
}

function syncGeos() {
  const canvas = masterRef.value
  if (!canvas) return

  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  const nodes = document.querySelectorAll<HTMLElement>('[data-fluid-geo]')

  for (const node of nodes) {
    const rect = node.getBoundingClientRect()
    if (rect.width < 2 || rect.height < 2) continue
    const dup = node.querySelector<HTMLElement>('.hypar-fluid__dup')
    const geoCanvas = node.querySelector<HTMLCanvasElement>('.hypar-fluid__canvas')
    if (!dup || !geoCanvas) continue

    dup.style.left = `${-rect.left}px`
    dup.style.top = `${-rect.top}px`
    dup.style.width = `${vw}px`
    dup.style.height = `${vh}px`

    const tw = Math.max(1, Math.round(vw * PIXEL))
    const th = Math.max(1, Math.round(vh * PIXEL))
    if (geoCanvas.width !== tw || geoCanvas.height !== th) {
      geoCanvas.width = tw
      geoCanvas.height = th
    }
    const ctx = geoCanvas.getContext('2d')
    if (!ctx) continue
    try {
      ctx.drawImage(canvas, 0, 0, tw, th)
    }
    catch {
      /* frame skip */
    }
  }
}

function syncFrame() {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  const mode = theme.value
  if (masterW !== vw || masterH !== vh || masterTheme !== mode) {
    paintMaster(vw, vh, mode)
  }
  syncGeos()
}

function loop() {
  syncGeos()
  raf = requestAnimationFrame(loop)
}

function onResize() {
  masterW = 0
  syncFrame()
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  syncFrame()
  // Geos only need continuous sync while they drift
  if (!reducedMotion) raf = requestAnimationFrame(loop)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
})

watch(theme, () => {
  masterTheme = ''
  syncFrame()
})
</script>
