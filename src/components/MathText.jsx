import { fmtNum, fmtDeg, abs, arg, niceRoot, clean } from '../lib/complex.js'

// Mini-znaczniki w tekstach:  I_A  U_{AB}  e^{j90°}  **pogrubienie**
const RE = /\*\*([^*]+)\*\*|([A-Za-zψφ])_\{([^}]+)\}|([A-Za-zψφ])_([A-Za-z0-9']+)|\^\{([^}]+)\}/g

/** Dzieli tekst na „jednostki” (znaki albo całe symbole) – przydatne do efektu pisania. */
export function richUnits(str) {
  const units = []
  let last = 0
  let m
  RE.lastIndex = 0
  while ((m = RE.exec(str))) {
    for (const ch of str.slice(last, m.index)) units.push(ch)
    if (m[1] !== undefined) units.push(<b key={'b' + m.index}>{m[1]}</b>)
    else if (m[2] !== undefined) units.push(<span key={m.index} className="sym">{m[2]}<sub>{m[3]}</sub></span>)
    else if (m[4] !== undefined) units.push(<span key={m.index} className="sym">{m[4]}<sub>{m[5]}</sub></span>)
    else units.push(<sup key={m.index}>{m[6]}</sup>)
    last = m.index + m[0].length
  }
  for (const ch of str.slice(last)) units.push(ch)
  return units
}

export function Rich({ children }) {
  if (typeof children !== 'string') return children
  const units = richUnits(children)
  // sklejamy sąsiednie znaki w jeden string
  const out = []
  let buf = ''
  units.forEach((u, i) => {
    if (typeof u === 'string') buf += u
    else {
      if (buf) out.push(buf)
      buf = ''
      out.push(<span key={'u' + i}>{u}</span>)
    }
  })
  if (buf) out.push(buf)
  return <>{out}</>
}

/** Symbol z indeksem: <S b="I" s="A" /> */
export const S = ({ b, s }) => (
  <span className="sym">
    {b}
    {s && <sub>{s}</sub>}
  </span>
)

/** e^{jφ} */
export const Exp = ({ deg }) => {
  const d = clean(deg)
  const sign = d < 0 ? '−' : ''
  return (
    <span className="exp">
      e<sup>{sign}j{fmtNum(Math.abs(d), { digits: 1 })}°</sup>
    </span>
  )
}

/** Postać wykładnicza: 10·e^{j150°} (kąt sprowadzony do (−180°,180°]). */
export function Pol({ z, mod, deg, root = false, unit }) {
  const m = mod !== undefined ? mod : abs(z)
  const a = deg !== undefined ? deg : arg(z)
  const r = root ? niceRoot(m) : null
  if (m < 1e-9) return <span className="num">0{unit && <> {unit}</>}</span>
  return (
    <span className="num">
      {fmtNum(m)}
      {r && <span className="root"> (={r})</span>}
      {Math.abs(clean(a)) > 1e-9 && <>·<Exp deg={a} /></>}
      {unit && <> {unit}</>}
    </span>
  )
}

/** Postać algebraiczna: −8,66 + j5 */
export function Alg({ z, unit }) {
  const re = clean(Math.round(z.re * 1e4) / 1e4)
  const im = clean(Math.round(z.im * 1e4) / 1e4)
  let s
  if (im === 0) s = fmtNum(re)
  else {
    const jpart = 'j' + fmtNum(Math.abs(im))
    if (re === 0) s = (im < 0 ? '−' : '') + jpart
    else s = fmtNum(re) + (im < 0 ? ' − ' : ' + ') + jpart
  }
  return (
    <span className="num">
      {s}
      {unit && <> {unit}</>}
    </span>
  )
}

export const Deg = ({ d }) => <span className="num">{fmtDeg(d)}</span>
export const N = ({ x, unit, digits }) => (
  <span className="num">
    {fmtNum(x, { digits })}
    {unit && <> {unit}</>}
  </span>
)

/** Wiersz równania */
export const Eq = ({ children, note }) => (
  <div className="eq">
    <div className="eq-body">{children}</div>
    {note && <div className="eq-note"><Rich>{note}</Rich></div>}
  </div>
)
