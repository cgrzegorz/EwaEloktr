// Minimalna arytmetyka liczb zespolonych (kąty w stopniach – jak na zajęciach).

export const C = (re, im = 0) => ({ re, im })
export const RAD = Math.PI / 180

export const polar = (mod, deg) => C(mod * Math.cos(deg * RAD), mod * Math.sin(deg * RAD))
export const add = (...zs) => zs.reduce((a, b) => C(a.re + b.re, a.im + b.im), C(0, 0))
export const sub = (a, b) => C(a.re - b.re, a.im - b.im)
export const mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re)
export const div = (a, b) => {
  const d = b.re * b.re + b.im * b.im
  return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d)
}
export const scale = (a, k) => C(a.re * k, a.im * k)
export const abs = (z) => Math.hypot(z.re, z.im)

/** Kąt sprowadzony do przedziału (−180°, 180°]. */
export const normDeg = (d) => {
  let x = ((d % 360) + 360) % 360
  if (x > 180 + 1e-9) x -= 360
  if (Math.abs(x + 180) < 1e-9) x = 180
  return x
}
export const arg = (z) => (abs(z) < 1e-9 ? 0 : normDeg(Math.atan2(z.im, z.re) / RAD))

export const isZero = (z, eps = 1e-6) => abs(z) < eps
export const clean = (x) => (Math.abs(x) < 1e-9 ? 0 : x)

/* ---------- formatowanie (przecinek dziesiętny, jak w zeszycie) ---------- */

export function fmtNum(x, opts = {}) {
  x = clean(x)
  const a = Math.abs(x)
  let d = opts.digits
  if (d === undefined) d = a >= 1000 ? 1 : a >= 100 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : 4
  let s = x.toFixed(d)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s.replace('-', '−').replace('.', ',')
}

export const fmtDeg = (d) => fmtNum(Math.round(normDeg(d) * 10) / 10, { digits: 1 }) + '°'

/** Krótka „ładna” postać pierwiastkowa modułu, np. 14,14 → 10√2. */
export function niceRoot(x) {
  for (const [r, s] of [[Math.SQRT2, '√2'], [Math.sqrt(3), '√3'], [Math.sqrt(6), '√6']]) {
    const k = x / r
    const kr = Math.round(k * 10) / 10
    if (Math.abs(k - kr) < 1e-6 && Math.abs(x - Math.round(x)) > 1e-6 && kr !== 0) {
      return (kr === 1 ? '' : fmtNum(kr)) + s
    }
  }
  return null
}
