const LEERDOEL = 'rek-gr5-doorlopend-tafels';

function hints(a, b) {
  const uitkomst = a * b;
  const voorlaatste = (a - 1) * b;

  let hint2;
  if (a === 1) {
    hint2 = `1 × ${b} = ${b}, dus het antwoord staat al vast.`;
  } else if (a === 2) {
    hint2 = `De rij van ${b} begint met ${b}. Welk getal is ${b} + ${b}?`;
  } else {
    // Rij tot en met de voorlaatste stap — kind doet de laatste stap zelf
    const rijZonderLaatste = Array.from({ length: a - 1 }, (_, i) => (i + 1) * b).join(', ');
    hint2 = `${rijZonderLaatste}. Welk getal komt er na ${voorlaatste} in de rij van ${b}?`;
  }

  return [
    `Gebruik de rij van ${b}: tel ${a} stappen van ${b}.`,
    hint2,
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
        keuzes: [],
        toetsDatum: '2026-07-05'
      });
    }
  }
  return items;
}
