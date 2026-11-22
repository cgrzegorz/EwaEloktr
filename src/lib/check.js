import { abs, arg, normDeg, sub, fmtNum, fmtDeg, RAD } from './complex.js'
import { safeParse } from './parse.js'
import { solve, wattVoltName } from './solver.js'

/** Pola do wpisania w zadaniu ćwiczeniowym. */
export function practiceFields(task) {
  const s = solve(task)
  const vn = wattVoltName(task.watt)
  const f = [
    { key: 'EB', label: 'E_B', unit: 'V', type: 'c', ref: s.E.B, hint: 'E_B = E_A·e^{−j120°} – od kąta E_A odejmij 120°.' },
    { key: 'EC', label: 'E_C', unit: 'V', type: 'c', ref: s.E.C, hint: 'E_C = E_A·e^{−j240°} = E_A·e^{j120°}.' },
    { key: 'IA', label: 'I_A', unit: 'A', type: 'c', ref: s.I.A, hint: 'I_A = U_A / Z_A, a U_A = E_A, bo U_N = 0. Moduły dzielisz, kąty odejmujesz.' },
    { key: 'IB', label: 'I_B', unit: 'A', type: 'c', ref: s.I.B, hint: 'I_B = E_B / Z_B. Kąt prądu = kąt napięcia − kąt impedancji.' },
    { key: 'IC', label: 'I_C', unit: 'A', type: 'c', ref: s.I.C, hint: 'I_C = E_C / Z_C. Kąt prądu = kąt napięcia − kąt impedancji.' },
    {
      key: 'IN',
      label: task.neutral ? 'I_N' : 'I_A + I_B + I_C',
      unit: 'A',
      type: 'c',
      ref: s.IN,
      hint: 'Dodaj trzy prądy w postaci algebraicznej (x + jy). Odbiornik symetryczny daje zero.',
    },
    {
      key: 'Uw',
      label: task.watt.u[1] === 'N' ? `U_${vn} (napięcie watomierza)` : `U_{${vn}} (napięcie watomierza)`,
      unit: 'V',
      type: 'c',
      ref: s.Uw,
      hint:
        task.watt.u[1] === 'N'
          ? `Cewka napięciowa jest między przewodem ${vn} a N – to napięcie fazowe U_${vn} = E_${vn}.`
          : `U_{${vn}} = U_${task.watt.u[0]} − U_${task.watt.u[1]}. Moduł √3 razy większy od fazowego.`,
    },
    { key: 'amm', label: 'wskazanie amperomierza', unit: 'A', type: 'r', ref: s.amm, hint: `Amperomierz pokazuje moduł prądu w ${task.ammeter === 'N' ? 'przewodzie neutralnym' : 'fazie ' + task.ammeter}.` },
    { key: 'P', label: 'wskazanie watomierza', unit: 'W', type: 'r', ref: s.P, hint: 'P = |U|·|I|·cos(φ_U − φ_I).' },
  ]
  return { fields: f, sol: s }
}

const near = (a, b, tol) => Math.abs(a - b) <= tol

