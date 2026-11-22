import { useEffect, useState } from 'react'
import { LEARN, PRACTICE, byId } from './data/tasks.js'
import StepPlayer from './components/StepPlayer.jsx'
import Practice from './components/Practice.jsx'
import Gnome, { GnomeFigure } from './components/Gnome.jsx'
import Circuit from './components/Circuit.jsx'
import Cheatsheet from './components/Cheatsheet.jsx'
import { Rich } from './components/MathText.jsx'

const parseHash = () => {
  const h = (window.location.hash || '#/').slice(2).split('/')
  return { page: h[0] || '', id: h[1] }
}

const PKEY = 'trojfaza-postep-v1'
const loadProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(PKEY)) || {}
  } catch {
    return {}
  }
}

const STEPS = [
  ['Schemat', 'Czytamy dane, szukamy przewodu N, amperomierza i watomierza.'],
  ['Źródła', '$E_B = E_A e^{-j120^\\circ}$, $E_C = E_A e^{-j240^\\circ}$'],
  ['$U_N = 0$', 'Przewód N bez oporu (albo symetria) ⇒ $U = E$'],
  ['Impedancje', '$Z = |Z|\\,e^{j\\varphi}$: R → 0°, L → +90°, C → −90°'],
  ['Prądy', '$I = \\dfrac{U}{Z}$: moduły dzielimy, kąty odejmujemy'],
  ['$I_N$', '$I_N = I_A + I_B + I_C$ – dodajemy w postaci $x + jy$'],
  ['Amperomierz', 'Moduł prądu w jego przewodzie.'],
  ['Watomierz', '$P = |U|\\,|I|\\cos(\\varphi_U - \\varphi_I)$'],
]

function Home({ go, progress }) {
  const solved = PRACTICE.filter((t) => progress[t.id]).length
  return (
    <div className="home">
      <section className="hero card">
        <div className="hero-text">
          <div className="eyebrow">Elektrotechnika · kolokwium</div>
          <h1>Trójfaza gwiazda–gwiazda bez stresu</h1>
          <p>
            Generator i odbiornik w gwiazdę, przewód neutralny bez oporu (<Rich>U_N = 0</Rich>). Uczysz się jednego schematu
            rozwiązania, który działa w każdym zadaniu – z wykresem wskazowym, amperomierzem i watomierzem.
          </p>
          <div className="hero-btns">
            <button className="btn primary big" onClick={() => go('nauka')}>Ucz się z krasnalem ({LEARN.length} zadań)</button>
            <button className="btn big" onClick={() => go('cwiczenia')}>Sprawdź się ({PRACTICE.length} zadań) · {solved}/{PRACTICE.length}</button>
          </div>
        </div>
        <div className="hero-gnome">
          <Gnome
            text="Jestem Omek! Przeprowadzę Cię przez każdy krok. Na kolokwium zawsze idziemy tą samą drogą – poznasz ją w 10 zadaniach, a potem sprawdzisz się w 10 kolejnych. Będą też liczby ujemne – nie bój się minusów!"
            mood="happy"
            size={120}
          />
        </div>
      </section>

      <section>
        <h2 className="section-title">Schemat rozwiązania – zawsze ten sam</h2>
        <ol className="recipe">
          {STEPS.map(([t, d], k) => (
            <li key={t} className="card">
              <span className="recipe-n">{k}</span>
              <strong><Rich>{t}</Rich></strong>
              <span className="small"><Rich>{d}</Rich></span>
            </li>
          ))}
        </ol>
        <p className="muted small center"><Rich>{'Wykres wskazowy rysujemy równolegle: najpierw napięcia E, potem prądy, na końcu I_N i napięcie watomierza.'}</Rich></p>
      </section>

      <section className="two">
        <div className="card">
          <h3>Najtrudniejsze: watomierz</h3>
          <p className="small">
            Cewka prądowa mówi, <b>jaki prąd</b> bierzemy. Cewka napięciowa mówi, <b>jakie napięcie</b>: między przewodem a N to
            napięcie fazowe, między dwoma przewodami – międzyfazowe (<Rich>{'$U_{AB} = U_A - U_B$'}</Rich>, √3 razy większe). Kąt to
            różnica kątów napięcia i prądu.
          </p>
          <button className="btn small" onClick={() => go('sciaga')}>Zobacz ściągę →</button>
        </div>
        <div className="card">
          <h3>Kalkulator a „cos + j·sin”</h3>
          <p className="small">
            Na kolokwium możesz liczyć kalkulatorem w trybie liczb zespolonych. Rozpisywanie na cos i j·sin, jak na tablicy, zostawiamy
            jako ciekawostkę – znajdziesz ją w kroku z prądem <Rich>I_N</Rich>.
          </p>
        </div>
      </section>
    </div>
  )
}

