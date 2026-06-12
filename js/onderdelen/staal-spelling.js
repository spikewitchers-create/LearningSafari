// Staal spelling — Groep 5, blok 4 t/m 8
// invoerType: 'tekst' → app.js schakelt invoer naar tekstmodus
// antwoord is altijd een string (lowercase vergelijking, apostrof-genormaliseerd)

// ── Blok 4: 's-woorden (apostrof + s) ────────────────────────────
const APOSTROF_S = [
  ["'s morgens",  "Hoe schrijf je: 'des morgens'?"],
  ["'s middags",  "Hoe schrijf je: 'des middags'?"],
  ["'s avonds",   "Hoe schrijf je: 'des avonds'?"],
  ["'s ochtends", "Hoe schrijf je: 'des ochtends'?"],
  ["'s nachts",   "Hoe schrijf je: 'des nachts'?"],
  ["'s winters",  "Hoe schrijf je: 'des winters'?"],
  ["'s zomers",   "Hoe schrijf je: 'des zomers'?"],
  ["'s lands",    "Hoe schrijf je: 'des lands'?"],
  ["'s maandags", "Hoe schrijf je: 'des maandags'?"],
  ["'s vrijdags", "Hoe schrijf je: 'des vrijdags'?"],
];

// ── Blok 4: Verkleinwoord met -etje ──────────────────────────────
const VERKLEINWOORD_ETJE = [
  // [woord, verkleinwoord, hint2]
  ['ding',  'dingetje',  'ding + etje (de -ng telt als één klank, geen verdubbeling)'],
  ['zon',   'zonnetje',  'zon + n + etje (korte klinker → letter verdubbelen)'],
  ['man',   'mannetje',  'man + n + etje (korte klinker → letter verdubbelen)'],
  ['bom',   'bommetje',  'bom + m + etje (korte klinker → letter verdubbelen)'],
  ['pan',   'pannetje',  'pan + n + etje (korte klinker → letter verdubbelen)'],
  ['kam',   'kammetje',  'kam + m + etje (korte klinker → letter verdubbelen)'],
  ['ton',   'tonnetje',  'ton + n + etje (korte klinker → letter verdubbelen)'],
  ['dom',   'dommetje',  'dom + m + etje (korte klinker → letter verdubbelen)'],
  ['ring',  'ringetje',  'ring + etje (de -ng telt als één klank)'],
  ['wang',  'wangetje',  'wang + etje (de -ng telt als één klank)'],
  ['pot',   'potje',     'pot + je (sluit af op t → geen verdubbeling nodig)'],
  ['deur',  'deurtje',   'deur + tje (lange klinker/tweeklank → direct -tje)'],
  ['taart', 'taartje',   'taart + je (sluit af op rt → geen verdubbeling)'],
  ['bloem', 'bloempje',  'bloem + pje (sluit af op m voor p)'],
  ['stoel', 'stoeltje',  'stoel + tje (lange klinker → direct -tje)'],
];

// ── Blok 4: Ei/ij-woorden (ei-plaat) ─────────────────────────────
const EI_IJ_PLAAT = [
  // [antwoord, vraag, hint2-uitleg]
  ['trein',   'Vul in (ei of ij?): tr__n → ik ga met de ... naar school.',   'De trein rijdt op rails: t-r-e-i-n'],
  ['meid',    'Vul in (ei of ij?): m__d → een stoere ...',                   'meid schrijf je met ei: m-e-i-d'],
  ['geit',    'Vul in (ei of ij?): g__t → een dier met hoorntjes: ...',      'geit schrijf je met ei: g-e-i-t'],
  ['wijd',    'Vul in (ei of ij?): w__d → de deur staat ... open.',           'wijd schrijf je met ij: w-i-j-d'],
  ['rij',     'Vul in (ei of ij?): r__ → een ... fietsers naast elkaar.',     'rij schrijf je met ij: r-i-j'],
  ['bij',     'Vul in (ei of ij?): b__ → een insect dat honing maakt: ...',  'bij schrijf je met ij: b-i-j'],
  ['vrij',    'Vul in (ei of ij?): vr__ → morgen ben ik ...',                'vrij schrijf je met ij: v-r-i-j'],
  ['fijn',    'Vul in (ei of ij?): f__n → dat is heel ...',                  'fijn schrijf je met ij: f-i-j-n'],
  ['sein',    'Vul in (ei of ij?): s__n → het stoplicht gaf een ... .',      'sein schrijf je met ei: s-e-i-n'],
  ['pijn',    'Vul in (ei of ij?): p__n → mijn knie doet ...',               'pijn schrijf je met ij: p-i-j-n'],
  ['wijs',    'Vul in (ei of ij?): w__s → de juf is heel ...',               'wijs schrijf je met ij: w-i-j-s'],
];

