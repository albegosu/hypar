import { A as AnyColor, C as ColorFormat } from './colordx-FkeB37IC.js';
export { a as CmykColor, b as CmykColorInput, c as ColorParser, d as Colordx, H as HslColor, e as HslColorInput, f as HsvColor, g as HsvColorInput, h as HwbColor, i as HwbColorInput, L as LabColor, j as LabColorInput, k as LchColor, l as LchColorInput, O as OklabColor, m as OklabColorInput, n as OklchColor, o as OklchColorInput, P as P3Color, p as P3ColorInput, q as Plugin, R as Rec2020Color, r as Rec2020ColorInput, s as RgbColor, t as RgbColorInput, X as XyzColor, u as XyzColorInput, v as colordx, w as extend, x as nearest, y as random, z as toHex8 } from './colordx-FkeB37IC.js';

/** Convert a number in [0, 255] to a 2-char lowercase hex byte. Clamps and rounds out-of-range inputs. */
declare const toHexByte: (n: number) => string;

declare const getFormat: (input: AnyColor) => ColorFormat | undefined;

/**
 * Returns true if the color is within the sRGB gamut.
 * Always true for hex, rgb, hsl, hsv, and hwb inputs.
 * For oklch/oklab inputs, checks whether the computed linear sRGB channels are in [0, 1].
 */
declare const inGamutSrgb: (input: AnyColor) => boolean;

/**
 * Convert OKLCH to unclamped linear sRGB channels without object allocation.
 * This is the shared expensive step (OKLCH → OKLab → linear sRGB via 3× cbrt + matrix).
 * Use this when you need multiple color spaces from the same color — compute once,
 * then pass to linearToP3Channels / linearToRec2020Channels (from their plugins) to avoid duplicate work.
 *
 * In-gamut sRGB colors have all channels in [0, 1]. Channels outside this range
 * indicate an out-of-gamut color — use as a free gamut check.
 */
declare const oklchToLinear: (l: number, c: number, h: number) => [number, number, number];
/** Zero-allocation sibling of oklchToLinear — writes [lr, lg, lb] into `out`. */
declare const oklchToLinearInto: (out: Float64Array | number[], l: number, c: number, h: number) => void;
/**
 * Convert OKLCH to gamma-encoded sRGB channels without object allocation.
 * Returns [r, g, b] in [0, 1] for in-gamut colors. Out-of-gamut channels may
 * exceed this range — callers are responsible for clamping before byte encoding.
 */
declare const oklchToRgbChannels: (l: number, c: number, h: number) => [number, number, number];
/** Zero-allocation sibling of oklchToRgbChannels — writes [r, g, b] (gamma-encoded, 0–1) into `out`. */
declare const oklchToRgbChannelsInto: (out: Float64Array | number[], l: number, c: number, h: number) => void;
/**
 * Convert OKLCH to both linear and gamma-encoded sRGB channels in a single pass.
 * Avoids recomputing the expensive OKLCH → OKLab → linear step when you need both.
 *
 * Linear channels are useful for gamut checks (all in [0,1] = in sRGB gamut)
 * and as input to P3/Rec2020 conversion matrices.
 * Gamma channels are ready for display on an sRGB canvas (still need clamping for out-of-gamut).
 *
 * Returns [[lr, lg, lb], [sr, sg, sb]] — both in [0, 1] for in-gamut colors.
 */
declare const oklchToLinearAndSrgb: (l: number, c: number, h: number) => [[number, number, number], [number, number, number]];
/**
 * Zero-allocation sibling of oklchToLinearAndSrgb — writes linear channels into `linOut`
 * and gamma-encoded sRGB channels into `srgbOut`. The two buffers must be distinct.
 */
declare const oklchToLinearAndSrgbInto: (linOut: Float64Array | number[], srgbOut: Float64Array | number[], l: number, c: number, h: number) => void;
/**
 * Gamma-encoded sRGB (0–1) → linear sRGB (0–1). Vector sibling of `srgbToLinear`.
 * For byte-scale RGB, pass `r/255, g/255, b/255`. Output range tracks input:
 * channels outside [0, 1] are preserved with the CSS Color 4 extended transfer curve.
 */
declare const rgbToLinear: (r: number, g: number, b: number) => [number, number, number];
/** Zero-allocation sibling of rgbToLinear — writes [lr, lg, lb] into `out`. */
declare const rgbToLinearInto: (out: Float64Array | number[], r: number, g: number, b: number) => void;
/**
 * CIE Lab (D50) → unclamped linear sRGB (0–1). Goes via XYZ D50 with Bradford adaptation.
 * L in [0, 100]; a/b typically in [-128, 128]. Out-of-sRGB-gamut colors return channels
 * outside [0, 1] — use as a free gamut check or pass to `srgbFromLinear` for display.
 */
