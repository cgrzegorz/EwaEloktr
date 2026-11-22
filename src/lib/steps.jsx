import { solve, zKind, PH, wattVoltName } from './solver.js'
import { abs, arg, normDeg, fmtNum, fmtDeg, RAD, C, niceRoot } from './complex.js'
import { S, Pol, Alg, Deg, N, Eq, Exp, Rich } from '../components/MathText.jsx'
import { PHASE_COLOR } from '../components/Phasor.jsx'

const where = (x) => (x === 'N' ? 'przewodzie neutralnym' : `przewodzie fazy ${x}`)
const isForward = (a, b) => ['AB', 'BC', 'CA'].includes(a + b)

/* ---------- wektory do wykresu ---------- */
const vE = (s, p, withU = true) => ({
  id: 'E' + p,
  z: s.E[p],
  kind: 'U',
  label: withU ? `E${p}=U` : 'E',
  sub: withU ? p : p,
  color: PHASE_COLOR[p],
})
const vEs = (s, withU) =>
  PH.map((p) => ({ ...vE(s, p, withU), label: withU ? 'E,U' : 'E', sub: p }))
const vIs = (s) => PH.map((p) => ({ id: 'I' + p, z: s.I[p], kind: 'I', label: 'I', sub: p, color: PHASE_COLOR[p], width: 2.2 }))

function nDegTerm(a, b, op) {
  // zapis „j(90 − 45)” z liczbami
  const f = (x) => fmtNum(x, { digits: 1 })
  const bb = op === '-' ? (b < 0 ? `+ ${f(-b)}` : `− ${f(b)}`) : b < 0 ? `− ${f(-b)}` : `+ ${f(b)}`
  return `${f(a)} ${bb}`
}

/** Krok: zamiana na postać algebraiczną cos/sin (ciekawostka). */
function CosSin({ name, sub, z }) {
  const m = abs(z)
  const a = arg(z)
  const c = Math.cos(a * RAD)
  const sn = Math.sin(a * RAD)
  return (
    <Eq>
      <S b={name} s={sub} /> = {fmtNum(m)}(cos {fmtDeg(a)} + j·sin {fmtDeg(a)}) = {fmtNum(m)}({fmtNum(c, { digits: 3 })}{' '}
      {sn < 0 ? '−' : '+'} j{fmtNum(Math.abs(sn), { digits: 3 })}) = <Alg z={z} />
    </Eq>
  )
}