/** Ocena jednej odpowiedzi. Zwraca { status: 'ok'|'bad'|'empty'|'parse', msg } */
export function checkField(field, input, task, sol) {
  if (!input || !input.trim()) return { status: 'empty' }
  const r = safeParse(input)
  if (!r.ok || !r.value) {
    return { status: 'parse', msg: 'Nie rozumiem zapisu. Spróbuj np. 10e^j150, 10∠150 albo −8,66+j5.' }
  }
  const z = r.value
  const ref = field.ref

  if (field.type === 'r') {
    const v = Math.abs(z.im) > 1e-6 ? abs(z) : z.re
    const tol = Math.max(0.02 * Math.abs(ref), 0.05)
    if (near(v, ref, tol)) return { status: 'ok', msg: 'Dobrze!' }
    if (field.key === 'P') {
      const U = abs(sol.Uw)
      const I = abs(sol.Iw)
      if (near(v, U * I, 0.02 * U * I)) return { status: 'bad', msg: 'To jest |U|·|I| bez cosinusa. Brakuje cos kąta między napięciem a prądem.' }
      if (near(v, ref / Math.sqrt(3), 0.02 * Math.abs(ref) + 0.05) || near(v, ref * Math.sqrt(3), 0.03 * Math.abs(ref) + 0.05))
        return { status: 'bad', msg: 'Różnica o √3 – sprawdź, czy watomierz mierzy napięcie fazowe czy międzyfazowe.' }
      if (near(v, -ref, Math.max(0.02 * Math.abs(ref), 0.05))) return { status: 'bad', msg: 'Zły znak. Kąt ψ = φ_U − φ_I – sprawdź, czy cos jest dodatni, czy ujemny (|ψ| > 90° → ujemny).' }
      const sumAng = Math.cos((arg(sol.Uw) + arg(sol.Iw)) * RAD) * U * I
      if (near(v, sumAng, 0.02 * Math.abs(sumAng) + 0.5)) return { status: 'bad', msg: 'Kąty trzeba ODJĄĆ, nie dodać: ψ = φ_U − φ_I.' }
      return { status: 'bad', msg: 'Nie zgadza się. Policz osobno |U|, |I| i kąt ψ = φ_U − φ_I.' }
    }
    return { status: 'bad', msg: 'Amperomierz pokazuje sam moduł prądu (bez kąta). Sprawdź, w którym przewodzie stoi.' }
  }

  // liczba zespolona
  const mr = abs(ref)
  const mz = abs(z)
  const tolAbs = 0.025 * mr + 0.03
  if (abs(sub(z, ref)) <= tolAbs) return { status: 'ok', msg: 'Dobrze!' }
  if (mr < 1e-6) return { status: 'bad', msg: `Powinno wyjść zero (masz |·| = ${fmtNum(mz)}). Sprawdź dodawanie części rzeczywistych i urojonych.` }

  const modOk = Math.abs(mz - mr) <= 0.025 * mr + 0.03
  const dAng = normDeg(arg(z) - arg(ref))
  if (modOk) {
    if (Math.abs(Math.abs(dAng) - 180) < 3) return { status: 'bad', msg: 'Moduł dobry, ale strzałka w przeciwną stronę (różnica 180°). Sprawdź znak.' }
    if (Math.abs(Math.abs(dAng) - 90) < 3)
      return {
        status: 'bad',
        msg: 'Moduł dobry, kąt różni się o 90°. Przy dzieleniu przez cewkę (e^{j90°}) kąt ODEJMUJESZ, przez kondensator (e^{−j90°}) – DODAJESZ.',
      }
    if (Math.abs(Math.abs(dAng) - 120) < 3 || Math.abs(Math.abs(dAng) - 240) < 3)
      return { status: 'bad', msg: 'Moduł dobry, kąt przesunięty o 120°. Sprawdź kolejność faz: B to −120°, C to −240° (= +120°).' }
    if (field.key === 'Uw' && Math.abs(Math.abs(dAng) - 60) < 3)
      return { status: 'bad', msg: 'Moduł dobry, kąt różni się o 60°. Pewnie odwrotna kolejność indeksów – U_{AB} = −U_{BA}.' }
    return { status: 'bad', msg: `Moduł dobry (${fmtNum(mr)}), kąt nie – różnica ${fmtDeg(dAng)}. Kąt prądu = kąt napięcia − kąt impedancji.` }
  }
  const angOk = Math.abs(dAng) < 2
  if (angOk) {
    const ratio = mz / mr
    if (Math.abs(ratio - Math.sqrt(3)) < 0.03 || Math.abs(ratio - 1 / Math.sqrt(3)) < 0.02)
      return { status: 'bad', msg: 'Kąt dobry, moduł różni się o √3 – fazowe czy międzyfazowe?' }
    return { status: 'bad', msg: 'Kąt dobry, sprawdź moduł (dzielenie modułów).' }
  }
  if (field.key === 'IN') {
    const sumMods = abs(sol.I.A) + abs(sol.I.B) + abs(sol.I.C)
    if (Math.abs(mz - sumMods) < 0.03 * sumMods) return { status: 'bad', msg: 'Wygląda na sumę modułów. Wskazy dodajemy jak strzałki – w postaci x + jy!' }
  }
  return { status: 'bad', msg: 'Nie zgadza się ani moduł, ani kąt. Zajrzyj do podpowiedzi krasnala.' }
}
