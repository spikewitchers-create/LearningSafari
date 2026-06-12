// Verhalende sommen — vermenigvuldigen t/m 10×10
// Elk item heeft dezelfde opgave-contract als tafels.js:
// { id, vraag, antwoord, leerdoel, hints: [] }
// IDs starten met "verhaal-" zodat ze apart te volgen zijn in beheersing.

const NAMEN = ['Emma', 'Liam', 'Sofie', 'Noah', 'Julie', 'Lars', 'Mila', 'Tom', 'Nora', 'Max'];

// Verhaalssjablonen: elke functie krijgt (a, b, antwoord) en geeft een zin terug.
// a = aantal groepen, b = per groep, antwoord = a*b
const SJABLONEN = [
  (a, b) => `${NAMEN[a % NAMEN.length]} koopt ${a} zakjes snoep. In elk zakje zitten ${b} snoepjes. Hoeveel snoepjes heeft ${NAMEN[a % NAMEN.length]} in totaal?`,
  (a, b) => `Er zijn ${a} tafels in de klas. Aan elke tafel zitten ${b} kinderen. Hoeveel kinderen zijn er in de klas?`,
  (a, b) => `${NAMEN[(a+1) % NAMEN.length]} pakt ${a} doosjes potloden. In elk doosje zitten ${b} potloden. Hoeveel potloden zijn er in totaal?`,
  (a, b) => `Een boer heeft ${a} kooien. In elke kooi zitten ${b} kippen. Hoeveel kippen heeft de boer?`,
  (a, b) => `${NAMEN[(a+2) % NAMEN.length]} rijdt ${a} rondes op de fiets. Elke ronde is ${b} kilometer. Hoeveel kilometer rijdt ${NAMEN[(a+2) % NAMEN.length]} in totaal?`,
  (a, b) => `Er staan ${a} rekken in de winkel. In elk rek liggen ${b} boeken. Hoeveel boeken liggen er in totaal?`,
  (a, b) => `${NAMEN[(a+3) % NAMEN.length]} bakt ${a} dozen koekjes. In elke doos passen ${b} koekjes. Hoeveel koekjes bakt ${NAMEN[(a+3) % NAMEN.length]} in totaal?`,
  (a, b) => `Een bus heeft ${a} rijen stoelen. In elke rij zitten ${b} stoelen. Hoeveel stoelen heeft de bus?`,
  (a, b) => `${NAMEN[(a+4) % NAMEN.length]} plant ${a} rijen bloemen. In elke rij staan ${b} bloemen. Hoeveel bloemen plant ${NAMEN[(a+4) % NAMEN.length]}?`,
  (a, b) => `Er zijn ${a} dozen eieren. In elke doos zitten ${b} eieren. Hoeveel eieren zijn er in totaal?`,
];

function hints(a, b) {
  const antwoord = a * b;
  const rijZonderLaatste = Array.from({ length: a - 1 }, (_, i) => (i + 1) * b).join(' → ');
  return [
    `Dit is een keersom: ${a} × ${b}. Tel ${a} groepen van ${b}.`,
    a > 1
      ? `De rij van ${b}: ${rijZonderLaatste} → ? (tel nog één keer ${b} erbij bij ${(a - 1) * b}).`
      : `${b} × 1 = ${b}.`,
    `Het antwoord is ${antwoord}.`,
  ];
}

export function genereerItems() {
  const items = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      const antwoord = a * b;
      const sjabloon = SJABLONEN[(a + b) % SJABLONEN.length];
      items.push({
        id: `verhaal-${a}x${b}`,
        vraag: sjabloon(a, b),
        antwoord,
        leerdoel: `rek-gr5-doorlopend-tafels`,
        hints: hints(a, b),
      });
    }
  }
  return items;
}
