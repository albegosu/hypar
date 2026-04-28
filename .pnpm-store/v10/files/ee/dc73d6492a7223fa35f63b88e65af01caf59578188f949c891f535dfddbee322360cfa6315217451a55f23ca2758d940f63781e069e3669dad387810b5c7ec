interface RgbColor {
    r: number;
    g: number;
    b: number;
    alpha: number;
}
type RgbColorInput = Omit<RgbColor, 'alpha'> & {
    alpha?: number;
};
interface HslColor {
    h: number;
    s: number;
    l: number;
    alpha: number;
}
type HslColorInput = Omit<HslColor, 'alpha'> & {
    alpha?: number;
};
interface HsvColor {
    h: number;
    s: number;
    v: number;
    alpha: number;
}
type HsvColorInput = Omit<HsvColor, 'alpha'> & {
    alpha?: number;
};
interface HwbColor {
    h: number;
    /** Whiteness [0, 100] */
    w: number;
    /** Blackness [0, 100] */
    b: number;
    alpha: number;
}
type HwbColorInput = Omit<HwbColor, 'alpha'> & {
    alpha?: number;
};
/** CIE LAB (D50) */
interface LabColor {
    l: number;
    /** Green–red axis */
    a: number;
    /** Blue–yellow axis */
    b: number;
    alpha: number;
    readonly colorSpace: 'lab';
}
type LabColorInput = Omit<LabColor, 'alpha'> & {
    alpha?: number;
};
/** CIE LCH (D50) */
interface LchColor {
    l: number;
    c: number;
    h: number;
    alpha: number;
    readonly colorSpace: 'lch';
}
type LchColorInput = Omit<LchColor, 'alpha'> & {
    alpha?: number;
};
/** CIE XYZ (D50) */
interface XyzColor {
    x: number;
    y: number;
    z: number;
    alpha: number;
}
type XyzColorInput = Omit<XyzColor, 'alpha'> & {
    alpha?: number;
};
/** CIE XYZ (D65) */
interface XyzD65Color {
    x: number;
    y: number;
    z: number;
    alpha: number;
    readonly colorSpace: 'xyz-d65';
}
type XyzD65ColorInput = Omit<XyzD65Color, 'alpha'> & {
    alpha?: number;
};
interface CmykColor {
    c: number;
    m: number;
    y: number;
    k: number;
    alpha: number;
}
type CmykColorInput = Omit<CmykColor, 'alpha'> & {
    alpha?: number;
};
/** Oklab — perceptually uniform, D65 */
interface OklabColor {
    l: number;
    /** Green–red axis */
    a: number;
    /** Blue–yellow axis */
    b: number;
    alpha: number;
}
type OklabColorInput = Omit<OklabColor, 'alpha'> & {
    alpha?: number;
};
/** Oklch — perceptually uniform, polar form of Oklab */
interface OklchColor {
    l: number;
    c: number;
    h: number;
    alpha: number;
}
type OklchColorInput = Omit<OklchColor, 'alpha'> & {
    alpha?: number;
};
/** CSS Color 4 Display-P3 */
interface P3Color {
    r: number;
    g: number;
    b: number;
    alpha: number;
    readonly colorSpace: 'display-p3';
}
type P3ColorInput = Omit<P3Color, 'alpha'> & {
    alpha?: number;
};
/** CSS Color 4 Rec.2020 */
interface Rec2020Color {
    r: number;
    g: number;
    b: number;
    alpha: number;
    readonly colorSpace: 'rec2020';
}
type Rec2020ColorInput = Omit<Rec2020Color, 'alpha'> & {
    alpha?: number;
};
type AnyColor = string | RgbColorInput | HslColorInput | HsvColorInput | HwbColorInput | LabColorInput | LchColorInput | XyzColorInput | XyzD65ColorInput | CmykColorInput | OklabColorInput | OklchColorInput | P3ColorInput | Rec2020ColorInput;
type ColorParser<T = AnyColor> = (input: T) => RgbColor | null;
type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv' | 'hwb' | 'oklab' | 'oklch' | 'lab' | 'lch' | 'xyz' | 'xyz-d65' | 'cmyk' | 'p3' | 'rec2020' | 'name';

