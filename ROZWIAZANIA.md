# Trójfaza gwiazda–gwiazda – zadania i rozwiązania

> Plik wygenerowany automatycznie poleceniem `npm run solutions` z tego samego silnika obliczeń, którego używa aplikacja
> (`src/lib/solver.js`, dane w `src/data/tasks.js`). Nie edytuj ręcznie – zmień dane i wygeneruj ponownie.

## Założenia i konwencje

- Generator i odbiornik w gwiazdę, U_N = 0 (przewód neutralny bez impedancji albo odbiornik symetryczny).
- Kolejność faz zgodna: E_B = E_A · e^(−j120°), E_C = E_A · e^(−j240°) = E_A · e^(j120°).
- Kąty w stopniach, sprowadzone do przedziału (−180°, 180°]. Wartości zaokrąglone do 3–4 cyfr znaczących.
- U_N = 0 ⇒ U_X = E_X, prądy z prawa Ohma I_X = U_X / Z_X, I_N = I_A + I_B + I_C.
- Napięcie międzyfazowe U_XY = U_X − U_Y (pierwszy indeks = zacisk z gwiazdką cewki napięciowej). Watomierz przewód–N mierzy U_X.
- Watomierz: P = |U| · |I| · cos(φ_U − φ_I). Amperomierz: moduł prądu w swoim przewodzie.

## Spis

| Nr | Zadanie | (A) | (W) |
|---|---|---|---|
| L1 | R, L, C z przewodem neutralnym | 10 A | 3300 W |
| L2 | Napięcie podane jako j220 | 22 A | 7260 W |
| L3 | Odbiornik symetryczny | 14,14 A | 9464,1 W |
| L4 | Watomierz, który pokazuje zero | 10 A | 0 W |
| L5 | Amperomierz w przewodzie neutralnym | 23 A | 3967,5 W |
| L6 | Minus przed j: E_A = −j230 | 10 A | 1991,9 W |
| L7 | E_A z ujemną częścią rzeczywistą | 23,94 A | 3300 W |
| L8 | E_A = −127 V i odbiornik 8 − j6 | 12,7 A | 2773,6 W |
| L9 | Watomierz pokazuje wartość ujemną | 10 A | −866 W |
| L10 | Ujemny kąt E_A | 10 A | 3000 W |
| P1 | Trzy rezystory | 0 A | 2300 W |
| P2 | C, R, L i napięcie U_BA | 3,66 A | 750 W |
| P3 | Symetryczny 30 + j40 | 8 A | 5097 W |
| P4 | Watomierz na fazie C | 6,35 A | 1209,7 W |
| P5 | E_A = −220 V | 54,64 A | −3810,5 W |
| P6 | E_A = −j220 i R, L, C | 10 A | 1905,3 W |
| P7 | Symetryczny pojemnościowy | 16,26 A | 6258,1 W |
| P8 | Impedancja 12 + j16 i watomierz fazowy | 12,38 A | 2400 W |
| P9 | E_A = −j200 i impedancja 6 + j8 | 21,18 A | 3464,1 W |
| P10 | E_A = −100 + j100 – druga ćwiartka | 33,86 A | 4732,1 W |

## Część 1 – zadania z opracowaniem (z krasnalem)

### L1. R, L, C z przewodem neutralnym

_Klasyk z tablicy: w każdej fazie inny element. Uczymy się całego schematu od początku do końca._

**Dane**

- E_A = 220 V
- faza A: R = 22 Ω (rezystor)
- faza B: X_L = 22 Ω (cewka)
- faza C: X_C = 22 Ω (kondensator)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy C
- watomierz: prąd I_A, napięcie U_AB (przewody A → B)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 220 V | 220 V |
| 1. Źródła | E_B | 220 · e^(−j120°) V | −110 − j190,5 V |
| 1. Źródła | E_C | 220 · e^(j120°) V | −110 + j190,5 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 22 Ω | 22 Ω |
| 3. Impedancje | Z_B | 22 · e^(j90°) Ω | j22 Ω |
| 3. Impedancje | Z_C | 22 · e^(−j90°) Ω | −j22 Ω |
| 4. Prądy I = U/Z | I_A | 10 A | 10 A |
| 4. Prądy I = U/Z | I_B | 10 · e^(j150°) A | −8,66 + j5 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(−j150°) A | −8,66 − j5 A |
| 5. Kirchhoff | I_N | 7,321 · e^(j180°) A | −7,321 A |
| 7. Napięcie watomierza | U_AB | 381,1 (= 220√3) · e^(j30°) V | 330 + j190,5 V |

- **Amperomierz:** (A) = |I_C| = **10 A**
- **Watomierz:** φ_U = 30°, φ_I = 0°, ψ = φ_U − φ_I = 30°  
  P = |U_AB| · |I_A| · cos ψ = 381,1 · 10 · cos(30°) = 381,1 · 10 · 0,866 = **3300 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 2200 W (watomierz pojedynczy nie musi jej pokazywać).

### L2. Napięcie podane jako j220

_Tu E_A leży na osi urojonej. Zobaczysz, jak cały wykres „obraca się” o 90° i jak watomierz mierzy U_AC._

**Dane**

