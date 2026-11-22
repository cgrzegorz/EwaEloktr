import { zKind } from '../lib/solver.js'

const Y = { A: 60, B: 140, C: 220, N: 290 }
const X0 = 40 // szyna punktu N (generator)
const XS = 92 // źródła
const XAMM = 180
const XW = 290
const XI = 405
const XZ = 520 // środek elementu
const X1 = 640 // szyna punktu N' (odbiornik)

const Sub = ({ x, y, b, s, cls = '', anchor = 'middle' }) => (
  <text x={x} y={y} className={'c-label ' + cls} textAnchor={anchor}>
    {b}
    <tspan dy="4" fontSize="0.72em">{s}</tspan>
  </text>
)

function Element({ y, kind, phase, hl }) {
  const cls = hl ? 'c-el hl' : 'c-el'
  const x0 = XZ - 26
  const x1 = XZ + 26
  let shape
  if (kind === 'L') {
    let d = `M${x0} ${y}`
    for (let k = 0; k < 4; k++) d += ` a6.5 8 0 0 1 13 0`
    shape = <path d={d} className={cls} fill="none" />
  } else if (kind === 'C') {
    shape = (
      <g className={cls}>
        <line x1={x0} y1={y} x2={XZ - 4} y2={y} />
        <line x1={XZ + 4} y1={y} x2={x1} y2={y} />
        <line x1={XZ - 4} y1={y - 12} x2={XZ - 4} y2={y + 12} strokeWidth="3" />
        <line x1={XZ + 4} y1={y - 12} x2={XZ + 4} y2={y + 12} strokeWidth="3" />
      </g>
    )
  } else {
    shape = <rect x={x0} y={y - 9} width={52} height={18} className={cls} fill="var(--paper)" />
  }
  const name = kind === 'Z' ? 'Z' : kind
  return (
    <g>
      {kind === 'L' || kind === 'C' ? (
        <rect x={x0 - 2} y={y - 14} width={56} height={28} fill="var(--paper)" stroke="none" />
      ) : null}
      {shape}
      <Sub x={XZ} y={y + 27} b={name} s={kind === 'Z' ? phase : ''} />
      {/* strzałka napięcia odbiornika */}
      <g className="c-uarrow">
        <line x1={XZ + 24} y1={y - 19} x2={XZ - 22} y2={y - 19} />
        <path d={`M${XZ - 24} ${y - 19} l7 -3.5 v7 z`} />
      </g>
      <Sub x={XZ + 34} y={y - 15} b="U" s={phase} anchor="start" cls="small" />
    </g>
  )
}

function Source({ y, phase, hl }) {
  return (
    <g className={hl ? 'hl' : ''}>
      <circle cx={XS} cy={y} r={15} className="c-src" />
      <line x1={XS - 8} y1={y} x2={XS + 6} y2={y} className="c-wire" />
      <path d={`M${XS + 9} ${y} l-6 -4 v8 z`} className="c-fill" />
      <Sub x={XS} y={y - 22} b="E" s={phase} />
    </g>
  )
}

function CurrentArrow({ x, y, label, sub, left = false, hl }) {
  const d = left ? `M${x - 6} ${y} l9 -4.5 v9 z` : `M${x + 6} ${y} l-9 -4.5 v9 z`
  return (
    <g className={hl ? 'hl' : ''}>
      <path d={d} className="c-fill" />
      <Sub x={x} y={y + (left ? 18 : -9)} b={label} s={sub} cls="small" />
    </g>
  )
}

/** Mostek nad przewodem przy pionowym przewodzie watomierza. */
function verticalLead(x, y0, y1, crossings) {
  const dir = y1 > y0 ? 1 : -1
  let d = `M${x} ${y0}`
  const cs = crossings.filter((yc) => (yc - y0) * dir > 0 && (y1 - yc) * dir > 0).sort((a, b) => (a - b) * dir)
  for (const yc of cs) {
    d += ` L${x} ${yc - 7 * dir} A7 7 0 0 ${dir > 0 ? 1 : 0} ${x} ${yc + 7 * dir}`
  }
  d += ` L${x} ${y1}`
  return d
}