// ── Blok 4: Persoonsvorm (vraagproef) ────────────────────────────
// Vraagproef: zet de zin om in een vraag → het woord dat van positie wisselt = persoonsvorm
const PERSOONSVORM = [
  // [antwoord, zin, hint2]
  ['rent',     'De hond rent snel door de tuin.',          'Zet om: "Rent de hond snel door de tuin?" → rent wisselt van plaats'],
  ['speelt',   'Lisa speelt piano na school.',             'Zet om: "Speelt Lisa piano na school?" → speelt wisselt van plaats'],
  ['eten',     'De kinderen eten brood voor de lunch.',    'Zet om: "Eten de kinderen brood?" → eten wisselt van plaats'],
  ['rijdt',    'De bus rijdt naar het centrum.',           'Zet om: "Rijdt de bus naar het centrum?" → rijdt wisselt van plaats'],
  ['vliegt',   'De vogel vliegt over het dak.',            'Zet om: "Vliegt de vogel over het dak?" → vliegt wisselt van plaats'],
  ['lacht',    'Mijn vader lacht om de grap.',             'Zet om: "Lacht mijn vader om de grap?" → lacht wisselt van plaats'],
  ['schrijft', 'De juf schrijft een woord op het bord.',  'Zet om: "Schrijft de juf een woord op het bord?" → schrijft wisselt'],
  ['slapen',   'De katten slapen op de bank.',             'Zet om: "Slapen de katten op de bank?" → slapen wisselt van plaats'],
  ['fietst',   'Sanne fietst elke dag naar school.',       'Zet om: "Fietst Sanne elke dag naar school?" → fietst wisselt'],
  ['werkt',    'Mijn moeder werkt in het ziekenhuis.',     'Zet om: "Werkt mijn moeder in het ziekenhuis?" → werkt wisselt'],
  ['loopt',    'De leraar loopt door de gang.',            'Zet om: "Loopt de leraar door de gang?" → loopt wisselt van plaats'],
  ['zingt',    'De klas zingt een mooi lied.',             'Zet om: "Zingt de klas een mooi lied?" → zingt wisselt van plaats'],
];

// ── Blok 5: Centwoord (c klinkt als s voor e, i, y) ─────────────
const CENTWOORDEN = [
  // [woord, foute variant, hint2]
  ['cent',     'sent',     'c + e → de c klinkt als "s" voor e, i of y'],
  ['citroen',  'sitroen',  'c + i → de c klinkt als "s" voor e, i of y'],
  ['cirkel',   'sirkel',   'c + i → de c klinkt als "s" voor e, i of y'],
  ['cel',      'sel',      'c + e → de c klinkt als "s" voor e, i of y'],
  ['centrum',  'sentrum',  'c + e → de c klinkt als "s" voor e, i of y'],
  ['cyclus',   'syclus',   'c + y → de c klinkt als "s" voor e, i of y'],
  ['cijfer',   'sijfer',   'c + ij → de c klinkt als "s" voor ij (= i-klank)'],
  ['cinema',   'sinema',   'c + i → de c klinkt als "s" voor e, i of y'],
  ['cymbaal',  'symbaal',  'c + y → de c klinkt als "s" voor e, i of y'],
  ['cement',   'sement',   'c + e → de c klinkt als "s" voor e, i of y'],
  ['cello',    'sello',    'c + e → de c klinkt als "s" voor e, i of y'],
  ['cyber',    'syber',    'c + y → de c klinkt als "s" voor e, i of y'],
];