export function buildSteps(task) {
  const s = solve(task)
  const w = task.watt
  const vn = wattVoltName(w)
  const vSub = vn
  const steps = []
  const EAang = task.EA.ang
  const Emod = task.EA.mod

  /* 0. Czytamy schemat */
  steps.push({
    key: 'read',
    title: 'Czytamy schemat i dane',
    mood: 'talk',
    highlight: ['amm', 'watt'],
    gnome:
      `Cześć! Zaczynamy zawsze tak samo: czytamy schemat jak mapę. Generator i odbiornik są połączone w gwiazdę (punkty N i N'). ` +
      (task.neutral
        ? `Punkty N i N' łączy przewód neutralny bez oporu – to klucz do całego zadania. `
        : `Przewodu neutralnego nie ma, ale wszystkie trzy impedancje są jednakowe. `) +
      `Amperomierz siedzi w ${where(task.ammeter)}. Watomierz: cewka prądowa w przewodzie ${w.i} (mierzy I_${w.i}), cewka napięciowa ` +
      (w.u[1] === 'N' ? `między przewodem ${w.u[0]} a punktem N (mierzy U_${w.u[0]}).` : `między przewodami ${w.u[0]} i ${w.u[1]} (mierzy U_{${vn}}).`),
    content: (
      <>
        <h4>Dane</h4>
        <ul className="data">
          <li><Rich>{task.EAtext}</Rich></li>
          {PH.map((p) => (
            <li key={p}>
              faza {p}: <Rich>{task.Ztext[p]}</Rich>
            </li>
          ))}
        </ul>
        <h4>Szukamy</h4>
        <ul className="data">
          <li>prądów <S b="I" s="A" />, <S b="I" s="B" />, <S b="I" s="C" /> {task.neutral && <>i <S b="I" s="N" /></>}</li>
          <li>wskazania amperomierza i watomierza</li>
          <li>wykresu wskazowego (rysujemy go równolegle z obliczeniami)</li>
        </ul>
      </>
    ),
    diagram: { vectors: [], arcs: [] },
  })

  /* 1. Napięcia źródeł */
  const EAgivenJ = /j/.test(task.EAtext) && !/e\^/.test(task.EAtext)
  steps.push({
    key: 'E',
    title: 'Krok 1. Napięcia źródeł',
    mood: 'talk',
    highlight: ['E'],
    gnome:
      (EAgivenJ ? `Najpierw tłumaczymy dane: ${task.EAtext.replace('E_A = ', '')} to ${Emod} V pod kątem ${fmtNum(EAang)}° (j to obrót o 90°). ` : '') +
      `Dostajemy tylko E_A. Źródła B i C mają tę samą wartość ${Emod} V, tylko są obrócone: od kąta E_A odejmujemy 120° (faza B) i 240° (faza C). Kąty odejmujemy, bo B i C „spóźniają się” za A.`,
    trap: `−240° i +120° to ten sam kierunek (różnią się o pełny obrót 360°). Prowadząca często pisze E_C = …·e^{j120°}.`,
    content: (
      <>
        <Eq>
          <S b="E" s="A" /> = <Pol mod={Emod} deg={EAang} unit="V" />
        </Eq>
        <Eq>
          <S b="E" s="B" /> = {Emod}·e<sup>j({nDegTerm(EAang, 120, '-')})°</sup> = <Pol z={s.E.B} unit="V" />
        </Eq>
        <Eq>
          <S b="E" s="C" /> = {Emod}·e<sup>j({nDegTerm(EAang, 240, '-')})°</sup> = <Pol z={s.E.C} unit="V" />
        </Eq>
      </>
    ),
    diagram: { vectors: vEs(s, false), arcs: [] },
  })

  /* 2. U_N = 0 */
  steps.push({
    key: 'UN',
    title: 'Krok 2. Napięcie U_N = 0',
    mood: 'think',
    highlight: task.neutral ? ['N'] : ['Z'],
    gnome: task.neutral
      ? `Przewód neutralny bez oporu łączy N i N' – elektrycznie to ten sam punkt, więc napięcie między nimi U_N = 0. Każda faza odbiornika dostaje dokładnie napięcie swojego źródła: U = E − U_N = E. To ogromne ułatwienie – każda faza to osobny, prosty obwód!`
      : `Nie ma przewodu neutralnego, ale odbiornik jest symetryczny (trzy identyczne Z). Prądy będą tej samej wielkości, przesunięte o 120°, i same zsumują się do zera. Nic nie „ciągnie” punktu N', więc U_N = 0.`,
    content: (
      <>
        <Eq note={task.neutral ? 'przewód neutralny bez impedancji' : 'odbiornik symetryczny'}>
          <S b="U" s="N" /> = 0
        </Eq>
        {PH.map((p) => (
          <Eq key={p}>
            <S b="U" s={p} /> = <S b="E" s={p} /> − <S b="U" s="N" /> = <S b="E" s={p} /> = <Pol z={s.U[p]} unit="V" />
          </Eq>
        ))}
      </>
    ),
    diagram: { vectors: vEs(s, true), arcs: [] },
  })

  /* 3. Impedancje */
  const zLine = (p) => {
    const z = s.Z[p]
    const k = zKind(z)
    const m = abs(z)
    const a = arg(z)
    if (k === 'R') return <Eq key={p}><S b="Z" s={p} /> = R = {fmtNum(m)} Ω <span className="muted">(kąt 0°)</span></Eq>
    if (k === 'L') return <Eq key={p}><S b="Z" s={p} /> = jX<sub>L</sub> = j{fmtNum(m)} = <Pol mod={m} deg={90} unit="Ω" /></Eq>
    if (k === 'C') return <Eq key={p}><S b="Z" s={p} /> = −jX<sub>C</sub> = −j{fmtNum(m)} = <Pol mod={m} deg={-90} unit="Ω" /></Eq>
    const r = niceRoot(m)
    return (
      <Eq key={p} note={`φ = arctg(${fmtNum(z.im)} / ${fmtNum(z.re)}) = ${fmtDeg(a)}`}>
        <S b="Z" s={p} /> = <Alg z={z} /> ⇒ |<S b="Z" s={p} />| = √({fmtNum(z.re)}² + {fmtNum(z.im)}²) = {fmtNum(m)}
        {r && <span className="root"> (={r})</span>} ⇒ <S b="Z" s={p} /> = <Pol mod={m} deg={a} unit="Ω" />
      </Eq>
    )
  }
  steps.push({
    key: 'Z',
    title: 'Krok 3. Impedancje w postaci wykładniczej',
    mood: 'talk',
    highlight: ['Z'],
    gnome:
      `Prąd policzymy z prawa Ohma, czyli dzieleniem. Dzielić najwygodniej w postaci wykładniczej, więc każdą impedancję zamieniamy na moduł i kąt. Rezystor ma kąt 0°, cewka +90°, kondensator −90°. Dla Z = x + jy: moduł √(x² + y²), kąt arctg(y/x). Kalkulator w trybie CMPLX robi to jednym przyciskiem.`,
    trap: `Kąt z arctg sprawdzaj z rysunkiem: jeśli część rzeczywista jest ujemna, do wyniku arctg trzeba dodać 180°.`,
    content: s.sym ? (
      <>
        <p className="muted small">Odbiornik symetryczny – wystarczy policzyć raz:</p>
        {zLine('A')}
      </>
    ) : (
      <>{PH.map(zLine)}</>
    ),
    diagram: { vectors: vEs(s, true), arcs: [] },
  })

  /* 4. Prądy */
  steps.push({
    key: 'I',
    title: 'Krok 4. Prądy fazowe z prawa Ohma',
    mood: 'talk',
    highlight: ['I', 'Z'],
    gnome:
      `Prąd = napięcie / impedancja. W postaci wykładniczej: moduły DZIELIMY, kąty ODEJMUJEMY (kąt napięcia minus kąt impedancji). Cewka zabiera 90° – prąd spóźnia się za napięciem. Kondensator dodaje 90° – prąd wyprzedza napięcie. Na rezystorze prąd i napięcie idą razem. Rysujemy prądy na wykresie (krótsze strzałki – mają inną skalę).`,
    content: (
      <>
        {PH.map((p) => {
          const zu = s.U[p]
          const zz = s.Z[p]
          const raw = arg(zu) - arg(zz)
          const wrapped = Math.abs(normDeg(raw) - raw) > 1e-6
          return (
            <Eq key={p} note={wrapped ? `kąt ${fmtNum(raw, { digits: 1 })}° to ten sam kierunek co ${fmtDeg(raw)} (±360°)` : undefined}>
              <S b="I" s={p} /> = <S b="U" s={p} />/<S b="Z" s={p} /> = <Pol z={zu} /> / <Pol z={zz} /> = {fmtNum(abs(zu) / abs(zz))}·e
              <sup>j({nDegTerm(arg(zu), arg(zz), '-')})°</sup> = <Pol z={s.I[p]} root unit="A" />
            </Eq>
          )
        })}
      </>
    ),
    diagram: { vectors: [...vEs(s, true), ...vIs(s)], arcs: [] },
  })

  /* 5. Prąd w przewodzie neutralnym */
  const INzero = abs(s.IN) < 1e-6
  const sumPoly = [
    { id: 'pB', z: s.I.B, from: s.I.A, kind: 'I', color: PHASE_COLOR.B, dashed: true },
    { id: 'pC', z: s.I.C, from: C(s.I.A.re + s.I.B.re, s.I.A.im + s.I.B.im), kind: 'I', color: PHASE_COLOR.C, dashed: true },
  ]
  steps.push({
    key: 'IN',
    title: task.neutral ? 'Krok 5. Prąd w przewodzie neutralnym' : 'Krok 5. Sprawdzenie: suma prądów',
    mood: INzero ? 'happy' : 'talk',
    highlight: ['N', 'I'],
    gnome: task.neutral
      ? `Z I prawa Kirchhoffa dla węzła N': wszystko, co wpłynęło trzema przewodami, wraca przewodem neutralnym, więc I_N = I_A + I_B + I_C. DODAWAĆ można tylko w postaci algebraicznej (x + jy) – kalkulator w trybie CMPLX doda postacie wykładnicze sam. ` +
        (INzero ? `Wyszło zero – tak jest zawsze przy odbiorniku symetrycznym.` : `Na wykresie: przykładamy strzałki jedna za drugą (przerywane), a I_N to strzałka od początku do końca łańcucha.`)
      : `Bez przewodu neutralnego prądy MUSZĄ się zsumować do zera. To świetne sprawdzenie rachunków – jeśli nie wyjdzie zero, szukaj błędu.`,
    trap: !INzero ? `I_N to nie suma modułów! ${fmtNum(abs(s.I.A))} + ${fmtNum(abs(s.I.B))} + ${fmtNum(abs(s.I.C))} ≠ ${fmtNum(abs(s.IN))}. Dodajemy wskazy, czyli „strzałki”.` : undefined,
    content: (
      <>
        {PH.map((p) => (
          <Eq key={p}>
            <S b="I" s={p} /> = <Pol z={s.I[p]} /> = <Alg z={s.I[p]} /> A
          </Eq>
        ))}
        <Eq>
          <S b="I" s="N" /> = <S b="I" s="A" /> + <S b="I" s="B" /> + <S b="I" s="C" /> = <Alg z={s.IN} unit="A" />
          {!INzero && <> = <Pol z={s.IN} unit="A" /></>}
        </Eq>
      </>
    ),
    curiosity: (
      <>
        <p>
          Tak liczy się „na piechotę” (jak na tablicy): każdy wskaz rozpisujemy jako |A|(cos φ + j·sin φ), a potem osobno sumujemy
          części rzeczywiste i urojone.
        </p>
        {PH.map((p) => (
          <CosSin key={p} name="I" sub={p} z={s.I[p]} />
        ))}
        <Eq>
          Re: {PH.map((p, i) => (
            <span key={p}>{i ? ' + ' : ''}({fmtNum(s.I[p].re)})</span>
          ))}{' '}
          = {fmtNum(s.IN.re)}, &nbsp; Im: {PH.map((p, i) => (
            <span key={p}>{i ? ' + ' : ''}({fmtNum(s.I[p].im)})</span>
          ))}{' '}
          = {fmtNum(s.IN.im)}
        </Eq>
        {!INzero && (
          <Eq note="powrót do postaci wykładniczej: moduł z Pitagorasa, kąt z arctg (uwaga na ćwiartkę!)">
            |<S b="I" s="N" />| = √({fmtNum(s.IN.re)}² + {fmtNum(s.IN.im)}²) = {fmtNum(abs(s.IN))} A, φ = {fmtDeg(arg(s.IN))}
          </Eq>
        )}
      </>
    ),
    diagram: {
      vectors: [
        ...vEs(s, true),
        ...vIs(s),
        ...(INzero ? sumPoly : [...sumPoly, { id: 'IN', z: s.IN, kind: 'I', label: 'I', sub: 'N', color: PHASE_COLOR.N, width: 2.8 }]),
      ],
      arcs: [],
    },
  })

  /* 6. Amperomierz */
  const ammVal = s.amm
  steps.push({
    key: 'amm',
    title: 'Krok 6. Amperomierz',
    mood: 'talk',
    highlight: ['amm'],
    gnome: `Amperomierz nie zna kątów – pokazuje tylko wartość skuteczną, czyli MODUŁ prądu, który przez niego płynie. Siedzi w ${where(task.ammeter)}, więc odczytujemy |I_${task.ammeter}|.`,
    content: (
      <Eq>
        (A) = |<S b="I" s={task.ammeter} />| = <N x={ammVal} unit="A" />
        {niceRoot(ammVal) && <span className="root"> (={niceRoot(ammVal)})</span>}
      </Eq>
    ),
    diagram: {
      vectors: [
        ...vEs(s, true),
        ...vIs(s).map((v) => ({ ...v, width: v.sub === task.ammeter ? 3.4 : 1.5 })),
        ...(task.ammeter === 'N' ? [{ id: 'IN', z: s.IN, kind: 'I', label: 'I', sub: 'N', color: PHASE_COLOR.N, width: 3.4 }] : []),
      ],
      arcs: [],
    },
  })

  /* 7. Watomierz – napięcie */
  const toN = w.u[1] === 'N'
  const [a, b] = w.u
  const fwd = !toN && isForward(a, b)
  const Uw = s.Uw
  const gnomeU = toN
    ? `Patrzymy na cewkę napięciową: jeden koniec w przewodzie ${a}, drugi w przewodzie neutralnym. Mierzy więc napięcie FAZOWE U_${a} = E_${a} (bo U_N = 0). Nic nie trzeba odejmować!`
    : `Patrzymy na cewkę napięciową: łączy przewody ${a} i ${b}, więc mierzy napięcie MIĘDZYFAZOWE U_{${vn}} = U_${a} − U_${b}. Kolejność indeksów jest ważna: pierwszy indeks to przewód z gwiazdką (*). Na wykresie U_{${vn}} to strzałka od końca E_${b} do końca E_${a}. Moduł zawsze wychodzi √3 razy większy od fazowego.`
  steps.push({
    key: 'wattU',
    title: 'Krok 7. Watomierz – które napięcie mierzy?',
    mood: 'think',
    highlight: ['watt'],
    gnome: gnomeU,
    trap: toN
      ? undefined
      : fwd
        ? `Skrót: przy kolejności „zgodnej” (AB, BC, CA) napięcie U_{${vn}} wyprzedza E_${a} o 30°: kąt = ${fmtDeg(arg(s.E[a]))} + 30° = ${fmtDeg(arg(Uw))}.`
        : `Skrót: przy kolejności „pod prąd” (BA, CB, AC) napięcie U_{${vn}} spóźnia się za E_${a} o 30°: kąt = ${fmtDeg(arg(s.E[a]))} − 30° = ${fmtDeg(arg(Uw))}.`,
    content: toN ? (
      <Eq>
        <S b="U" s={a} /> = <S b="E" s={a} /> = <Pol z={Uw} unit="V" />
      </Eq>
    ) : (
      <>
        <Eq>
          <S b="U" s={vn} /> = <S b="U" s={a} /> − <S b="U" s={b} /> = (<Alg z={s.U[a]} />) − (<Alg z={s.U[b]} />) = <Alg z={Uw} /> V
        </Eq>
        <Eq note={`|U_{${vn}}| = √3·${fmtNum(Emod)} = ${fmtNum(abs(Uw))} V`}>
          <S b="U" s={vn} /> = <Pol z={Uw} unit="V" />
        </Eq>
      </>
    ),
    diagram: {
      vectors: toN
        ? [...vEs(s, true), { id: 'Uw0', z: Uw, kind: 'U', label: 'U', sub: a, color: PHASE_COLOR.W, width: 3.4 }]
        : [
            ...vEs(s, true),
            { id: 'UwTri', z: Uw, from: s.E[b], kind: 'U', color: PHASE_COLOR.W, dashed: true, label: 'U', sub: vn },
            { id: 'Uw0', z: Uw, kind: 'U', color: PHASE_COLOR.W, width: 3.2, label: 'U', sub: vn },
          ],
      arcs: [],
    },
  })

  /* 8. Watomierz – kąt i moc */
  const psi = s.psi
  const P = s.P
  const iw = w.i
  const phiU = arg(Uw)
  const phiI = arg(s.I[iw])
  let extra = ''
  if (Math.abs(P) < 1e-6) extra = ` Wyszło cos 90° = 0, więc watomierz pokazuje 0 W! To nie błąd: napięcie i prąd są do siebie prostopadłe.`
  else if (P < 0) extra = ` Kąt jest większy niż 90°, więc cos jest ujemny i watomierz pokazuje wartość UJEMNĄ (wskazówka wychyla się w drugą stronę). Taki wynik też jest poprawny.`
  steps.push({
    key: 'wattP',
    title: 'Krok 8. Watomierz – kąt i moc',
    mood: Math.abs(P) < 1e-6 || P < 0 ? 'warn' : 'talk',
    highlight: ['watt'],
    gnome:
      `Watomierz zawsze liczymy tak samo: |U|·|I|·cos(kąta między nimi). Kąt odczytujemy z wykresu: przesuwamy strzałkę napięcia do początku układu i mierzymy, o ile trzeba ją obrócić, żeby trafić w strzałkę prądu. Rachunkowo to po prostu RÓŻNICA kątów: φ_U − φ_I. Kolejność odejmowania nie ma znaczenia, bo cos(−x) = cos(x).` +
      extra,
    trap: `Nie mylimy kąta φ_U − φ_I z kątem samego prądu ani z kątem impedancji! Kąt impedancji to przesunięcie między U_${iw} a I_${iw} – a watomierz może mierzyć inne napięcie.`,
    content: (
      <>
        <Eq>
          <S b="φ" s={'U'} /> = <Deg d={phiU} />, &nbsp; <S b="φ" s={'I'} /> = <Deg d={phiI} />
        </Eq>
        <Eq>
          ψ = ∢(<S b="U" s={vSub} />, <S b="I" s={iw} />) = {fmtNum(phiU, { digits: 1 })}° − ({fmtNum(phiI, { digits: 1 })}°) = <Deg d={psi} />
        </Eq>
        <Eq>
          P = |<S b="U" s={vSub} />|·|<S b="I" s={iw} />|·cos ψ = {fmtNum(abs(Uw))} · {fmtNum(abs(s.I[iw]))} · cos({fmtDeg(psi)})
        </Eq>
        <Eq>
          P = {fmtNum(abs(Uw))} · {fmtNum(abs(s.I[iw]))} · {fmtNum(Math.cos(psi * RAD), { digits: 3 })} = <b><N x={P} unit="W" /></b>
        </Eq>
      </>
    ),
    diagram: {
      vectors: [
        { id: 'Uw0', z: Uw, kind: 'U', color: PHASE_COLOR.W, width: 3.2, label: 'U', sub: vSub },
        { id: 'Iw', z: s.I[iw], kind: 'I', color: PHASE_COLOR[iw], width: 3, label: 'I', sub: iw },
      ],
      arcs: [{ id: 'psi', a1: phiU, a2: phiI, label: `ψ = ${fmtDeg(Math.abs(psi))}`, color: 'var(--ph-w)' }],
    },
  })

  /* 9. Podsumowanie */
  steps.push({
    key: 'sum',
    title: 'Wynik i pełny wykres wskazowy',
    mood: 'happy',
    highlight: [],
    gnome: `Gotowe! Na kolokwium zawsze ta sama droga: E → U_N = 0 → Z w postaci wykładniczej → I = U/Z → I_N z Kirchhoffa → przyrządy. Wykres wskazowy rysuj równolegle z obliczeniami – od razu widać, czy kąty mają sens.`,
    content: (
      <div className="result">
        <Eq>
          <S b="I" s="A" /> = <Pol z={s.I.A} unit="A" />, &nbsp; <S b="I" s="B" /> = <Pol z={s.I.B} unit="A" />, &nbsp;{' '}
          <S b="I" s="C" /> = <Pol z={s.I.C} unit="A" />
        </Eq>
        <Eq>
          <S b="I" s="N" /> = <Pol z={s.IN} unit="A" />
        </Eq>
        <Eq>
          (A) = <N x={ammVal} unit="A" />, &nbsp; (W) = <N x={P} unit="W" />
        </Eq>
      </div>
    ),
    diagram: {
      vectors: [
        ...vEs(s, true),
        ...vIs(s),
        ...(INzero ? [] : [{ id: 'IN', z: s.IN, kind: 'I', label: 'I', sub: 'N', color: PHASE_COLOR.N, width: 2.8 }]),
      ],
      arcs: [],
    },
  })

  return { steps, sol: s }
}

export { Exp }