- E_A = j220 V
- faza A: Z_A = R = 10 Ω (rezystor)
- faza B: Z_B = jX_L = j5 Ω (cewka)
- faza C: Z_C = −jX_C = −j10 Ω (kondensator)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy A
- watomierz: prąd I_A, napięcie U_AC (przewody A → C)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 220 · e^(j90°) V | j220 V |
| 1. Źródła | E_B | 220 · e^(−j30°) V | 190,5 − j110 V |
| 1. Źródła | E_C | 220 · e^(−j150°) V | −190,5 − j110 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 10 Ω | 10 Ω |
| 3. Impedancje | Z_B | 5 · e^(j90°) Ω | j5 Ω |
| 3. Impedancje | Z_C | 10 · e^(−j90°) Ω | −j10 Ω |
| 4. Prądy I = U/Z | I_A | 22 · e^(j90°) A | j22 A |
| 4. Prądy I = U/Z | I_B | 44 · e^(−j120°) A | −22 − j38,11 A |
| 4. Prądy I = U/Z | I_C | 22 · e^(−j60°) A | 11 − j19,05 A |
| 5. Kirchhoff | I_N | 36,84 · e^(−j107,4°) A | −11 − j35,16 A |
| 7. Napięcie watomierza | U_AC | 381,1 (= 220√3) · e^(j60°) V | 190,5 + j330 V |

- **Amperomierz:** (A) = |I_A| = **22 A**
- **Watomierz:** φ_U = 60°, φ_I = 90°, ψ = φ_U − φ_I = −30°  
  P = |U_AC| · |I_A| · cos ψ = 381,1 · 22 · cos(−30°) = 381,1 · 22 · 0,866 = **7260 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 4840 W (watomierz pojedynczy nie musi jej pokazywać).

### L3. Odbiornik symetryczny

_Trzy jednakowe impedancje. Prądy same się zerują, a watomierz mierzy prąd I_B i napięcie U_BC._

**Dane**

- E_A = j400 V
- faza A: Z = 20 − j20 Ω (impedancja ogólna)
- faza B: Z = 20 − j20 Ω (impedancja ogólna)
- faza C: Z = 20 − j20 Ω (impedancja ogólna)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy A
- watomierz: prąd I_B, napięcie U_BC (przewody B → C)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 400 · e^(j90°) V | j400 V |
| 1. Źródła | E_B | 400 · e^(−j30°) V | 346,4 − j200 V |
| 1. Źródła | E_C | 400 · e^(−j150°) V | −346,4 − j200 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 28,28 (= 20√2) · e^(−j45°) Ω | 20 − j20 Ω |
| 3. Impedancje | Z_B | 28,28 (= 20√2) · e^(−j45°) Ω | 20 − j20 Ω |
| 3. Impedancje | Z_C | 28,28 (= 20√2) · e^(−j45°) Ω | 20 − j20 Ω |
| 4. Prądy I = U/Z | I_A | 14,14 (= 10√2) · e^(j135°) A | −10 + j10 A |
| 4. Prądy I = U/Z | I_B | 14,14 (= 10√2) · e^(j15°) A | 13,66 + j3,66 A |
| 4. Prądy I = U/Z | I_C | 14,14 (= 10√2) · e^(−j105°) A | −3,66 − j13,66 A |
| 5. Kirchhoff | I_N | 0 A | 0 A |
| 7. Napięcie watomierza | U_BC | 692,8 (= 400√3) V | 692,8 V |

- **Amperomierz:** (A) = |I_A| = **14,14 A**
- **Watomierz:** φ_U = 0°, φ_I = 15°, ψ = φ_U − φ_I = −15°  
  P = |U_BC| · |I_B| · cos ψ = 692,8 · 14,14 · cos(−15°) = 692,8 · 14,14 · 0,966 = **9464,1 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 12000 W (watomierz pojedynczy nie musi jej pokazywać).

### L4. Watomierz, który pokazuje zero

_Watomierz mierzy prąd cewki i napięcie fazowe. Wynik 0 W to nie błąd – zobaczysz dlaczego._

**Dane**

- E_A = 100 V
- faza A: Z_A = jX_L = j10 Ω (cewka)
- faza B: Z_B = 20 + j20 Ω (impedancja ogólna)
- faza C: Z_C = R = 10 Ω (rezystor)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy C
- watomierz: prąd I_A, napięcie U_A (przewód A – N)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 100 V | 100 V |
| 1. Źródła | E_B | 100 · e^(−j120°) V | −50 − j86,6 V |
| 1. Źródła | E_C | 100 · e^(j120°) V | −50 + j86,6 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 10 · e^(j90°) Ω | j10 Ω |
| 3. Impedancje | Z_B | 28,28 (= 20√2) · e^(j45°) Ω | 20 + j20 Ω |
| 3. Impedancje | Z_C | 10 Ω | 10 Ω |
| 4. Prądy I = U/Z | I_A | 10 · e^(−j90°) A | −j10 A |
| 4. Prądy I = U/Z | I_B | 3,536 (= 2,5√2) · e^(−j165°) A | −3,415 − j0,9151 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(j120°) A | −5 + j8,66 A |
| 5. Kirchhoff | I_N | 8,712 · e^(−j165°) A | −8,415 − j2,255 A |
| 7. Napięcie watomierza | U_A | 100 V | 100 V |

