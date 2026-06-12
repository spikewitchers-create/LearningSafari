// Vermenigvuldigen — groep 5, Pluspunt-methodologie
// Categorieën:
//   1. Splitsen (blok 6): 2-cijferig × enkelvoudig cijfer
//   2. Rekenen met te veel (blok 8): enkelvoudig × bijna-tiental

const LEERDOEL = 'rek-gr5-vermenigvuldigen';

// ── Categorie 1: Splitsen ─────────────────────────────────────────────────────
// a × b waarbij a 2-cijferig (niet veelvoud van 10), b enkelvoudig (2-9)
// Pluspunt-methode: b × a, splits a in tiental + eenheid
function hintsSplitsen(a, b) {
  const antwoord = a * b;
  const aTiental = Math.floor(a / 10) * 10;
  const aEenheid = a % 10;
  const deelTiental = b * aTiental;
  // Hint 2 toont b × aTiental = deelTiental, vraagt om b × aEenheid + optelling
  // Het eindantwoord wordt NIET gegeven
  return [
    `Splitsen: draai om (${b} × ${a}) en splits ${a} in ${aTiental} en ${aEenheid}.`,
    `${b} × ${aTiental} = ${deelTiental}. Nu moet je nog ${b} × ${aEenheid} uitrekenen en bij ${deelTiental} optellen.`,
    `Het antwoord is ${antwoord}.`
  ];
}

// ── Categorie 2: Rekenen met te veel ─────────────────────────────────────────
// a × b waarbij b eindigt op 8 of 9, a is 2-9
// Pluspunt-methode: a × afgerond − a × teveel
function hintsTevel(a, b) {
  const antwoord = a * b;
  const afgerond = Math.ceil(b / 10) * 10;
  const teveel = afgerond - b;
  const tussenstap = a * afgerond;
  const correctie = a * teveel;
  // Hint 2 toont tussenstap en correctie, vraagt om aftrekking — GEEN eindantwoord
  return [
    `Rekenen met te veel: ${b} is bijna ${afgerond}. Reken met ${afgerond} en trek daarna het te veel berekende af.`,
    `${a} × ${afgerond} = ${tussenstap}. Maar je hebt ${a} × ${teveel} = ${correctie} te veel gerekend. Trek dat af.`,
    `Het antwoord is ${antwoord}.`
  ];
}

export function vermenigvuldigItems() {
  const items = [];

  // ── 1. Splitsen ───────────────────────────────────────────────────────────
  // a = 2-cijferig niet-veelvoud-van-10, b = enkelvoudig (2-9)
  // Notatie: a×b (a is de te splitsen factor)
  const splitsenSommen = [
    [67, 4], [53, 6], [84, 3], [72, 5], [46, 8],
    [39, 7], [65, 4], [78, 3], [57, 6], [93, 4],
    [48, 7], [62, 5], [74, 6], [36, 8], [81, 4],
    [56, 9], [43, 7], [69, 5], [85, 3], [27, 8]
  ];
  for (const [a, b] of splitsenSommen) {
    items.push({
      id: `vermenigv-splits-${a}-${b}`,
      vraag: `${a} × ${b} = ?`,
      antwoord: a * b,
      leerdoel: LEERDOEL,
      hints: hintsSplitsen(a, b)
    });
  }

  // ── 2. Rekenen met te veel ────────────────────────────────────────────────
  // a = enkelvoudig (2-9), b eindigt op 8 of 9
  const tevelSommen = [
    [4, 69], [3, 79], [5, 49], [6, 39], [4, 89],
    [7, 29], [3, 59], [5, 69], [4, 99], [6, 89],
    [3, 49], [8, 29], [4, 79], [5, 39], [6, 59],
    [3, 99], [7, 49], [4, 59], [5, 89], [6, 69]
  ];
  for (const [a, b] of tevelSommen) {
    items.push({
      id: `vermenigv-tevel-${a}-${b}`,
      vraag: `${a} × ${b} = ?`,
      antwoord: a * b,
      leerdoel: LEERDOEL,
      hints: hintsTevel(a, b)
    });
  }

  return items;
}
