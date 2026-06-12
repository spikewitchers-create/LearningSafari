// Genereert alle deelfeiten afgeleid van tafels 1×1 t/m 10×10.
// Strategie per Pluspunt groep 5: keersom zoeken.

const LEERDOEL = 'rek-gr5-blok5-deelsom-keersom';

export function genereerItems() {
  const items = [];
  for (let b = 1; b <= 10; b++) {      // deler
    for (let c = 1; c <= 10; c++) {    // uitkomst
      const a = b * c;                  // deeltal
      items.push({
        id: `deelsom-${a}d${b}`,
        vraag: `${a} ÷ ${b}`,
        antwoord: String(c),
        leerdoel: LEERDOEL,
        hints: [],
        keuzes: []
      });
    }
  }
  return items;
}
