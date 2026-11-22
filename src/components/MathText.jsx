import katex from 'katex'
import 'katex/dist/katex.min.css'

const cache = new Map()
function render(tex, display) {
  const k = (display ? 'D' : 'I') + tex
  if (!cache.has(k)) {
    cache.set(
      k,
      katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false, output: 'html' }),
    )
  }
  return cache.get(k)
}

/** Wzór LaTeX składany przez KaTeX. */
export function Tex({ children, tex, display = false, className = '' }) {
  const src = tex !== undefined ? tex : children
  return (
    <span
      className={'tex ' + className}
      dangerouslySetInnerHTML={{ __html: render(String(src), display) }}
    />
  )
}

// Znaczniki w zwykłych tekstach:
//   $…$          – dowolny wzór LaTeX
//   I_A, U_{AB}  – symbol z indeksem (składany przez KaTeX)
//   e^{j90°}     – wykładnik
//   **tekst**    – pogrubienie
const RE = /\$([^$]+)\$|\*\*([^*]+)\*\*|([A-Za-zψφ])_\{([^}]+)\}|([A-Za-zψφ])_([A-Za-z0-9']+)|e\^\{([^}]+)\}/g

const symTex = (b, s) => {
  const base = b === 'ψ' ? '\\psi' : b === 'φ' ? '\\varphi' : b
  const sub = s.replace(/'/g, '^{\\prime}')
  return `${base}_{${/^[A-Z0-9]+$/.test(s) ? `\\mathrm{${sub}}` : sub}}`
}

/** Dzieli tekst na „jednostki” (znaki albo całe wzory) – do efektu pisania w dymku. */
export function richUnits(str) {
  const units = []
  let last = 0
  let m
  RE.lastIndex = 0
  while ((m = RE.exec(str))) {
    for (const ch of str.slice(last, m.index)) units.push(ch)
    const k = 'r' + m.index
    if (m[1] !== undefined) units.push(<Tex key={k}>{m[1]}</Tex>)
    else if (m[2] !== undefined) units.push(<b key={k}>{m[2]}</b>)
    else if (m[3] !== undefined) units.push(<Tex key={k}>{symTex(m[3], m[4])}</Tex>)
    else if (m[5] !== undefined) units.push(<Tex key={k}>{symTex(m[5], m[6])}</Tex>)
    else units.push(<Tex key={k}>{`e^{${m[7].replace(/°/g, '^\\circ').replace(/−/g, '-')}}`}</Tex>)
    last = m.index + m[0].length
  }
  for (const ch of str.slice(last)) units.push(ch)
  return units
}

export function Rich({ children }) {
  if (typeof children !== 'string') return children
  const out = []
  let buf = ''
  richUnits(children).forEach((u, i) => {
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

/** Wiersz równania (wzór wyświetlany) z opcjonalnym komentarzem. */
export const Eq = ({ tex, children, note }) => (
  <div className="eq">
    <div className="eq-body">{tex !== undefined ? <Tex display tex={tex} /> : children}</div>
    {note && (
      <div className="eq-note">
        <Rich>{note}</Rich>
      </div>
    )}
  </div>
)
