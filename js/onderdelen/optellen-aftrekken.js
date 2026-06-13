// Optellen en aftrekken t/m 1000 — groep 5, Pluspunt-methodologie
import { getallenLijn } from '../hint-svg.js';
// Categorieën:
//   1. Rijgen optellen (blok 5)
//   2. Rijgen aftrekken (blok 5/6)
//   3. Splitsen optellen (blok 7)
//   4. Splitsen aftrekken (blok 7)
//   5. Aanvullen aftrekken (blok 8)
//   6. Rijgen-met-te-veel optellen (blok 9)
//   7. Rijgen-met-te-veel aftrekken (blok 9)

const LEERDOEL = 'rek-gr5-optellen-aftrekken';

// ── Categorie 1: Rijgen optellen ──────────────────────────────────────────────
// Hint 1: strategie (geen deelresultaat)
// Hint 2: eerste sprong met tussenresultaat, vraag naar volgende stap
// Hint 3: antwoord
function hintsRijgenOpt(a, b) {
  const antwoord = a + b;
  const bHonderd = Math.floor(b / 100) * 100;
  const bRest = b - bHonderd;
  const tussen = a + bHonderd;
  return [
    `Rijgen: spring eerst de honderdtallen (${bHonderd}), dan de rest (${bRest}).`,
    `Eerste sprong: ${a} + ${bHonderd} = ${tussen}. Nu moet je nog ${bRest} optellen.`,
    `Het antwoord is ${antwoord}.`
  ];
}

// ── Categorie 2: Rijgen aftrekken ─────────────────────────────────────────────
function hintsRijgenAft(a, b) {
  const antwoord = a - b;
  const bHonderd = Math.floor(b / 100) * 100;
  const bRest = b - bHonderd;
  const tussen = a - bHonderd;
  return [
    `Rijgen: trek eerst de honderdtallen af (${bHonderd}), dan de rest (${bRest}).`,
    `Eerste sprong: ${a} - ${bHonderd} = ${tussen}. Hoeveel moet je nog aftrekken?`,
    `Het antwoord is ${antwoord}.`
  ];
}

// ── Categorie 3: Splitsen optellen ────────────────────────────────────────────
function hintsSplitsenOpt(a, b) {
  const antwoord = a + b;
  const aH = Math.floor(a / 100) * 100;
  const aT = Math.floor((a % 100) / 10) * 10;
  const aE = a % 10;
  const bH = Math.floor(b / 100) * 100;
  const bT = Math.floor((b % 100) / 10) * 10;
  const bE = b % 10;
  return [
    `Splitsen: splits beide getallen in honderdtallen + tientallen + eenheden en tel die apart op.`,
    `${a} = ${aH} + ${aT} + ${aE}, en ${b} = ${bH} + ${bT} + ${bE}. Hoeveel is ${aH} + ${bH}?`,
    `Het antwoord is ${antwoord}.`
  ];
}

// ── Categorie 4: Splitsen aftrekken ───────────────────────────────────────────
function hintsSplitsenAft(a, b) {
  const antwoord = a - b;
  const aH = Math.floor(a / 100) * 100;
  const aT = Math.floor((a % 100) / 10) * 10;
  const aE = a % 10;
  const bH = Math.floor(b / 100) * 100;
  const bT = Math.floor((b % 100) / 10) * 10;
  const hResult = aH - bH;
  return [
    `Splitsen: trek honderdtallen, tientallen en eenheden apart af.`,
    `${a}: ${aH}, ${aT}, ${aE}. Trek ${bH} af van ${aH}: ${aH} - ${bH} = ${hResult}. Trek ook ${bT} af van ${aT}: dat geeft?`,
    `Het antwoord is ${antwoord}.`
  ];
}

// ── Categorie 5: Aanvullen aftrekken ──────────────────────────────────────────
function hintsAanvulAft(a, b) {
  const antwoord = a - b;
  const volgendRond = Math.ceil(b / 100) * 100;
  const stap1 = volgendRond - b;           // van b naar volgend honderdtal
  // Daarna van volgendRond naar a (kan meerdere stappen zijn)
  const restNaarA = a - volgendRond;
  // Splits restNaarA in honderdtallen + tientallen+eenheden voor hint 2
  const restH = Math.floor(restNaarA / 100) * 100;
  const restTE = restNaarA - restH;
  let stap2Tekst;
  if (restH > 0 && restTE > 0) {
    stap2Tekst = `+${restH} + +${restTE}`;
  } else {
    stap2Tekst = `+${restNaarA}`;
  }
  return [
    `Aanvullen: tel op van ${b} naar ${a}. Hoe ver is het van ${b} naar ${a}?`,
    `Spring van ${b} naar ${volgendRond}: +${stap1}. Dan naar ${a}: dat is nog ${stap2Tekst}. Hoeveel stappen zijn het samen?`,
    `Het antwoord is ${antwoord}.`
  ];
}

