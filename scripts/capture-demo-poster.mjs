#!/usr/bin/env node
/**
 * Renders docs/public/demo/poster-frame.html to poster.png for the VitePress hero.
 *
 * Usage: pnpm demo:poster
 * Optional live capture (app running + auth):
 *   DEMO_CAPTURE_URL=http://localhost:3000 \
 *   DEMO_CAPTURE_EMAIL=you@example.com \
 *   DEMO_CAPTURE_PASSWORD=secret \
 *   pnpm demo:poster -- --live
 */
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'docs/public/demo')
const posterPath = path.join(outDir, 'poster.png')
const framePath = path.join(outDir, 'poster-frame.html')

const live = process.argv.includes('--live')
const baseUrl = (process.env.DEMO_CAPTURE_URL || 'http://localhost:3000').replace(/\/$/, '')
const email = process.env.DEMO_CAPTURE_EMAIL
const password = process.env.DEMO_CAPTURE_PASSWORD

async function captureFrame(browser) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 675 } })
  await page.goto(`file://${framePath}`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: posterPath, type: 'png' })
  await page.close()
}

async function captureLive(browser) {
  if (!email || !password) {
    throw new Error('Set DEMO_CAPTURE_EMAIL and DEMO_CAPTURE_PASSWORD for --live')
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.goto(`${baseUrl}/auth/signin`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL((url) => !url.pathname.includes('/auth/signin'), { timeout: 15000 })
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const chat = page.locator('.max-w-5xl').first()
  await chat.screenshot({ path: posterPath, type: 'png' })
  await page.close()
}

async function main() {
  if (!fs.existsSync(framePath)) {
    throw new Error(`Missing ${framePath}`)
  }
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  try {
    if (live) {
      console.log(`Capturing live chat from ${baseUrl}…`)
      await captureLive(browser)
    } else {
      console.log(`Rendering ${path.relative(root, framePath)}…`)
      await captureFrame(browser)
    }
    console.log(`Wrote ${path.relative(root, posterPath)}`)
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
