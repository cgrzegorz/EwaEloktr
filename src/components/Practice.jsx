import { useMemo, useState } from 'react'
import Gnome from './Gnome.jsx'
import Circuit from './Circuit.jsx'
import Phasor, { PHASE_COLOR } from './Phasor.jsx'
import { Rich, Pol } from './MathText.jsx'
import { practiceFields, checkField } from '../lib/check.js'
import { PH, wattVoltName } from '../lib/solver.js'

const where = (x) => (x === 'N' ? 'w przewodzie neutralnym' : `w przewodzie fazy ${x}`)

export default function Practice({ task, onExit, onSolved, onShowSolution }) {
  const { fields, sol } = useMemo(() => practiceFields(task), [task])
  const [vals, setVals] = useState({})
  const [res, setRes] = useState({})
  const [hintFor, setHintFor] = useState(null)
  const [gnome, setGnome] = useState({
    text: 'Twoja kolej! Wpisuj wyniki w dowolnej postaci: 10e^j150, 10∠150 albo −8,66+j5. Kąty w stopniach. Kalkulator w trybie CMPLX jest Twoim przyjacielem.',
    mood: 'talk',
  })

  const allOk = fields.every((f) => res[f.key]?.status === 'ok')

  const check = () => {
    const r = {}
    let ok = 0
    let firstBad = null
    for (const f of fields) {
      r[f.key] = checkField(f, vals[f.key], task, sol)
      if (r[f.key].status === 'ok') ok++
      else if (!firstBad && r[f.key].status !== 'empty') firstBad = { f, r: r[f.key] }
    }
    setRes(r)
    if (ok === fields.length) {
      setGnome({ text: 'Wszystko się zgadza! Brawo! Spójrz jeszcze na wykres wskazowy poniżej – tak powinien wyglądać Twój rysunek.', mood: 'happy' })
      onSolved(task.id)
    } else if (firstBad) {
      setGnome({ text: `${firstBad.f.label}: ${firstBad.r.msg}`, mood: 'warn' })
    } else {
      setGnome({ text: `Masz ${ok} z ${fields.length}. Uzupełnij resztę – idziemy po kolei, jak w schemacie.`, mood: 'think' })
    }
  }

  const askHint = (f) => {
    setHintFor(f.key)
    setGnome({ text: `${f.label}: ${f.hint}`, mood: 'think' })
  }

  const vn = wattVoltName(task.watt)

  return (
    <div className="player">
      <div className="player-head">
        <button className="btn ghost" onClick={onExit}>← Lista zadań</button>
        <div>
          <div className="eyebrow">Zadanie do samodzielnego rozwiązania · {task.id}</div>
          <h2><Rich>{task.title}</Rich></h2>
        </div>
      </div>

      <div className="player-grid">
        <section className="card step-card">
          <Gnome text={gnome.text} mood={gnome.mood} />
          <div className="task-text">
            <p>
              Dla podanego obwodu oblicz rozpływ prądów, wskazania przyrządów i narysuj wykres wskazowy.{' '}
              <Rich>{task.EAtext}</Rich>,{' '}
              {PH.map((p, k) => (
                <span key={p}>
                  {k ? ', ' : ''}faza {p}: <Rich>{task.Ztext[p]}</Rich>
                </span>
              ))}
              . {task.neutral ? 'Przewód neutralny bez impedancji.' : 'Brak przewodu neutralnego.'} Amperomierz {where(task.ammeter)}. Watomierz:
              prąd <Rich>{`I_${task.watt.i}`}</Rich>, napięcie <Rich>{task.watt.u[1] === 'N' ? `U_${vn}` : `U_{${vn}}`}</Rich>.
            </p>
          </div>

          <div className="fields">
            {fields.map((f) => {
              const r = res[f.key]
              const st = r?.status
              return (
                <div key={f.key} className={`field ${st || ''} ${hintFor === f.key ? 'hinted' : ''}`}>
                  <label htmlFor={'f-' + f.key}>
                    <Rich>{f.label}</Rich> <span className="muted">[{f.unit}]</span>
                  </label>
                  <div className="field-row">
                    <input
                      id={'f-' + f.key}
                      value={vals[f.key] || ''}
                      placeholder={f.type === 'c' ? 'np. 10e^j150' : 'np. 3300'}
                      onChange={(e) => {
                        setVals({ ...vals, [f.key]: e.target.value })
                        if (r) setRes({ ...res, [f.key]: undefined })
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && check()}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button className="btn small hint-btn" onClick={() => askHint(f)} title="Podpowiedź krasnala">💡</button>
                    <span className="mark">{st === 'ok' ? '✓' : st === 'bad' || st === 'parse' ? '✗' : ''}</span>
                  </div>
                  {r && r.status !== 'ok' && r.msg && <div className="field-msg"><Rich>{r.msg}</Rich></div>}
                </div>
              )
            })}
          </div>

          <div className="nav">
            <button className="btn" onClick={() => onShowSolution(task.id)}>Pokaż rozwiązanie krok po kroku</button>
            <button className="btn primary" onClick={check}>Sprawdź</button>
          </div>
        </section>

        <aside className="side">
          <div className="card">
            <div className="card-title">Schemat</div>
            <Circuit task={task} highlight={allOk ? [] : ['amm', 'watt']} />
          </div>
          <div className="card">
            <div className="card-title">Wykres wskazowy</div>
            {allOk ? (
              <Phasor
                vectors={[
                  ...PH.map((p) => ({ id: 'E' + p, z: sol.E[p], kind: 'U', label: 'E,U', sub: p, color: PHASE_COLOR[p] })),
                  ...PH.map((p) => ({ id: 'I' + p, z: sol.I[p], kind: 'I', label: 'I', sub: p, color: PHASE_COLOR[p], width: 2.2 })),
                  ...(Math.hypot(sol.IN.re, sol.IN.im) > 1e-6
                    ? [{ id: 'IN', z: sol.IN, kind: 'I', label: 'I', sub: 'N', color: PHASE_COLOR.N, width: 2.8 }]
                    : []),
                ]}
              />
            ) : (
              <div className="locked">
                <p>🔒 Wykres odblokuje się, gdy wszystkie wyniki będą poprawne.</p>
                <p className="small muted">
                  Narysuj go najpierw sam na kartce: E<sub>A</sub> = <Pol z={sol.E.A} unit="V" /> – od niego zaczynasz.
                </p>
              </div>
            )}
          </div>
          <div className="card help">
            <div className="card-title">Jak wpisywać</div>
            <ul className="small">
              <li><code>10e^j150</code>, <code>10e^(-j120)</code>, <code>10·e^&#123;j90&#125;</code></li>
              <li><code>10∠150</code> lub <code>10&lt;150</code></li>
              <li><code>-8,66+j5</code>, <code>j220</code>, <code>-j10</code></li>
              <li><code>10√2e^j45</code>, <code>220√3</code>, <code>9,46kW</code></li>
            </ul>
            <p className="small muted">Tolerancja ok. 2,5% – zaokrąglenia są w porządku.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
