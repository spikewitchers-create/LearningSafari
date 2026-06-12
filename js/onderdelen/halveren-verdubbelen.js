// Halveren & verdubbelen — groep 5, Pluspunt blok 10
// Drie vraagtypes:
//   1. Verdubbel [n]             → 2 × n
//   2. Halveer [n]               → n / 2  (alleen even getallen)
//   3. Strategie: [a] × [b]      → gebruik halveren/verdubbelen om makkelijker te rekenen

const LEERDOEL = 'rek-gr5-halveren-verdubbelen';

function hintsVerdubbel(n) {
  const splits = Math.floor(n / 10) * 10;
  const rest   = n % 10;
  return [
    `Verdubbelen = 2 × ${n}. Splits ${n} en verdubbel elk deel apart.`,
    `2 × ${splits} = ${2 * splits}. Hoeveel is 2 × ${rest}? Tel die bij ${2 * splits} op.`,
    `Het antwoord is ${2 * n}.`,
  ];
}

function hintsHalveer(n) {
  const helft1 = Math.floor(n / 2 / 10) * 10; // halveer het tiental-deel
  const rest   = n - helft1 * 2;               // wat blijft over
  return [
    `Halveren = ${n} ÷ 2. Splits ${n} en halveer elk deel apart.`,
    `Halveer ${Math.floor(n / 10) * 10}: dat geeft ${Math.floor(n / 10) * 5}. Hoeveel is ${n % 10 === 0 ? '' : `de rest (${n % 10}) ÷ 2?`}`.trimEnd().replace(/\?$/, rest > 0 ? ` Voeg ${rest / 2} toe.` : ' Klaar.'),
    `Het antwoord is ${n / 2}.`,
  ];
}

function hintsStrategie(a, b) {
  // a is het enkelvoudige getal (2, 4, 8), b is de factor die we halveren
  // Voorbeeld: 4 × 35 → halveer 4 naar 2, verdubbel 35 naar 70 → 2 × 70 = 140
  const stap1A = a / 2;
  const stap1B = b * 2;
  const antwoord = a * b;
  if (a === 2) {
    return [
      `Verdubbelen: 2 × ${b} kun je uitrekenen door ${b} te verdubbelen.`,
      `2 × ${Math.floor(b / 10) * 10} = ${2 * Math.floor(b / 10) * 10}. Hoeveel is 2 × ${b % 10}? Tel op.`,
      `Het antwoord is ${antwoord}.`,
    ];
  }
  return [
    `Halveren en verdubbelen: halveer ${a} en verdubbel ${b} — de uitkomst blijft hetzelfde.`,
    `${a} × ${b} = ${stap1A} × ${stap1B}. Hoeveel is ${stap1A} × ${stap1B}?`,
    `Het antwoord is ${antwoord}.`,
  ];
}

export function genereerItems() {
  const items = [];

  // 1. Verdubbel n (n tussen 15 en 95, stap 5)
  for (let n = 15; n <= 95; n += 5) {
    items.push({
      id: `halverd-verdubbel-${n}`,
      vraag: `Verdubbel ${n}. (2 × ${n} = ?)`,
      antwoord: 2 * n,
      leerdoel: LEERDOEL,
      hints: hintsVerdubbel(n),
    });
  }

  // 2. Halveer n (even getallen 20–100, stap 4)
  for (let n = 20; n <= 100; n += 4) {
    items.push({
      id: `halverd-halveer-${n}`,
      vraag: `Halveer ${n}. (${n} ÷ 2 = ?)`,
      antwoord: n / 2,
      leerdoel: LEERDOEL,
      hints: hintsHalveer(n),
    });
  }

  // 3. Strategie: 4 × getal en 8 × getal via halveren/verdubbelen
  const strategieSommen = [
    [4, 15], [4, 25], [4, 35], [4, 45], [4, 55], [4, 65], [4, 75],
    [8, 15], [8, 25], [8, 35], [8, 45],
    [4, 18], [4, 22], [4, 32], [4, 42], [8, 12], [8, 22],
  ];
  for (const [a, b] of strategieSommen) {
    items.push({
      id: `halverd-strategie-${a}-${b}`,
      vraag: `${a} × ${b} = ? (gebruik halveren en verdubbelen)`,
      antwoord: a * b,
      leerdoel: LEERDOEL,
      hints: hintsStrategie(a, b),
    });
  }

  return items;
}