- **Amperomierz:** (A) = |I_C| = **10 A**
- **Watomierz:** φ_U = 0°, φ_I = −90°, ψ = φ_U − φ_I = 90°  
  P = |U_A| · |I_A| · cos ψ = 100 · 10 · cos(90°) = 100 · 10 · 0 = **0 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 1250 W (watomierz pojedynczy nie musi jej pokazywać).

### L5. Amperomierz w przewodzie neutralnym

_Impedancje podane w postaci x + jy z pierwiastkiem. Amperomierz mierzy I_N, watomierz – prąd I_C i napięcie U_CB (indeksy „pod prąd”!)._

**Dane**

- E_A = 230 V
- faza A: Z_A = 20 Ω (rezystor)
- faza B: Z_B = 10 − j10√3 Ω (impedancja ogólna)
- faza C: Z_C = 10 + j10√3 Ω (impedancja ogólna)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_C, napięcie U_CB (przewody C → B)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 230 V | 230 V |
| 1. Źródła | E_B | 230 · e^(−j120°) V | −115 − j199,2 V |
| 1. Źródła | E_C | 230 · e^(j120°) V | −115 + j199,2 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 20 Ω | 20 Ω |
| 3. Impedancje | Z_B | 20 · e^(−j60°) Ω | 10 − j17,32 Ω |
| 3. Impedancje | Z_C | 20 · e^(j60°) Ω | 10 + j17,32 Ω |
| 4. Prądy I = U/Z | I_A | 11,5 A | 11,5 A |
| 4. Prądy I = U/Z | I_B | 11,5 · e^(−j60°) A | 5,75 − j9,959 A |
| 4. Prądy I = U/Z | I_C | 11,5 · e^(j60°) A | 5,75 + j9,959 A |
| 5. Kirchhoff | I_N | 23 A | 23 A |
| 7. Napięcie watomierza | U_CB | 398,4 (= 230√3) · e^(j90°) V | j398,4 V |

- **Amperomierz:** (A) = |I_N| = **23 A**
- **Watomierz:** φ_U = 90°, φ_I = 60°, ψ = φ_U − φ_I = 30°  
  P = |U_CB| · |I_C| · cos ψ = 398,4 · 11,5 · cos(30°) = 398,4 · 11,5 · 0,866 = **3967,5 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 5290 W (watomierz pojedynczy nie musi jej pokazywać).

### L6. Minus przed j: E_A = −j230

_Napięcie skierowane „w dół”, czyli pod kątem −90°. Kondensator w fazie A, cewka w fazie C, watomierz mierzy prąd I_C i napięcie U_CB._

**Dane**

- E_A = −j230 V
- faza A: Z_A = −jX_C = −j23 Ω (kondensator)
- faza B: Z_B = R = 23 Ω (rezystor)
- faza C: Z_C = jX_L = j23 Ω (cewka)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy B
- watomierz: prąd I_C, napięcie U_CB (przewody C → B)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 230 · e^(−j90°) V | −j230 V |
| 1. Źródła | E_B | 230 · e^(j150°) V | −199,2 + j115 V |
| 1. Źródła | E_C | 230 · e^(j30°) V | 199,2 + j115 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 23 · e^(−j90°) Ω | −j23 Ω |
| 3. Impedancje | Z_B | 23 Ω | 23 Ω |
| 3. Impedancje | Z_C | 23 · e^(j90°) Ω | j23 Ω |
| 4. Prądy I = U/Z | I_A | 10 A | 10 A |
| 4. Prądy I = U/Z | I_B | 10 · e^(j150°) A | −8,66 + j5 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(−j60°) A | 5 − j8,66 A |
| 5. Kirchhoff | I_N | 7,321 · e^(−j30°) A | 6,34 − j3,66 A |
| 7. Napięcie watomierza | U_CB | 398,4 (= 230√3) V | 398,4 V |

- **Amperomierz:** (A) = |I_B| = **10 A**
- **Watomierz:** φ_U = 0°, φ_I = −60°, ψ = φ_U − φ_I = 60°  
  P = |U_CB| · |I_C| · cos ψ = 398,4 · 10 · cos(60°) = 398,4 · 10 · 0,5 = **1991,9 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 2300 W (watomierz pojedynczy nie musi jej pokazywać).

### L7. E_A z ujemną częścią rzeczywistą

_E_A = −110 + j110√3 – najpierw trzeba je zamienić na moduł i kąt. Pułapka z arctg: punkt leży w II ćwiartce!_

**Dane**

