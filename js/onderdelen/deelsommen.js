const LEERDOEL = 'rek-gr5-blok5-deelsom-keersom';

function hints(a, b, c) {
  // Toon de eerste helft van de rij (min. 2, max. c-1) — kind telt zelf verder
  const toonStappen = Math.min(Math.max(2, Math.floor(c / 2)), c - 1);
  const deelRij = Array.from({ length: toonStappen }, (_, i) => (i + 1) * b).join(', ');
  return [
    `Zoek de keersom: ? × ${b} = ${a}.`,
    c > 1
      ? `Begin de rij van ${b} te tellen: ${deelRij}, ... Ga verder tot je ${a} bereikt.`
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
