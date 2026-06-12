// Lengtematen — blok 9
// Herleiden van mm, cm, dm (en m als uitbreiding)
// 1 cm = 10 mm | 1 dm = 10 cm = 100 mm | 1 m = 10 dm = 100 cm = 1000 mm

const TYPES = [
  {
    prefix: 'cm2mm',
    maakVraag: n => `Hoeveel mm is ${n} cm?`,
    bereken:   n => n * 10,
    hint1: `1 cm = 10 mm. Vermenigvuldig met 10.`,
    hint2: n => `${n} cm × 10 = ?`,
    label: 'cm → mm',
  },
  {
    prefix: 'mm2cm',
    maakVraag: n => `Hoeveel cm is ${n * 10} mm?`,
    bereken:   n => n,
    hint1: `10 mm = 1 cm. Deel door 10.`,
    hint2: n => `${n * 10} mm ÷ 10 = ?`,
    label: 'mm → cm',
    nRange: [1, 9],
  },
  {
    prefix: 'dm2cm',
    maakVraag: n => `Hoeveel cm is ${n} dm?`,
    bereken:   n => n * 10,
    hint1: `1 dm = 10 cm. Vermenigvuldig met 10.`,
    hint2: n => `${n} dm × 10 = ?`,
    label: 'dm → cm',
  },
  {
    prefix: 'cm2dm',
    maakVraag: n => `Hoeveel dm is ${n * 10} cm?`,
    bereken:   n => n,
    hint1: `10 cm = 1 dm. Deel door 10.`,
    hint2: n => `${n * 10} cm ÷ 10 = ?`,
    label: 'cm → dm',
    nRange: [1, 9],
  },
  {
    prefix: 'dm2mm',
    maakVraag: n => `Hoeveel mm is ${n} dm?`,
    bereken:   n => n * 100,
    hint1: `1 dm = 100 mm. Vermenigvuldig met 100.`,
    hint2: n => `${n} dm × 100 = ?`,
    label: 'dm → mm',
    nRange: [1, 6],
  },
  {
    prefix: 'mm2dm',
    maakVraag: n => `Hoeveel dm is ${n * 100} mm?`,
    bereken:   n => n,
    hint1: `100 mm = 1 dm. Deel door 100.`,
    hint2: n => `${n * 100} mm ÷ 100 = ?`,
    label: 'mm → dm',
    nRange: [1, 5],
  },
];

export function genereerItems() {
  const items = [];
  for (const type of TYPES) {
    const [nMin, nMax] = type.nRange ?? [1, 9];
    for (let n = nMin; n <= nMax; n++) {
      items.push({
        id: `lengte-${type.prefix}-${n}`,
        vraag: type.maakVraag(n),
        antwoord: type.bereken(n),
        leerdoel: `Lengtematen herleiden: ${type.label}`,
        hints: [type.hint1, type.hint2(n)],
      });
    }
  }
  return items;
}