function LearnList({ go }) {
  return (
    <div>
      <h2 className="section-title">Zadania z opracowaniem</h2>
      <p className="muted center">Każde zadanie krok po kroku: krasnal tłumaczy, wzory się liczą, a wykres rysuje się na bieżąco.</p>
      <div className="grid">
        {LEARN.map((t, k) => (
          <button key={t.id} className="card task-card" onClick={() => go('nauka', t.id)}>
            <div className="task-top">
              <span className="pill">{k + 1}</span>
              <span className="tag"><Rich>{t.tag}</Rich></span>
            </div>
            <h3><Rich>{t.title}</Rich></h3>
            <p className="small muted"><Rich>{t.intro}</Rich></p>
            <div className="mini-circuit"><Circuit task={t} /></div>
          </button>
        ))}
      </div>
    </div>
  )
}

function PracticeList({ go, progress, reset }) {
  return (
    <div>
      <h2 className="section-title">Zadania do samodzielnego rozwiązania</h2>
      <p className="muted center">
        Wpisz wyniki (liczby zespolone w dowolnej postaci). Krasnal powie, co jest nie tak – np. czy pomylił się kąt, czy moduł.
      </p>
      <div className="grid">
        {PRACTICE.map((t, k) => (
          <button key={t.id} className={'card task-card' + (progress[t.id] ? ' solved' : '')} onClick={() => go('cwiczenia', t.id)}>
            <div className="task-top">
              <span className="pill">{k + 1}</span>
              <span className="tag">{'★'.repeat(t.level)}{'☆'.repeat(3 - t.level)}</span>
              {progress[t.id] && <span className="tag ok">rozwiązane ✓</span>}
            </div>
            <h3><Rich>{t.title}</Rich></h3>
            <div className="mini-circuit"><Circuit task={t} /></div>
          </button>
        ))}
      </div>
      <p className="center">
        <button className="btn ghost small" onClick={reset}>Wyzeruj postęp</button>
      </p>
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState(parseHash)
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    const f = () => {
      setRoute(parseHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  const go = (page, id) => {
    window.location.hash = '#/' + page + (id ? '/' + id : '')
  }
  const save = (p) => {
    setProgress(p)
    try {
      localStorage.setItem(PKEY, JSON.stringify(p))
    } catch {
      /* brak dostępu do pamięci – trudno */
    }
  }

  const { page, id } = route
  let body
  if (page === 'nauka' && id && byId(id)) {
    body = <StepPlayer task={byId(id)} onExit={() => go('nauka')} />
  } else if (page === 'nauka') {
    body = <LearnList go={go} />
  } else if (page === 'cwiczenia' && id && byId(id)) {
    body = (
      <Practice
        key={id}
        task={byId(id)}
        onExit={() => go('cwiczenia')}
        onSolved={(tid) => save({ ...progress, [tid]: true })}
        onShowSolution={(tid) => go('rozw', tid)}
      />
    )
  } else if (page === 'cwiczenia') {
    body = <PracticeList go={go} progress={progress} reset={() => save({})} />
  } else if (page === 'rozw' && id && byId(id)) {
    body = <StepPlayer task={byId(id)} onExit={() => go('cwiczenia', id)} exitLabel="← Wróć do zadania" />
  } else if (page === 'sciaga') {
    body = <Cheatsheet />
  } else {
    body = <Home go={go} progress={progress} />
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => go('')}>
          <GnomeFigure size={30} mood="talk" />
          <span>Trójfaza<b>Y–Y</b></span>
        </button>
        <nav>
          <button className={page === 'nauka' ? 'on' : ''} onClick={() => go('nauka')}>Nauka</button>
          <button className={page === 'cwiczenia' || page === 'rozw' ? 'on' : ''} onClick={() => go('cwiczenia')}>Ćwiczenia</button>
          <button className={page === 'sciaga' ? 'on' : ''} onClick={() => go('sciaga')}>Ściąga</button>
        </nav>
      </header>
      <main>{body}</main>
      <footer className="muted small"><Rich>{'Układy trójfazowe: generator i odbiornik w gwiazdę, U_N = 0 · materiały do nauki do kolokwium'}</Rich></footer>
    </div>
  )
}
