import { useEffect, useMemo, useState } from 'react'
import { richUnits } from './MathText.jsx'

/**
 * Krasnal Omek – animowany przewodnik. Postać narysowana w SVG:
 * czerwona czapka z błyskawicą, okulary, broda, wskaźnik w ręku.
 * mood: 'talk' | 'think' | 'warn' | 'happy'
 */
export function GnomeFigure({ mood = 'talk', talking = false, size = 120 }) {
  const happy = mood === 'happy'
  const warn = mood === 'warn'
  const think = mood === 'think'
  return (
    <svg
      className={`gnome ${happy ? 'gnome-jump' : 'gnome-bob'}`}
      viewBox="0 0 120 150"
      width={size}
      height={size * 1.25}
      aria-label="Krasnal Omek"
      role="img"
    >
      <ellipse cx="60" cy="144" rx="30" ry="5" fill="rgba(0,0,0,.12)" />
      {/* buty */}
      <ellipse cx="46" cy="137" rx="11" ry="6" fill="#6b3f1d" />
      <ellipse cx="74" cy="137" rx="11" ry="6" fill="#6b3f1d" />
      {/* tunika */}
      <path d="M34 132 Q36 92 60 88 Q84 92 86 132 Z" fill="#2f7d4f" />
      <rect x="35" y="112" width="50" height="8" rx="3" fill="#5a3517" />
      <rect x="55" y="111" width="10" height="10" rx="2" fill="#f2c14e" stroke="#a87b12" strokeWidth="1.2" />
      {/* lewa ręka */}
      <path d="M38 100 Q28 110 32 122" stroke="#2f7d4f" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="123" r="5" fill="#f2c9a0" />
      {/* prawa ręka ze wskaźnikiem */}
      <g className={talking ? 'gnome-point' : ''} style={{ transformOrigin: '84px 100px' }}>
        <path d="M82 100 Q96 96 100 84" stroke="#2f7d4f" strokeWidth="9" fill="none" strokeLinecap="round" />
        <line x1="101" y1="83" x2="116" y2="52" stroke="#7a4a21" strokeWidth="3" strokeLinecap="round" />
        <circle cx="116" cy="51" r="3.2" fill="#f2c14e" />
        <circle cx="101" cy="83" r="5" fill="#f2c9a0" />
      </g>
      {/* twarz */}
      <circle cx="60" cy="62" r="21" fill="#f2c9a0" />
      <circle cx="47" cy="68" r="4.5" fill="#f4a3a3" opacity=".7" />
      <circle cx="73" cy="68" r="4.5" fill="#f4a3a3" opacity=".7" />
      {/* broda */}
      <path
        d="M38 66 Q36 96 60 108 Q84 96 82 66 Q76 80 60 80 Q44 80 38 66 Z"
        fill="#f7f7f2"
        stroke="#ddd"
        strokeWidth="1"
      />
      {/* usta */}
      <ellipse
        className={talking ? 'gnome-mouth talking' : 'gnome-mouth'}
        cx="60"
        cy="86"
        rx={happy ? 6 : 4.5}
        ry={happy ? 4 : 2.2}
        fill="#7a2e2e"
        style={{ transformOrigin: '60px 86px' }}
      />
      {/* wąsy */}
      <path d="M60 79 Q50 76 44 82 Q52 84 60 81 Q68 84 76 82 Q70 76 60 79 Z" fill="#ececec" />
      {/* nos */}
      <circle cx="60" cy="71" r="5.5" fill="#e79c7a" />
      {/* oczy */}
      {happy ? (
        <g stroke="#2b2b2b" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M48 61 Q52 57 56 61" />
          <path d="M64 61 Q68 57 72 61" />
        </g>
      ) : (
        <g className="gnome-eyes" style={{ transformOrigin: '60px 61px' }}>
          <circle cx="52" cy="61" r="2.6" fill="#2b2b2b" />
          <circle cx="68" cy="61" r="2.6" fill="#2b2b2b" />
        </g>
      )}
      {/* okulary */}
      <g stroke="#3b3b3b" strokeWidth="1.4" fill="rgba(255,255,255,.25)">
        <circle cx="52" cy="61" r="6.5" />
        <circle cx="68" cy="61" r="6.5" />
        <path d="M58.5 61 L61.5 61" />
      </g>
      {/* brwi */}
      <g stroke="#9a9a9a" strokeWidth="2.4" strokeLinecap="round">
        {warn ? (
          <>
            <path d="M45 51 L56 54" />
            <path d="M75 51 L64 54" />
          </>
        ) : think ? (
          <>
            <path d="M45 52 Q50 48 56 51" />
            <path d="M64 49 Q70 45 75 49" />
          </>
        ) : (
          <>
            <path d="M45 52 Q50 49 56 52" />
            <path d="M64 52 Q70 49 75 52" />
          </>
        )}
      </g>
      {/* czapka */}
      <path d="M36 54 Q40 30 58 14 Q66 6 78 2 Q72 14 76 26 Q82 40 84 54 Z" fill="#d6403a" />
      <path d="M33 52 Q60 44 87 52 Q88 58 86 60 Q60 52 34 60 Q32 56 33 52 Z" fill="#b52f2a" />
      <path d="M62 22 L56 34 L62 34 L58 44 L68 30 L62 30 L66 22 Z" fill="#f2c14e" />
      <circle cx="78" cy="2.5" r="4" fill="#f7f7f2" />
      {/* dymek nastroju */}
      {think && (
        <text x="96" y="22" fontSize="20" fontWeight="700" fill="#7c5cd6">?</text>
      )}
      {warn && (
        <text x="94" y="24" fontSize="22" fontWeight="800" fill="#d6403a">!</text>
      )}
      {happy && (
        <g fill="#f2c14e">
          <path d="M14 30 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" className="gnome-star" />
          <path d="M100 18 l2 5 5 1 -4 3 1 5 -4 -2 -4 2 1 -5 -4 -3 5 -1 z" className="gnome-star s2" />
        </g>
      )}
    </svg>
  )
}

/** Krasnal z dymkiem – tekst „pisze się” jak w rozmowie. Klik w dymek pokazuje całość. */
export default function Gnome({ text, mood = 'talk', size = 110, speed = 16, compact = false }) {
  const units = useMemo(() => richUnits(text || ''), [text])
  const [n, setN] = useState(0)

  useEffect(() => {
    setN(0)
    if (!units.length) return
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(units.length)
      return
    }
    const id = setInterval(() => {
      setN((k) => {
        if (k >= units.length) {
          clearInterval(id)
          return k
        }
        return k + 1
      })
    }, speed)
    return () => clearInterval(id)
  }, [units, speed])

  const talking = n < units.length
  return (
    <div className={`gnome-row ${compact ? 'compact' : ''}`}>
      <div className="gnome-figure">
        <GnomeFigure mood={mood} talking={talking} size={size} />
        <div className="gnome-name">Omek</div>
      </div>
      <div
        className={`bubble mood-${mood}`}
        onClick={() => setN(units.length)}
        title={talking ? 'Kliknij, żeby pokazać całość' : undefined}
      >
        <p>
          {units.slice(0, n).map((u, i) => (typeof u === 'string' ? u : <span key={i}>{u}</span>))}
          {talking && <span className="caret">▍</span>}
        </p>
      </div>
    </div>
  )
}