- E_A = −110 + j110√3 V
- faza A: Z_A = 11 + j11 Ω (impedancja ogólna)
- faza B: Z_B = 22 Ω (rezystor)
- faza C: Z_C = −j22 Ω (kondensator)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_B, napięcie U_BA (przewody B → A)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 220 · e^(j120°) V | −110 + j190,5 V |
| 1. Źródła | E_B | 220 V | 220 V |
| 1. Źródła | E_C | 220 · e^(−j120°) V | −110 − j190,5 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 15,56 (= 11√2) · e^(j45°) Ω | 11 + j11 Ω |
| 3. Impedancje | Z_B | 22 Ω | 22 Ω |
| 3. Impedancje | Z_C | 22 · e^(−j90°) Ω | −j22 Ω |
| 4. Prądy I = U/Z | I_A | 14,14 (= 10√2) · e^(j75°) A | 3,66 + j13,66 A |
| 4. Prądy I = U/Z | I_B | 10 A | 10 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(−j30°) A | 8,66 − j5 A |
| 5. Kirchhoff | I_N | 23,94 · e^(j21,2°) A | 22,32 + j8,66 A |
| 7. Napięcie watomierza | U_BA | 381,1 (= 220√3) · e^(−j30°) V | 330 − j190,5 V |

- **Amperomierz:** (A) = |I_N| = **23,94 A**
- **Watomierz:** φ_U = −30°, φ_I = 0°, ψ = φ_U − φ_I = −30°  
  P = |U_BA| · |I_B| · cos ψ = 381,1 · 10 · cos(−30°) = 381,1 · 10 · 0,866 = **3300 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 4400 W (watomierz pojedynczy nie musi jej pokazywać).

### L8. E_A = −127 V i odbiornik 8 − j6

_Minus przed liczbą rzeczywistą to obrót o 180°. Odbiornik symetryczny, impedancja z „nieokrągłym” kątem._

**Dane**

- E_A = −127 V
- faza A: Z = 8 − j6 Ω (impedancja ogólna)
- faza B: Z = 8 − j6 Ω (impedancja ogólna)
- faza C: Z = 8 − j6 Ω (impedancja ogólna)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy C
- watomierz: prąd I_A, napięcie U_AB (przewody A → B)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 127 · e^(j180°) V | −127 V |
| 1. Źródła | E_B | 127 · e^(j60°) V | 63,5 + j110 V |
| 1. Źródła | E_C | 127 · e^(−j60°) V | 63,5 − j110 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 10 · e^(−j36,9°) Ω | 8 − j6 Ω |
| 3. Impedancje | Z_B | 10 · e^(−j36,9°) Ω | 8 − j6 Ω |
| 3. Impedancje | Z_C | 10 · e^(−j36,9°) Ω | 8 − j6 Ω |
| 4. Prądy I = U/Z | I_A | 12,7 · e^(−j143,1°) A | −10,16 − j7,62 A |
| 4. Prądy I = U/Z | I_B | 12,7 · e^(j96,9°) A | −1,519 + j12,61 A |
| 4. Prądy I = U/Z | I_C | 12,7 · e^(−j23,1°) A | 11,68 − j4,989 A |
| 5. Kirchhoff | I_N | 0 A | 0 A |
| 7. Napięcie watomierza | U_AB | 220 (= 127√3) · e^(−j150°) V | −190,5 − j110 V |

- **Amperomierz:** (A) = |I_C| = **12,7 A**
- **Watomierz:** φ_U = −150°, φ_I = −143,1°, ψ = φ_U − φ_I = −6,9°  
  P = |U_AB| · |I_A| · cos ψ = 220 · 12,7 · cos(−6,9°) = 220 · 12,7 · 0,993 = **2773,6 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 3871 W (watomierz pojedynczy nie musi jej pokazywać).

### L9. Watomierz pokazuje wartość ujemną

_Kondensator w fazie A: prąd I_A wyprzedza napięcie o 90°, a U_AC spóźnia się za E_A o 30°. Kąt między nimi to 120°, cos jest ujemny._

**Dane**

- E_A = 100 V
- faza A: Z_A = −jX_C = −j10 Ω (kondensator)
- faza B: Z_B = jX_L = j10 Ω (cewka)
- faza C: Z_C = R = 10 Ω (rezystor)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy B
- watomierz: prąd I_A, napięcie U_AC (przewody A → C)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 100 V | 100 V |
| 1. Źródła | E_B | 100 · e^(−j120°) V | −50 − j86,6 V |
| 1. Źródła | E_C | 100 · e^(j120°) V | −50 + j86,6 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 10 · e^(−j90°) Ω | −j10 Ω |
| 3. Impedancje | Z_B | 10 · e^(j90°) Ω | j10 Ω |
| 3. Impedancje | Z_C | 10 Ω | 10 Ω |
| 4. Prądy I = U/Z | I_A | 10 · e^(j90°) A | j10 A |
| 4. Prądy I = U/Z | I_B | 10 · e^(j150°) A | −8,66 + j5 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(j120°) A | −5 + j8,66 A |
| 5. Kirchhoff | I_N | 27,32 · e^(j120°) A | −13,66 + j23,66 A |
| 7. Napięcie watomierza | U_AC | 173,2 (= 100√3) · e^(−j30°) V | 150 − j86,6 V |

- **Amperomierz:** (A) = |I_B| = **10 A**
- **Watomierz:** φ_U = −30°, φ_I = 90°, ψ = φ_U − φ_I = −120°  
  P = |U_AC| · |I_A| · cos ψ = 173,2 · 10 · cos(−120°) = 173,2 · 10 · (−0,5) = **−866 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 1000 W (watomierz pojedynczy nie musi jej pokazywać).