declare const labToLinearSrgb: (l: number, a: number, b: number) => [number, number, number];
/** Zero-allocation sibling of labToLinearSrgb — writes [lr, lg, lb] into `out`. */
declare const labToLinearSrgbInto: (out: Float64Array | number[], l: number, a: number, b: number) => void;
/**
 * CIE LCH (D50) → unclamped linear sRGB (0–1). Polar-to-rectangular to Lab, then Lab → linear sRGB.
 * L in [0, 100]; C is the chroma (0–~150); H in degrees. Out-of-gamut colors return channels
 * outside [0, 1] — useful in LCH render hot paths where you want linear pixels and a gamut check in one step.
 */
declare const lchToLinearSrgb: (l: number, c: number, h: number) => [number, number, number];
/** Zero-allocation sibling of lchToLinearSrgb — writes [lr, lg, lb] into `out`. */
declare const lchToLinearSrgbInto: (out: Float64Array | number[], l: number, c: number, h: number) => void;
/**
 * CIE Lab (D50) → gamma-encoded sRGB (0–1). Convenience wrapper over `labToLinearSrgb` + `srgbFromLinear`.
 * In-gamut colors return channels in [0, 1]; out-of-gamut channels may exceed this range — clamp before byte encoding.
 */
declare const labToRgbChannels: (l: number, a: number, b: number) => [number, number, number];
/** Zero-allocation sibling of labToRgbChannels — writes [r, g, b] (gamma-encoded, 0–1) into `out`. */
declare const labToRgbChannelsInto: (out: Float64Array | number[], l: number, a: number, b: number) => void;
/**
 * CIE LCH (D50) → gamma-encoded sRGB (0–1). Polar-to-rectangular to Lab, then Lab → gamma sRGB.
 * In-gamut colors return channels in [0, 1]; out-of-gamut channels may exceed this range.
 */
declare const lchToRgbChannels: (l: number, c: number, h: number) => [number, number, number];
/** Zero-allocation sibling of lchToRgbChannels — writes [r, g, b] (gamma-encoded, 0–1) into `out`. */
declare const lchToRgbChannelsInto: (out: Float64Array | number[], l: number, c: number, h: number) => void;
/**
 * CIE Lab (D50) → both linear and gamma-encoded sRGB in a single pass.
 * Avoids recomputing Lab → XYZ D50 → linear sRGB when you need both (e.g. gamut check + pixel).
 * Returns [[lr, lg, lb], [sr, sg, sb]].
 */
declare const labToLinearAndSrgb: (l: number, a: number, b: number) => [[number, number, number], [number, number, number]];
/**
 * Zero-allocation sibling of labToLinearAndSrgb — writes linear channels into `linOut`
 * and gamma-encoded sRGB channels into `srgbOut`. The two buffers must be distinct.
 */
declare const labToLinearAndSrgbInto: (linOut: Float64Array | number[], srgbOut: Float64Array | number[], l: number, a: number, b: number) => void;
/**
 * CIE LCH (D50) → both linear and gamma-encoded sRGB in a single pass.
 * Polar-to-rectangular to Lab, then Lab → linear + gamma sRGB. Returns [[lr, lg, lb], [sr, sg, sb]].
 */
declare const lchToLinearAndSrgb: (l: number, c: number, h: number) => [[number, number, number], [number, number, number]];
/** Zero-allocation sibling of lchToLinearAndSrgb — same buffer rules as labToLinearAndSrgbInto. */
declare const lchToLinearAndSrgbInto: (linOut: Float64Array | number[], srgbOut: Float64Array | number[], l: number, c: number, h: number) => void;

export { AnyColor, ColorFormat, getFormat, inGamutSrgb, labToLinearAndSrgb, labToLinearAndSrgbInto, labToLinearSrgb, labToLinearSrgbInto, labToRgbChannels, labToRgbChannelsInto, lchToLinearAndSrgb, lchToLinearAndSrgbInto, lchToLinearSrgb, lchToLinearSrgbInto, lchToRgbChannels, lchToRgbChannelsInto, oklchToLinear, oklchToLinearAndSrgb, oklchToLinearAndSrgbInto, oklchToLinearInto, oklchToRgbChannels, oklchToRgbChannelsInto, rgbToLinear, rgbToLinearInto, toHexByte };
