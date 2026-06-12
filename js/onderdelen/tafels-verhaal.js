// Verhalende sommen — vermenigvuldigen t/m 10×10
// genereerItems() aanroepen per sessie zodat elke sessie andere verhalen heeft.
// IDs zijn verhaal-AxB zodat beheersing per feit bijgehouden wordt.

const NAMEN = [
  'Emma', 'Liam', 'Sofie', 'Noah', 'Julie', 'Lars',
  'Mila', 'Tom', 'Nora', 'Max', 'Sara', 'Finn',
  'Luna', 'Daan', 'Roos', 'Jesse', 'Nina', 'Bram',
];

// Elke sjabloonfunctie krijgt (a, b) en geeft één zin terug.
// a = aantal groepen, b = grootte van elke groep, antwoord = a*b
const SJABLONEN = [
  // Eten & drinken
  (a, b, n) => `${n} koopt ${a} zakjes snoep. In elk zakje zitten ${b} snoepjes. Hoeveel snoepjes heeft ${n} in totaal?`,
  (a, b, n) => `${n} bakt ${a} dozen koekjes. In elke doos passen ${b} koekjes. Hoeveel koekjes bakt ${n}?`,
  (a, b, n) => `Op een verjaardag liggen er ${a} schalen met fruit. Op elke schaal liggen ${b} stuks fruit. Hoeveel stuks fruit zijn er in totaal?`,
  (a, b, n) => `${n} scoopt ${a} bakjes ijs. In elk bakje zitten ${b} bolletjes. Hoeveel bolletjes ijs is dat?`,
  (a, b, n) => `In de kantine staan ${a} tafels. Op elke tafel staan ${b} flesjes water. Hoeveel flesjes water zijn er?`,
  (a, b, n) => `${n} maakt ${a} dozen pizza. Elke pizza is verdeeld in ${b} punten. Hoeveel punten pizza zijn er in totaal?`,

  // School & klaslokaal
  (a, b, n) => `Er zijn ${a} tafels in de klas. Aan elke tafel zitten ${b} kinderen. Hoeveel kinderen zijn er in de klas?`,
  (a, b, n) => `${n} pakt ${a} doosjes potloden. In elk doosje zitten ${b} potloden. Hoeveel potloden zijn er in totaal?`,
  (a, b, n) => `Er staan ${a} rekken in de bibliotheek. In elk rek staan ${b} boeken. Hoeveel boeken zijn er?`,
  (a, b, n) => `${n} heeft ${a} mappen. In elke map zitten ${b} vellen papier. Hoeveel vellen papier is dat?`,
  (a, b, n) => `Op de speelplaats staan ${a} bankjes. Op elk bankje zitten ${b} kinderen. Hoeveel kinderen zitten er?`,

  // Natuur & dieren
  (a, b, n) => `Een boer heeft ${a} kooien. In elke kooi zitten ${b} kippen. Hoeveel kippen heeft de boer?`,
  (a, b, n) => `In de dierentuin zijn er ${a} verblijven. In elk verblijf leven ${b} dieren. Hoeveel dieren zijn er in totaal?`,
  (a, b, n) => `${n} plant ${a} rijen bloemen. In elke rij staan ${b} bloemen. Hoeveel bloemen plant ${n}?`,
  (a, b, n) => `Er zijn ${a} bomen in het park. Aan elke boom hangen ${b} vogelnestjes. Hoeveel nestjes zijn er?`,
  (a, b, n) => `Een spin heeft ${a} poten per lichaamsdeel. ${n} telt ${b} lichaamsdelen. Hoeveel poten zijn dat?`,
  (a, b, n) => `Op een boerderij lopen ${a} groepen koeien. Elke groep bestaat uit ${b} koeien. Hoeveel koeien zijn er in totaal?`,

  // Sport & spel
  (a, b, n) => `${n} rijdt ${a} rondes op de fiets. Elke ronde is ${b} kilometer. Hoeveel kilometer rijdt ${n} in totaal?`,
  (a, b, n) => `Er worden ${a} voetbalwedstrijden gespeeld. Elke wedstrijd duurt ${b} kwartier. Hoeveel kwartier voetbal is dat?`,
  (a, b, n) => `${n} doet ${a} weken aan training. Elke week traint ${n} ${b} keer. Hoeveel trainingen is dat in totaal?`,
  (a, b, n) => `Bij het kaartspel deelt ${n} ${a} rondes. Elke ronde krijgt iedereen ${b} kaarten. Hoeveel kaarten worden er uitgedeeld per speler?`,
  (a, b, n) => `Op het speelkwartier springen ${a} groepjes touw. Elk groepje bestaat uit ${b} kinderen. Hoeveel kinderen springen er in totaal?`,

  // Transport & reis
  (a, b, n) => `Een bus heeft ${a} rijen stoelen. In elke rij zitten ${b} stoelen. Hoeveel stoelen heeft de bus?`,
  (a, b, n) => `Er staan ${a} treinstellen. Elk treinstel heeft ${b} wagons. Hoeveel wagons zijn er in totaal?`,
  (a, b, n) => `${n} maakt ${a} reizen. Elke reis duurt ${b} uur. Hoeveel uur is ${n} in totaal onderweg?`,
  (a, b, n) => `Op de parkeerplaats staan ${a} rijen auto's. In elke rij staan ${b} auto's. Hoeveel auto's staan er?`,

  // Winkelen & geld
  (a, b, n) => `In de winkel liggen ${a} dozen eieren. In elke doos zitten ${b} eieren. Hoeveel eieren zijn er in totaal?`,
  (a, b, n) => `${n} koopt ${a} pakken stickers. In elk pak zitten ${b} stickers. Hoeveel stickers heeft ${n}?`,
  (a, b, n) => `Er zijn ${a} schappen met speelgoed. Op elk schap liggen ${b} speeltjes. Hoeveel speeltjes zijn er?`,
  (a, b, n) => `${n} spaart ${a} weken lang. Elke week spaart ${n} ${b} euro. Hoeveel euro heeft ${n} gespaard?`,

  // Thuis & huishouden
  (a, b, n) => `${n} vouwt ${a} stapels was. In elke stapel zitten ${b} kledingstukken. Hoeveel kledingstukken zijn er?`,
  (a, b, n) => `In het huis zijn ${a} kamers. In elke kamer staan ${b} stoelen. Hoeveel stoelen zijn er in het huis?`,
  (a, b, n) => `${n} plant ${a} bakken groenten in de tuin. In elke bak passen ${b} planten. Hoeveel planten zijn er?`,
  (a, b, n) => `Op de boekenplank staan ${a} rijen boeken. In elke rij staan ${b} boeken. Hoeveel boeken staan er?`,
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

function nieuwVraag(a, b) {
  const naam = NAMEN[Math.floor(Math.random() * NAMEN.length)];
  const sjabloon = SJABLONEN[Math.floor(Math.random() * SJABLONEN.length)];
  return sjabloon(a, b, naam);
}

export function genereerItems() {
  const items = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      items.push({
        id: `verhaal-${a}x${b}`,
        vraag: nieuwVraag(a, b),        // eerste weergave
        genereerVraag: () => nieuwVraag(a, b), // elke volgende weergave vers
        antwoord: a * b,
        leerdoel: 'rek-gr5-doorlopend-tafels',
        hints: hints(a, b),
      });
    }
  }
  return items;
}
