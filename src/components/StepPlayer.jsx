import { useEffect, useMemo, useState } from 'react'
import Gnome from './Gnome.jsx'
import Circuit from './Circuit.jsx'
import Phasor from './Phasor.jsx'
import { Rich } from './MathText.jsx'
import { buildSteps } from '../lib/steps.jsx'

export default function StepPlayer({ task, onExit, exitLabel = '← Lista zadań' }) {
  const { steps } = useMemo(() => buildSteps(task), [task])
  const [i, setI] = useState(0)
  const [showCur, setShowCur] = useState(false)
  const st = steps[i]

  useEffect(() => {
    setI(0)
  }, [task])
  useEffect(() => setShowCur(false), [i])
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') setI((k) => Math.min(k + 1, steps.length - 1))
      if (e.key === 'ArrowLeft') setI((k) => Math.max(k - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [steps.length])

  return (
    <div className="player">
      <div className="player-head">
        <button className="btn ghost" onClick={onExit}>{exitLabel}</button>
        <div>
          <div className="eyebrow">{task.id.startsWith('L') ? 'Zadanie z opracowaniem' : 'Rozwiązanie zadania'} · {task.id}</div>
          <h2><Rich>{task.title}</Rich></h2>
        </div>
      </div>

      <ol className="dots" aria-label="Kroki">
        {steps.map((s, k) => (
          <li key={s.key}>
            <button
              className={k === i ? 'on' : k < i ? 'done' : ''}
              onClick={() => setI(k)}
              title={s.title.replace(/_/g, '')}
            >
              {k}
            </button>
          </li>
        ))}
      </ol>

      <div className="player-grid">
        <section className="card step-card">
          <Gnome text={st.gnome} mood={st.mood} />
          <h3><Rich>{st.title}</Rich></h3>
          <div className="formulas" key={st.key}>{st.content}</div>
          {st.trap && (
            <div className="trap">
              <strong>Uwaga, pułapka:</strong> <Rich>{st.trap}</Rich>
            </div>
          )}
          {st.curiosity && (
            <div className="curio">
              <button className="btn small" onClick={() => setShowCur((v) => !v)}>
                {showCur ? '▾' : '▸'} Ciekawostka: jak liczy prowadząca (cos + j·sin)
              </button>
              {showCur && <div className="curio-body">{st.curiosity}</div>}
            </div>
          )}
          <div className="nav">
            <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>← Wstecz</button>
            <span className="muted small">krok {i} / {steps.length - 1} · strzałki ← → na klawiaturze</span>
            {i < steps.length - 1 ? (
              <button className="btn primary" onClick={() => setI(i + 1)}>Dalej →</button>
            ) : (
              <button className="btn primary" onClick={onExit}>Koniec ✓</button>
            )}
          </div>
        </section>

        <aside className="side">
          <div className="card">
            <div className="card-title">Schemat</div>
            <Circuit task={task} highlight={st.highlight} />
          </div>
          <div className="card">
            <div className="card-title">Wykres wskazowy</div>
            {st.diagram.vectors.length ? (
              <Phasor vectors={st.diagram.vectors} arcs={st.diagram.arcs} />
            ) : (
              <p className="muted small empty-diagram">Wykres zaczniemy rysować w kroku 1 – od napięć źródeł.</p>
            )}
            <p className="legend small muted">Napięcia – długie strzałki, prądy – krótsze (inna skala). Najedź na strzałkę, żeby zobaczyć wartość.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