// ── Blok 5: Apostrof-s meervoud ──────────────────────────────────
const APOSTROF_MEERVOUD = [
  // [enkelvoud, meervoud]
  ['auto',   "auto's"],
  ['menu',   "menu's"],
  ['foto',   "foto's"],
  ['piano',  "piano's"],
  ['taxi',   "taxi's"],
  ['baby',   "baby's"],
  ['studio', "studio's"],
  ['villa',  "villa's"],
  ['sofa',   "sofa's"],
  ['jury',   "jury's"],
  ['video',  "video's"],
  ['radio',  "radio's"],
  ['oma',    "oma's"],
  ['opa',    "opa's"],
];

// ── Blok 6: Ei/ij-woorden (zonder plaat, meer woorden) ───────────
const EI_IJ_ZONDER_PLAAT = [
  // [antwoord, vraag, hint2]
  ['ijzer',   'Vul in (ei of ij?): __zer → het metaal ...',          'ijzer schrijf je met ij: ij-z-e-r'],
  ['tijger',  'Vul in (ei of ij?): t__ger → het gestreepte dier.',   'tijger schrijf je met ij: t-ij-g-e-r'],
  ['heide',   'Vul in (ei of ij?): h__de → een paarse vlakte.',      'heide schrijf je met ei: h-ei-d-e'],
  ['reizen',  'Vul in (ei of ij?): r__zen → op vakantie gaan.',      'reizen schrijf je met ei: r-ei-z-en'],
  ['kwijt',   'Vul in (ei of ij?): kw__t → ik ben mijn fiets ...',   'kwijt schrijf je met ij: kw-ij-t'],
  ['beige',   'Vul in (ei of ij?): b__ge → de kleur ... (geelbruin)','beige schrijf je met ei: b-ei-g-e'],
  ['lijm',    'Vul in (ei of ij?): l__m → plakken met ...',          'lijm schrijf je met ij: l-ij-m'],
  ['prijs',   'Vul in (ei of ij?): pr__s → de ... in de winkel.',    'prijs schrijf je met ij: pr-ij-s'],
  ['eindje',  'Vul in (ei of ij?): __ndje → nog een klein ...',      'eindje schrijf je met ei: ein-d-je'],
  ['stijgen', 'Vul in (ei of ij?): st__gen → omhoog gaan.',          'stijgen schrijf je met ij: st-ij-g-en'],
  ['veilig',  'Vul in (ei of ij?): v__lig → dat is ... .',           'veilig schrijf je met ei: v-ei-l-ig'],
  ['bijten',  'Vul in (ei of ij?): b__ten → de hond wil ... .',      'bijten schrijf je met ij: b-ij-t-en'],
];

// ── Blok 6: Pech-versje woorden (-ch) ────────────────────────────
const PECH_WOORDEN = [
  // [woord, hint2-geheugensteuntje]
  ['pech',    'pech → klinkt als "pek" maar schrijf je met -ch: p-e-ch'],
  ['recht',   'recht → klinkt als "rekt" maar schrijf je met -cht: r-e-ch-t'],
  ['licht',   'licht → klinkt als "likt" maar schrijf je met -cht: l-i-ch-t'],
  ['lucht',   'lucht → klinkt als "lukt" maar schrijf je met -cht: l-u-ch-t'],
  ['nacht',   'nacht → klinkt als "nakt" maar schrijf je met -cht: n-a-ch-t'],
  ['kracht',  'kracht → klinkt als "krakt" maar schrijf je met -cht: kr-a-ch-t'],
  ['vacht',   'vacht → klinkt als "fakt" maar schrijf je met -cht: v-a-ch-t'],
  ['wacht',   'wacht → klinkt als "wakt" maar schrijf je met -cht: w-a-ch-t'],
  ['pracht',  'pracht → klinkt als "prakt" maar schrijf je met -cht: pr-a-ch-t'],
  ['slecht',  'slecht → klinkt als "slekt" maar schrijf je met -cht: sl-e-ch-t'],
  ['vecht',   'vecht → klinkt als "fekt" maar schrijf je met -cht: v-e-ch-t'],
  ['dacht',   'dacht → verleden tijd van denken: d-a-ch-t'],
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
  ['conditie',   'De t + ie klinkt als "tsie": condi_tie'],
  ['positie',    'De t + ie klinkt als "tsie": posi_tie'],
  ['traditie',   'De t + ie klinkt als "tsie": tradi_tie'],
  ['editie',     'De t + ie klinkt als "tsie": edi_tie'],
];

