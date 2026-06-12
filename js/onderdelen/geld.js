// Geld — groep 5, Pluspunt blok 8
// Aanvullen tot hele euro's en verschil berekenen
// Antwoorden altijd in hele centen (integer) om decimale invoer te vermijden

const LEERDOEL = 'rek-gr5-geld';

// ── Aanvullen tot volgende hele euro ──────────────────────────────────────────
function hintsAanvulEuro(eurosDeel, centenDeel) {
  const ontbrekend = 100 - centenDeel;
  const volgend = eurosDeel + 1;
  return [
    `Aanvullen: hoever is het van €${eurosDeel},${String(centenDeel).padStart(2, '0')} naar €${volgend},00?`,
    `Je hebt al ${centenDeel} cent van de ${volgend * 100} cent. Je hebt nog ${100} − ${centenDeel} cent nodig.`,
    `Het antwoord is ${ontbrekend} cent.`,
  ];
}

// ── Aanvullen tot rond eurobedrag (meerdere euro's) ───────────────────────────
function hintsAanvulRond(heeftEuro, heeftCent, doelEuro) {
  const heeftTotaal = heeftEuro * 100 + heeftCent;
  const doelTotaal  = doelEuro * 100;
  const ontbrekend  = doelTotaal - heeftTotaal;
  const stap1 = 100 - heeftCent; // aanvullen naar volgende euro
  const stap2 = (doelEuro - heeftEuro - 1) * 100; // volle euro's erbij
  return [
    `Reken in stappen: vul eerst aan naar €${heeftEuro + 1},00, tel dan de rest bij op.`,
    `Van €${heeftEuro},${String(heeftCent).padStart(2, '0')} naar €${heeftEuro + 1},00: dat is ${stap1} cent. Hoeveel euro's zijn er nog van €${heeftEuro + 1},00 naar €${doelEuro},00?`,
    `Het antwoord is ${ontbrekend} cent (= €${Math.floor(ontbrekend / 100)},${String(ontbrekend % 100).padStart(2, '0')}).`,
  ];
}

// ── Verschil tussen twee bedragen (< €1) ──────────────────────────────────────
function hintsVerschilKlein(a, b) {
  // a > b, beiden in cent, uitkomst in cent
  const verschil = a - b;
  return [
    `Trek de kleine centbedragen van elkaar af.`,
    `${a} cent − ${b} cent: reken ${a} − ${Math.floor(b / 10) * 10} = ${a - Math.floor(b / 10) * 10}. Hoeveel is er nog?`,
    `Het antwoord is ${verschil} cent.`,
  ];
}

// ── Verschil tussen twee eurobedragen (> €1) ──────────────────────────────────
function hintsVerschilGroot(aEuro, aCent, bEuro, bCent) {
  const aTotal = aEuro * 100 + aCent;
  const bTotal = bEuro * 100 + bCent;
  const verschil = aTotal - bTotal;
  return [
    `Reken het verschil: trek de bedragen van elkaar af via aanvullen of splitsen.`,
    `Van €${bEuro},${String(bCent).padStart(2, '0')} naar €${aEuro},${String(aCent).padStart(2, '0')}: vul eerst aan naar €${bEuro + 1},00. Dat is ${100 - bCent} cent. Hoeveel is er dan nog?`,
    `Het antwoord is ${verschil} cent (= €${Math.floor(verschil / 100)},${String(verschil % 100).padStart(2, '0')}).`,
  ];
}

export function genereerItems() {
  const items = [];

  // 1. Aanvullen tot volgende euro (cent-deel 10–90, stap 5)
  for (let euros = 1; euros <= 9; euros++) {
    for (const centen of [15, 25, 35, 45, 55, 65, 75, 85]) {
      const ontbrekend = 100 - centen;
      items.push({
        id: `geld-aanvul1-${euros}-${centen}`,
        vraag: `Je hebt €${euros},${String(centen).padStart(2, '0')}. Hoeveel cent heb je nog nodig voor €${euros + 1},00?`,
        antwoord: ontbrekend,
        leerdoel: LEERDOEL,
        hints: hintsAanvulEuro(euros, centen),
      });
    }
  }

  // 2. Aanvullen tot rond bedrag (meerdere euro's verder)
  const aanvulRond = [
    [1, 35, 5], [2, 60, 6], [3, 25, 7], [4, 75, 8], [1, 45, 4],
    [2, 15, 5], [3, 80, 7], [5, 35, 9], [1, 55, 6], [4, 20, 8],
    [2, 70, 6], [3, 40, 7], [1, 65, 5], [2, 85, 5], [4, 55, 9],
  ];
  for (const [hEuro, hCent, doel] of aanvulRond) {
    const ontbrekend = doel * 100 - (hEuro * 100 + hCent);
    items.push({
      id: `geld-aanvulrond-${hEuro}-${hCent}-${doel}`,
      vraag: `Je hebt €${hEuro},${String(hCent).padStart(2, '0')}. Hoeveel cent heb je nog nodig voor €${doel},00?`,
      antwoord: ontbrekend,
      leerdoel: LEERDOEL,
      hints: hintsAanvulRond(hEuro, hCent, doel),
    });
  }

  // 3. Verschil kleiner dan €1 (in centen)
  const verschilKlein = [
    [90, 35], [75, 40], [80, 45], [95, 60], [85, 30],
    [70, 25], [65, 20], [95, 45], [80, 55], [75, 15],
  ];
  for (const [a, b] of verschilKlein) {
    items.push({
      id: `geld-verschilkl-${a}-${b}`,
      vraag: `Hoeveel cent is het verschil tussen ${a} cent en ${b} cent?`,
      antwoord: a - b,
      leerdoel: LEERDOEL,
      hints: hintsVerschilKlein(a, b),
    });
  }

  // 4. Verschil groter dan €1
  const verschilGroot = [
    [5, 30, 2, 80], [7, 15, 3, 60], [6, 50, 2, 75], [8, 20, 4, 65],
    [9, 10, 5, 55], [4, 40, 1, 85], [6, 25, 3, 70], [7, 60, 4, 90],
    [5, 45, 2, 90], [8, 35, 5, 75],
  ];
  for (const [aE, aC, bE, bC] of verschilGroot) {
    const verschil = (aE - bE) * 100 + (aC - bC);
    if (verschil <= 0) continue;
    items.push({
      id: `geld-verschilgr-${aE}-${aC}-${bE}-${bC}`,
      vraag: `Hoeveel cent is het verschil tussen €${aE},${String(aC).padStart(2, '0')} en €${bE},${String(bC).padStart(2, '0')}?`,
      antwoord: verschil,
      leerdoel: LEERDOEL,
      hints: hintsVerschilGroot(aE, aC, bE, bC),
    });
  }

  return items;
}
