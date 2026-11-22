import { solve, zKind, PH, wattVoltName } from './solver.js'
import { abs, arg, normDeg, fmtNum, fmtDeg, RAD, C, niceRoot, polar } from './complex.js'
import { tn, tdeg, tpol, talg, tparen, tunit } from './tex.js'
import { Eq, Rich } from '../components/MathText.jsx'
import { PHASE_COLOR } from '../components/Phasor.jsx'

const where = (x) => (x === 'N' ? 'przewodzie neutralnym' : `przewodzie fazy ${x}`)
const isForward = (a, b) => ['AB', 'BC', 'CA'].includes(a + b)
const R = (p) => `\\mathrm{${p}}` // indeks pisany prosto
const sym = (b, p) => `${b}_{${R(p)}}`

/* ---------- wektory do wykresu ---------- */
const vEs = (s, withU) =>
  PH.map((p) => ({ id: 'E' + p, z: s.E[p], kind: 'U', label: withU ? 'E,U' : 'E', sub: p, color: PHASE_COLOR[p] }))
const vIs = (s) => PH.map((p) => ({ id: 'I' + p, z: s.I[p], kind: 'I', label: 'I', sub: p, color: PHASE_COLOR[p], width: 2.2 }))

/** „(90° − 45°)” w wykładniku */
function angDiff(a, b) {
  const f = (x) => tn(Math.round(x * 10) / 10, { digits: 1 })
  return `j(${f(a)}^\\circ ${b < 0 ? '+' : '-'} ${f(Math.abs(b))}^\\circ)`
}

/** Ciekawostka: rozpisanie na cos + j sin */
function cosSinTex(name, p, z) {
  const m = abs(z)
  const a = arg(z)
  const c = Math.cos(a * RAD)
  const sn = Math.sin(a * RAD)
  return `${sym(name, p)} = ${tn(m)}\\left(\\cos ${tdeg(a)} + j\\sin ${tdeg(a)}\\right) = ${tn(m)}\\left(${tn(c, { digits: 3 })} ${sn < 0 ? '-' : '+'} j${tn(Math.abs(sn), { digits: 3 })}\\right) = ${talg(z)}`
}

