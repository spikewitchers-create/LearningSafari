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
  // "half h" in NL = (h-1):30, dus 5 over half 3 = 2:35
  for (let h = 2; h <= 10; h++) {
    for (const x of [5, 10]) {
      const min = 30 + x;
      items.push({
        id: `klok-halfuur-${h}-${x}`,
        vraag: `Hoeveel minuten wijst de grote wijzer?`,
        antwoord: min,
        leerdoel: `Klokkijken: minuten over het halfuur`,
        hints: hints5minOverHalf(h, x),
        klokTijd: { uur: h - 1, minuten: min },
        klokLabel: `${x} min. over half ${UURNAMEN[h]}`,
      });
    }
  }

  // ── Type 2: kwart over ──────────────────────────────────────────
  for (let h = 1; h <= 12; h++) {
    items.push({
      id: `klok-kwartover-${h}`,
      vraag: `Hoeveel minuten wijst de grote wijzer?`,
      antwoord: 15,
      leerdoel: `Klokkijken: kwart over`,
      hints: hintsKwartOver(h),
      klokTijd: { uur: h, minuten: 15 },
      klokLabel: `kwart over ${UURNAMEN[h]}`,
    });
  }

  // ── Type 3: precies half ────────────────────────────────────────
  for (let h = 2; h <= 12; h++) {
    items.push({
      id: `klok-half-${h}`,
      vraag: `Hoeveel minuten wijst de grote wijzer?`,
      antwoord: 30,
      leerdoel: `Klokkijken: het halfuur`,
      hints: hintsHalf(h),
      klokTijd: { uur: h - 1, minuten: 30 },
      klokLabel: `half ${UURNAMEN[h]}`,
    });
  }

  // ── Type 4: kwart voor ──────────────────────────────────────────
  // "kwart voor h" = (h-1):45
  for (let h = 1; h <= 12; h++) {
    items.push({
      id: `klok-kwartvoor-${h}`,
      vraag: `Hoeveel minuten wijst de grote wijzer?`,
      antwoord: 45,
      leerdoel: `Klokkijken: kwart voor`,
      hints: hintsKwartVoor(h),
      klokTijd: { uur: h - 1, minuten: 45 },
      klokLabel: `kwart voor ${UURNAMEN[h]}`,
    });
  }

  // ── Type 5: x minuten over het uur (5/10/20/25) ────────────────
  for (let h = 1; h <= 10; h++) {
    for (const x of [5, 10, 20, 25]) {
      items.push({
        id: `klok-over-${h}-${x}`,
        vraag: `Hoeveel minuten wijst de grote wijzer?`,
        antwoord: x,
        leerdoel: `Klokkijken: minuten over het uur`,
        hints: hintsOverUur(h, x),
        klokTijd: { uur: h, minuten: x },
        klokLabel: `${x} min. over ${UURNAMEN[h]}`,
      });
    }
  }

  // ── Type 6: x minuten voor het uur (5/10/20/25) ────────────────
  // "x voor h" = (h-1):(60-x)
  for (let h = 2; h <= 11; h++) {
    for (const x of [5, 10, 20, 25]) {
      const min = 60 - x;
      items.push({
        id: `klok-voor-${h}-${x}`,
        vraag: `Hoeveel minuten wijst de grote wijzer?`,
        antwoord: min,
        leerdoel: `Klokkijken: minuten voor het uur`,
        hints: hintsVoorUur(h, x),
        klokTijd: { uur: h - 1, minuten: min },
        klokLabel: `${x} min. voor ${UURNAMEN[h]}`,
      });
    }
  }

  return items;
}