### L10. Ujemny kąt E_A

_E_A = 200·e^(−j30°) – od ujemnego kąta też odejmujemy 120° i 240°. Watomierz w fazie C mierzy napięcie U_CA._

**Dane**

- E_A = 200·e^(−j30°) V
- faza A: Z_A = 20 Ω (rezystor)
- faza B: Z_B = 10 + j10√3 Ω (impedancja ogólna)
- faza C: Z_C = 10 − j10√3 Ω (impedancja ogólna)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy A
- watomierz: prąd I_C, napięcie U_CA (przewody C → A)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 200 · e^(−j30°) V | 173,2 − j100 V |
| 1. Źródła | E_B | 200 · e^(−j150°) V | −173,2 − j100 V |
| 1. Źródła | E_C | 200 · e^(j90°) V | j200 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 20 Ω | 20 Ω |
| 3. Impedancje | Z_B | 20 · e^(j60°) Ω | 10 + j17,32 Ω |
| 3. Impedancje | Z_C | 20 · e^(−j60°) Ω | 10 − j17,32 Ω |
| 4. Prądy I = U/Z | I_A | 10 · e^(−j30°) A | 8,66 − j5 A |
| 4. Prądy I = U/Z | I_B | 10 · e^(j150°) A | −8,66 + j5 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(j150°) A | −8,66 + j5 A |
| 5. Kirchhoff | I_N | 10 · e^(j150°) A | −8,66 + j5 A |
| 7. Napięcie watomierza | U_CA | 346,4 (= 200√3) · e^(j120°) V | −173,2 + j300 V |

- **Amperomierz:** (A) = |I_A| = **10 A**
- **Watomierz:** φ_U = 120°, φ_I = 150°, ψ = φ_U − φ_I = −30°  
  P = |U_CA| · |I_C| · cos ψ = 346,4 · 10 · cos(−30°) = 346,4 · 10 · 0,866 = **3000 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 4000 W (watomierz pojedynczy nie musi jej pokazywać).

## Część 2 – zadania do samodzielnego rozwiązania

### P1. Trzy rezystory

**Dane**

- E_A = 230 V
- faza A: R = 23 Ω (rezystor)
- faza B: R = 23 Ω (rezystor)
- faza C: R = 23 Ω (rezystor)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_A, napięcie U_A (przewód A – N)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 230 V | 230 V |
| 1. Źródła | E_B | 230 · e^(−j120°) V | −115 − j199,2 V |
| 1. Źródła | E_C | 230 · e^(j120°) V | −115 + j199,2 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 23 Ω | 23 Ω |
| 3. Impedancje | Z_B | 23 Ω | 23 Ω |
| 3. Impedancje | Z_C | 23 Ω | 23 Ω |
| 4. Prądy I = U/Z | I_A | 10 A | 10 A |
| 4. Prądy I = U/Z | I_B | 10 · e^(−j120°) A | −5 − j8,66 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(j120°) A | −5 + j8,66 A |
| 5. Kirchhoff | I_N | 0 A | 0 A |
| 7. Napięcie watomierza | U_A | 230 V | 230 V |

- **Amperomierz:** (A) = |I_N| = **0 A**
- **Watomierz:** φ_U = 0°, φ_I = 0°, ψ = φ_U − φ_I = 0°  
  P = |U_A| · |I_A| · cos ψ = 230 · 10 · cos(0°) = 230 · 10 · 1 = **2300 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 6900 W (watomierz pojedynczy nie musi jej pokazywać).

### P2. C, R, L i napięcie U_BA

**Dane**

- E_A = j100 V
- faza A: Z_A = −j20 Ω (kondensator)
- faza B: Z_B = 20 Ω (rezystor)
- faza C: Z_C = j20 Ω (cewka)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_B, napięcie U_BA (przewody B → A)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 100 · e^(j90°) V | j100 V |
| 1. Źródła | E_B | 100 · e^(−j30°) V | 86,6 − j50 V |
| 1. Źródła | E_C | 100 · e^(−j150°) V | −86,6 − j50 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 20 · e^(−j90°) Ω | −j20 Ω |
| 3. Impedancje | Z_B | 20 Ω | 20 Ω |
| 3. Impedancje | Z_C | 20 · e^(j90°) Ω | j20 Ω |
| 4. Prądy I = U/Z | I_A | 5 · e^(j180°) A | −5 A |
| 4. Prądy I = U/Z | I_B | 5 · e^(−j30°) A | 4,33 − j2,5 A |
| 4. Prądy I = U/Z | I_C | 5 · e^(j120°) A | −2,5 + j4,33 A |
| 5. Kirchhoff | I_N | 3,66 · e^(j150°) A | −3,17 + j1,83 A |
| 7. Napięcie watomierza | U_BA | 173,2 (= 100√3) · e^(−j60°) V | 86,6 − j150 V |

- **Amperomierz:** (A) = |I_N| = **3,66 A**
- **Watomierz:** φ_U = −60°, φ_I = −30°, ψ = φ_U − φ_I = −30°  
  P = |U_BA| · |I_B| · cos ψ = 173,2 · 5 · cos(−30°) = 173,2 · 5 · 0,866 = **750 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 500 W (watomierz pojedynczy nie musi jej pokazywać).

