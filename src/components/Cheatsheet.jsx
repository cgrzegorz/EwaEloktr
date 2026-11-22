import { useState } from 'react'
import Phasor, { PHASE_COLOR } from './Phasor.jsx'
import Gnome from './Gnome.jsx'
import { Rich } from './MathText.jsx'
import { polar, sub, arg, fmtDeg } from '../lib/complex.js'

const PAIRS = ['AB', 'BC', 'CA', 'BA', 'CB', 'AC']

function LineVoltageDemo() {
  const [pair, setPair] = useState('AB')
  const [ea, setEa] = useState(0)
  const E = { A: polar(220, ea), B: polar(220, ea - 120), C: polar(220, ea - 240) }
  const [x, y] = pair.split('')
  const U = sub(E[x], E[y])
  return (
    <div className="demo">
      <div className="demo-ctrl">
        <div>
          <div className="small muted">Napięcie watomierza</div>
          <div className="seg">
            {PAIRS.map((p) => (
              <button key={p} className={p === pair ? 'on' : ''} onClick={() => setPair(p)}>
                U<sub>{p}</sub>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="small muted">Kąt E<sub>A</sub></div>
          <div className="seg">
            {[0, 30, 90].map((a) => (
              <button key={a} className={a === ea ? 'on' : ''} onClick={() => setEa(a)}>
                {a}°
              </button>
            ))}
          </div>
        </div>
        <p className="small">
          <Rich>{`$U_{${pair}} = E_${x} - E_${y}$`}</Rich> — strzałka od końca <Rich>{`E_${y}`}</Rich> do końca <Rich>{`E_${x}`}</Rich>.
          Kąt: <b>{fmtDeg(arg(U))}</b> = kąt <Rich>{`E_${x}`}</Rich> ({fmtDeg(arg(E[x]))}) {['AB', 'BC', 'CA'].includes(pair) ? '+ 30°' : '− 30°'}.
        </p>
      </div>
      <Phasor
        size={320}
        vectors={[
          ...['A', 'B', 'C'].map((p) => ({ id: 'E' + p, z: E[p], kind: 'U', label: 'E', sub: p, color: PHASE_COLOR[p] })),
          { id: 'tri' + pair + ea, z: U, from: E[y], kind: 'U', color: PHASE_COLOR.W, dashed: true },
          { id: 'u' + pair + ea, z: U, kind: 'U', color: PHASE_COLOR.W, label: 'U', sub: pair, width: 3 },
        ]}
      />
    </div>
  )
}

export default function Cheatsheet() {
  return (
    <div className="cheat">
      <h2 className="section-title">Ściąga</h2>
      <Gnome
        text="Wszystko, co trzeba mieć w głowie na kolokwium. Pobaw się wykresem napięć międzyfazowych – to klucz do watomierza!"
        mood="talk"
        compact
      />
      <div className="cheat-grid">
        <div className="card">
          <h3>Postać wykładnicza ↔ algebraiczna</h3>
          <ul className="small">
            <li><Rich>{'$A\\,e^{j\\varphi} = A\\cos\\varphi + jA\\sin\\varphi$'}</Rich></li>
            <li><Rich>{'$x + jy \\;\\Rightarrow\\; |A| = \\sqrt{x^2 + y^2},\\ \\varphi = \\operatorname{arctg}\\frac{y}{x}$'}</Rich> (gdy x &lt; 0: +180°)</li>
            <li><Rich>{'$j = e^{j90^\\circ},\\quad -j = e^{-j90^\\circ},\\quad -1 = e^{j180^\\circ}$'}</Rich></li>
            <li><b>Mnożenie / dzielenie</b> – wykładniczo: moduły mnożymy / dzielimy, kąty dodajemy / odejmujemy.</li>
            <li><b>Dodawanie / odejmowanie</b> – tylko algebraicznie (x + jy).</li>
          </ul>
        </div>
        <div className="card">
          <h3>Gwiazda, U_N = 0</h3>
          <ul className="small">
            <li><Rich>{'$E_B = E_A\\,e^{-j120^\\circ},\\quad E_C = E_A\\,e^{-j240^\\circ} = E_A\\,e^{j120^\\circ}$'}</Rich></li>
            <li>Przewód N bez oporu albo odbiornik symetryczny ⇒ <Rich>{'$U_N = 0 \\Rightarrow U_A = E_A$'}</Rich> itd.</li>
            <li><Rich>{'$I_A = \\dfrac{U_A}{Z_A}$'}</Rich> (prawo Ohma)</li>
            <li><Rich>{'$I_N = I_A + I_B + I_C$'}</Rich> (I prawo Kirchhoffa)</li>
            <li>R: prąd w fazie z napięciem · L: prąd spóźnia się o 90° · C: prąd wyprzedza o 90°</li>
          </ul>
        </div>
        <div className="card">
          <h3>Przyrządy</h3>
          <ul className="small">
            <li><b>Amperomierz</b>: moduł prądu w swoim przewodzie, np. <Rich>{'$\\text{(A)} = |I_C|$'}</Rich>.</li>
            <li><b>Watomierz</b>: <Rich>{'$P = |U|\\cdot|I|\\cdot\\cos\\psi$'}</Rich>, gdzie <Rich>{'$\\psi = \\varphi_U - \\varphi_I$'}</Rich>.</li>
            <li>Cewka napięciowa przewód–N: <Rich>{'$U = U_A$'}</Rich> (fazowe).</li>
            <li>Cewka napięciowa przewód–przewód: <Rich>{'$U_{AB} = U_A - U_B$'}</Rich>, <Rich>{'$|U_{AB}| = \\sqrt{3}\\,|E|$'}</Rich>.</li>
            <li>Zgodnie z kolejnością (AB, BC, CA): kąt = kąt pierwszej fazy + 30°. Odwrotnie (BA, CB, AC): − 30°.</li>
            <li>P może wyjść 0 (ψ = 90°) albo ujemne (|ψ| &gt; 90°) – to poprawne wyniki.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Kalkulator (tryb liczb zespolonych)</h3>
          <ul className="small">
            <li>Ustaw kąty w stopniach (Deg) i włącz tryb CMPLX (np. Casio fx-991: MODE → CMPLX).</li>
            <li>Postać wykładniczą wpisujesz jako <code>220∠−120</code> (symbol ∠ zwykle pod SHIFT).</li>
            <li>Zamiana: polecenia ▶r∠θ i ▶a+bi (w menu SHIFT/OPTN, zależnie od modelu).</li>
            <li>Kalkulator dodaje i dzieli w każdej postaci – nie trzeba rozpisywać cos i sin.</li>
          </ul>
          <p className="small muted">Ciekawostka: na tablicy prowadząca rozpisuje wszystko na cos + j·sin – w każdym zadaniu z opracowaniem znajdziesz to w kroku z prądem I<sub>N</sub>.</p>
        </div>
      </div>
      <div className="card">
        <h3>Wykres: skąd się bierze napięcie międzyfazowe</h3>
        <LineVoltageDemo />
      </div>
    </div>
  )
}