// ── Blok 7: Cola-woorden (c klinkt als k voor a/o/u) ────────────
const COLA_WOORDEN = [
  ['cultuur',   'c + u → de c klinkt als "k" voor a, o of u'],
  ['contant',   'c + o → de c klinkt als "k" voor a, o of u'],
  ['conflict',  'c + o → de c klinkt als "k" voor a, o of u'],
  ['contact',   'c + o → de c klinkt als "k" voor a, o of u'],
  ['concert',   'c + o → de c klinkt als "k" voor a, o of u'],
  ['compleet',  'c + o → de c klinkt als "k" voor a, o of u'],
  ['combinatie','c + o → de c klinkt als "k" voor a, o of u'],
  ['camping',   'c + a → de c klinkt als "k" voor a, o of u'],
  ['computer',  'c + o → de c klinkt als "k" voor a, o of u'],
  ['cadeau',    'c + a → de c klinkt als "k" voor a, o of u'],
  ['camera',    'c + a → de c klinkt als "k" voor a, o of u'],
  ['couleur',   'c + o → de c klinkt als "k" voor a, o of u'],
];

// ── Blok 7: Voltooid deelwoord ────────────────────────────────────
const VOLTOOID_DEELWOORD = [
  // [infinitief, VD, hint2-uitleg]
  ['spelen',    'gespeeld',    'ge- + speel + d: de stam eindigt op l (= zachte medeklinker) → -d'],
  ['werken',    'gewerkt',     'ge- + werk + t: de stam eindigt op k (= harde medeklinker: t kofschip) → -t'],
  ['maken',     'gemaakt',     'ge- + maak + t: de stam eindigt op k (= harde medeklinker) → -t'],
  ['lopen',     'gelopen',     'ge- + lopen: sterk werkwoord, verander de stam'],
  ['fietsen',   'gefietst',    'ge- + fiets + t: de stam eindigt op s (= harde medeklinker) → -t'],
  ['kijken',    'gekeken',     'ge- + keken: sterk werkwoord'],
  ['schrijven', 'geschreven',  'ge- + schreven: sterk werkwoord'],
  ['lezen',     'gelezen',     'ge- + lezen: sterk werkwoord (lees → gelezen)'],
  ['zingen',    'gezongen',    'ge- + zongen: sterk werkwoord (zing → gezongen)'],
  ['dansen',    'gedanst',     'ge- + dans + t: de stam eindigt op s (= harde medeklinker) → -t'],
  ['slapen',    'geslapen',    'ge- + slapen: sterk werkwoord'],
  ['helpen',    'geholpen',    'ge- + holpen: sterk werkwoord'],
  ['kopen',     'gekocht',     'ge- + kocht: sterk werkwoord (koop → gekocht)'],
  ['horen',     'gehoord',     'ge- + hoor + d: de stam eindigt op r (= zachte medeklinker) → -d'],
];

// ── Blok 8: Isch-woorden ─────────────────────────────────────────
const ISCH_WOORDEN = [
  ['tropisch',    'tropi + sch → -isch achtervoegsel'],
  ['magisch',     'magi + sch → -isch achtervoegsel'],
  ['komisch',     'komi + sch → -isch achtervoegsel'],
  ['fantastisch', 'fantasti + sch → -isch achtervoegsel'],
  ['logisch',     'logi + sch → -isch achtervoegsel'],
  ['typisch',     'typi + sch → -isch achtervoegsel'],
  ['plastisch',   'plasti + sch → -isch achtervoegsel'],
  ['klassiek',    'Let op: klassiek heeft -iek, niet -isch (Frans woord)'],
  ['robotisch',   'robot + isch → -isch achtervoegsel'],
  ['kosmisch',    'kosmi + sch → -isch achtervoegsel'],
  ['cynisch',     'cyni + sch → -isch achtervoegsel (c + y → s-klank)'],
  ['chronisch',   'chroni + sch → -isch achtervoegsel'],
];

