const LEERDOEL = 'rek-gr5-blok5-deelsom-keersom';

function hints(a, b, c) {
  let hint2;
  if (c === 1) {
    hint2 = `${b} × 1 = ${b}, dus ${b} ÷ ${b} = 1.`;
  } else {
    // Toon max floor(c/2) stappen — kind telt zelf verder naar het antwoord
    const toonStappen = Math.max(1, Math.floor(c / 2));
    const deelRij = Array.from({ length: toonStappen }, (_, i) => (i + 1) * b).join(', ');
    hint2 = `Tel de rij van ${b}: ${deelRij}, ... Ga verder tellen tot je ${a} bereikt. Hoeveel stappen heb je gezet?`;
  }
  return [
    `Zoek de keersom: ? × ${b} = ${a}. Welk getal maal ${b} geeft ${a}?`,
    hint2,
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
