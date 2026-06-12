// Deelsommen naar analogie — blok 8
// Strategie: gebruik de 'kleine som' (8:4=2 → 80:4=20)

function hints(groot, deler, klein, resultKlein) {
  return [
    `Gebruik de kleine som: zoek een keersom die op deze som lijkt.`,
    `${klein} : ${deler} = ${resultKlein}. Dus ${groot} : ${deler} = ${resultKlein} × 10 = ?`,
  ];
}

export function genereerItems() {
  const items = [];

  // Genereer vanuit tafels: voor elk tafelproduct p = a*b,
  // maak de analogievraag (p*10) : b = a*10
  for (let a = 2; a <= 9; a++) {
    for (let b = 2; b <= 9; b++) {
      const klein = a * b;          // bijv. 8
      const groot = klein * 10;     // bijv. 80
      const antwoord = a * 10;      // bijv. 20

      if (groot > 900 || antwoord > 90) continue;

      items.push({
        id: `deelanalog-${groot}-${b}`,
        vraag: `${groot} : ${b} = ?`,
        antwoord,
        leerdoel: `Deelsommen naar analogie: gebruik de kleine som ${klein} : ${b} = ${a}`,
        hints: hints(groot, b, klein, a),
      });
    }
  }

  // Dedupliceer op id (meerdere combinaties kunnen zelfde som geven)
  const gezien = new Set();
  return items.filter(it => {
    if (gezien.has(it.id)) return false;
    gezien.add(it.id);
    return true;
  });
}