// ── Blok 8: Overtreffende trap (superlatief: -ste / -ste) ────────
const SUPERLATIEF = [
  // [grondwoord, superlatief, hint2]
  ['groot',   'grootste',   'groot → groter → groot + ste = grootste'],
  ['klein',   'kleinste',   'klein → kleiner → klein + ste = kleinste'],
  ['lang',    'langste',    'lang → langer → lang + ste = langste'],
  ['kort',    'kortste',    'kort → korter → kort + ste = kortste'],
  ['oud',     'oudste',     'oud → ouder → oud + ste = oudste'],
  ['nieuw',   'nieuwste',   'nieuw → nieuwer → nieuw + ste = nieuwste'],
  ['mooi',    'mooiste',    'mooi → mooier → mooi + ste = mooiste'],
  ['snel',    'snelste',    'snel → sneller → snel + ste = snelste'],
  ['sterk',   'sterkste',   'sterk → sterker → sterk + ste = sterkste'],
  ['zwak',    'zwakste',    'zwak → zwakker → zwak + ste = zwakste'],
  ['warm',    'warmste',    'warm → warmer → warm + ste = warmste'],
  ['koud',    'koudste',    'koud → kouder → koud + ste = koudste'],
  ['lief',    'liefste',    'lief → liever → lief + ste = liefste'],
  ['slim',    'slimste',    'slim → slimmer → slim + ste = slimste'],
];


