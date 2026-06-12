// Genereert alle tafel-items (1×1 t/m 10×10).
// Voldoet aan het opgave-contract uit ARCHITECTUUR.md.

const LEERDOEL = 'rek-gr5-doorlopend-tafels';

// Rijgen: tel a stappen van b op en toon de rij
function rijgenHint(a, b) {
  const stappen = Array.from({ length: a }, (_, i) => (i + 1) * b).join(', ');
  return `Tel de rij van ${b}: ${stappen}`;
}

export function genereerItems() {
  const items = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      items.push({
        id: `tafel-${a}x${b}`,
        vraag: `${a} × ${b}`,
        antwoord: String(a * b),
        leerdoel: LEERDOEL,
        hints: [rijgenHint(a, b)],
        keuzes: []
      });
    }
  }
  return items;
}
