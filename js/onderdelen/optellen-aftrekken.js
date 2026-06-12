// Optellen en aftrekken t/m 1000 — groep 5 niveau
// Categorieën:
//   1. Tientallen optellen/aftrekken (230 + 140, 580 - 240)
//   2. Honderdtallen optellen/aftrekken (300 + 400, 700 - 200)
//   3. Gemengd met overschrijding (450 + 270, 830 - 380)
//   4. Aanvullen tot 1000 (670 + ? = 1000)

function hints_opt(a, b) {
  const som = a + b;
  return [
    `Tel op per honderdtal: ${a} + ${Math.floor(b / 100) * 100} = ${a + Math.floor(b / 100) * 100}, dan nog ${b % 100} erbij.`,
    `${a} + ${b}: eerst ${a} + ${Math.floor(b / 100) * 100} = ${a + Math.floor(b / 100) * 100}. Dan + ${b % 100} = ${som}.`,
    `Het antwoord is ${som}.`,
  ];
}

function hints_aft(a, b) {
  const verschil = a - b;
  return [
    `Trek af per honderdtal: ${a} - ${Math.floor(b / 100) * 100} = ${a - Math.floor(b / 100) * 100}, dan nog ${b % 100} eraf.`,
    `${a} - ${b}: eerst ${a} - ${Math.floor(b / 100) * 100} = ${a - Math.floor(b / 100) * 100}. Dan - ${b % 100} = ${verschil}.`,
    `Het antwoord is ${verschil}.`,
  ];
}

function hints_aanvul(a) {
  const ontbrekend = 1000 - a;
  const stap1 = Math.ceil(a / 100) * 100;
  return [
    `Reken eerst naar het volgende honderdtal: ${a} → ${stap1} (dat is ${stap1 - a} stappen). Dan van ${stap1} naar 1000.`,
    `Van ${a} naar ${stap1}: +${stap1 - a}. Van ${stap1} naar 1000: +${1000 - stap1}. Samen: ${stap1 - a} + ${1000 - stap1} = ${ontbrekend}.`,
    `Het antwoord is ${ontbrekend}.`,
  ];
}

function maakId(type, a, b) {
  return `optaft-${type}-${a}-${b}`;
}

export function genereerItems() {
  const items = [];

  // 1. Tientallen optellen (veelvouden van 10, geen overschrijding honderdtal)
  for (let a = 100; a <= 900; a += 100) {
    for (let b = 10; b <= 90; b += 10) {
      if (a + b > 1000) continue;
      items.push({
        id: maakId('opt10', a, b),
        vraag: `${a} + ${b} = ?`,
        antwoord: a + b,
        leerdoel: 'rek-gr5-optellen-aftrekken',
        hints: hints_opt(a, b),
      });
    }
  }

  // 2. Honderdtallen optellen
  for (let a = 100; a <= 800; a += 100) {
    for (let b = 100; b <= 900 - a; b += 100) {
      items.push({
        id: maakId('opt100', a, b),
        vraag: `${a} + ${b} = ?`,
        antwoord: a + b,
        leerdoel: 'rek-gr5-optellen-aftrekken',
        hints: hints_opt(a, b),
      });
    }
  }

  // 3. Tientallen aftrekken
  for (let a = 200; a <= 1000; a += 100) {
    for (let b = 10; b <= 90; b += 10) {
      if (a - b < 0) continue;
      items.push({
        id: maakId('aft10', a, b),
        vraag: `${a} - ${b} = ?`,
        antwoord: a - b,
        leerdoel: 'rek-gr5-optellen-aftrekken',
        hints: hints_aft(a, b),
      });
    }
  }

  // 4. Honderdtallen aftrekken
  for (let a = 200; a <= 1000; a += 100) {
    for (let b = 100; b < a; b += 100) {
      items.push({
        id: maakId('aft100', a, b),
        vraag: `${a} - ${b} = ?`,
        antwoord: a - b,
        leerdoel: 'rek-gr5-optellen-aftrekken',
        hints: hints_aft(a, b),
      });
    }
  }

  // 5. Aanvullen tot 1000
  for (let a = 100; a <= 900; a += 50) {
    items.push({
      id: maakId('aanvul', a, 1000),
      vraag: `${a} + ? = 1000`,
      antwoord: 1000 - a,
      leerdoel: 'rek-gr5-optellen-aftrekken',
      hints: hints_aanvul(a),
    });
  }

  return items;
}