### P3. Symetryczny 30 + j40

**Dane**

- E_A = 400 V
- faza A: Z = 30 + j40 Ω (impedancja ogólna)
- faza B: Z = 30 + j40 Ω (impedancja ogólna)
- faza C: Z = 30 + j40 Ω (impedancja ogólna)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy A
- watomierz: prąd I_A, napięcie U_AC (przewody A → C)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 400 V | 400 V |
| 1. Źródła | E_B | 400 · e^(−j120°) V | −200 − j346,4 V |
| 1. Źródła | E_C | 400 · e^(j120°) V | −200 + j346,4 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 50 · e^(j53,1°) Ω | 30 + j40 Ω |
| 3. Impedancje | Z_B | 50 · e^(j53,1°) Ω | 30 + j40 Ω |
| 3. Impedancje | Z_C | 50 · e^(j53,1°) Ω | 30 + j40 Ω |
| 4. Prądy I = U/Z | I_A | 8 · e^(−j53,1°) A | 4,8 − j6,4 A |
| 4. Prądy I = U/Z | I_B | 8 · e^(−j173,1°) A | −7,943 − j0,9569 A |
| 4. Prądy I = U/Z | I_C | 8 · e^(j66,9°) A | 3,143 + j7,357 A |
| 5. Kirchhoff | I_N | 0 A | 0 A |
| 7. Napięcie watomierza | U_AC | 692,8 (= 400√3) · e^(−j30°) V | 600 − j346,4 V |

- **Amperomierz:** (A) = |I_A| = **8 A**
- **Watomierz:** φ_U = −30°, φ_I = −53,1°, ψ = φ_U − φ_I = 23,1°  
  P = |U_AC| · |I_A| · cos ψ = 692,8 · 8 · cos(23,1°) = 692,8 · 8 · 0,92 = **5097 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 5760 W (watomierz pojedynczy nie musi jej pokazywać).

### P4. Watomierz na fazie C

**Dane**

- E_A = j127 V
- faza A: Z_A = 10 + j10 Ω (impedancja ogólna)
- faza B: Z_B = −j20 Ω (kondensator)
- faza C: Z_C = 20 Ω (rezystor)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy B
- watomierz: prąd I_C, napięcie U_CB (przewody C → B)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 127 · e^(j90°) V | j127 V |
| 1. Źródła | E_B | 127 · e^(−j30°) V | 110 − j63,5 V |
| 1. Źródła | E_C | 127 · e^(−j150°) V | −110 − j63,5 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 14,14 (= 10√2) · e^(j45°) Ω | 10 + j10 Ω |
| 3. Impedancje | Z_B | 20 · e^(−j90°) Ω | −j20 Ω |
| 3. Impedancje | Z_C | 20 Ω | 20 Ω |
| 4. Prądy I = U/Z | I_A | 8,98 · e^(j45°) A | 6,35 + j6,35 A |
| 4. Prądy I = U/Z | I_B | 6,35 · e^(j60°) A | 3,175 + j5,499 A |
| 4. Prądy I = U/Z | I_C | 6,35 · e^(−j150°) A | −5,499 − j3,175 A |
| 5. Kirchhoff | I_N | 9,563 · e^(j65,1°) A | 4,026 + j8,674 A |
| 7. Napięcie watomierza | U_CB | 220 (= 127√3) · e^(j180°) V | −220 V |

- **Amperomierz:** (A) = |I_B| = **6,35 A**
- **Watomierz:** φ_U = 180°, φ_I = −150°, ψ = φ_U − φ_I = −30°  
  P = |U_CB| · |I_C| · cos ψ = 220 · 6,35 · cos(−30°) = 220 · 6,35 · 0,866 = **1209,7 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 1612,9 W (watomierz pojedynczy nie musi jej pokazywać).

### P5. E_A = −220 V

**Dane**

- E_A = −220 V
- faza A: Z_A = jX_L = j11 Ω (cewka)
- faza B: Z_B = R = 11 Ω (rezystor)
- faza C: Z_C = −jX_C = −j11 Ω (kondensator)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_A, napięcie U_AB (przewody A → B)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 220 · e^(j180°) V | −220 V |
| 1. Źródła | E_B | 220 · e^(j60°) V | 110 + j190,5 V |
| 1. Źródła | E_C | 220 · e^(−j60°) V | 110 − j190,5 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 11 · e^(j90°) Ω | j11 Ω |
| 3. Impedancje | Z_B | 11 Ω | 11 Ω |
| 3. Impedancje | Z_C | 11 · e^(−j90°) Ω | −j11 Ω |
| 4. Prądy I = U/Z | I_A | 20 · e^(j90°) A | j20 A |
| 4. Prądy I = U/Z | I_B | 20 · e^(j60°) A | 10 + j17,32 A |
| 4. Prądy I = U/Z | I_C | 20 · e^(j30°) A | 17,32 + j10 A |
| 5. Kirchhoff | I_N | 54,64 · e^(j60°) A | 27,32 + j47,32 A |
| 7. Napięcie watomierza | U_AB | 381,1 (= 220√3) · e^(−j150°) V | −330 − j190,5 V |

