export function genereerItems() {
  const paren = [
    [2,2],[3,2],[3,3],[4,2],[4,3],[4,4],[5,2],[5,3],[5,4],[5,5],
    [6,2],[6,3],[6,4],[6,5],[6,6],[7,3],[7,4],[7,5],[8,3],[8,4],[8,5],[8,6],[9,4],[9,5],[10,4],[10,5],[10,6]
  ];

  const items = [];

  for (const [l, b] of paren) {
    items.push({
      id: `opp-omtrek-${l}-${b}`,
      vraag: `Wat is de omtrek van een rechthoek van ${l} cm en ${b} cm?`,
      antwoord: 2 * (l + b),
      leerdoel: 'Oppervlakte & omtrek: omtrek van een rechthoek',
      hints: [
        "Omtrek = 2 × (lengte + breedte).",
        `2 × (${l} + ${b}) = 2 × ${l + b} = ?`
      ]
    });

    items.push({
      id: `opp-opp-${l}-${b}`,
      vraag: `Wat is de oppervlakte van een rechthoek van ${l} cm en ${b} cm? (in cm²)`,
      antwoord: l * b,
      leerdoel: 'Oppervlakte & omtrek: oppervlakte van een rechthoek',
      hints: [
        "Oppervlakte = lengte × breedte.",
        `${l} × ${b} = ?`
      ]
    });
  }

  return items;
}
