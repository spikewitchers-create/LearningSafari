const LEERDOEL = 'rek-gr5-blok5-deelsom-keersom';

function hints(a, b, c) {
  const rij = Array.from({ length: c }, (_, i) => (i + 1) * b).join(' → ');
  return [
    `Zoek de keersom: ? × ${b} = ${a}.`,
    `Tel de rij van ${b} tot je ${a} bereikt: ${rij}. Dat zijn ${c} stappen.`,
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
