// Kalender & datums — blok 7
// Jaarkalender aflezen, datum berekenen, weken/maanden

const MAANDEN = ['','januari','februari','maart','april','mei','juni',
                  'juli','augustus','september','oktober','november','december'];
const DAGEN_IN_MAAND = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAGENNAMEN = ['maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag','zondag'];

export function genereerItems() {
  const items = [];

  // ── Hoeveel dagen heeft een maand? ─────────────────────────────
  for (let m = 1; m <= 12; m++) {
    if (m === 2) continue; // februari lastig (28/29)
    items.push({
      id: `kalender-dagenmaand-${m}`,
      vraag: `Hoeveel dagen heeft de maand ${MAANDEN[m]}?`,
      antwoord: DAGEN_IN_MAAND[m],
      leerdoel: `Kalender: dagen per maand kennen`,
      hints: [
        `Denk aan het liedje: "30 dagen heeft september, april, juni en november…"`,
        `${MAANDEN[m]} heeft ${DAGEN_IN_MAAND[m]} dagen. Vul in.`,
      ],
    });
  }

  // ── Hoeveel dagen zijn er in n weken? ──────────────────────────
  for (let w = 1; w <= 8; w++) {
    items.push({
      id: `kalender-wekendagen-${w}`,
      vraag: `Hoeveel dagen zijn er in ${w} ${w === 1 ? 'week' : 'weken'}?`,
      antwoord: w * 7,
      leerdoel: `Kalender: weken omrekenen naar dagen`,
      hints: [
        `1 week = 7 dagen.`,
        `${w} × 7 = ?`,
      ],
    });
  }

  // ── Welke datum is het n weken later? (binnen dezelfde maand) ──
  // Startdata zodat startdag + n*7 ≤ 28
  const startDagen = [1, 2, 3, 4, 5, 6, 7];
  const nWeken = [1, 2, 3];
  for (const dag of startDagen) {
    for (const n of nWeken) {
      const doel = dag + n * 7;
      if (doel > 28) continue;
      items.push({
        id: `kalender-laterdatum-${dag}-${n}`,
        vraag: `Het is de ${dag}e van de maand. Welke datum is het ${n} ${n === 1 ? 'week' : 'weken'} later?`,
        antwoord: doel,
        leerdoel: `Kalender: datum berekenen met weken`,
        hints: [
          `${n} week${n > 1 ? 'en' : ''} = ${n * 7} dagen.`,
          `${dag} + ${n * 7} = ?`,
        ],
      });
    }
  }

  // ── Hoeveel weken zitten er van datum A tot datum B? ───────────
  // Multiples van 7 dagen verschil, clean
  const periodenWeken = [
    { van: 1, tot: 8,  w: 1 }, { van: 1, tot: 15, w: 2 },
    { van: 1, tot: 22, w: 3 }, { van: 1, tot: 29, w: 4 },
    { van: 3, tot: 17, w: 2 }, { van: 5, tot: 26, w: 3 },
    { van: 7, tot: 21, w: 2 }, { van: 2, tot: 30, w: 4 },
  ];
  for (const { van, tot, w } of periodenWeken) {
    items.push({
      id: `kalender-hoevelweken-${van}-${tot}`,
      vraag: `Van de ${van}e tot de ${tot}e van de maand — hoeveel weken zijn dat?`,
      antwoord: w,
      leerdoel: `Kalender: dagen omrekenen naar weken`,
      hints: [
        `Bereken eerst het aantal dagen: ${tot} − ${van} = ${tot - van} dagen.`,
        `${tot - van} dagen ÷ 7 = ?`,
      ],
    });
  }

  // ── Hoeveel maanden heeft een jaar? ────────────────────────────
  items.push({
    id: `kalender-maandeninjaar`,
    vraag: `Hoeveel maanden heeft een jaar?`,
    antwoord: 12,
    leerdoel: `Kalender: basiskennis`,
    hints: [`Tel de maanden: januari t/m december.`, `12 maanden.`],
  });

  // ── Welke maand is de ne maand van het jaar? ───────────────────
  for (let m = 1; m <= 12; m++) {
    items.push({
      id: `kalender-nemaand-${m}`,
      vraag: `${MAANDEN[m].charAt(0).toUpperCase() + MAANDEN[m].slice(1)} is de hoeveelste maand van het jaar?`,
      antwoord: m,
      leerdoel: `Kalender: volgorde maanden`,
      hints: [
        `Tel de maanden: jan=1, feb=2, mrt=3, apr=4, mei=5, jun=6, jul=7, aug=8, sep=9, okt=10, nov=11, dec=12.`,
        `${MAANDEN[m]} is maand nummer ${m}.`,
      ],
    });
  }

  return items;
}
