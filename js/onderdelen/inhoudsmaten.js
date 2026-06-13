// Inhoudsmaten herleiden – groep 5
const TYPES = [
  {
    prefix: 'l2dl',
    maakVraag: n => `Hoeveel deciliter is ${n} liter?`,
    bereken: n => n * 10,
    hint1: '1 l = 10 dl. Vermenigvuldig met 10.',
    hint2: n => `${n} l × 10 = ?`,
    label: 'liter naar deciliter',
    nRange: [1, 9],
  },
  {
    prefix: 'dl2l',
    maakVraag: n => `Hoeveel liter is ${n * 10} dl?`,
    bereken: n => n,
    hint1: '10 dl = 1 l. Deel door 10.',
    hint2: n => `${n * 10} dl ÷ 10 = ?`,
    label: 'deciliter naar liter',
    nRange: [1, 9],
  },
  {
    prefix: 'dl2cl',
    maakVraag: n => `Hoeveel centiliter is ${n} dl?`,
    bereken: n => n * 10,
    hint1: '1 dl = 10 cl. Vermenigvuldig met 10.',
    hint2: n => `${n} dl × 10 = ?`,
    label: 'deciliter naar centiliter',
    nRange: [1, 9],
  },
  {
    prefix: 'cl2dl',
    maakVraag: n => `Hoeveel dl is ${n * 10} cl?`,
    bereken: n => n,
    hint1: '10 cl = 1 dl. Deel door 10.',
    hint2: n => `${n * 10} cl ÷ 10 = ?`,
    label: 'centiliter naar deciliter',
    nRange: [1, 9],
  },
  {
    prefix: 'l2cl',
    maakVraag: n => `Hoeveel centiliter is ${n} liter?`,
    bereken: n => n * 100,
    hint1: '1 l = 100 cl. Vermenigvuldig met 100.',
    hint2: n => `${n} l × 100 = ?`,
    label: 'liter naar centiliter',
    nRange: [1, 5],
  },
  {
    prefix: 'cl2l',
    maakVraag: n => `Hoeveel liter is ${n * 100} cl?`,
    bereken: n => n,
    hint1: '100 cl = 1 l. Deel door 100.',
    hint2: n => `${n * 100} cl ÷ 100 = ?`,
    label: 'centiliter naar liter',
    nRange: [1, 5],
  },
];

export function genereerItems() {
  const items = [];
  for (const type of TYPES) {
    const [nMin, nMax] = type.nRange ?? [1, 9];
    for (let n = nMin; n <= nMax; n++) {
      items.push({
        id: `inhoud-${type.prefix}-${n}`,
        vraag: type.maakVraag(n),
        antwoord: type.bereken(n),
        leerdoel: `Inhoudsmaten herleiden: ${type.label}`,
        hints: [
          typeof type.hint1 === 'function' ? type.hint1(n) : type.hint1,
          type.hint2(n),
        ],
        trapType: 'inhoud',
      });
    }
  }
  return items;
}