// ── Categorie 6: Rijgen-met-te-veel optellen ──────────────────────────────────
function hintsTevelOpt(a, b) {
  const antwoord = a + b;
  const afgerond = Math.ceil(b / 10) * 10;
  const correctie = afgerond - b;
  const tussenstap = a + afgerond;
  return [
    `Rijgen met te veel: ${b} is bijna ${afgerond}. Spring met ${afgerond} en corrigeer daarna.`,
    `${a} + ${afgerond} = ${tussenstap}. Maar je hebt ${correctie} te veel geteld. Wat trek je af?`,
    `Het antwoord is ${antwoord}.`
  ];
}

// ── Categorie 7: Rijgen-met-te-veel aftrekken ─────────────────────────────────
function hintsTevelAft(a, b) {
  const antwoord = a - b;
  const afgerond = Math.ceil(b / 10) * 10;
  const correctie = afgerond - b;
  const tussenstap = a - afgerond;
  return [
    `Rijgen met te veel: ${b} is bijna ${afgerond}. Trek ${afgerond} af en corrigeer daarna.`,
    `${a} - ${afgerond} = ${tussenstap}. Maar je hebt ${correctie} te veel afgetrokken. Wat tel je er bij op?`,
    `Het antwoord is ${antwoord}.`
  ];
}