// ── Items genereren ──────────────────────────────────────────────
export function genereerItems() {
  const items = [];

  // Apostrof-s — dictee: kind hoort het woord en schrijft het
  for (let i = 0; i < APOSTROF_S.length; i++) {
    const [antwoord] = APOSTROF_S[i];
    items.push({
      id: `staal-apots-${i}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: antwoord,
      vraag: `Schrijf het tijdstip dat je hoort.`,
      antwoord,
      leerdoel: `Spelling blok 4: 's-woorden`,
      hints: [
        `"Des" wordt vervangen door apostrof + s: 's ...`,
        `Begint met apostrof: '${antwoord.slice(2)}`,
      ],
    });
  }

  // Verkleinwoord — kind hoort het basiswoord, schrijft het verkleinwoord
  for (const [woord, verk, hint2] of VERKLEINWOORD_ETJE) {
    items.push({
      id: `staal-etje-${woord}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: woord,
      vraag: `Schrijf het verkleinwoord van het woord dat je hoort.`,
      antwoord: verk,
      leerdoel: `Spelling blok 4: verkleinwoord`,
      hints: [
        `Korte klinker + medeklinker → verdubbel + -etje. Na -ng geen verdubbeling.`,
        `${hint2}.`,
      ],
    });
  }

  // Ei/ij-plaat — kind hoort het woord in een zin
  for (const [antwoord, zin, hint2] of EI_IJ_PLAAT) {
    items.push({
      id: `staal-eiij-plaat-${antwoord}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: antwoord,
      vraag: zin,
      antwoord,
      leerdoel: `Spelling blok 4: ei/ij-woorden`,
      hints: [`Leer per woord of het ei of ij heeft — er is geen vaste regel.`, hint2],
    });
  }

  // Persoonsvorm — lees + luister de zin
  for (let i = 0; i < PERSOONSVORM.length; i++) {
    const [antwoord, zin, hint2] = PERSOONSVORM[i];
    items.push({
      id: `staal-pv-${i}`,
      invoerType: 'tekst', spreekUit: zin,
      vraag: `Wat is de persoonsvorm?\n"${zin}"`,
      antwoord,
      leerdoel: `Spelling blok 4: persoonsvorm`,
      hints: [
        `Vraagproef: maak er een vraag van. Het woord dat van plaats wisselt is de persoonsvorm.`,
        hint2,
      ],
    });
  }

  // Centwoord — kind hoort het woord en schrijft het
  for (const [goed, , hint2] of CENTWOORDEN) {
    items.push({
      id: `staal-cent-${goed}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: goed,
      vraag: `Schrijf het woord dat je hoort.`,
      antwoord: goed,
      leerdoel: `Spelling blok 5: centwoord`,
      hints: [`De letter c klinkt als "s" voor e, i of y.`, hint2],
    });
  }

  // Apostrof-s meervoud — kind hoort het enkelvoud, schrijft meervoud
  for (const [enkelvoud, meervoud] of APOSTROF_MEERVOUD) {
    items.push({
      id: `staal-apomv-${enkelvoud}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: enkelvoud,
      vraag: `Schrijf het meervoud van het woord dat je hoort.`,
      antwoord: meervoud,
      leerdoel: `Spelling blok 5: apostrof-s meervoud`,
      hints: [
        `Woorden die eindigen op a, i, o, u of y krijgen 's in het meervoud.`,
        `${enkelvoud} → ${enkelvoud}'s`,
      ],
    });
  }

  // Ei/ij zonder plaat — context-zin met audio
  for (const [antwoord, zin, hint2] of EI_IJ_ZONDER_PLAAT) {
    items.push({
      id: `staal-eiij-${antwoord}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: antwoord,
      vraag: zin,
      antwoord,
      leerdoel: `Spelling blok 6: ei/ij-woorden`,
      hints: [`Geen vaste regel — onthoud per woord.`, hint2],
    });
  }

  // Pech-woorden — kind hoort het woord en schrijft het
  for (const [woord, hint2] of PECH_WOORDEN) {
    items.push({
      id: `staal-pech-${woord}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: woord,
      vraag: `Schrijf het woord dat je hoort.`,
      antwoord: woord,
      leerdoel: `Spelling blok 6: pech-versje (-ch)`,
      hints: [
        `Pech-versje: schrijf met -ch (niet -k). Denk aan: pech, recht, licht, lucht, nacht…`,
        hint2,
      ],
    });
  }

  // t(s)ie-woorden — kind hoort het woord en schrijft het
  for (const [woord, hint2] of TSIE_WOORDEN) {
    items.push({
      id: `staal-tsie-${woord}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: woord,
      vraag: `Schrijf het woord dat je hoort.`,
      antwoord: woord,
      leerdoel: `Spelling blok 6: t(s)ie-woorden`,
      hints: [
        `De "tsie"-klank schrijf je als -tie (niet -tsie). Denk aan: ac-tie, poli-tie.`,
        hint2,
      ],
    });
  }

  // Cola-woorden — kind hoort het woord en schrijft het
  for (const [woord, hint2] of COLA_WOORDEN) {
    items.push({
      id: `staal-cola-${woord}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: woord,
      vraag: `Schrijf het woord dat je hoort.`,
      antwoord: woord,
      leerdoel: `Spelling blok 7: cola-woord (c = k)`,
      hints: [`De letter c klinkt als "k" voor a, o of u.`, hint2],
    });
  }

  // Voltooid deelwoord — lees + luister het werkwoord
  for (const [inf, vd, hint2] of VOLTOOID_DEELWOORD) {
    items.push({
      id: `staal-vd-${inf}`,
      invoerType: 'tekst', spreekUit: inf,
      vraag: `Wat is het voltooid deelwoord van "${inf}"?\n(Hij heeft gisteren ___ .)`,
      antwoord: vd,
      leerdoel: `Spelling blok 7: voltooid deelwoord`,
      hints: [
        `Begint met ge-. Zwak: stam eindigt op t/k/f/s/ch/p → -t, anders -d. Sterk: uit je hoofd leren.`,
        hint2,
      ],
    });
  }

  // Isch-woorden — kind hoort het woord en schrijft het
  for (const [woord, hint2] of ISCH_WOORDEN) {
    items.push({
      id: `staal-isch-${woord}`,
      invoerType: 'tekst', spellingDictee: true, spreekUit: woord,
      vraag: `Schrijf het bijvoeglijk naamwoord dat je hoort.`,
      antwoord: woord,
      leerdoel: `Spelling blok 8: isch-woorden`,
      hints: [`Eindigt op -isch (met -sch). Denk aan tropi-sch.`, hint2],
    });
  }

  // Superlatief — lees + luister het grondwoord
  for (const [grond, sup, hint2] of SUPERLATIEF) {
    items.push({
      id: `staal-sup-${grond}`,
      invoerType: 'tekst', spreekUit: grond,
      vraag: `Wat is de overtreffende trap van "${grond}"?`,
      antwoord: sup,
      leerdoel: `Spelling blok 8: overtreffende trap`,
      hints: [`Overtreffende trap: voeg -ste toe aan de vergrotende trap.`, hint2],
    });
  }

  return items;
}