- **Amperomierz:** (A) = |I_N| = **54,64 A**
- **Watomierz:** φ_U = −150°, φ_I = 90°, ψ = φ_U − φ_I = 120°  
  P = |U_AB| · |I_A| · cos ψ = 381,1 · 20 · cos(120°) = 381,1 · 20 · (−0,5) = **−3810,5 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 4400 W (watomierz pojedynczy nie musi jej pokazywać).

### P6. E_A = −j220 i R, L, C

**Dane**

- E_A = −j220 V
- faza A: Z_A = R = 22 Ω (rezystor)
- faza B: Z_B = jX_L = j22 Ω (cewka)
- faza C: Z_C = −jX_C = −j22 Ω (kondensator)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy C
- watomierz: prąd I_B, napięcie U_BA (przewody B → A)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 220 · e^(−j90°) V | −j220 V |
| 1. Źródła | E_B | 220 · e^(j150°) V | −190,5 + j110 V |
| 1. Źródła | E_C | 220 · e^(j30°) V | 190,5 + j110 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 22 Ω | 22 Ω |
| 3. Impedancje | Z_B | 22 · e^(j90°) Ω | j22 Ω |
| 3. Impedancje | Z_C | 22 · e^(−j90°) Ω | −j22 Ω |
| 4. Prądy I = U/Z | I_A | 10 · e^(−j90°) A | −j10 A |
| 4. Prądy I = U/Z | I_B | 10 · e^(j60°) A | 5 + j8,66 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(j120°) A | −5 + j8,66 A |
| 5. Kirchhoff | I_N | 7,321 · e^(j90°) A | j7,321 A |
| 7. Napięcie watomierza | U_BA | 381,1 (= 220√3) · e^(j120°) V | −190,5 + j330 V |

- **Amperomierz:** (A) = |I_C| = **10 A**
- **Watomierz:** φ_U = 120°, φ_I = 60°, ψ = φ_U − φ_I = 60°  
  P = |U_BA| · |I_B| · cos ψ = 381,1 · 10 · cos(60°) = 381,1 · 10 · 0,5 = **1905,3 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 2200 W (watomierz pojedynczy nie musi jej pokazywać).

### P7. Symetryczny pojemnościowy

**Dane**

- E_A = j230 V
- faza A: Z = 10 − j10 Ω (impedancja ogólna)
- faza B: Z = 10 − j10 Ω (impedancja ogólna)
- faza C: Z = 10 − j10 Ω (impedancja ogólna)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód fazy C
- watomierz: prąd I_C, napięcie U_CA (przewody C → A)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 230 · e^(j90°) V | j230 V |
| 1. Źródła | E_B | 230 · e^(−j30°) V | 199,2 − j115 V |
| 1. Źródła | E_C | 230 · e^(−j150°) V | −199,2 − j115 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 14,14 (= 10√2) · e^(−j45°) Ω | 10 − j10 Ω |
| 3. Impedancje | Z_B | 14,14 (= 10√2) · e^(−j45°) Ω | 10 − j10 Ω |
| 3. Impedancje | Z_C | 14,14 (= 10√2) · e^(−j45°) Ω | 10 − j10 Ω |
| 4. Prądy I = U/Z | I_A | 16,26 (= 11,5√2) · e^(j135°) A | −11,5 + j11,5 A |
| 4. Prądy I = U/Z | I_B | 16,26 (= 11,5√2) · e^(j15°) A | 15,71 + j4,209 A |
| 4. Prądy I = U/Z | I_C | 16,26 (= 11,5√2) · e^(−j105°) A | −4,209 − j15,71 A |
| 5. Kirchhoff | I_N | 0 A | 0 A |
| 7. Napięcie watomierza | U_CA | 398,4 (= 230√3) · e^(−j120°) V | −199,2 − j345 V |

- **Amperomierz:** (A) = |I_C| = **16,26 A**
- **Watomierz:** φ_U = −120°, φ_I = −105°, ψ = φ_U − φ_I = −15°  
  P = |U_CA| · |I_C| · cos ψ = 398,4 · 16,26 · cos(−15°) = 398,4 · 16,26 · 0,966 = **6258,1 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 7935 W (watomierz pojedynczy nie musi jej pokazywać).

### P8. Impedancja 12 + j16 i watomierz fazowy

**Dane**

- E_A = 240 V
- faza A: Z_A = 12 + j16 Ω (impedancja ogólna)
- faza B: Z_B = −j24 Ω (kondensator)
- faza C: Z_C = 24 Ω (rezystor)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_C, napięcie U_C (przewód C – N)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 240 V | 240 V |
| 1. Źródła | E_B | 240 · e^(−j120°) V | −120 − j207,8 V |
| 1. Źródła | E_C | 240 · e^(j120°) V | −120 + j207,8 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 20 · e^(j53,1°) Ω | 12 + j16 Ω |
| 3. Impedancje | Z_B | 24 · e^(−j90°) Ω | −j24 Ω |
| 3. Impedancje | Z_C | 24 Ω | 24 Ω |
| 4. Prądy I = U/Z | I_A | 12 · e^(−j53,1°) A | 7,2 − j9,6 A |
| 4. Prądy I = U/Z | I_B | 10 · e^(−j30°) A | 8,66 − j5 A |
| 4. Prądy I = U/Z | I_C | 10 · e^(j120°) A | −5 + j8,66 A |
| 5. Kirchhoff | I_N | 12,38 · e^(−j28,7°) A | 10,86 − j5,94 A |
| 7. Napięcie watomierza | U_C | 240 · e^(j120°) V | −120 + j207,8 V |

