// Parser odpowiedzi studenta. Akceptuje m.in.:
//   10e^j150   10e^(-j120°)   10·e^{j90}   10∠150   10<-30
//   -8,66+j5   -8.66 + 5j   j220   -j10   10√2e^j45   sqrt(2)*10
// Kąty w wykładniku są w STOPNIACH (konwencja z zajęć).
import { C, add, sub, mul, div, polar, abs, arg } from './complex.js'

function tokenize(src) {
  let s = src
    .replace(/[\s°]/g, '')
    .replace(/,/g, '.')
    .replace(/[·×⋅]/g, '*')
    .replace(/[−–]/g, '-')
    .replace(/Ω|kW|kV|VA|var|[VAW]$/g, '')
  const out = []
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (/[0-9.]/.test(ch)) {
      let j = i
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      const num = parseFloat(s.slice(i, j))
      if (Number.isNaN(num)) throw new Error('liczba')
      out.push({ t: 'num', v: num })
      i = j
    } else if (s.startsWith('sqrt', i)) {
      out.push({ t: 'sqrt' })
      i += 4
    } else if (ch === '√') {
      out.push({ t: 'sqrt' })
      i++
    } else if (ch === 'j' || ch === 'i') {
      out.push({ t: 'j' })
      i++
    } else if (ch === 'e') {
      out.push({ t: 'e' })
      i++
    } else if (ch === '∠' || ch === '<') {
      out.push({ t: 'ang' })
      i++
    } else if ('+-*/^(){}[]'.includes(ch)) {
      const map = { '{': '(', '[': '(', '}': ')', ']': ')' }
      out.push({ t: map[ch] || ch })
      i++
    } else {
      throw new Error('znak ' + ch)
    }
  }
  return out
}

export function parseComplex(src) {
  if (!src || !src.trim()) return null
  let kilo = 1
  if (/k[WV]\s*$/.test(src)) {
    kilo = 1000
    src = src.replace(/k([WV])\s*$/, '')
  }
  const toks = tokenize(src)
  let p = 0
  const peek = () => toks[p]
  const eat = (t) => {
    if (!toks[p] || toks[p].t !== t) throw new Error('oczekiwano ' + t)
    return toks[p++]
  }
  const startsPrimary = (tk) => tk && ['num', 'j', 'e', 'sqrt', '('].includes(tk.t)

  function primary() {
    const tk = peek()
    if (!tk) throw new Error('koniec')
    if (tk.t === 'num') { p++; return C(tk.v) }
    if (tk.t === 'j') { p++; return C(0, 1) }
    if (tk.t === 'sqrt') {
      p++
      const v = peek() && peek().t === '(' ? paren() : primary()
      return C(Math.sqrt(v.re))
    }
    if (tk.t === '(') return paren()
    if (tk.t === 'e') {
      p++
      if (!peek() || peek().t !== '^') return C(Math.E)
      p++
      const w = exponent()
      // e^(jθ) z θ w stopniach
      return polar(Math.exp(w.re), w.im)
    }
    throw new Error('nieoczekiwany ' + tk.t)
  }
  function paren() {
    eat('(')
    const v = expr()
    eat(')')
    return v
  }
  function exponent() {
    // wykładnik: (…) albo ciąg z mnożeniem domyślnym, np. -j120, j(−30)
    let sign = 1
    while (peek() && (peek().t === '-' || peek().t === '+')) {
      if (peek().t === '-') sign = -sign
      p++
    }
    let v = primary()
    while (startsPrimary(peek()) && peek().t !== 'e') v = mul(v, primary())
    return sign === 1 ? v : mul(v, C(-1))
  }
  function power() {
    let v = primary()
    if (peek() && peek().t === '^') {
      p++
      const w = exponent()
      v = C(Math.pow(v.re, w.re))
    }
    return v
  }
  function unary() {
    if (peek() && peek().t === '-') { p++; return mul(C(-1), unary()) }
    if (peek() && peek().t === '+') { p++; return unary() }
    return power()
  }
  function term() {
    let v = unary()
    for (;;) {
      const tk = peek()
      if (tk && tk.t === '*') { p++; v = mul(v, unary()) }
      else if (tk && tk.t === '/') { p++; v = div(v, unary()) }
      else if (startsPrimary(tk)) v = mul(v, power())
      else break
    }
    return v
  }
  function expr() {
    let v = term()
    for (;;) {
      const tk = peek()
      if (tk && tk.t === '+') { p++; v = add(v, term()) }
      else if (tk && tk.t === '-') { p++; v = sub(v, term()) }
      else break
    }
    return v
  }
  function top() {
    let v = expr()
    if (peek() && peek().t === 'ang') {
      p++
      const a = expr()
      v = polar(v.re, a.re)
    }
    return v
  }

  const v = top()
  if (p !== toks.length) throw new Error('nadmiarowe znaki')
  if (!Number.isFinite(v.re) || !Number.isFinite(v.im)) throw new Error('nieskończoność')
  return kilo === 1 ? v : C(v.re * kilo, v.im * kilo)
}

export function safeParse(src) {
  try {
    return { ok: true, value: parseComplex(src) }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

export { abs, arg }
