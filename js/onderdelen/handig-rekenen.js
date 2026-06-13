// Handig rekenen — blok 10
import { driehoek } from '../hint-svg.js';
// Strategie: zoek twee getallen die samen een rond getal maken (bijv. 35+65=100)
// Dan tel het derde getal erbij: 35 + 53 + 65 → (35+65) + 53 = 100 + 53 = 153

// Paren die samen 100 geven
const PAREN100 = [
  [15, 85], [20, 80], [25, 75], [30, 70],
  [35, 65], [40, 60], [45, 55],
];

// Paren die samen 50 geven
const PAREN50 = [
  [15, 35], [20, 30], [25, 25],
];

// Middelste getallen (niet een van de paren)
const MIDDENS = [12, 13, 14, 16, 17, 18, 21, 22, 23, 24, 26, 27, 28, 31, 32, 33, 34, 36, 37, 38, 41, 42, 43, 44, 46, 47, 48, 51, 52, 53];

function hintsVoor100(a, k, b) {
  return [
    `Kijk of twee getallen samen 100 (of een ander rond getal) maken.`,
    `${a} + ${b} = 100. Dan: 100 + ${k} = ?`,
  ];
}

function hintsVoor50(a, k, b) {
  return [
    `Kijk of twee getallen samen 50 (of een ander rond getal) maken.`,
    `${a} + ${b} = 50. Dan: 50 + ${k} = ?`,
  ];
}

export function genereerItems() {
  const items = [];

  // Sommen naar 100
  for (const [a, b] of PAREN100) {
    for (const k of MIDDENS) {
      // Vermijd dat k gelijk is aan a of b
      if (k === a || k === b) continue;
      // Varieer volgorde: a+k+b
      items.push({
        id: `handig-${a}-${k}-${b}`,
        vraag: `Reken handig: ${a} + ${k} + ${b} = ?`,
        antwoord: 100 + k,
        leerdoel: `Handig rekenen: zoek getallen die samen 100 geven`,
        hints: hintsVoor100(a, k, b),
        hintSvg: driehoek(a, k, b, 100),
      });
    }
  }

  // Sommen naar 50
  for (const [a, b] of PAREN50) {
    for (const k of [11, 12, 13, 16, 17, 18, 21, 22, 23, 24, 26, 27]) {
      if (k === a || k === b) continue;
      items.push({
        id: `handig-${a}-${k}-${b}`,
        vraag: `Reken handig: ${a} + ${k} + ${b} = ?`,
        antwoord: 50 + k,
        leerdoel: `Handig rekenen: zoek getallen die samen 50 geven`,
        hints: hintsVoor50(a, k, b),
        hintSvg: driehoek(a, k, b, 50),
      });
    }
  }

  // Dedupliceer
  const gezien = new Set();
  return items.filter(it => {
    if (gezien.has(it.id)) return false;
    gezien.add(it.id);
    return true;
  });
}
