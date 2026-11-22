import { C, polar, add, sub, div, abs, arg, normDeg, RAD } from './complex.js'

export const PH = ['A', 'B', 'C']

/** Rodzaj elementu po impedancji: R, L, C albo ogólne Z. */
export function zKind(z) {
  const eps = 1e-9
  if (Math.abs(z.im) < eps) return 'R'
  if (Math.abs(z.re) < eps) return z.im > 0 ? 'L' : 'C'
  return 'Z'
}

export function isSymmetric(task) {
  const [a, b, c] = PH.map((p) => task.Z[p])
  const same = (x, y) => Math.abs(x.re - y.re) < 1e-9 && Math.abs(x.im - y.im) < 1e-9
  return same(a, b) && same(b, c)
}

/** Nazwa napięcia mierzonego przez watomierz, np. ['A','B'] → "AB", ['A','N'] → "A". */
export const wattVoltName = (w) => (w.u[1] === 'N' ? w.u[0] : w.u[0] + w.u[1])

export function solve(task) {
  const EA = polar(task.EA.mod, task.EA.ang)
  const E = { A: EA, B: polar(task.EA.mod, task.EA.ang - 120), C: polar(task.EA.mod, task.EA.ang - 240) }
  const UN = C(0, 0)
  const U = { A: sub(E.A, UN), B: sub(E.B, UN), C: sub(E.C, UN) }
  const Z = task.Z
  const I = {}
  for (const p of PH) I[p] = div(U[p], Z[p])
  const IN = add(I.A, I.B, I.C)

  const amm = task.ammeter === 'N' ? abs(IN) : abs(I[task.ammeter])

  const w = task.watt
  const Uw = w.u[1] === 'N' ? U[w.u[0]] : sub(U[w.u[0]], U[w.u[1]])
  const Iw = I[w.i]
  const psi = normDeg(arg(Uw) - arg(Iw))
  const P = abs(Uw) * abs(Iw) * Math.cos(psi * RAD)

  return { E, UN, U, Z, I, IN, amm, Uw, Iw, psi, P, sym: isSymmetric(task) }
}
