export function genereerItems() {
  const items = [];

  // ─── Groep 1: de/het (lidwoord) ───────────────────────────────────────────

  const deHetWoorden = [
    // de-woorden
    { woord: 'tafel',  antwoord: 'de',  hint2: "'de tafel' — denk aan de grote eettafel." },
    { woord: 'stoel',  antwoord: 'de',  hint2: "'de stoel' — je zit op de stoel." },
    { woord: 'school', antwoord: 'de',  hint2: "'de school' — je gaat naar de school." },
    { woord: 'straat', antwoord: 'de',  hint2: "'de straat' — je loopt over de straat." },
    { woord: 'boom',   antwoord: 'de',  hint2: "'de boom' — een grote de-boom in de tuin." },
    { woord: 'fiets',  antwoord: 'de',  hint2: "'de fiets' — je rijdt op de fiets." },
    { woord: 'zon',    antwoord: 'de',  hint2: "'de zon' — de zon schijnt." },
    { woord: 'maan',   antwoord: 'de',  hint2: "'de maan' — 's nachts zie je de maan." },
    { woord: 'hond',   antwoord: 'de',  hint2: "'de hond' — de hond blaft." },
    { woord: 'kat',    antwoord: 'de',  hint2: "'de kat' — de kat miauwt." },
    { woord: 'vogel',  antwoord: 'de',  hint2: "'de vogel' — de vogel zingt." },
    { woord: 'vis',    antwoord: 'de',  hint2: "'de vis' — de vis zwemt." },
    { woord: 'man',    antwoord: 'de',  hint2: "'de man' — de man loopt." },
    { woord: 'vrouw',  antwoord: 'de',  hint2: "'de vrouw' — de vrouw lacht." },
    { woord: 'auto',   antwoord: 'de',  hint2: "'de auto' — je rijdt in de auto." },
    { woord: 'trein',  antwoord: 'de',  hint2: "'de trein' — de trein rijdt op het spoor." },
    { woord: 'deur',   antwoord: 'de',  hint2: "'de deur' — je opent de deur." },
    { woord: 'muur',   antwoord: 'de',  hint2: "'de muur' — de muur van het huis." },
    { woord: 'tuin',   antwoord: 'de',  hint2: "'de tuin' — je speelt in de tuin." },
    { woord: 'hand',   antwoord: 'de',  hint2: "'de hand' — je wuift met je hand." },
    // het-woorden
    { woord: 'boek',   antwoord: 'het', hint2: "'het boek' — denk aan het kleine boekje (verkleinwoord)." },
    { woord: 'huis',   antwoord: 'het', hint2: "'het huis' — je woont in het huis." },
    { woord: 'kind',   antwoord: 'het', hint2: "'het kind' — het kind speelt. Verkleinwoord: het kindje." },
    { woord: 'water',  antwoord: 'het', hint2: "'het water' — je drinkt het water." },
    { woord: 'jaar',   antwoord: 'het', hint2: "'het jaar' — het jaar heeft twaalf maanden." },
    { woord: 'woord',  antwoord: 'het', hint2: "'het woord' — je leest het woord. Verkleinwoord: het woordje." },
    { woord: 'dier',   antwoord: 'het', hint2: "'het dier' — het dier leeft in de natuur." },
    { woord: 'geld',   antwoord: 'het', hint2: "'het geld' — je betaalt met het geld." },
    { woord: 'brood',  antwoord: 'het', hint2: "'het brood' — je eet het brood bij het ontbijt." },
    { woord: 'meisje', antwoord: 'het', hint2: "'het meisje' — eindigt op -je, dus altijd 'het'." },
  ];

  deHetWoorden.forEach(({ woord, antwoord, hint2 }, index) => {
    items.push({
      id: `woord-dehet-${String(index + 1).padStart(2, '0')}`,
      vraag: `Welk lidwoord hoort bij '${woord}'? (de of het)`,
      antwoord,
      leerdoel: 'Woordsoorten: lidwoord (de of het)',
      hints: [
        "De meeste woorden zijn 'de'-woorden. 'Het'-woorden zijn vaak klein of verkleinwoorden (-je).",
        hint2,
      ],
      invoerType: 'tekst',
    });
  });

  // ─── Groep 2: Bijvoeglijk naamwoord herkennen ─────────────────────────────

  const bijvoeglijkZinnen = [
    {
      zin: 'De grote jas hangt aan de kapstok.',
      antwoord: 'grote',
      hint2: 'Hoe is de jas? → grote.',
    },
    {
      zin: 'Het kleine meisje speelt in de tuin.',
      antwoord: 'kleine',
      hint2: 'Hoe is het meisje? → kleine.',
    },
    {
      zin: 'De rode auto rijdt snel over de weg.',
      antwoord: 'rode',
      hint2: 'Hoe is de auto? → rode.',
    },
    {
      zin: 'Mijn nieuwe fiets staat buiten.',
      antwoord: 'nieuwe',
      hint2: 'Hoe is de fiets? → nieuwe.',
    },
    {
      zin: 'De blauwe hemel is heel mooi vandaag.',
      antwoord: 'blauwe',
      hint2: 'Hoe is de hemel? → blauwe.',
    },
    {
      zin: 'Het oude huis staat aan het einde van de straat.',
      antwoord: 'oude',
      hint2: 'Hoe is het huis? → oude.',
    },
    {
      zin: 'De lieve hond kwispelt met zijn staart.',
      antwoord: 'lieve',
      hint2: 'Hoe is de hond? → lieve.',
    },
    {
      zin: 'De dikke kat ligt op de warme bank.',
      antwoord: 'dikke',
      hint2: 'Hoe is de kat? → dikke.',
    },
    {
      zin: 'Het koude water smaakt heerlijk.',
      antwoord: 'koude',
      hint2: 'Hoe is het water? → koude.',
    },
    {
      zin: 'De vrolijke kinderen spelen buiten.',
      antwoord: 'vrolijke',
      hint2: 'Hoe zijn de kinderen? → vrolijke.',
    },
    {
      zin: 'Een sterke man tilt de zware doos op.',
      antwoord: 'sterke',
      hint2: 'Hoe is de man? → sterke.',
    },
    {
      zin: 'De zachte sneeuw valt op de grond.',
      antwoord: 'zachte',
      hint2: 'Hoe is de sneeuw? → zachte.',
    },
  ];

  bijvoeglijkZinnen.forEach(({ zin, antwoord, hint2 }, index) => {
    items.push({
      id: `woord-bjv-${String(index + 1).padStart(2, '0')}`,
      vraag: `Welk woord is het bijvoeglijk naamwoord?\n'${zin}'`,
      antwoord,
      leerdoel: 'Woordsoorten: bijvoeglijk naamwoord herkennen',
      hints: [
        'Een bijvoeglijk naamwoord beschrijft een zelfstandig naamwoord. Vraag: hoe is het/de ...?',
        hint2,
      ],
      invoerType: 'tekst',
    });
  });

  // ─── Groep 3: Zelfstandig naamwoord herkennen ────────────────────────────

  const zelfstandigZinnen = [
    {
      zin: 'De hond loopt door het park.',
      antwoord: 'hond',
      hint2: 'Wie of wat loopt? → de hond.',
    },
    {
      zin: 'Een vogel zingt in de boom.',
      antwoord: 'vogel',
      hint2: 'Wie of wat zingt? → een vogel.',
    },
    {
      zin: 'Het kind leest een boek.',
      antwoord: 'kind',
      hint2: 'Wie of wat leest? → het kind.',
    },
    {
      zin: 'De fiets staat voor de deur.',
      antwoord: 'fiets',
      hint2: 'Wie of wat staat voor de deur? → de fiets.',
    },
    {
      zin: 'Een kat slaapt op de stoel.',
      antwoord: 'kat',
      hint2: 'Wie of wat slaapt? → een kat.',
    },
    {
      zin: 'De juf schrijft op het bord.',
      antwoord: 'juf',
      hint2: 'Wie of wat schrijft? → de juf.',
    },
    {
      zin: 'Een vlinder vliegt over de bloemen.',
      antwoord: 'vlinder',
      hint2: 'Wie of wat vliegt? → een vlinder.',
    },
    {
      zin: 'De trein rijdt naar de stad.',
      antwoord: 'trein',
      hint2: 'Wie of wat rijdt? → de trein.',
    },
    {
      zin: 'Het meisje eet een appel.',
      antwoord: 'meisje',
      hint2: 'Wie of wat eet? → het meisje.',
    },
    {
      zin: 'De bakker verkoopt vers brood.',
      antwoord: 'bakker',
      hint2: 'Wie of wat verkoopt? → de bakker.',
    },
  ];

  zelfstandigZinnen.forEach(({ zin, antwoord, hint2 }, index) => {
    items.push({
      id: `woord-znw-${String(index + 1).padStart(2, '0')}`,
      vraag: `Welk woord is het zelfstandig naamwoord?\n'${zin}'`,
      antwoord,
      leerdoel: 'Woordsoorten: zelfstandig naamwoord herkennen',
      hints: [
        'Een zelfstandig naamwoord is een naam voor een persoon, dier, ding of begrip.',
        hint2,
      ],
      invoerType: 'tekst',
    });
  });

  return items;
}
