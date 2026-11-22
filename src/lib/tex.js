// Pomocnicze funkcje budujące zapis LaTeX (KaTeX) dla liczb zespolonych.
import { fmtNum, abs, arg, normDeg, clean, niceRoot } from './complex.js'

/** Liczba w TeX-u z przecinkiem dziesiętnym: 8,66 → 8{,}66 */
export const tn = (x, opts) => fmtNum(x, opts).replace('−', '-').replace(',', '{,}')

/** Kąt w stopniach (bez normalizacji, jeśli raw = true) */
export const tdeg = (d, raw = false) => tn(raw ? d : Math.round(normDeg(d) * 10) / 10, { digits: 1 }) + '^\\circ'

export const tunit = (u) => (u ? `\\,\\mathrm{${u === 'Ω' ? '\\Omega' : u}}` : '')

/** e^{jφ} */
export const texp = (deg) => {
  const d = clean(Math.round(deg * 10) / 10)
  return `e^{${d < 0 ? '-' : ''}j${tn(Math.abs(d), { digits: 1 })}^\\circ}`
}

/** Postać wykładnicza: 10\,e^{j150°} */
export function tpol(z, { unit, root = false, mod, deg } = {}) {
  const m = mod !== undefined ? mod : abs(z)
  const a = deg !== undefined ? deg : arg(z)
  if (m < 1e-9) return '0' + tunit(unit)
  const r = root ? niceRoot(m) : null
  const head = r ? r.replace('√', '\\sqrt{').replace(/$/, '}') : tn(m)
  const ang = Math.abs(clean(a)) > 1e-9 ? `\\,${texp(a)}` : ''
  return head + ang + tunit(unit)
}

/** Postać algebraiczna: -8{,}66 + j5 */
export function talg(z, unit) {
  const re = clean(Math.round(z.re * 1e4) / 1e4)
  const im = clean(Math.round(z.im * 1e4) / 1e4)
  let s
  if (im === 0) s = tn(re)
  else {
    const jp = 'j' + tn(Math.abs(im))
    if (re === 0) s = (im < 0 ? '-' : '') + jp
    else s = tn(re) + (im < 0 ? ' - ' : ' + ') + jp
  }
  return s + tunit(unit)
}

/** Postać algebraiczna w nawiasie, jeśli to potrzebne przy odejmowaniu */
export const tparen = (z) => {
  const s = talg(z)
  return /[+-]/.test(s.slice(1)) || s.startsWith('-') ? `(${s})` : s
}
