// Klokkijken — blok 5 (5/10 min over halfuur) + algemeen
// Antwoord = altijd het aantal MINUTEN op de klok (0-55)

const UURNAMEN = ['','één','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf','twaalf'];

function hints5minOverHalf(h, x) {
  const min = 30 + x;
  return [
    `De grote wijzer geeft de minuten aan. Het halfuur = 30 minuten.`,
    `Half ${UURNAMEN[h]} = 30 minuten. Tel er ${x} bij op: 30 + ${x} = ?`,
  ];
}

function hintsKwartOver(h) {
  return [
    `De grote wijzer op het 3 = kwart over = 15 minuten.`,
    `Kwart over betekent 15 minuten. De grote wijzer staat op het 3.`,
  ];
}

function hintsHalf(h) {
  return [
    `De grote wijzer op het 6 = precies het halfuur = 30 minuten.`,
    `Half ${UURNAMEN[h]} = 30 minuten. De grote wijzer staat op het 6.`,
  ];
}

function hintsKwartVoor(h) {
  return [
    `De grote wijzer op het 9 = kwart voor = 45 minuten.`,
    `Kwart voor betekent 45 minuten. De grote wijzer staat op het 9.`,
  ];
}

function hintsOverUur(h, x) {
  const wijzerPositie = x / 5;
  return [
    `Elke positie van de grote wijzer is 5 minuten. Positie ${wijzerPositie} = ${x} minuten.`,
    `De grote wijzer staat op het ${wijzerPositie}. ${wijzerPositie} × 5 = ?`,
  ];
}

function hintsVoorUur(h, x) {
  const minuten = 60 - x;
  const wijzerPositie = minuten / 5;
  return [
    `"Voor" betekent dat er nog minuten overblijven tot het volgende uur.`,
    `${x} minuten voor ${UURNAMEN[h]} = 60 − ${x} = ? minuten op de klok.`,
  ];
}

export function genereerItems() {
  const items = [];

  // ── Type 1: x minuten over het halfuur (blok 5 focus) ──────────
  for (let h = 2; h <= 10; h++) {
    for (const x of [5, 10]) {
      const min = 30 + x;
      items.push({
        id: `klok-halfuur-${h}-${x}`,
        vraag: `De klok wijst ${x} minuten over half ${UURNAMEN[h]}. Hoeveel minuten zijn dat?`,
        antwoord: min,
        leerdoel: `Klokkijken: minuten over het halfuur`,
        hints: hints5minOverHalf(h, x),
      });
    }
  }

  // ── Type 2: kwart over ──────────────────────────────────────────
  for (let h = 1; h <= 12; h++) {
    items.push({
      id: `klok-kwartover-${h}`,
      vraag: `De klok wijst kwart over ${UURNAMEN[h]}. Hoeveel minuten zijn dat?`,
      antwoord: 15,
      leerdoel: `Klokkijken: kwart over`,
      hints: hintsKwartOver(h),
    });
  }

  // ── Type 3: precies half ────────────────────────────────────────
  for (let h = 2; h <= 12; h++) {
    items.push({
      id: `klok-half-${h}`,
      vraag: `De klok wijst precies half ${UURNAMEN[h]}. Hoeveel minuten zijn dat?`,
      antwoord: 30,
      leerdoel: `Klokkijken: het halfuur`,
      hints: hintsHalf(h),
    });
  }

  // ── Type 4: kwart voor ──────────────────────────────────────────
  for (let h = 1; h <= 12; h++) {
    items.push({
      id: `klok-kwartvoor-${h}`,
      vraag: `De klok wijst kwart voor ${UURNAMEN[h]}. Hoeveel minuten zijn dat?`,
      antwoord: 45,
      leerdoel: `Klokkijken: kwart voor`,
      hints: hintsKwartVoor(h),
    });
  }

  // ── Type 5: x minuten over het uur (5/10/20/25) ────────────────
  for (let h = 1; h <= 10; h++) {
    for (const x of [5, 10, 20, 25]) {
      items.push({
        id: `klok-over-${h}-${x}`,
        vraag: `De klok wijst ${x} minuten over ${UURNAMEN[h]}. Hoeveel minuten zijn dat?`,
        antwoord: x,
        leerdoel: `Klokkijken: minuten over het uur`,
        hints: hintsOverUur(h, x),
      });
    }
  }

  // ── Type 6: x minuten voor het uur (5/10/20/25) ────────────────
  for (let h = 2; h <= 11; h++) {
    for (const x of [5, 10, 20, 25]) {
      const min = 60 - x;
      items.push({
        id: `klok-voor-${h}-${x}`,
        vraag: `De klok wijst ${x} minuten voor ${UURNAMEN[h]}. Hoeveel minuten zijn dat?`,
        antwoord: min,
        leerdoel: `Klokkijken: minuten voor het uur`,
        hints: hintsVoorUur(h, x),
      });
    }
  }

  return items;
}
