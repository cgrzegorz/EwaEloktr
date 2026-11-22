// Generuje ROZWIAZANIA.md ze wszystkimi zadaniami i wynikami – z tego samego silnika co aplikacja.
// Uruchom: npm run solutions
import { writeFileSync } from 'node:fs'
import { LEARN, PRACTICE } from '../src/data/tasks.js'
import { solve, zKind, PH, wattVoltName } from '../src/lib/solver.js'
import { abs, arg, normDeg, RAD, fmtNum, niceRoot } from '../src/lib/complex.js'

const n = (x, d) => fmtNum(x, d === undefined ? {} : { digits: d })
const deg = (d) => n(Math.round(normDeg(d) * 10) / 10, 1) + '°'
const pol = (z, unit = '') => {
  const m = abs(z)
  if (m < 1e-9) return '0' + (unit ? ' ' + unit : '')
  const r = niceRoot(m)
  const a = arg(z)
  const e = Math.abs(a) < 1e-9 ? '' : ` · e^(${a < 0 ? '−' : ''}j${deg(Math.abs(a))})`
  return `${n(m)}${r ? ` (= ${r})` : ''}${e}${unit ? ' ' + unit : ''}`
}
const alg = (z, unit = '') => {
  const re = Math.abs(z.re) < 1e-9 ? 0 : z.re
  const im = Math.abs(z.im) < 1e-9 ? 0 : z.im
  let s
  if (im === 0) s = n(re)
  else if (re === 0) s = (im < 0 ? '−' : '') + 'j' + n(Math.abs(im))
  else s = `${n(re)} ${im < 0 ? '−' : '+'} j${n(Math.abs(im))}`
  return s + (unit ? ' ' + unit : '')
}
const t = (s) => s.replace(/_\{([^}]+)\}/g, '_$1').replace(/e\^\{([^}]+)\}/g, 'e^($1)')
const kindName = { R: 'rezystor', L: 'cewka', C: 'kondensator', Z: 'impedancja ogólna' }
const where = (x) => (x === 'N' ? 'przewód neutralny' : `przewód fazy ${x}`)

function taskMd(task, idx, kind) {
  const s = solve(task)
  const w = task.watt
  const vn = wattVoltName(w)
  const toN = w.u[1] === 'N'
  const L = []
  L.push(`### ${task.id}. ${t(task.title)}`)
  L.push('')
  if (task.intro) L.push(`_${t(task.intro)}_`, '')
  L.push('**Dane**', '')
  L.push(`- ${t(task.EAtext)}`)
  for (const p of PH) L.push(`- faza ${p}: ${t(task.Ztext[p])} (${kindName[zKind(task.Z[p])]})`)
  L.push(`- przewód neutralny: ${task.neutral ? 'TAK, bez impedancji' : 'BRAK (odbiornik symetryczny)'}`)
  L.push(`- amperomierz: ${where(task.ammeter)}`)
  L.push(`- watomierz: prąd I_${w.i}, napięcie ${toN ? `U_${w.u[0]} (przewód ${w.u[0]} – N)` : `U_${vn} (przewody ${w.u[0]} → ${w.u[1]})`}`)
  L.push('')
  L.push('**Rozwiązanie**', '')
  L.push('| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |')
  L.push('|---|---|---|---|')
  for (const p of PH) L.push(`| 1. Źródła | E_${p} | ${pol(s.E[p], 'V')} | ${alg(s.E[p], 'V')} |`)
  L.push(`| 2. Napięcie N–N' | U_N | 0 | ${task.neutral ? 'przewód N bez oporu' : 'odbiornik symetryczny'} |`)
  for (const p of PH) L.push(`| 3. Impedancje | Z_${p} | ${pol(s.Z[p], 'Ω')} | ${alg(s.Z[p], 'Ω')} |`)
  for (const p of PH) L.push(`| 4. Prądy I = U/Z | I_${p} | ${pol(s.I[p], 'A')} | ${alg(s.I[p], 'A')} |`)
  L.push(`| 5. Kirchhoff | ${task.neutral ? 'I_N' : 'I_A + I_B + I_C'} | ${pol(s.IN, 'A')} | ${alg(s.IN, 'A')} |`)
  L.push(`| 7. Napięcie watomierza | U_${vn} | ${pol(s.Uw, 'V')} | ${alg(s.Uw, 'V')} |`)
  L.push('')
  const ammSym = `I_${task.ammeter}`
  L.push(`- **Amperomierz:** (A) = |${ammSym}| = **${n(s.amm)} A**`)
  L.push(
    `- **Watomierz:** φ_U = ${deg(arg(s.Uw))}, φ_I = ${deg(arg(s.Iw))}, ψ = φ_U − φ_I = ${deg(s.psi)}  ` +
      `\n  P = |U_${vn}| · |I_${w.i}| · cos ψ = ${n(abs(s.Uw))} · ${n(abs(s.Iw))} · cos(${deg(s.psi)}) = ${n(abs(s.Uw))} · ${n(abs(s.Iw))} · ${Math.cos(s.psi * RAD) < -1e-9 ? `(${n(Math.cos(s.psi * RAD), 3)})` : n(Math.cos(s.psi * RAD), 3)} = **${n(s.P)} W**`,
  )
  // sprawdzenie bilansu mocy czynnej (informacyjnie)
  const Ptot = PH.reduce((acc, p) => acc + abs(s.I[p]) ** 2 * s.Z[p].re, 0)
  L.push(`- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = ${n(Ptot)} W (watomierz pojedynczy nie musi jej pokazywać).`)
  L.push('')
  return L.join('\n')
}

