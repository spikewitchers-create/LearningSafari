// Pure functies — geen DOM, geen opslag. Invoer → uitvoer.

const SESSIE_GROOTTE = 10;
const DREMPEL_BEHEERST = 3;
const RECENT_GROOTTE = 3; // vermijd herhaling binnen laatste N vragen

// Bepaal 1 van 6 visuele/weegstaten op basis van beheersing-entry.
// Gespiegeld met itemStaat() in app.js — wijzigingen hier ook daar doorvoeren.
export function staatVan(b) {
  if (!b || b.status === 'nieuw') return 'grijs';
  if (b.status === 'beheerst')    return 'donkergroen';
  const rij     = b.rij     ?? 0;
  const fout    = b.fout    ?? 0;
  const metHint = b.metHint ?? 0;
  if (fout === 0 && metHint === 0) return 'lichtgroen'; // zelfstandig, nooit fout
  if (fout === 0 && metHint  > 0)  return 'geel';       // nooit fout maar leunde op hints
  if (rij === 0)                   return 'rood';        // laatste antwoord fout
  if (rij === 1)                   return 'oranje';      // 1 goed na een fout
  return                                  'geel';        // 2+ goed maar eerder fout
}

// Basisgewicht per staat: hoe hoger, hoe vaker het item terugkomt
const GEWICHT = {
  grijs:       3,  // nog niet gezien — zeker aan bod laten komen
  rood:        6,  // laatste fout — direct herhalen
  oranje:      5,  // 1 goed na fout — consolideren
  geel:        4,  // hint-afhankelijk of bijna hersteld
  lichtgroen:  3,  // goed bezig, zelfstandig — maar nog niet beheerst
  donkergroen: 1,  // beheerst — laag gewicht, af en toe herhalen
};

// Deadline-boost per staat: ongeziene en risicovolle items zwaarder vlak voor toets
function deadlineBoost(item, staat) {
  if (!item.toetsDatum) return 1;
  const dagenOver = (new Date(item.toetsDatum).getTime() - Date.now()) / 86400000;
  if (dagenOver < 0) return staat === 'donkergroen' ? 0 : 1; // na toets: beheerst weglaten
  if (staat === 'grijs') {
    // Ongezien vlak voor toets: absolute topprioriteit
    if (dagenOver <= 1)  return 20;
    if (dagenOver <= 3)  return 12;
    if (dagenOver <= 7)  return 7;
    if (dagenOver <= 14) return 3;
    return 1;
  }
  if (staat === 'rood' || staat === 'oranje') {
    if (dagenOver <= 3)  return 6;
    if (dagenOver <= 7)  return 4;
    if (dagenOver <= 14) return 2;
    return 1;
  }
  if (staat === 'geel' || staat === 'lichtgroen') {
    if (dagenOver <= 3)  return 4;
    if (dagenOver <= 7)  return 2;
    return 1;
  }
  // donkergroen: kleine opfrissing vlak voor toets
  if (dagenOver <= 3)  return 3;
  if (dagenOver <= 7)  return 2;
  return 1;
}

// Kiest `aantal` items gewogen op beheersing.
// Garandeert spreiding: alle unieke items komen minstens 1× voor als de pool
// klein genoeg is. Daarna wordt aangevuld met gewogen willekeurige selectie.
export function kiesOpgaven(items, beheersing, aantal = SESSIE_GROOTTE) {
  if (items.length === 0) return [];

  // Bouw gewogen pool — beheerste items na deadline krijgen gewicht 1 (onderhoud)
  const itemGewicht = item => {
    const staat = staatVan(beheersing[item.id]);
    const basis = GEWICHT[staat];
    const boost = deadlineBoost(item, staat);
    return Math.max(1, Math.round(basis * boost)); // minimaal 1, nooit weggooien
  };

  const uniekeItems = items.filter(it => itemGewicht(it) > 0);
  if (uniekeItems.length === 0) return [];

  // Fase 1: shuffle alle unieke items zodat elk minstens 1× aan bod komt
  // (als er minder unieke items dan sessieslots zijn)
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const gekozen = [];

  if (uniekeItems.length <= aantal) {
    // Alle items passen in de sessie: shuffle ze als basisvolgorde
    gekozen.push(...shuffle(uniekeItems));
  }

  // Fase 2: vul aan tot `aantal` met gewogen willekeurige selectie
  const gewogen = uniekeItems.flatMap(item =>
    Array(itemGewicht(item)).fill(item)
  );
  const recent = new Set(gekozen.slice(-RECENT_GROOTTE).map(it => it.id));

  while (gekozen.length < aantal) {
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
  const norm = s => String(s)
    .replace(/[­​-‏‪-‮﻿᠎]/g, '') // onzichtbare Unicode
    .trim().toLowerCase().replace(/[''`]/g, "'");
  const correctIngepykt = norm(gegeven) === norm(opgave.antwoord)
    || (opgave.extraAntwoorden ?? []).some(a => norm(a) === norm(gegeven));
  const correct  = !antwoordGezien && correctIngepykt;
  const metHulp  = !antwoordGezien && hintsGebruikt > 0;
  const vandaag  = new Date().toISOString().slice(0, 10);

  const b = beheersing[id] ?? { goed: 0, fout: 0, rij: 0, status: 'nieuw', laatstGeoefend: null,
    metHint: 0, gezien: 0, fouteAntwoorden: [] };
  b.metHint         ??= 0;
  b.gezien          ??= 0;
  b.fouteAntwoorden ??= [];
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
    b.goed   += 1;
    b.metHint += 1;
    if (b.status === 'nieuw') b.status = 'oefenen';
  } else if (antwoordGezien && correctIngepykt) {
    // Antwoord voorgezegd maar toch correct overgetypt: neutraal, geen straf
    b.goed  += 1;
    b.gezien += 1;
    if (b.status === 'nieuw') b.status = 'oefenen';
  } else {
    // Echt fout: rij reset
    b.fout += 1;
    b.rij   = 0;
    b.status = 'oefenen';
    // Bewaar unieke foute antwoorden (max 5, meest recent eerst)
    const normGegeven = String(gegeven).trim();
    if (normGegeven && !b.fouteAntwoorden.includes(normGegeven)) {
      b.fouteAntwoorden.unshift(normGegeven);
      if (b.fouteAntwoorden.length > 5) b.fouteAntwoorden.pop();
    }
  }

  return { correct, antwoordGezien, correctIngepykt, nieuwBeheerst, entry: b };
}
