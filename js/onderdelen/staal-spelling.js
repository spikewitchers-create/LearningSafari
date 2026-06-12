// Staal spelling — Groep 5, blok 4 t/m 8
// invoerType: 'tekst' → app.js schakelt invoer naar tekstmodus
// antwoord is altijd een string (lowercase vergelijking, apostrof-genormaliseerd)

// ── Blok 4: 's-woorden (apostrof + s) ────────────────────────────
const APOSTROF_S = [
  ["'s morgens", "Hoe schrijf je: 'des morgens'?"],
  ["'s middags", "Hoe schrijf je: 'des middags'?"],
  ["'s avonds",  "Hoe schrijf je: 'des avonds'?"],
  ["'s ochtends","Hoe schrijf je: 'des ochtends'?"],
  ["'s nachts",  "Hoe schrijf je: 'des nachts'?"],
  ["'s winters", "Hoe schrijf je: 'des winters'?"],
  ["'s zomers",  "Hoe schrijf je: 'des zomers'?"],
  ["'s lands",   "Hoe schrijf je: 'des lands'?"],
];

// ── Blok 4: Verkleinwoord met -etje ──────────────────────────────
const VERKLEINWOORD_ETJE = [
  // [woord, verkleinwoord, hint2-tussenstap]
  ['ding',  'dingetje',  'ding + etje (de -ng telt als één klank)'],
  ['zon',   'zonnetje',  'zon + n + etje (korte klinker → letter verdubbelen)'],
  ['man',   'mannetje',  'man + n + etje (korte klinker → letter verdubbelen)'],
  ['bom',   'bommetje',  'bom + m + etje (korte klinker → letter verdubbelen)'],
  ['pan',   'pannetje',  'pan + n + etje (korte klinker → letter verdubbelen)'],
  ['kam',   'kammetje',  'kam + m + etje (korte klinker → letter verdubbelen)'],
  ['ton',   'tonnetje',  'ton + n + etje (korte klinker → letter verdubbelen)'],
  ['dom',   'dommetje',  'dom + m + etje (korte klinker → letter verdubbelen)'],
  ['ring',  'ringetje',  'ring + etje (de -ng telt als één klank)'],
  ['wang',  'wangetje',  'wang + etje (de -ng telt als één klank)'],
];

// ── Blok 5: Centwoord (c klinkt als s voor e, i, y) ─────────────
const CENTWOORDEN = [
  // [woord, foute variant, hint2]
  ['cent',    'sent',    'c + e → de c klinkt als "s" voor e, i of y'],
  ['citroen', 'sitroen', 'c + i → de c klinkt als "s" voor e, i of y'],
  ['cirkel',  'sirkel',  'c + i → de c klinkt als "s" voor e, i of y'],
  ['cel',     'sel',     'c + e → de c klinkt als "s" voor e, i of y'],
  ['centrum', 'sentrum', 'c + e → de c klinkt als "s" voor e, i of y'],
  ['cyclus',  'cyclus',  'c + y → de c klinkt als "s" voor e, i of y'],
  ['cijfer',  'sijfer',  'c + ij → de c klinkt als "s" voor ij (= i-klank)'],
  ['cinema',  'sinema',  'c + i → de c klinkt als "s" voor e, i of y'],
];

// ── Blok 5: Apostrof-s meervoud ──────────────────────────────────
const APOSTROF_MEERVOUD = [
  // [enkelvoud, meervoud]
  ["auto",   "auto's"],
  ["menu",   "menu's"],
  ["foto",   "foto's"],
  ["piano",  "piano's"],
  ["taxi",   "taxi's"],
  ["baby",   "baby's"],
  ["studio", "studio's"],
  ["villa",  "villa's"],
  ["sofa",   "sofa's"],
  ["jury",   "jury's"],
];

// ── Blok 6: t(s)ie-woorden ──────────────────────────────────────
const TSIE_WOORDEN = [
  ['politie',    'De t + ie klinkt als "tsie": poli_tie'],
  ['generatie',  'De t + ie klinkt als "tsie": genera_tie'],
  ['natie',      'De t + ie klinkt als "tsie": na_tie'],
  ['portie',     'De t + ie klinkt als "tsie": por_tie'],
  ['functie',    'De t + ie klinkt als "tsie": func_tie'],
  ['relatie',    'De t + ie klinkt als "tsie": rela_tie'],
  ['actie',      'De t + ie klinkt als "tsie": ac_tie'],
  ['sectie',     'De t + ie klinkt als "tsie": sec_tie'],
  ['fractie',    'De t + ie klinkt als "tsie": frac_tie'],
];

// ── Blok 7: Cola-woorden (c klinkt als k voor a/o/u) ────────────
const COLA_WOORDEN = [
  // [woord, hint-uitleg]
  ['cultuur',  'c + u → de c klinkt als "k" voor a, o of u'],
  ['contant',  'c + o → de c klinkt als "k" voor a, o of u'],
  ['conflict', 'c + o → de c klinkt als "k" voor a, o of u'],
  ['contact',  'c + o → de c klinkt als "k" voor a, o of u'],
  ['concert',  'c + o → de c klinkt als "k" voor a, o of u'],
  ['compleet', 'c + o → de c klinkt als "k" voor a, o of u'],
];