export function buildSteps(task) {
  const s = solve(task)
  const w = task.watt
  const vn = wattVoltName(w)
  const steps = []
  const EAang = task.EA.ang
  const Emod = task.EA.mod
  const Uw = s.Uw
  const UwSym = sym('U', vn)

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
          <li><Rich>{`prądów $I_{\\mathrm A}, I_{\\mathrm B}, I_{\\mathrm C}$${task.neutral ? ' i $I_{\\mathrm N}$' : ''}`}</Rich></li>
          <li>wskazania amperomierza i watomierza</li>
          <li>wykresu wskazowego (rysujemy go równolegle z obliczeniami)</li>
        </ul>
      </>
    ),
    diagram: { vectors: [], arcs: [] },
  })

  /* 1. Napięcia źródeł */
  const given = task.EAtext.replace('E_A = ', '').replace(/ V$/, '')
  const algebraic = !/e\^/.test(task.EAtext) && (/j/.test(given) || /^[−-]/.test(given))
  const twoParts = algebraic && /\d\s*[+−-]\s*j/.test(given)
  const EAc = polar(Emod, EAang)
  let eIntro = ''
  if (twoParts)
    eIntro = `Najpierw tłumaczymy dane: E_A = ${given} V to punkt na płaszczyźnie zespolonej (x = ${fmtNum(EAc.re)}, y = ${fmtNum(EAc.im)}). Moduł liczymy z Pitagorasa, kąt z arctg. ${EAc.re < 0 ? 'UWAGA: część rzeczywista jest UJEMNA, więc punkt leży po lewej stronie i do wyniku arctg dodajemy 180°! ' : ''}`
  else if (algebraic && /^[−-]j/.test(given))
    eIntro = `Najpierw tłumaczymy dane: ${given} to ${fmtNum(Emod)} V pod kątem −90°, bo $-j = e^{-j90^\\circ}$. Minus przed j obraca strzałkę w dół. `
  else if (algebraic && /^j/.test(given))
    eIntro = `Najpierw tłumaczymy dane: ${given} to ${fmtNum(Emod)} V pod kątem 90°, bo $j = e^{j90^\\circ}$. `
  else if (algebraic && /^[−-]/.test(given))
    eIntro = `Najpierw tłumaczymy dane: ${given} V to ${fmtNum(Emod)} V pod kątem 180°, bo $-1 = e^{j180^\\circ}$ – minus to obrót o pół koła. `
  else if (EAang < 0)
    eIntro = `Kąt E_A jest ujemny – nie szkodzi! Od niego też odejmujemy 120° i 240°, a wynik sprowadzamy do przedziału od −180° do 180°. `
  steps.push({
    key: 'E',
    title: 'Krok 1. Napięcia źródeł',
    mood: eIntro ? 'think' : 'talk',
    highlight: ['E'],
    gnome:
      eIntro +
      `Dostajemy tylko E_A. Źródła B i C mają tę samą wartość ${fmtNum(Emod)} V, tylko są obrócone: od kąta E_A odejmujemy 120° (faza B) i 240° (faza C). Kąty odejmujemy, bo B i C „spóźniają się” za A.`,
    trap: twoParts
      ? `Kalkulator i arctg „nie wiedzą”, w której ćwiartce jest punkt: $\\operatorname{arctg}\\frac{${tn(EAc.im)}}{${tn(EAc.re)}} = ${tdeg(Math.atan(EAc.im / EAc.re) / RAD)}$, a prawdziwy kąt to ${fmtDeg(EAang)}. Zawsze patrz na znaki x i y!`
      : `−240° i +120° to ten sam kierunek (różnią się o pełny obrót 360°). Prowadząca często pisze $E_{\\mathrm C} = E\\,e^{j120^\\circ}$.`,
    content: (
      <>
        {twoParts && (
          <Eq
            tex={`\\begin{aligned} ${sym('E', 'A')} &= ${talg(EAc, 'V')} \\\\ |${sym('E', 'A')}| &= \\sqrt{(${tn(EAc.re)})^2 + (${tn(EAc.im)})^2} = ${niceRoot(Emod) ? `${tpol(null, { mod: Emod, deg: 0, root: true })} \\approx ${tn(Emod)}` : tn(Emod)}\\,\\mathrm{V} \\\\ \\varphi &= \\operatorname{arctg}\\frac{${tn(EAc.im)}}{${tn(EAc.re)}}${EAc.re < 0 ? ' + 180^\\circ' : ''} = ${tdeg(EAang)} \\end{aligned}`}
          />
        )}
        <Eq tex={`${sym('E', 'A')} = ${algebraic && !twoParts ? talg(EAc) + ' = ' : ''}${tpol(null, { mod: Emod, deg: EAang, unit: 'V', root: true })}`} />
        <Eq tex={`${sym('E', 'B')} = ${sym('E', 'A')}\\,e^{-j120^\\circ} = ${tpol(null, { mod: Emod, deg: 0, root: true })}\\,e^{${angDiff(EAang, 120)}} = ${tpol(s.E.B, { unit: 'V' })}`} />
        <Eq tex={`${sym('E', 'C')} = ${sym('E', 'A')}\\,e^{-j240^\\circ} = ${tpol(null, { mod: Emod, deg: 0, root: true })}\\,e^{${angDiff(EAang, 240)}} = ${tpol(s.E.C, { unit: 'V' })}`} />
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
      ? `Przewód neutralny bez oporu łączy N i N' – elektrycznie to ten sam punkt, więc napięcie między nimi U_N = 0. Każda faza odbiornika dostaje dokładnie napięcie swojego źródła: $U = E - U_N = E$. To ogromne ułatwienie – każda faza to osobny, prosty obwód!`
      : `Nie ma przewodu neutralnego, ale odbiornik jest symetryczny (trzy identyczne Z). Prądy będą tej samej wielkości, przesunięte o 120°, i same zsumują się do zera. Nic nie „ciągnie” punktu N', więc U_N = 0.`,
    content: (
      <>
        <Eq tex={`${sym('U', 'N')} = 0`} note={task.neutral ? 'przewód neutralny bez impedancji' : 'odbiornik symetryczny'} />
        {PH.map((p) => (
          <Eq key={p} tex={`${sym('U', p)} = ${sym('E', p)} - ${sym('U', 'N')} = ${sym('E', p)} = ${tpol(s.U[p], { unit: 'V' })}`} />
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
    const Z = sym('Z', p)
    if (k === 'R') return <Eq key={p} tex={`${Z} = R = ${tn(m)}${tunit('Ω')} = ${tn(m)}\\,e^{j0^\\circ}${tunit('Ω')}`} />
    if (k === 'L') return <Eq key={p} tex={`${Z} = jX_L = j${tn(m)}${tunit('Ω')} = ${tpol(null, { mod: m, deg: 90, unit: 'Ω' })}`} />
    if (k === 'C') return <Eq key={p} tex={`${Z} = -jX_C = -j${tn(m)}${tunit('Ω')} = ${tpol(null, { mod: m, deg: -90, unit: 'Ω' })}`} />
    const quad = z.re < 0 ? ' + 180^\\circ' : ''
    return (
      <Eq
        key={p}
        tex={`\\begin{aligned} ${Z} &= ${talg(z, 'Ω')} \\\\ |${Z}| &= \\sqrt{${tn(z.re)}^2 + (${tn(z.im)})^2} = ${niceRoot(m) ? `${tpol(null, { mod: m, deg: 0, root: true })} \\approx ${tn(m)}` : tn(m)}${tunit('Ω')} \\\\ \\varphi_{${R(p)}} &= \\operatorname{arctg}\\frac{${tn(z.im)}}{${tn(z.re)}}${quad} = ${tdeg(a)} \\\\ ${Z} &= ${tpol(null, { mod: m, deg: a, unit: 'Ω' })} \\end{aligned}`}
      />
    )
  }
  steps.push({
    key: 'Z',
    title: 'Krok 3. Impedancje w postaci wykładniczej',
    mood: 'talk',
    highlight: ['Z'],
    gnome: `Prąd policzymy z prawa Ohma, czyli dzieleniem. Dzielić najwygodniej w postaci wykładniczej, więc każdą impedancję zamieniamy na moduł i kąt. Rezystor ma kąt 0°, cewka +90°, kondensator −90°. Dla $Z = x + jy$: moduł $|Z| = \\sqrt{x^2 + y^2}$, kąt $\\varphi = \\operatorname{arctg}\\frac{y}{x}$. Kalkulator w trybie CMPLX robi to jednym przyciskiem.`,
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
    gnome: `Prąd = napięcie / impedancja. W postaci wykładniczej moduły DZIELIMY, a kąty ODEJMUJEMY: $\\frac{|U|\\,e^{j\\alpha}}{|Z|\\,e^{j\\varphi}} = \\frac{|U|}{|Z|}\\,e^{j(\\alpha-\\varphi)}$. Cewka zabiera 90° – prąd spóźnia się za napięciem. Kondensator dodaje 90° – prąd wyprzedza napięcie. Na rezystorze prąd i napięcie idą razem.`,
    content: (
      <>
        {PH.map((p) => {
          const zu = s.U[p]
          const zz = s.Z[p]
          const raw = arg(zu) - arg(zz)
          const wrapped = Math.abs(normDeg(raw) - raw) > 1e-6
          return (
            <Eq
              key={p}
              note={wrapped ? `kąt ${fmtNum(raw, { digits: 1 })}° to ten sam kierunek co ${fmtDeg(raw)} (±360°)` : undefined}
              tex={`${sym('I', p)} = \\frac{${sym('U', p)}}{${sym('Z', p)}} = \\frac{${tpol(zu)}}{${tpol(zz)}} = ${tn(abs(zu) / abs(zz))}\\,e^{${angDiff(arg(zu), arg(zz))}} = ${tpol(s.I[p], { unit: 'A', root: true })}`}
            />
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
      ? `Z I prawa Kirchhoffa dla węzła N': wszystko, co wpłynęło trzema przewodami, wraca przewodem neutralnym, więc $I_N = I_A + I_B + I_C$. DODAWAĆ można tylko w postaci algebraicznej (x + jy) – kalkulator w trybie CMPLX zrobi to sam. ` +
        (INzero ? `Wyszło zero – tak jest zawsze przy odbiorniku symetrycznym.` : `Na wykresie przykładamy strzałki jedna za drugą (przerywane), a I_N to strzałka od początku do końca łańcucha.`)
      : `Bez przewodu neutralnego prądy MUSZĄ się zsumować do zera. To świetne sprawdzenie rachunków – jeśli nie wyjdzie zero, szukaj błędu.`,
    trap: !INzero
      ? `I_N to nie suma modułów! $${tn(abs(s.I.A))} + ${tn(abs(s.I.B))} + ${tn(abs(s.I.C))} \\neq ${tn(abs(s.IN))}$. Dodajemy wskazy, czyli „strzałki”.`
      : undefined,
    content: (
      <>
        {PH.map((p) => (
          <Eq key={p} tex={`${sym('I', p)} = ${tpol(s.I[p])} = ${talg(s.I[p], 'A')}`} />
        ))}
        <Eq
          tex={`\\begin{aligned} ${sym('I', 'N')} &= ${sym('I', 'A')} + ${sym('I', 'B')} + ${sym('I', 'C')} \\\\ &= ${talg(s.IN, 'A')}${INzero ? '' : ` = ${tpol(s.IN, { unit: 'A' })}`} \\end{aligned}`}
        />
      </>
    ),
    curiosity: (
      <>
        <p>
          Tak liczy się „na piechotę” (jak na tablicy): każdy wskaz rozpisujemy jako{' '}
          <Rich>{'$|A|(\\cos\\varphi + j\\sin\\varphi)$'}</Rich>, a potem osobno sumujemy części rzeczywiste i urojone.
        </p>
        {PH.map((p) => (
          <Eq key={p} tex={cosSinTex('I', p, s.I[p])} />
        ))}
        <Eq
          tex={`\\begin{aligned} \\operatorname{Re} &: ${PH.map((p) => tparen({ re: s.I[p].re, im: 0 })).join(' + ')} = ${tn(s.IN.re)} \\\\ \\operatorname{Im} &: ${PH.map((p) => tparen({ re: s.I[p].im, im: 0 })).join(' + ')} = ${tn(s.IN.im)} \\end{aligned}`}
        />
        {!INzero && (
          <Eq
            note="powrót do postaci wykładniczej: moduł z Pitagorasa, kąt z arctg (uwaga na ćwiartkę!)"
            tex={`|${sym('I', 'N')}| = \\sqrt{(${tn(s.IN.re)})^2 + (${tn(s.IN.im)})^2} = ${tn(abs(s.IN))}\\,\\mathrm{A}, \\quad \\varphi = ${tdeg(arg(s.IN))}`}
          />
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
  steps.push({
    key: 'amm',
    title: 'Krok 6. Amperomierz',
    mood: 'talk',
    highlight: ['amm'],
    gnome: `Amperomierz nie zna kątów – pokazuje tylko wartość skuteczną, czyli MODUŁ prądu, który przez niego płynie. Siedzi w ${where(task.ammeter)}, więc odczytujemy $|I_${task.ammeter}|$.`,
    content: <Eq tex={`\\text{(A)} = |${sym('I', task.ammeter)}| = ${niceRoot(s.amm) ? `${tpol(null, { mod: s.amm, deg: 0, root: true })} \\approx ${tn(s.amm)}` : tn(s.amm)}\\,\\mathrm{A}`} />,
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
  steps.push({
    key: 'wattU',
    title: 'Krok 7. Watomierz – które napięcie mierzy?',
    mood: 'think',
    highlight: ['watt'],
    gnome: toN
      ? `Patrzymy na cewkę napięciową: jeden koniec w przewodzie ${a}, drugi w przewodzie neutralnym. Mierzy więc napięcie FAZOWE $U_${a} = E_${a}$ (bo U_N = 0). Nic nie trzeba odejmować!`
      : `Patrzymy na cewkę napięciową: łączy przewody ${a} i ${b}, więc mierzy napięcie MIĘDZYFAZOWE $U_{${vn}} = U_${a} - U_${b}$. Kolejność indeksów jest ważna: pierwszy indeks to przewód z gwiazdką (*). Na wykresie U_{${vn}} to strzałka od końca E_${b} do końca E_${a}. Moduł zawsze wychodzi $\\sqrt{3}$ razy większy od fazowego.`,
    trap: toN
      ? undefined
      : fwd
        ? `Skrót: przy kolejności „zgodnej” (AB, BC, CA) napięcie U_{${vn}} wyprzedza E_${a} o 30°: $${tdeg(arg(s.E[a]))} + 30^\\circ = ${tdeg(arg(Uw))}$.`
        : `Skrót: przy kolejności „pod prąd” (BA, CB, AC) napięcie U_{${vn}} spóźnia się za E_${a} o 30°: $${tdeg(arg(s.E[a]))} - 30^\\circ = ${tdeg(arg(Uw))}$.`,
    content: toN ? (
      <Eq tex={`${sym('U', a)} = ${sym('E', a)} = ${tpol(Uw, { unit: 'V' })}`} />
    ) : (
      <Eq
        tex={`\\begin{aligned} ${UwSym} &= ${sym('U', a)} - ${sym('U', b)} = ${tparen(s.U[a])} - ${tparen(s.U[b])} \\\\ &= ${talg(Uw, 'V')} \\\\ |${UwSym}| &= \\sqrt{3}\\cdot ${tn(Emod)} = ${tn(abs(Uw))}\\,\\mathrm{V} \\\\ ${UwSym} &= ${tpol(Uw, { unit: 'V' })} \\end{aligned}`}
      />
    ),
    diagram: {
      vectors: toN
        ? [...vEs(s, true), { id: 'Uw0', z: Uw, kind: 'U', label: 'U', sub: a, color: PHASE_COLOR.W, width: 3.4 }]
        : [
            ...vEs(s, true),
            { id: 'UwTri', z: Uw, from: s.E[b], kind: 'U', color: PHASE_COLOR.W, dashed: true },
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
      `Watomierz zawsze liczymy tak samo: $P = |U|\\cdot|I|\\cdot\\cos\\psi$. Kąt ψ odczytujemy z wykresu: strzałka napięcia stoi w początku układu, mierzymy, o ile trzeba ją obrócić, żeby trafić w strzałkę prądu. Rachunkowo to po prostu RÓŻNICA kątów: $\\psi = \\varphi_U - \\varphi_I$. Kolejność odejmowania nie ma znaczenia, bo $\\cos(-x) = \\cos x$.` +
      extra,
    trap: `Nie mylimy kąta $\\varphi_U - \\varphi_I$ z kątem samego prądu ani z kątem impedancji! Kąt impedancji to przesunięcie między U_${iw} a I_${iw} – a watomierz może mierzyć inne napięcie.`,
    content: (
      <Eq
        tex={`\\begin{aligned} \\varphi_U &= ${tdeg(phiU)}, \\qquad \\varphi_I = ${tdeg(phiI)} \\\\ \\psi &= \\varphi_U - \\varphi_I = ${tdeg(phiU)} - (${tdeg(phiI)}) = ${tdeg(psi)} \\\\ P &= |${UwSym}|\\cdot|${sym('I', iw)}|\\cdot\\cos\\psi \\\\ &= ${tn(abs(Uw))}\\cdot ${tn(abs(s.I[iw]))}\\cdot\\cos(${tdeg(psi)}) \\\\ &= ${tn(abs(Uw))}\\cdot ${tn(abs(s.I[iw]))}\\cdot ${Math.cos(psi * RAD) < -1e-9 ? `(${tn(Math.cos(psi * RAD), { digits: 3 })})` : tn(Math.cos(psi * RAD), { digits: 3 })} = \\boxed{${tn(P)}\\,\\mathrm{W}} \\end{aligned}`}
      />
    ),
    diagram: {
      vectors: [
        { id: 'Uw0', z: Uw, kind: 'U', color: PHASE_COLOR.W, width: 3.2, label: 'U', sub: toN ? a : vn },
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
    gnome: `Gotowe! Na kolokwium zawsze ta sama droga: E → U_N = 0 → Z w postaci wykładniczej → $I = \\frac{U}{Z}$ → I_N z Kirchhoffa → przyrządy. Wykres wskazowy rysuj równolegle z obliczeniami – od razu widać, czy kąty mają sens.`,
    content: (
      <div className="result">
        <Eq
          tex={`\\begin{aligned} ${sym('I', 'A')} &= ${tpol(s.I.A, { unit: 'A' })} & ${sym('I', 'B')} &= ${tpol(s.I.B, { unit: 'A' })} \\\\ ${sym('I', 'C')} &= ${tpol(s.I.C, { unit: 'A' })} & ${sym('I', 'N')} &= ${tpol(s.IN, { unit: 'A' })} \\\\ \\text{(A)} &= ${tn(s.amm)}\\,\\mathrm{A} & \\text{(W)} &= ${tn(P)}\\,\\mathrm{W} \\end{aligned}`}
        />
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
