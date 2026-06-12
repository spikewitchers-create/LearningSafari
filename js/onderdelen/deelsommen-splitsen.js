// Deelsommen splitsen — groep 5, Pluspunt blok 9/10
// Strategie: splits het deeltal in twee handige stukken die allebei deelbaar zijn
// Voorbeeld: 42 : 3 = (30 + 12) : 3 = 10 + 4 = 14

const LEERDOEL = 'rek-gr5-deelsommen-splitsen';

function vindSplitsing(a, b) {
  // Zoek grootste veelvoud van b*10 dat ≤ a, rest moet ook deelbaar zijn door b
  const tiental = Math.floor(a / (b * 10)) * (b * 10);
  const rest = a - tiental;
  if (rest % b === 0 && tiental > 0) return [tiental, rest];
  // Fallback: zoek veelvoud van b dichtbij a/2
  for (let v = Math.floor(a / 2 / b) * b; v >= b; v -= b) {
    const r = a - v;
    if (r % b === 0 && r > 0) return [v, r];
  }
  return null;
}

function hints(a, b, splitsing) {
  const [deel1, deel2] = splitsing;
  const q1 = deel1 / b;
  const q2 = deel2 / b;
  return [
    `Splitsen: deel ${a} op in twee getallen die allebei deelbaar zijn door ${b}.`,
    `${a} = ${deel1} + ${deel2}. Reken ${deel1} : ${b} = ${q1}. Hoeveel is ${deel2} : ${b}?`,
    `Het antwoord is ${q1 + q2} (want ${q1} + ${q2} = ${q1 + q2}).`,
  ];
}

export function genereerItems() {
  const items = [];

  // Geselecteerde sommen die goed splitsen met de Pluspunt-methode
  const sommen = [
    // deler 2
    [48, 2], [64, 2], [76, 2], [84, 2], [96, 2],
    // deler 3
    [42, 3], [51, 3], [63, 3], [72, 3], [84, 3], [93, 3],
    // deler 4
    [48, 4], [52, 4], [64, 4], [76, 4], [84, 4], [96, 4],
    // deler 5
    [55, 5], [65, 5], [75, 5], [85, 5], [95, 5],
    // deler 6
    [54, 6], [66, 6], [72, 6], [78, 6], [84, 6], [96, 6],
    // deler 7
    [56, 7], [63, 7], [77, 7], [84, 7], [91, 7],
    // deler 8
    [56, 8], [64, 8], [72, 8], [88, 8], [96, 8],
    // deler 9
    [54, 9], [63, 9], [72, 9], [81, 9], [90, 9],
  ];

  for (const [a, b] of sommen) {
    const splitsing = vindSplitsing(a, b);
    if (!splitsing) continue;
    items.push({
      id: `deelspl-${a}-${b}`,
      vraag: `${a} : ${b} = ?`,
      antwoord: a / b,
      leerdoel: LEERDOEL,
      hints: hints(a, b, splitsing),
    });
  }

  return items;
}
