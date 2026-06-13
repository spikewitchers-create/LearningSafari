// Breuken — groep 5, blok 6-7

export function genereerItems() {
  const items = [];

  for (let n = 2; n <= 40; n += 2) {
    items.push({
      id: `breuk-half-${n}`,
      vraag: `Hoeveel is ½ van ${n}?`,
      antwoord: n / 2,
      leerdoel: 'Breuken: helft van een getal',
      hints: [
        '½ van een getal = het getal gedeeld door 2.',
        `${n} ÷ 2 = ?`,
      ],
    });
  }

  for (let n = 4; n <= 48; n += 4) {
    items.push({
      id: `breuk-kwart-${n}`,
      vraag: `Hoeveel is ¼ van ${n}?`,
      antwoord: n / 4,
      leerdoel: 'Breuken: kwart van een getal',
      hints: [
        '¼ van een getal = het getal gedeeld door 4.',
        `${n} ÷ 4 = ?`,
      ],
    });
  }

  for (let n = 4; n <= 48; n += 4) {
    items.push({
      id: `breuk-driekwart-${n}`,
      vraag: `Hoeveel is ¾ van ${n}?`,
      antwoord: (n / 4) * 3,
      leerdoel: 'Breuken: driekwart van een getal',
      hints: [
        '¾ = 3 × ¼. Bereken eerst ¼, dan × 3.',
        `¼ van ${n} = ${n / 4}. Dan ${n / 4} × 3 = ?`,
      ],
    });
  }

  for (let n = 3; n <= 36; n += 3) {
    items.push({
      id: `breuk-derde-${n}`,
      vraag: `Hoeveel is ⅓ van ${n}?`,
      antwoord: n / 3,
      leerdoel: 'Breuken: derde van een getal',
      hints: [
        '⅓ van een getal = het getal gedeeld door 3.',
        `${n} ÷ 3 = ?`,
      ],
    });
  }

  for (let n = 3; n <= 36; n += 3) {
    items.push({
      id: `breuk-tweederde-${n}`,
      vraag: `Hoeveel is ⅔ van ${n}?`,
      antwoord: (n / 3) * 2,
      leerdoel: 'Breuken: tweederde van een getal',
      hints: [
        '⅔ = 2 × ⅓. Bereken eerst ⅓, dan × 2.',
        `⅓ van ${n} = ${n / 3}. Dan ${n / 3} × 2 = ?`,
      ],
    });
  }

  return items;
}