declare const _SENTINEL: unique symbol;
declare class Colordx {
    private readonly _rgb;
    private readonly _valid;
    constructor(input: AnyColor | Colordx | typeof _SENTINEL, _direct?: RgbColor);
    private static _make;
    /**
     * Construct a Colordx from linear-sRGB channels, gamma-encoding to the internal ×255 storage.
     * Channels may exceed [0, 1] — wide-gamut inputs (toGamutP3 / toGamutRec2020 applied to a
     * color outside sRGB) land here after the target-space → linear-sRGB matrix, and the stored
     * _rgb holds unclamped gamma-encoded ×255 so toP3() / toRec2020() can recover the wide-gamut
     * channels. sRGB output methods (toRgb, toHex, etc.) clamp to [0, 255] before returning.
     *
     * Replaces the prior _makeFromOklab: cssGamutMap hands back clipped linear-target channels
     * directly, so callers skip the OKLab → linear round-trip that used to reintroduce 1-ULP
     * asymmetries on gamut-boundary colors.
     *
     * A residual source of asymmetry remains — the clip itself. cssGamutMap's clip puts one
     * channel exactly on 0 or 1 while the others sit where the input's hue landed, so an
     * extreme-dark or extreme-light color ends up with genuinely asymmetric sub-byte channels
     * (e.g. clipped linear (3e-6, 0, 8e-10) from oklch(0.001 0.001 0)). Math.round collapses all
     * three to the same byte, but rgbToHslRaw / rgbToOklab read the raw floats and report
     * phantom hue/saturation. Snap values within half a byte of 0 or 255 to the exact boundary;
     * the band matches Math.round's own behavior so byte output is unchanged, while HSL / OKLab
     * see a consistent pure white / black / primary. Values outside [0, 255] are wide-gamut
     * (P3 / Rec.2020 targets) and pass through untouched.
     */
    static _makeFromLinearSrgb(lr: number, lg: number, lb: number, alpha: number): Colordx;
    isValid(): boolean;
    toRgb(): RgbColor;
    /** Returns the internal unrounded RGB. Intended for plugin use where deferred rounding matters. */
    _rawRgb(): RgbColor;
    /**
     * Format as a `rgb()` / `rgba()` CSS string.
     * Default is CSS Color 4 modern syntax (space-separated, slash-delimited alpha):
     *   `rgb(255 0 0)` / `rgb(255 0 0 / 0.5)`
     * Pass `{ legacy: true }` for CSS Color 3 comma-separated syntax, which also
     * switches the function name to `rgba()` when alpha < 1:
     *   `rgb(255, 0, 0)` / `rgba(255, 0, 0, 0.5)`
     */
    toRgbString(options?: {
        legacy?: boolean;
    }): string;
    toHex(): string;
    /** Always returns an 8-digit `#rrggbbaa`, even when alpha is 1. */
    toHex8(): string;
    /** Returns a 24-bit RGB integer (0x000000–0xFFFFFF). Alpha is not included. */
    toNumber(): number;
    toHsl(precision?: number): HslColor;
    toHslString(precision?: number): string;
    toOklab(precision?: number): OklabColor;
    toOklabString(precision?: number): string;
    toOklch(precision?: number): OklchColor;
    toOklchString(precision?: number): string;
    brightness(): number;
    isDark(): boolean;
    isLight(): boolean;
    alpha(): number;
    alpha(value: number): Colordx;
    hue(): number;
    hue(value: number): Colordx;
    lightness(): number;
    lightness(value: number): Colordx;
    chroma(): number;
    chroma(value: number): Colordx;
    lighten(amount?: number, options?: {
        relative?: boolean;
    }): Colordx;
    darken(amount?: number, options?: {
        relative?: boolean;
    }): Colordx;
    saturate(amount?: number, options?: {
        relative?: boolean;
    }): Colordx;
    desaturate(amount?: number, options?: {
        relative?: boolean;
    }): Colordx;
    grayscale(): Colordx;
    invert(): Colordx;
    rotate(amount?: number): Colordx;
    isEqual(color: AnyColor): boolean;
    toString(): string;
    /**
     * Clips this color into the sRGB gamut by clamping out-of-range channels to [0, 255].
     * Matches the naive-clip strategy browsers use when rendering out-of-gamut `oklch()` / `oklab()`.
     * Hue and lightness may shift noticeably for colors far outside sRGB.
     * Returns `this` when already in gamut.
     */
    clampSrgb(): Colordx;
    /**
     * Maps this color into the sRGB gamut using the CSS Color 4 gamut mapping algorithm
     * (chroma-reduction binary search). Preserves lightness and hue; sacrifices chroma.
     * Useful when hue stability matters — design tokens, palettes, color pickers.
     * Returns `this` when already in gamut.
     */
    mapSrgb(): Colordx;
    /**
     * Maps an out-of-sRGB-gamut color into sRGB using the CSS Color 4 gamut mapping algorithm.
     * Colors already in gamut are returned as-is. sRGB inputs (hex, rgb, hsl, etc.) are passed through.
     */
    static toGamutSrgb: (input: AnyColor) => Colordx;
}
type Plugin = (ColordxClass: typeof Colordx, parsers: ColorParser[], formatParsers: [ColorParser, ColorFormat][]) => void;
declare const colordx: (input: AnyColor | Colordx) => Colordx;
/** Emit an 8-digit `#rrggbbaa` hex for any color input. Convenience over `colordx(c).toHex8()`. */
declare const toHex8: (input: AnyColor | Colordx) => string;
declare const extend: (plugins: Plugin[]) => void;
declare const nearest: <T extends AnyColor>(color: AnyColor, candidates: T[]) => T;
declare const random: () => Colordx;

export { type AnyColor as A, type XyzD65Color as B, type ColorFormat as C, type HslColor as H, type LabColor as L, type OklabColor as O, type P3Color as P, type Rec2020Color as R, type XyzColor as X, type CmykColor as a, type CmykColorInput as b, type ColorParser as c, Colordx as d, type HslColorInput as e, type HsvColor as f, type HsvColorInput as g, type HwbColor as h, type HwbColorInput as i, type LabColorInput as j, type LchColor as k, type LchColorInput as l, type OklabColorInput as m, type OklchColor as n, type OklchColorInput as o, type P3ColorInput as p, type Plugin as q, type Rec2020ColorInput as r, type RgbColor as s, type RgbColorInput as t, type XyzColorInput as u, colordx as v, extend as w, nearest as x, random as y, toHex8 as z };
