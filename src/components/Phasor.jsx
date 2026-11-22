import { abs, arg, add, RAD, fmtNum, fmtDeg } from '../lib/complex.js'

/**
 * Wykres wskazowy.
 * vectors: [{ id, z, kind: 'U'|'I', label, sub, color, dashed, from, width }]
 *   from – początek strzałki (w tych samych jednostkach co z), domyślnie 0.
 * arcs: [{ id, a1, a2, r, label, color }]  – kąty w stopniach
 * Napięcia i prądy mają osobne skale (jak na tablicy).
 */
export default function Phasor({ vectors = [], arcs = [], size = 380, caption }) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.4
  const reach = (v) => abs(add(v.from || { re: 0, im: 0 }, v.z))
  const maxU = Math.max(1e-9, ...vectors.filter((v) => v.kind === 'U').map((v) => Math.max(abs(v.z), reach(v))))
  const maxI = Math.max(1e-9, ...vectors.filter((v) => v.kind === 'I').map((v) => Math.max(abs(v.z), reach(v))))
  const hasU = vectors.some((v) => v.kind === 'U')
  const hasI = vectors.some((v) => v.kind === 'I')
  // Skale dobrane tak, by jedna działka siatki odpowiadała „okrągłej” wartości.
  const DIV = 6 // liczba działek na promieniu R
  const d = R / DIV
  const stepU = niceStep(maxU / DIV)
  const stepI = niceStep(maxI / (DIV * (hasU ? 0.8 : 1)))
  const sU = d / stepU
  const sI = d / stepI
  const sc = (kind) => (kind === 'U' ? sU : sI)
  const P = (z, kind) => [cx + z.re * sc(kind), cy - z.im * sc(kind)]
  const nGrid = Math.floor((size / 2 - 6) / d)
  const gridLines = []
  for (let k = -nGrid; k <= nGrid; k++) {
    if (k === 0) continue
    gridLines.push(<line key={'v' + k} x1={cx + k * d} y1={4} x2={cx + k * d} y2={size - 4} className="ph-grid" />)
    gridLines.push(<line key={'h' + k} x1={4} y1={cy + k * d} x2={size - 4} y2={cy + k * d} className="ph-grid" />)
  }

  return (
    <figure className="phasor">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Wykres wskazowy">
        {gridLines}
        {Array.from({ length: 2 * nGrid + 1 }, (_, k) => k - nGrid).map((k) =>
          k ? (
            <g key={'t' + k} className="ph-tick">
              <line x1={cx + k * d} y1={cy - 3} x2={cx + k * d} y2={cy + 3} />
              <line x1={cx - 3} y1={cy - k * d} x2={cx + 3} y2={cy - k * d} />
            </g>
          ) : null,
        )}
        <line x1={8} y1={cy} x2={size - 8} y2={cy} className="ph-axis" />
        <line x1={cx} y1={size - 8} x2={cx} y2={8} className="ph-axis" />
        <path d={`M${size - 8} ${cy} l-8 -4 v8 z`} className="ph-axis-head" />
        <path d={`M${cx} 8 l-4 8 h8 z`} className="ph-axis-head" />
        <text x={size - 12} y={cy + 16} className="ph-axis-t" textAnchor="end">+1</text>
        <text x={cx + 8} y={18} className="ph-axis-t">+j</text>

        {arcs.map((a) => {
          const r = a.r || R * 0.55
          let d1 = a.a1
          let d2 = a.a2
          let diff = ((d2 - d1) % 360 + 540) % 360 - 180
          d2 = d1 + diff
          const x1 = cx + r * Math.cos(d1 * RAD)
          const y1 = cy - r * Math.sin(d1 * RAD)
          const x2 = cx + r * Math.cos(d2 * RAD)
          const y2 = cy - r * Math.sin(d2 * RAD)
          const sweep = diff > 0 ? 0 : 1
          const mid = (d1 + d2) / 2
          return (
            <g key={a.id} className="ph-arc anim-fade" style={{ '--c': a.color || 'var(--accent)' }}>
              <path d={`M${x1} ${y1} A${r} ${r} 0 0 ${sweep} ${x2} ${y2}`} fill="none" />
              <text
                x={cx + (r * 0.55) * Math.cos(mid * RAD)}
                y={cy - (r * 0.55) * Math.sin(mid * RAD) + 5}
                textAnchor="middle"
              >
                {a.label}
              </text>
            </g>
          )
        })}

        {vectors.map((v) => {
          const f = v.from || { re: 0, im: 0 }
          const [x0, y0] = P(f, v.kind)
          const [x1, y1] = P(add(f, v.z), v.kind)
          const len = Math.hypot(x1 - x0, y1 - y0)
          if (len < 0.5) return null
          const ang = Math.atan2(y1 - y0, x1 - x0)
          const h = v.kind === 'U' ? 11 : 9
          const ax = x1 - h * Math.cos(ang)
          const ay = y1 - h * Math.sin(ang)
          const px = Math.sin(ang) * h * 0.45
          const py = -Math.cos(ang) * h * 0.45
          const lx = x1 + 14 * Math.cos(ang)
          const ly = y1 + 14 * Math.sin(ang)
          const w = v.width || (v.kind === 'U' ? 2.6 : 2)
          const tip = `${fmtNum(abs(v.z))}·e^(j${fmtDeg(arg(v.z))})`
          return (
            <g key={v.id} className="ph-vec" style={{ '--c': v.color }}>
              <title>{`${v.label}${v.sub || ''} = ${tip}`}</title>
              <line
                x1={x0}
                y1={y0}
                x2={ax}
                y2={ay}
                strokeWidth={w}
                strokeDasharray={v.dashed ? '6 5' : undefined}
                className={v.dashed ? 'anim-fade' : 'anim-draw'}
                style={{ '--len': len }}
              />
              <path
                d={`M${x1} ${y1} L${ax + px} ${ay + py} L${ax - px} ${ay - py} Z`}
                className="ph-head anim-fade-late"
              />
              {v.label && (
                <text x={lx} y={ly + 4} textAnchor="middle" className="ph-label anim-fade-late">
                  {v.label}
                  <tspan dy="4" fontSize="0.72em">{v.sub}</tspan>
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <figcaption className="ph-scale">
        Skala (1 kratka): {hasU && <span>napięcia <b>{fmtNum(stepU)} V</b></span>}
        {hasU && hasI && ' · '}
        {hasI && <span>prądy <b>{fmtNum(stepI)} A</b></span>}
        {caption && <div>{caption}</div>}
      </figcaption>
    </figure>
  )
}

/** Najbliższy „okrągły” krok ≥ x: 1, 2, 2,5, 5 × 10^n */
function niceStep(x) {
  if (!(x > 0)) return 1
  const p = Math.pow(10, Math.floor(Math.log10(x)))
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= x - 1e-12) return m * p
  return 10 * p
}

export const PHASE_COLOR = { A: 'var(--ph-a)', B: 'var(--ph-b)', C: 'var(--ph-c)', N: 'var(--ph-n)', W: 'var(--ph-w)' }
