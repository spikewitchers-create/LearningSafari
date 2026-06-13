// Gewichten herleiden – groep 5
const TYPES = [
  {
    prefix: 'kg2g',
    maakVraag: n => `Hoeveel gram is ${n} kg?`,
    bereken: n => n * 1000,
    hint1: '1 kg = 1000 g. Vermenigvuldig met 1000.',
    hint2: n => `${n} kg × 1000 = ?`,
    label: 'kilogram naar gram',
    nRange: [1, 9],
  },
  {
    prefix: 'g2kg',
    maakVraag: n => `Hoeveel kg is ${n * 1000} g?`,
    bereken: n => n,
    hint1: '1000 g = 1 kg. Deel door 1000.',
    hint2: n => `${n * 1000} g ÷ 1000 = ?`,
    label: 'gram naar kilogram',
    nRange: [1, 9],
  },
  {
    prefix: 'halvekg',
    maakVraag: n => `Hoeveel gram is ${n},5 kg?`,
    bereken: n => n * 1000 + 500,
    hint1: n => `${n},5 kg = ${n} kg + ½ kg. En ½ kg = 500 g.`,
    hint2: n => `${n} × 1000 + 500 = ?`,
    label: 'halve kilogram naar gram',
    nRange: [1, 5],
  },
];

export function genereerItems() {
  const items = [];
  for (const type of TYPES) {
    const [nMin, nMax] = type.nRange ?? [1, 9];
    for (let n = nMin; n <= nMax; n++) {
      items.push({
        id: `gewicht-${type.prefix}-${n}`,
        vraag: type.maakVraag(n),
        antwoord: type.bereken(n),
        leerdoel: `Gewichten herleiden: ${type.label}`,
        hints: [
          typeof type.hint1 === 'function' ? type.hint1(n) : type.hint1,
          type.hint2(n),
        ],
        trapType: 'gewicht',
      });
    }
  }
  return items;
}