// ── Blok 8: Isch-woorden ─────────────────────────────────────────
const ISCH_WOORDEN = [
  ['tropisch',   'tropi + sch → -isch achtervoegsel'],
  ['magisch',    'magi + sch → -isch achtervoegsel'],
  ['komisch',    'komi + sch → -isch achtervoegsel'],
  ['fantastisch','fantasti + sch → -isch achtervoegsel'],
  ['logisch',    'logi + sch → -isch achtervoegsel'],
  ['klassiek',   'Let op: klassiek heeft -iek, niet -isch'],
  ['typisch',    'typi + sch → -isch achtervoegsel'],
  ['plastisch',  'plasti + sch → -isch achtervoegsel'],
];

// ── Items genereren ──────────────────────────────────────────────
export function genereerItems() {
  const items = [];

  // Apostrof-s
  for (let i = 0; i < APOSTROF_S.length; i++) {
    const [antwoord, vraag] = APOSTROF_S[i];
    items.push({
      id: `staal-apots-${i}`,
      invoerType: 'tekst',
      vraag,
      antwoord,
      leerdoel: `Spelling blok 4: 's-woorden`,
      hints: [
        `"Des" wordt vervangen door een apostrof + s. Het klinkt hetzelfde maar schrijf je anders.`,
        `Het begint altijd met een apostrof (') gevolgd door een 's': '...`,
      ],
    });
  }

  // Verkleinwoord -etje
  for (let i = 0; i < VERKLEINWOORD_ETJE.length; i++) {
    const [woord, verk, hint2] = VERKLEINWOORD_ETJE[i];
    items.push({
      id: `staal-etje-${woord}`,
      invoerType: 'tekst',
      vraag: `Maak een verkleinwoord van: "${woord}" (gebruik -etje of -netje)`,
      antwoord: verk,
      leerdoel: `Spelling blok 4: verkleinwoord -etje`,
      hints: [
        `Verkleinwoorden op -etje komen na een korte klinker + medeklinker, of na -ng.`,
        `${hint2}. Schrijf het verkleinwoord volledig.`,
      ],
    });
  }

  // Centwoord
  for (let i = 0; i < CENTWOORDEN.length; i++) {
    const [goed, fout, hint2] = CENTWOORDEN[i];
    items.push({
      id: `staal-cent-${goed}`,
      invoerType: 'tekst',
      vraag: `Centwoord — schrijf correct: "${fout}" of "${goed}"? Type het goede woord.`,
      antwoord: goed,
      leerdoel: `Spelling blok 5: centwoord (c klinkt als s)`,
      hints: [
        `De letter c klinkt als "s" als hij voor een e, i of y staat.`,
        `${hint2}. Dus: ...`,
      ],
    });
  }

  // Apostrof-s meervoud
  for (let i = 0; i < APOSTROF_MEERVOUD.length; i++) {
    const [enkelvoud, meervoud] = APOSTROF_MEERVOUD[i];
    items.push({
      id: `staal-apomv-${enkelvoud}`,
      invoerType: 'tekst',
      vraag: `Meervoud met apostrof: wat is het meervoud van "${enkelvoud}"?`,
      antwoord: meervoud,
      leerdoel: `Spelling blok 5: apostrof-s meervoud`,
      hints: [
        `Woorden die eindigen op een klinker (a, i, o, u, y) krijgen 's in het meervoud.`,
        `${enkelvoud} → ${enkelvoud.slice(0,-0)}... voeg 's toe na de laatste letter.`,
      ],
    });
  }

  // t(s)ie-woorden
  for (let i = 0; i < TSIE_WOORDEN.length; i++) {
    const [woord, hint2] = TSIE_WOORDEN[i];
    const fout = woord.replace('tie', 'tsie');
    items.push({
      id: `staal-tsie-${woord}`,
      invoerType: 'tekst',
      vraag: `T(s)ie-woord — schrijf correct: hoe schrijf je het woord dat klinkt als "${fout}"?`,
      antwoord: woord,
      leerdoel: `Spelling blok 6: t(s)ie-woorden`,
      hints: [
        `De "tsie"-klank schrijf je als -tie (niet -tsie). Denk aan: ac-tie, poli-tie.`,
        `${hint2}`,
      ],
    });
  }

  // Cola-woorden
  for (let i = 0; i < COLA_WOORDEN.length; i++) {
    const [woord, hint2] = COLA_WOORDEN[i];
    items.push({
      id: `staal-cola-${woord}`,
      invoerType: 'tekst',
      vraag: `Cola-woord — schrijf correct: hoe schrijf je "${woord.replace('c','k')}" met een c?`,
      antwoord: woord,
      leerdoel: `Spelling blok 7: cola-woord (c klinkt als k voor a/o/u)`,
      hints: [
        `De letter c klinkt als "k" als hij voor een a, o of u staat.`,
        `${hint2}`,
      ],
    });
  }

  // Isch-woorden
  for (let i = 0; i < ISCH_WOORDEN.length; i++) {
    const [woord, hint2] = ISCH_WOORDEN[i];
    items.push({
      id: `staal-isch-${woord}`,
      invoerType: 'tekst',
      vraag: `Isch-woord — schrijf correct: hoe schrijf je het bijvoeglijk naamwoord van dit woord? (hint: eindigt op -isch of -iek)\nWoord: ${woord.replace(/isch$|iek$/, '...')}`,
      antwoord: woord,
      leerdoel: `Spelling blok 8: isch-woorden`,
      hints: [
        `Woorden die eindigen op -isch schrijf je met -sch (niet -s). Denk aan tropi-sch.`,
        `${hint2}`,
      ],
    });
  }

  return items;
}
