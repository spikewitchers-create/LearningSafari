const LEERDOEL = 'rek-gr5-doorlopend-tafels';

function hints(a, b) {
  const uitkomst = a * b;
  const rij = Array.from({ length: a }, (_, i) => (i + 1) * b).join(' → ');
  return [
    `Strategie rijgen: tel ${a} stappen van ${b}.`,
    `De rij van ${b}: ${rij}. De laatste stap is het antwoord.`,
    `Het antwoord is ${uitkomst}.`
  ];
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
        hints: hints(a, b),
        keuzes: []
      });
    }
  }
  return items;
}
