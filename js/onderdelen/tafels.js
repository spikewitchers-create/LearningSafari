// Genereert alle tafel-items (1×1 t/m 10×10).
// Voldoet aan het opgave-contract uit ARCHITECTUUR.md.

const LEERDOEL = 'rek-gr5-doorlopend-tafels';

export function genereerItems() {
  const items = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      items.push({
        id: `tafel-${a}x${b}`,
        vraag: `${a} × ${b}`,
        antwoord: String(a * b),
        leerdoel: LEERDOEL,
        hints: [],
        keuzes: []
      });
    }
  }
  return items;
}