export function genereerItems() {
  const items = [];

  // ── 1. Rijgen optellen ────────────────────────────────────────────────────
  const rijgenOptSommen = [
    [347, 215], [423, 164], [538, 241], [625, 173], [462, 328],
    [284, 513], [156, 432], [371, 425], [248, 347], [563, 214],
    [189, 308], [445, 237], [326, 451], [174, 623], [517, 282],
    [263, 534], [381, 216], [452, 347], [127, 468], [584, 213]
  ];
  for (const [a, b] of rijgenOptSommen) {
    const bH = Math.floor(b / 100) * 100, bR = b - bH;
    const stappen = bH > 0 && bR > 0
      ? [{van:a, naar:a+bH, delta:`+${bH}`, positief:true}, {van:a+bH, naar:a+b, delta:`+${bR}`, positief:true}]
      : [{van:a, naar:a+b, delta:`+${b}`, positief:true}];
    items.push({
      id: `optaft-rijgen-opt-${a}-${b}`,
      vraag: `${a} + ${b} = ?`,
      antwoord: a + b,
      leerdoel: LEERDOEL,
      hints: hintsRijgenOpt(a, b),
      hintSvg: getallenLijn(stappen, 1),
      hintSvgVolledig: getallenLijn(stappen),
    });
  }

  // ── 2. Rijgen aftrekken ───────────────────────────────────────────────────
  const rijgenAftSommen = [
    [582, 247], [763, 234], [845, 312], [491, 256], [638, 214],
    [724, 381], [856, 423], [571, 234], [693, 241], [748, 315],
    [467, 231], [839, 274], [615, 382], [782, 361], [534, 213],
    [961, 347], [473, 261], [657, 324], [813, 452], [546, 213]
  ];
  for (const [a, b] of rijgenAftSommen) {
    const bH = Math.floor(b / 100) * 100, bR = b - bH;
    const stappen = bH > 0 && bR > 0
      ? [{van:a, naar:a-bH, delta:`-${bH}`, positief:false}, {van:a-bH, naar:a-b, delta:`-${bR}`, positief:false}]
      : [{van:a, naar:a-b, delta:`-${b}`, positief:false}];
    const stappenOmhoog = stappen.slice().reverse().map(s => ({van:s.naar, naar:s.van, delta:s.delta.replace('-','+'), positief:true}));
    items.push({
      id: `optaft-rijgen-aft-${a}-${b}`,
      vraag: `${a} - ${b} = ?`,
      antwoord: a - b,
      leerdoel: LEERDOEL,
      hints: hintsRijgenAft(a, b),
      hintSvg: getallenLijn(stappenOmhoog, 1),
      hintSvgVolledig: getallenLijn(stappenOmhoog),
    });
  }

  // ── 3. Splitsen optellen ──────────────────────────────────────────────────
  const splitsenOptSommen = [
    [345, 213], [423, 254], [516, 231], [634, 152], [241, 326],
    [312, 245], [421, 156], [534, 213], [163, 214], [452, 135],
    [261, 324], [413, 265], [521, 134], [342, 215], [623, 154],
    [251, 132], [314, 263], [435, 152], [162, 215], [543, 214]
  ];
  for (const [a, b] of splitsenOptSommen) {
    items.push({
      id: `optaft-splits-opt-${a}-${b}`,
      vraag: `${a} + ${b} = ?`,
      antwoord: a + b,
      leerdoel: LEERDOEL,
      hints: hintsSplitsenOpt(a, b)
    });
  }

  // ── 4. Splitsen aftrekken (geen overschrijding: eenheden a≥b, tientallen a≥b)
  const splitsenAftSommen = [
    [578, 234], [689, 245], [745, 312], [867, 453], [496, 132],
    [758, 234], [896, 341], [674, 231], [589, 145], [967, 342],
    [758, 416], [685, 423], [797, 365], [489, 132], [796, 453],
    [579, 234], [698, 345], [876, 451], [467, 213], [879, 564]
  ].filter(([a, b]) =>
    (a % 10) >= (b % 10) &&
    (Math.floor((a % 100) / 10)) >= (Math.floor((b % 100) / 10))
  );
  for (const [a, b] of splitsenAftSommen) {
    items.push({
      id: `optaft-splits-aft-${a}-${b}`,
      vraag: `${a} - ${b} = ?`,
      antwoord: a - b,
      leerdoel: LEERDOEL,
      hints: hintsSplitsenAft(a, b)
    });
  }

  // ── 5. Aanvullen aftrekken ────────────────────────────────────────────────
  const aanvulAftSommen = [
    [723, 456], [845, 387], [612, 348], [934, 567], [751, 284],
    [823, 456], [714, 357], [632, 478], [941, 563], [752, 387],
    [813, 467], [924, 578], [741, 356], [832, 467], [621, 384],
    [943, 576], [761, 284], [832, 357], [914, 548], [743, 267]
  ];
  for (const [a, b] of aanvulAftSommen) {
    if (a - b > 100) {
      const volgendRond = Math.ceil(b / 100) * 100;
      const stap1 = volgendRond - b;
      const restNaarA = a - volgendRond;
      const aanvulStappen = restNaarA > 0
        ? [{van:b, naar:volgendRond, delta:`+${stap1}`, positief:true}, {van:volgendRond, naar:a, delta:`+${restNaarA}`, positief:true}]
        : [{van:b, naar:a, delta:`+${stap1}`, positief:true}];
      items.push({
        id: `optaft-aanvul-aft-${a}-${b}`,
        vraag: `${a} - ${b} = ?`,
        antwoord: a - b,
        leerdoel: LEERDOEL,
        hints: hintsAanvulAft(a, b),
        hintSvg: getallenLijn(aanvulStappen, 1),
        hintSvgVolledig: getallenLijn(aanvulStappen),
      });
    }
  }

  // ── 6. Rijgen-met-te-veel optellen ───────────────────────────────────────
  const tevelOptSommen = [
    [524, 199], [368, 299], [415, 198], [537, 399], [246, 198],
    [689, 199], [423, 298], [351, 199], [547, 399], [263, 198],
    [478, 299], [612, 198], [385, 399], [241, 199], [534, 298]
  ];
  for (const [a, b] of tevelOptSommen) {
    const afgerond = Math.ceil(b / 10) * 10;
    const correctie = afgerond - b;
    items.push({
      id: `optaft-tevel-opt-${a}-${b}`,
      vraag: `${a} + ${b} = ?`,
      antwoord: a + b,
      leerdoel: LEERDOEL,
      hints: hintsTevelOpt(a, b),
      hintSvg: getallenLijn([{van:a, naar:a+afgerond, delta:`+${afgerond}`, positief:true}, {van:a+afgerond, naar:a+b, delta:`-${correctie}`, positief:false}], 1),
      hintSvgVolledig: getallenLijn([{van:a, naar:a+afgerond, delta:`+${afgerond}`, positief:true}, {van:a+afgerond, naar:a+b, delta:`-${correctie}`, positief:false}]),
    });
  }

  // ── 7. Rijgen-met-te-veel aftrekken ──────────────────────────────────────
  const tevelAftSommen = [
    [618, 298], [745, 199], [523, 298], [867, 399], [412, 198],
    [954, 299], [731, 198], [846, 399], [523, 199], [674, 298],
    [815, 199], [437, 298], [962, 399], [548, 199], [723, 298]
  ];
  for (const [a, b] of tevelAftSommen) {
    items.push({
      id: `optaft-tevel-aft-${a}-${b}`,
      vraag: `${a} - ${b} = ?`,
      antwoord: a - b,
      leerdoel: LEERDOEL,
      hints: hintsTevelAft(a, b)
    });
  }

  return items;
}