export default function Circuit({ task, highlight = [] }) {
  const hl = (k) => highlight.includes(k)
  const { ammeter, watt, neutral } = task
  const wy = Y[watt.i]
  const ty = watt.u[1] === 'N' ? (neutral ? Y.N : Y.C + 40) : Y[watt.u[1]]
  const wFrom = Y[watt.u[0]]
  // jeśli napięcie nie zaczyna się w przewodzie prądu (np. I_A, U_BC) – rysujemy dwa przewody napięciowe
  const lines = [Y.A, Y.B, Y.C]
  const lead2 = watt.u[0] !== watt.i

  return (
    <svg viewBox="0 0 700 330" className="circuit" role="img" aria-label="Schemat obwodu">
      {/* szyna N i N' */}
      <line x1={X0} y1={Y.A} x2={X0} y2={neutral ? Y.N : Y.C} className="c-wire" />
      <line x1={X1} y1={Y.A} x2={X1} y2={neutral ? Y.N : Y.C} className="c-wire" />
      <circle cx={X0} cy={Y.B} r={4} className="c-fill" />
      <circle cx={X1} cy={Y.B} r={4} className="c-fill" />
      <text x={X0 - 14} y={Y.B + 5} className="c-label" textAnchor="middle">N</text>
      <text x={X1 + 16} y={Y.B + 5} className="c-label" textAnchor="middle">N&apos;</text>

      {/* przewody fazowe */}
      {['A', 'B', 'C'].map((p) => (
        <g key={p}>
          <line x1={X0} y1={Y[p]} x2={X1} y2={Y[p]} className={'c-wire' + (hl('I' + p) ? ' hl' : '')} />
          <text x={X0 + 18} y={Y[p] - 6} className="c-phase">{p}</text>
        </g>
      ))}

      {/* przewód neutralny */}
      {neutral && (
        <g className={hl('N') ? 'hl' : ''}>
          <line x1={X0} y1={Y.N} x2={X1} y2={Y.N} className="c-wire" />
          <CurrentArrow x={XI + 60} y={Y.N} label="I" sub="N" left hl={hl('N')} />
        </g>
      )}

      {['A', 'B', 'C'].map((p) => (
        <Source key={p} y={Y[p]} phase={p} hl={hl('E')} />
      ))}

      {['A', 'B', 'C'].map((p) => (
        <CurrentArrow key={p} x={XI} y={Y[p]} label="I" sub={p} hl={hl('I') || hl('I' + p)} />
      ))}

      {['A', 'B', 'C'].map((p) => (
        <Element key={p} y={Y[p]} kind={zKind(task.Z[p])} phase={p} hl={hl('Z')} />
      ))}

      {/* amperomierz */}
      <g className={'meter' + (hl('amm') ? ' hl' : '')}>
        <circle cx={XAMM} cy={Y[ammeter]} r={14} className="c-meter" />
        <text x={XAMM} y={Y[ammeter] + 5} textAnchor="middle" className="c-meter-t">A</text>
      </g>

      {/* watomierz */}
      <g className={'meter' + (hl('watt') ? ' hl' : '')}>
        {lead2 ? (
          <>
            <path d={verticalLead(XW - 9, wFrom < wy ? wy - 17 : wy + 17, wFrom, lines)} className="c-lead" fill="none" />
            <circle cx={XW - 9} cy={wFrom} r={3.5} className="c-fill" />
            <path d={verticalLead(XW + 9, ty < wy ? wy - 17 : wy + 17, ty, lines)} className="c-lead" fill="none" />
            <circle cx={XW + 9} cy={ty} r={3.5} className="c-fill" />
          </>
        ) : (
          <>
            <path d={verticalLead(XW, ty < wy ? wy - 17 : wy + 17, ty, lines)} className="c-lead" fill="none" />
            <circle cx={XW} cy={ty} r={3.5} className="c-fill" />
          </>
        )}
        <rect x={XW - 17} y={wy - 17} width={34} height={34} rx={6} className="c-meter" />
        <text x={XW} y={wy + 6} textAnchor="middle" className="c-meter-t">W</text>
        <text x={XW - 21} y={wy - 9} className="c-star">*</text>
        <text x={XW - 4} y={wy - 21} className="c-star">*</text>
      </g>
    </svg>
  )
}
