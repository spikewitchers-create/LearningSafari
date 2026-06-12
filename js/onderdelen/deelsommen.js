const LEERDOEL = 'rek-gr5-blok5-deelsom-keersom';

function hints(a, b, c) {
  // Rij stopt één stap vóór het deeltal — kind telt de laatste stap zelf
  const rijZonderLaatste = Array.from({ length: c - 1 }, (_, i) => (i + 1) * b).join(' → ');
  const voorlaatste = (c - 1) * b;
  return [
    `Zoek de keersom: ? × ${b} = ${a}.`,
    c > 1
      ? `Tel de rij van ${b}: ${rijZonderLaatste} → ? (nog één stap van ${b} bij ${voorlaatste}).`
      : `${b} × 1 = ${b}, dus ${b} ÷ ${b} = 1.`,
    `Het antwoord is ${c}.`
  ];
}

export function genereerItems() {
  const items = [];
  for (let b = 1; b <= 10; b++) {
    for (let c = 1; c <= 10; c++) {
      const a = b * c;
      items.push({
        id: `deelsom-${a}d${b}`,
        vraag: `${a} ÷ ${b}`,
        antwoord: String(c),
        leerdoel: LEERDOEL,
        hints: hints(a, b, c),
        keuzes: []
      });
    }
  }
  return items;
}
