// Deelsommen met rest — groep 5, Pluspunt blok 6/7
// Strategie: keersom zoeken, dan rest bepalen
// Twee vraagtypes per combinatie: quotient en rest apart

const LEERDOEL = 'rek-gr5-deelsommen-rest';

function hintsQuotient(a, b, c, r) {
  const toonStappen = Math.max(1, Math.floor(c / 2));
  const rij = Array.from({ length: toonStappen }, (_, i) => (i + 1) * b).join(', ');
  return [
    `Keersom zoeken: ? × ${b} komt het dichtst bij ${a}. Tel de rij van ${b}.`,
    `Rij van ${b}: ${rij}, ... Ga door tot je het grootste veelvoud van ${b} onder ${a} bereikt. Hoeveel stappen?`,
    `Het antwoord is ${c} (want ${c} × ${b} = ${c * b}, en dat past in ${a}).`,
  ];
}

function hintsRest(a, b, c, r) {
  return [
    `Bereken eerst hoeveel keer ${b} in ${a} past (zonder rest), dan zie je wat er overblijft.`,
    `${c} × ${b} = ${c * b}. Hoeveel is er over van ${a} na ${c * b}?`,
    `Het antwoord is ${r} (want ${c} × ${b} = ${c * b}, en ${a} − ${c * b} = ${r}).`,
  ];
}

// Genereer sommen: delers 2-9, deeltal 10-99, rest > 0
export function genereerItems() {
  const items = [];
  // Vaste selectie die de leerstof dekt zonder te veel items
  const sommen = [
    [17, 3], [23, 4], [29, 5], [31, 6], [37, 7], [41, 8], [43, 9],
    [19, 4], [26, 7], [33, 8], [38, 9], [47, 6], [52, 7], [53, 8],
    [58, 9], [61, 7], [67, 8], [71, 9], [34, 9], [46, 8],
    [25, 4], [32, 7], [44, 6], [55, 8], [63, 9], [74, 8], [83, 9],
    [27, 4], [35, 6], [49, 8], [56, 9], [65, 7], [76, 9], [85, 6],
  ];

  for (const [a, b] of sommen) {
    const c = Math.floor(a / b);
    const r = a % b;
    if (r === 0) continue; // geen rest — niet voor dit onderdeel

    items.push({
      id: `deelrest-quot-${a}-${b}`,
      vraag: `Hoe vaak past ${b} in ${a}? (${a} : ${b} = ?)`,
      antwoord: c,
      leerdoel: LEERDOEL,
      hints: hintsQuotient(a, b, c, r),
    });

    items.push({
      id: `deelrest-rest-${a}-${b}`,
      vraag: `Wat is de rest bij ${a} : ${b}?`,
      antwoord: r,
      leerdoel: LEERDOEL,
      hints: hintsRest(a, b, c, r),
    });
  }

  return items;
}
