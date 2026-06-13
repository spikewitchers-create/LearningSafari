// Klokkijken — blok 5 (5/10 min over halfuur) + algemeen
// Vraag: volledige tijd noemen — meerkeuze met 4 opties

const UURNAMEN = ['','één','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf','twaalf'];

function hints5minOverHalf(h, x) {
  return [
    `De grote wijzer staat voorbij het 6 (= halfuur). Elke streep na het 6 is 5 minuten extra.`,
    `Grote wijzer op positie ${(30 + x) / 5} = ${x} minuten ná half. Het is ${x} min. over half ${UURNAMEN[h]}.`,
  ];
}

function hintsKwartOver(h) {
  return [
    `Grote wijzer op het 3 = kwart over (15 minuten). Kijk dan naar de kleine wijzer voor het uur.`,
    `Grote wijzer op 3 = kwart over. Kleine wijzer staat bij het ${h}. Het is kwart over ${UURNAMEN[h]}.`,
  ];
}

function hintsHalf(h) {
  return [
    `Grote wijzer op het 6 = precies half. Bij 'half' noem je het VOLGENDE uur: half drie = 2:30.`,
    `Grote wijzer op 6. Kleine wijzer staat tussen ${UURNAMEN[h - 1]} en ${UURNAMEN[h]}. Het is half ${UURNAMEN[h]}.`,
  ];
}

function hintsKwartVoor(h) {
  return [
    `Grote wijzer op het 9 = kwart voor (45 minuten). Dan noem je het VOLGENDE uur.`,
    `Grote wijzer op 9 = kwart voor ${UURNAMEN[h]}. Kleine wijzer staat vlak voor het ${h}. Het is kwart voor ${UURNAMEN[h]}.`,
  ];
}

function hintsOverUur(h, x) {
  const pos = x / 5;
  return [
    `Grote wijzer vóór het 6? Dan is het 'over het uur'. Elke positie = 5 minuten.`,
    `Grote wijzer op positie ${pos} = ${x} minuten. Kleine wijzer bij het ${h}. Het is ${x} min. over ${UURNAMEN[h]}.`,
  ];
}

function hintsVoorUur(h, x) {
  const minuten = 60 - x;
  const pos = minuten / 5;
  return [
    `Grote wijzer voorbij het 6 én voor het 12? Dan is het 'voor het uur'. Hoeveel minuten nog tot het volgende uur?`,
    `Grote wijzer op positie ${pos} = ${minuten} minuten. Nog ${x} minuten tot het ${h}. Het is ${x} min. voor ${UURNAMEN[h]}.`,
  ];
}

function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function kiesDisctractoren(item, pool) {
  const h = item.klokTijd.uur;
  const m = item.klokTijd.minuten;
  const gezien = new Set([item.id]);
  const kandidaten = [];

  // Voorrang: zelfde uur, andere minuten (meest verwarrend voor kind)
  for (const it of pool) {
    if (!gezien.has(it.id) && it.klokTijd.uur === h && it.klokTijd.minuten !== m) {
      gezien.add(it.id);
      kandidaten.push(it);
    }
  }
  // Dan: zelfde minuten, buurbuur-uur (±1)
  for (const it of pool) {
    if (!gezien.has(it.id) && it.klokTijd.minuten === m && Math.abs(it.klokTijd.uur - h) <= 1) {
      gezien.add(it.id);
      kandidaten.push(it);
    }
  }
  // Aanvullen uit de rest
  for (const it of pool) {
    if (!gezien.has(it.id)) { gezien.add(it.id); kandidaten.push(it); }
    if (kandidaten.length >= 9) break;
  }

  return shuffleArr(kandidaten).slice(0, 3).map(it => it.klokLabel);
}

export function genereerItems() {
  const items = [];

  // Type 1: x minuten over het halfuur
  for (let h = 2; h <= 10; h++) {
    for (const x of [5, 10]) {
      const min = 30 + x;
      items.push({
        id: `klok-halfuur-${h}-${x}`,
        vraag: `Welke tijd zie je op de klok?`,
        antwoord: `${x} min. over half ${UURNAMEN[h]}`,
        leerdoel: `Klokkijken: minuten over het halfuur`,
        hints: hints5minOverHalf(h, x),
        invoerType: 'meerkeuze',
        klokTijd: { uur: h - 1, minuten: min },
        klokLabel: `${x} min. over half ${UURNAMEN[h]}`,
      });
    }
  }

  // Type 2: kwart over
  for (let h = 1; h <= 12; h++) {
    items.push({
      id: `klok-kwartover-${h}`,
      vraag: `Welke tijd zie je op de klok?`,
      antwoord: `kwart over ${UURNAMEN[h]}`,
      leerdoel: `Klokkijken: kwart over`,
      hints: hintsKwartOver(h),
      invoerType: 'meerkeuze',
      klokTijd: { uur: h, minuten: 15 },
      klokLabel: `kwart over ${UURNAMEN[h]}`,
    });
  }

  // Type 3: precies half
  for (let h = 2; h <= 12; h++) {
    items.push({
      id: `klok-half-${h}`,
      vraag: `Welke tijd zie je op de klok?`,
      antwoord: `half ${UURNAMEN[h]}`,
      leerdoel: `Klokkijken: het halfuur`,
      hints: hintsHalf(h),
      invoerType: 'meerkeuze',
      klokTijd: { uur: h - 1, minuten: 30 },
      klokLabel: `half ${UURNAMEN[h]}`,
    });
  }

  // Type 4: kwart voor
  for (let h = 1; h <= 12; h++) {
    items.push({
      id: `klok-kwartvoor-${h}`,
      vraag: `Welke tijd zie je op de klok?`,
      antwoord: `kwart voor ${UURNAMEN[h]}`,
      leerdoel: `Klokkijken: kwart voor`,
      hints: hintsKwartVoor(h),
      invoerType: 'meerkeuze',
      klokTijd: { uur: h - 1, minuten: 45 },
      klokLabel: `kwart voor ${UURNAMEN[h]}`,
    });
  }

  // Type 5: x minuten over het uur (5/10/20/25)
  for (let h = 1; h <= 10; h++) {
    for (const x of [5, 10, 20, 25]) {
      items.push({
        id: `klok-over-${h}-${x}`,
        vraag: `Welke tijd zie je op de klok?`,
        antwoord: `${x} min. over ${UURNAMEN[h]}`,
        leerdoel: `Klokkijken: minuten over het uur`,
        hints: hintsOverUur(h, x),
        invoerType: 'meerkeuze',
        klokTijd: { uur: h, minuten: x },
        klokLabel: `${x} min. over ${UURNAMEN[h]}`,
      });
    }
  }

  // Type 6: x minuten voor het uur (5/10/20/25)
  for (let h = 2; h <= 11; h++) {
    for (const x of [5, 10, 20, 25]) {
      const min = 60 - x;
      items.push({
        id: `klok-voor-${h}-${x}`,
        vraag: `Welke tijd zie je op de klok?`,
        antwoord: `${x} min. voor ${UURNAMEN[h]}`,
        leerdoel: `Klokkijken: minuten voor het uur`,
        hints: hintsVoorUur(h, x),
        invoerType: 'meerkeuze',
        klokTijd: { uur: h - 1, minuten: min },
        klokLabel: `${x} min. voor ${UURNAMEN[h]}`,
      });
    }
  }

  // Tweede pass: voeg de 4 keuze-opties toe
  for (const item of items) {
    const distractors = kiesDisctractoren(item, items);
    item.opties = shuffleArr([item.antwoord, ...distractors]);
  }

  return items;
}
