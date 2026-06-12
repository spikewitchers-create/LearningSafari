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

// Verwerkt een antwoord.
// hintsGebruikt: aantal hints dat de leerling heeft bekeken.
//   0               → normaal; correct telt mee voor rij naar beheerst
//   1..hints.length-1 → hulp gebruikt; correct bevriест rij (neutraal)
//   >= hints.length → antwoord voorgezegd; telt altijd als fout
export function verwerkAntwoord(id, gegeven, opgave, beheersing, hintsGebruikt = 0) {
  const aantalHints = opgave.hints?.length ?? 0;
  const antwoordGezien = hintsGebruikt >= aantalHints && aantalHints > 0;
  const correct = !antwoordGezien && gegeven.trim() === String(opgave.antwoord).trim();
  const metHulp  = !antwoordGezien && hintsGebruikt > 0;
  const vandaag  = new Date().toISOString().slice(0, 10);

  const b = beheersing[id] ?? { goed: 0, fout: 0, rij: 0, status: 'nieuw', laatstGeoefend: null };
  b.laatstGeoefend = vandaag;

  let nieuwBeheerst = 0;

  if (correct && !metHulp) {
    // Zelfstandig goed: normaal vooruitgaan
    b.goed += 1;
    b.rij  += 1;
    if (b.status !== 'beheerst' && b.rij >= DREMPEL_BEHEERST) {
      b.status = 'beheerst';
      nieuwBeheerst = 1;
    } else if (b.status === 'nieuw') {
      b.status = 'oefenen';
    }
  } else if (correct && metHulp) {
    // Goed mét hint: rij bevroren, geen achteruitgang
    b.goed += 1;
    if (b.status === 'nieuw') b.status = 'oefenen';
  } else {
    // Fout of antwoord voorgezegd: rij reset
    b.fout += 1;
    b.rij   = 0;
    b.status = 'oefenen';
  }

  return { correct, antwoordGezien, nieuwBeheerst, entry: b };
}