const out = []
out.push('# Trójfaza gwiazda–gwiazda – zadania i rozwiązania')
out.push('')
out.push('> Plik wygenerowany automatycznie poleceniem `npm run solutions` z tego samego silnika obliczeń, którego używa aplikacja')
out.push('> (`src/lib/solver.js`, dane w `src/data/tasks.js`). Nie edytuj ręcznie – zmień dane i wygeneruj ponownie.')
out.push('')
out.push('## Założenia i konwencje')
out.push('')
out.push('- Generator i odbiornik w gwiazdę, U_N = 0 (przewód neutralny bez impedancji albo odbiornik symetryczny).')
out.push('- Kolejność faz zgodna: E_B = E_A · e^(−j120°), E_C = E_A · e^(−j240°) = E_A · e^(j120°).')
out.push('- Kąty w stopniach, sprowadzone do przedziału (−180°, 180°]. Wartości zaokrąglone do 3–4 cyfr znaczących.')
out.push('- U_N = 0 ⇒ U_X = E_X, prądy z prawa Ohma I_X = U_X / Z_X, I_N = I_A + I_B + I_C.')
out.push('- Napięcie międzyfazowe U_XY = U_X − U_Y (pierwszy indeks = zacisk z gwiazdką cewki napięciowej). Watomierz przewód–N mierzy U_X.')
out.push('- Watomierz: P = |U| · |I| · cos(φ_U − φ_I). Amperomierz: moduł prądu w swoim przewodzie.')
out.push('')
out.push('## Spis')
out.push('')
out.push('| Nr | Zadanie | (A) | (W) |')
out.push('|---|---|---|---|')
for (const task of [...LEARN, ...PRACTICE]) {
  const s = solve(task)
  out.push(`| ${task.id} | ${t(task.title)} | ${n(s.amm)} A | ${n(s.P)} W |`)
}
out.push('')
out.push('## Część 1 – zadania z opracowaniem (z krasnalem)')
out.push('')
LEARN.forEach((task, i) => out.push(taskMd(task, i, 'L')))
out.push('## Część 2 – zadania do samodzielnego rozwiązania')
out.push('')
PRACTICE.forEach((task, i) => out.push(taskMd(task, i, 'P')))

writeFileSync(new URL('../ROZWIAZANIA.md', import.meta.url), out.join('\n'))
console.log('Zapisano ROZWIAZANIA.md')
