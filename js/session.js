// Pure functies — geen DOM, geen opslag. Invoer → uitvoer.

const SESSIE_GROOTTE = 10;
const DREMPEL_BEHEERST = 3;
const RECENT_GROOTTE = 3; // vermijd herhaling binnen laatste N vragen

const GEWICHT = { nieuw: 2, oefenen: 4, beheerst: 1 };

function gewichtVan(id, beheersing) {
  const b = beheersing[id];
  if (!b) return GEWICHT.nieuw;
  return GEWICHT[b.status] ?? GEWICHT.nieuw;
}

// Deadline-boost: hoe dichter bij de toetsdatum, hoe hoger de vermenigvuldiger.
// Na de datum: beheerste items krijgen gewicht 0 (worden weggelaten).
function deadlineBoost(item) {
  if (!item.toetsDatum) return 1;
  const nu = Date.now();
  const toets = new Date(item.toetsDatum).getTime();
  const dagenOver = (toets - nu) / 86400000;
  if (dagenOver < 0) return 0;   // toets voorbij: niet meer aanbieden
  if (dagenOver <= 3)  return 6; // laatste 3 dagen: heel urgent
  if (dagenOver <= 7)  return 4; // week voor toets
  if (dagenOver <= 14) return 2; // twee weken voor toets
  return 1;
}

// Kiest `aantal` items gewogen op beheersing.
// Vermijdt herhaling van de laatste RECENT_GROOTTE items.
export function kiesOpgaven(items, beheersing, aantal = SESSIE_GROOTTE) {
  if (items.length === 0) return [];

  const gewogen = items.flatMap(item => {
    const basis = gewichtVan(item.id, beheersing);
    const boost = deadlineBoost(item);
    // Na deadline: beheerste items weglaten (boost=0), rest normaal
    if (boost === 0 && beheersing[item.id]?.status === 'beheerst') return [];
    const w = Math.round(basis * Math.max(boost, 1));
    return Array(w).fill(item);
  });

  const gekozen = [];
  const recent = new Set();

  for (let i = 0; i < aantal; i++) {
    const kandidaten = gewogen.filter(it => !recent.has(it.id));
    const pool = kandidaten.length > 0 ? kandidaten : gewogen;
    const opgave = pool[Math.floor(Math.random() * pool.length)];
    gekozen.push(opgave);
    recent.add(opgave.id);
    if (recent.size > RECENT_GROOTTE) {
      recent.delete(recent.values().next().value);
    }
  }

  return gekozen;
}

// Verwerkt een antwoord.
// hintsGebruikt: aantal hints dat de leerling heeft bekeken.
//   0                → normaal; correct telt mee voor rij
//   1..hints.length-1 → hulp gebruikt; correct bevriest rij (neutraal)
//   >= hints.length  → antwoord voorgezegd
//     - correct ingetypt na zien → neutraal (geen straf, geen vooruitgang)
//     - fout ingetypt na zien    → rij reset
export function verwerkAntwoord(id, gegeven, opgave, beheersing, hintsGebruikt = 0) {
  const aantalHints = opgave.hints?.length ?? 0;
  const antwoordGezien = hintsGebruikt >= aantalHints && aantalHints > 0;
  const norm = s => String(s).trim().toLowerCase().replace(/[''`]/g, "'");
  const correctIngepykt = norm(gegeven) === norm(opgave.antwoord)
    || (opgave.extraAntwoorden ?? []).some(a => norm(a) === norm(gegeven));
  const correct  = !antwoordGezien && correctIngepykt;
  const metHulp  = !antwoordGezien && hintsGebruikt > 0;
  const vandaag  = new Date().toISOString().slice(0, 10);

  const b = beheersing[id] ?? { goed: 0, fout: 0, rij: 0, status: 'nieuw', laatstGeoefend: null };
  b.laatstGeoefend = vandaag;

  let nieuwBeheerst = 0;

  if (correct && !metHulp) {
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
  } else if (antwoordGezien && correctIngepykt) {
    // Antwoord voorgezegd maar toch correct overgetypt: neutraal, geen straf
    b.goed += 1;
    if (b.status === 'nieuw') b.status = 'oefenen';
  } else {
    // Echt fout: rij reset
    b.fout += 1;
    b.rij   = 0;
    b.status = 'oefenen';
  }

  return { correct, antwoordGezien, correctIngepykt, nieuwBeheerst, entry: b };
}
