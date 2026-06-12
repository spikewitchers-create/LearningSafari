// Pure functies — geen DOM, geen opslag. Invoer → uitvoer.
// Een sessie = 10 opgaven, gekozen op basis van beheersing.

const SESSIE_GROOTTE = 10;

// Drempels voor status-overgang
const DREMPEL_BEHEERST = 3; // aaneengesloten goede antwoorden

// Gewichten per status bij het trekken van opgaven
const GEWICHT = { nieuw: 2, oefenen: 4, beheerst: 1 };

function gewichtVan(id, beheersing) {
  const b = beheersing[id];
  if (!b) return GEWICHT.nieuw;
  return GEWICHT[b.status] ?? GEWICHT.nieuw;
}

// Kiest `aantal` items gewogen op beheersing (met terugleggen als nodig).
export function kiesOpgaven(items, beheersing, aantal = SESSIE_GROOTTE) {
  if (items.length === 0) return [];

  const gewogen = items.flatMap(item =>
    Array(gewichtVan(item.id, beheersing)).fill(item)
  );

  const gekozen = [];
  const recent = new Set();

  for (let i = 0; i < aantal; i++) {
    // Vermijd directe herhaling van hetzelfde item
    const kandidaten = gewogen.filter(it => !recent.has(it.id));
    const pool = kandidaten.length > 0 ? kandidaten : gewogen;
    const opgave = pool[Math.floor(Math.random() * pool.length)];
    gekozen.push(opgave);
    recent.clear();
    recent.add(opgave.id);
  }

  return gekozen;
}

// Verwerkt een antwoord; geeft terug { correct, nieuwBeheerst, beheersing }.
export function verwerkAntwoord(id, gegeven, opgave, beheersing) {
  const correct = gegeven.trim() === String(opgave.antwoord).trim();
  const vandaag = new Date().toISOString().slice(0, 10);

  const b = beheersing[id] ?? { goed: 0, fout: 0, rij: 0, status: 'nieuw', laatstGeoefend: null };

  b.laatstGeoefend = vandaag;

  let nieuwBeheerst = 0;

  if (correct) {
    b.goed += 1;
    b.rij += 1;
    if (b.status !== 'beheerst' && b.rij >= DREMPEL_BEHEERST) {
      b.status = 'beheerst';
      nieuwBeheerst = 1;
    } else if (b.status === 'nieuw') {
      b.status = 'oefenen';
    }
  } else {
    b.fout += 1;
    b.rij = 0;
    if (b.status === 'beheerst') b.status = 'oefenen';
    else b.status = 'oefenen';
  }

  return { correct, nieuwBeheerst, entry: b };
}
