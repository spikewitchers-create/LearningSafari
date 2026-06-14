// Klokkijken digitaal — toont HH:MM display, vraagt Dutch time expression
// meerkeuze met 4 opties

const UURNAMEN = ['','één','twee','drie','vier','vijf','zes','zeven','acht','negen','tien','elf','twaalf'];

function digitaalSvg(uurDisplay, minDisplay) {
  const tekst = `${String(uurDisplay).padStart(2,'0')}:${String(minDisplay).padStart(2,'0')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" class="hint-svg" style="max-width:200px">
    <rect x="10" y="10" width="180" height="70" rx="10" ry="10" fill="#1a1a2e" stroke="#4a90d9" stroke-width="3"/>
    <text x="100" y="62" font-family="monospace" font-size="42" fill="#00e5ff" text-anchor="middle" dominant-baseline="auto" letter-spacing="4">${tekst}</text>
  </svg>`;
}

function dutchLabel(uur, min) {
  const volgend = uur === 12 ? 1 : uur + 1;
  if (min === 0)  return `${UURNAMEN[uur]} uur`;
  if (min === 15) return `kwart over ${UURNAMEN[uur]}`;
  if (min === 30) return `half ${UURNAMEN[volgend]}`;
  if (min === 45) return `kwart voor ${UURNAMEN[volgend]}`;
  if (min < 30)   return `${min} min. over ${UURNAMEN[uur]}`;
  const voor = 60 - min;
  return `${voor} min. voor ${UURNAMEN[volgend]}`;
}

function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hints(uur, min) {
  const volgend = uur === 12 ? 1 : uur + 1;
  const label = dutchLabel(uur, min);
  if (min === 0)  return [`Het uur staat links van de punt. Minuten zijn 00.`, `${uur}:00 = precies ${UURNAMEN[uur]} uur.`];
  if (min === 15) return [`15 minuten = kwart over. Kijk naar het uur links.`, `${uur}:15 = kwart over ${UURNAMEN[uur]}.`];
  if (min === 30) return [`30 minuten = half. Bij 'half' noem je het VOLGENDE uur.`, `${uur}:30 = half ${UURNAMEN[volgend]}.`];
  if (min === 45) return [`45 minuten = kwart voor. Noem het VOLGENDE uur.`, `${uur}:45 = kwart voor ${UURNAMEN[volgend]}.`];
  if (min < 30)   return [`De minuten zijn minder dan 30: het is 'over het uur'.`, `${uur}:${String(min).padStart(2,'0')} = ${min} min. over ${UURNAMEN[uur]}.`];
  return [`De minuten zijn meer dan 30: tel hoeveel tot het volgende uur (60 − ${min} = ${60-min}).`, `Het is ${label}.`];
}

export function genereerItems() {
  const items = [];

  const tijden = [];
  for (let h = 1; h <= 12; h++) tijden.push({ uur: h, min: 0 });
  for (let h = 1; h <= 12; h++) tijden.push({ uur: h, min: 15 });
  for (let h = 1; h <= 12; h++) tijden.push({ uur: h, min: 30 });
  for (let h = 1; h <= 12; h++) tijden.push({ uur: h, min: 45 });
  for (let h = 1; h <= 10; h++) for (const m of [5, 10, 20, 25]) tijden.push({ uur: h, min: m });
  for (let h = 1; h <= 10; h++) for (const m of [35, 40, 50, 55]) tijden.push({ uur: h, min: m });

  for (const { uur, min } of tijden) {
    const label = dutchLabel(uur, min);
    items.push({
      id: `digklok-${uur}-${min}`,
      vraag: `Welke tijd zie je op het display?`,
      antwoord: label,
      leerdoel: `Klokkijken: digitale klok`,
      hints: hints(uur, min),
      invoerType: 'meerkeuze',
      klokTijd: null,
      klokLabel: '',
      digitaalSvg: digitaalSvg(uur, min),
      _uur: uur,
      _min: min,
    });
  }

  // Second pass: add 4 options per item
  for (const item of items) {
    const h = item._uur;
    const m = item._min;
    const gezien = new Set([item.antwoord]);
    const kandidaten = [];

    for (const it of items) {
      if (!gezien.has(it.antwoord) && it._uur === h && it._min !== m) {
        gezien.add(it.antwoord); kandidaten.push(it.antwoord);
      }
    }
    for (const it of items) {
      if (!gezien.has(it.antwoord) && it._min === m && Math.abs(it._uur - h) <= 1) {
        gezien.add(it.antwoord); kandidaten.push(it.antwoord);
      }
    }
    for (const it of items) {
      if (!gezien.has(it.antwoord)) { gezien.add(it.antwoord); kandidaten.push(it.antwoord); }
      if (kandidaten.length >= 9) break;
    }

    item.opties = shuffleArr([item.antwoord, ...shuffleArr(kandidaten).slice(0, 3)]);
  }

  return items;
}