- **Amperomierz:** (A) = |I_N| = **12,38 A**
- **Watomierz:** φ_U = 120°, φ_I = 120°, ψ = φ_U − φ_I = 0°  
  P = |U_C| · |I_C| · cos ψ = 240 · 10 · cos(0°) = 240 · 10 · 1 = **2400 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 4128 W (watomierz pojedynczy nie musi jej pokazywać).

### P9. E_A = −j200 i impedancja 6 + j8

**Dane**

- E_A = −j200 V
- faza A: Z_A = 6 + j8 Ω (impedancja ogólna)
- faza B: Z_B = −j10 Ω (kondensator)
- faza C: Z_C = 10 Ω (rezystor)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_B, napięcie U_BC (przewody B → C)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 200 · e^(−j90°) V | −j200 V |
| 1. Źródła | E_B | 200 · e^(j150°) V | −173,2 + j100 V |
| 1. Źródła | E_C | 200 · e^(j30°) V | 173,2 + j100 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 10 · e^(j53,1°) Ω | 6 + j8 Ω |
| 3. Impedancje | Z_B | 10 · e^(−j90°) Ω | −j10 Ω |
| 3. Impedancje | Z_C | 10 Ω | 10 Ω |
| 4. Prądy I = U/Z | I_A | 20 · e^(−j143,1°) A | −16 − j12 A |
| 4. Prądy I = U/Z | I_B | 20 · e^(−j120°) A | −10 − j17,32 A |
| 4. Prądy I = U/Z | I_C | 20 · e^(j30°) A | 17,32 + j10 A |
| 5. Kirchhoff | I_N | 21,18 · e^(−j114,2°) A | −8,679 − j19,32 A |
| 7. Napięcie watomierza | U_BC | 346,4 (= 200√3) · e^(j180°) V | −346,4 V |

- **Amperomierz:** (A) = |I_N| = **21,18 A**
- **Watomierz:** φ_U = 180°, φ_I = −120°, ψ = φ_U − φ_I = −60°  
  P = |U_BC| · |I_B| · cos ψ = 346,4 · 20 · cos(−60°) = 346,4 · 20 · 0,5 = **3464,1 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 6400 W (watomierz pojedynczy nie musi jej pokazywać).

### P10. E_A = −100 + j100 – druga ćwiartka

**Dane**

- E_A = −100 + j100 V
- faza A: Z_A = j10 Ω (cewka)
- faza B: Z_B = 10 Ω (rezystor)
- faza C: Z_C = 5 − j5 Ω (impedancja ogólna)
- przewód neutralny: TAK, bez impedancji
- amperomierz: przewód neutralny
- watomierz: prąd I_C, napięcie U_CA (przewody C → A)

**Rozwiązanie**

| Krok | Wielkość | Postać wykładnicza | Postać algebraiczna |
|---|---|---|---|
| 1. Źródła | E_A | 141,4 (= 100√2) · e^(j135°) V | −100 + j100 V |
| 1. Źródła | E_B | 141,4 (= 100√2) · e^(j15°) V | 136,6 + j36,6 V |
| 1. Źródła | E_C | 141,4 (= 100√2) · e^(−j105°) V | −36,6 − j136,6 V |
| 2. Napięcie N–N' | U_N | 0 | przewód N bez oporu |
| 3. Impedancje | Z_A | 10 · e^(j90°) Ω | j10 Ω |
| 3. Impedancje | Z_B | 10 Ω | 10 Ω |
| 3. Impedancje | Z_C | 7,071 (= 5√2) · e^(−j45°) Ω | 5 − j5 Ω |
| 4. Prądy I = U/Z | I_A | 14,14 (= 10√2) · e^(j45°) A | 10 + j10 A |
| 4. Prądy I = U/Z | I_B | 14,14 (= 10√2) · e^(j15°) A | 13,66 + j3,66 A |
| 4. Prądy I = U/Z | I_C | 20 · e^(−j60°) A | 10 − j17,32 A |
| 5. Kirchhoff | I_N | 33,86 · e^(−j6,2°) A | 33,66 − j3,66 A |
| 7. Napięcie watomierza | U_CA | 244,9 (= 100√6) · e^(−j75°) V | 63,4 − j236,6 V |

- **Amperomierz:** (A) = |I_N| = **33,86 A**
- **Watomierz:** φ_U = −75°, φ_I = −60°, ψ = φ_U − φ_I = −15°  
  P = |U_CA| · |I_C| · cos ψ = 244,9 · 20 · cos(−15°) = 244,9 · 20 · 0,966 = **4732,1 W**
- _Kontrola:_ całkowita moc czynna odbiornika Σ|I|²·R = 4000 W (watomierz pojedynczy nie musi jej pokazywać).
