const LEERDOEL = 'rek-gr5-doorlopend-tafels';

function hints(a, b) {
  const uitkomst = a * b;
  // Rij tot en met de voorlaatste stap — laatste stap doet het kind zelf
  const rijZonderLaatste = Array.from({ length: a - 1 }, (_, i) => (i + 1) * b).join(' → ');
  const voorlaatste = (a - 1) * b;
  return [
    `Gebruik rijgen: tel ${a} stappen van ${b}.`,
    a > 1
      ? `De rij van ${b}: ${rijZonderLaatste} → ? (tel nog één stap van ${b} bij ${voorlaatste} op).`
      : `${b} × 1 = ${b}.`,
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
