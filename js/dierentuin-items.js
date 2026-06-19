// Alle unlockable items voor de dierentuin — pure data, geen DOM
export const WEEK_DOEL       = 3;   // sessiedagen per week
export const PUNTEN_PER_STER = [0, 10, 20, 35]; // index = sterren (0 niet gebruikt)
export const WEEK_BONUS      = 25;  // bonus bij weekdoel gehaald

export const ITEMS = [
  // ── Locaties ─────────────────────────────────────────────────
  { id: 'loc-leeuw',   naam: 'Leeuwenverblijf',   icoon: '🏕️', type: 'locatie', kosten: 0,   beschrijving: 'Begin je safari!',           kleur: 'linear-gradient(135deg, #f9c74f 0%, #f4845f 100%)' },
  { id: 'loc-olifant', naam: 'Olifantenpaddock',   icoon: '🪨', type: 'locatie', kosten: 40,  beschrijving: 'Voor de grootste dieren',     kleur: 'linear-gradient(135deg, #c9b99a 0%, #a07850 100%)' },
  { id: 'loc-giraf',   naam: 'Giraffenweide',       icoon: '🌿', type: 'locatie', kosten: 65,  beschrijving: 'Kijk omhoog — ze zijn enorm!', kleur: 'linear-gradient(135deg, #b7e4c7 0%, #f9c74f 100%)' },
  { id: 'loc-pinguïn', naam: 'Pinguïnbad',          icoon: '❄️', type: 'locatie', kosten: 95,  beschrijving: 'Koud en heerlijk!',           kleur: 'linear-gradient(135deg, #caf0f8 0%, #90e0ef 100%)' },
  { id: 'loc-dolfijn', naam: 'Dolfijnenbad',        icoon: '🌊', type: 'locatie', kosten: 130, beschrijving: 'Zie ze springen!',             kleur: 'linear-gradient(135deg, #48cae4 0%, #0077b6 100%)' },
  { id: 'loc-gorilla', naam: 'Gorillabos',           icoon: '🌳', type: 'locatie', kosten: 165, beschrijving: 'Diep in de jungle',            kleur: 'linear-gradient(135deg, #40916c 0%, #1b4332 100%)' },
  { id: 'loc-vogel',   naam: 'Vogelvolière',         icoon: '🪺', type: 'locatie', kosten: 200, beschrijving: 'Vol met kleurrijke vogels',    kleur: 'linear-gradient(135deg, #a8dadc 0%, #457b9d 100%)' },
  { id: 'loc-reptiel', naam: 'Reptielenhuis',        icoon: '🪵', type: 'locatie', kosten: 250, beschrijving: 'Spannend en geheimzinnig',     kleur: 'linear-gradient(135deg, #606c38 0%, #283618 100%)' },

  // ── Dieren: leeuwenverblijf ───────────────────────────────────
  { id: 'dier-leeuw',     naam: 'Leeuw',        icoon: '🦁', type: 'dier', kosten: 0,  locatie: 'loc-leeuw',   beschrijving: 'De koning van de savanne' },
  { id: 'dier-luipaard',  naam: 'Luipaard',     icoon: '🐆', type: 'dier', kosten: 25, locatie: 'loc-leeuw',   beschrijving: 'Razendsnel!' },
  { id: 'dier-tijger',    naam: 'Tijger',        icoon: '🐅', type: 'dier', kosten: 35, locatie: 'loc-leeuw',   beschrijving: 'Met prachtige strepen' },

  // ── Dieren: olifantenpaddock ──────────────────────────────────
  { id: 'dier-olifant',   naam: 'Olifant',      icoon: '🐘', type: 'dier', kosten: 0,  locatie: 'loc-olifant', beschrijving: 'Heeft een lange slurf' },
  { id: 'dier-neushoorn', naam: 'Neushoorn',    icoon: '🦏', type: 'dier', kosten: 30, locatie: 'loc-olifant', beschrijving: 'Heeft een grote hoorn' },
  { id: 'dier-nijlpaard', naam: 'Nijlpaard',    icoon: '🦛', type: 'dier', kosten: 40, locatie: 'loc-olifant', beschrijving: 'Zwemt de hele dag!' },

  // ── Dieren: giraffenweide ─────────────────────────────────────
  { id: 'dier-giraf',     naam: 'Giraf',         icoon: '🦒', type: 'dier', kosten: 0,  locatie: 'loc-giraf',   beschrijving: 'Langste nek ter wereld' },
  { id: 'dier-zebra',     naam: 'Zebra',          icoon: '🦓', type: 'dier', kosten: 25, locatie: 'loc-giraf',   beschrijving: 'Zwart-wit gestreept' },
  { id: 'dier-kameel',    naam: 'Kameel',         icoon: '🐪', type: 'dier', kosten: 30, locatie: 'loc-giraf',   beschrijving: 'Woestijnreis!' },

  // ── Dieren: pinguïnbad ────────────────────────────────────────
  { id: 'dier-pinguïn',   naam: 'Pinguïn',       icoon: '🐧', type: 'dier', kosten: 0,  locatie: 'loc-pinguïn', beschrijving: 'Waggelt heel schattig' },
  { id: 'dier-zeehond',   naam: 'Zeehond',        icoon: '🦭', type: 'dier', kosten: 25, locatie: 'loc-pinguïn', beschrijving: 'Geeft kunstjes weg' },
  { id: 'dier-ijsbeer',   naam: 'IJsbeer',        icoon: '🐻‍❄️', type: 'dier', kosten: 40, locatie: 'loc-pinguïn', beschrijving: 'Dol op ijs en sneeuw' },

  // ── Dieren: dolfijnenbad ──────────────────────────────────────
  { id: 'dier-dolfijn',   naam: 'Dolfijn',        icoon: '🐬', type: 'dier', kosten: 0,  locatie: 'loc-dolfijn', beschrijving: 'Slim en vrolijk!' },
  { id: 'dier-walvis',    naam: 'Walvis',          icoon: '🐋', type: 'dier', kosten: 35, locatie: 'loc-dolfijn', beschrijving: 'Het grootste zeezoogdier' },
  { id: 'dier-haai',      naam: 'Haai',            icoon: '🦈', type: 'dier', kosten: 45, locatie: 'loc-dolfijn', beschrijving: 'Indrukwekkend!' },

  // ── Dieren: gorillabos ────────────────────────────────────────
  { id: 'dier-gorilla',   naam: 'Gorilla',         icoon: '🦍', type: 'dier', kosten: 0,  locatie: 'loc-gorilla', beschrijving: 'Onze verre neef' },
  { id: 'dier-aap',       naam: 'Aap',              icoon: '🐒', type: 'dier', kosten: 20, locatie: 'loc-gorilla', beschrijving: 'Slingert door de bomen' },
  { id: 'dier-orang',     naam: 'Orang-oetan',     icoon: '🦧', type: 'dier', kosten: 35, locatie: 'loc-gorilla', beschrijving: 'Heel slimme aap' },

  // ── Dieren: vogelvolière ──────────────────────────────────────
  { id: 'dier-papegaai',  naam: 'Papegaai',        icoon: '🦜', type: 'dier', kosten: 0,  locatie: 'loc-vogel',   beschrijving: 'Praat je na!' },
  { id: 'dier-pauw',      naam: 'Pauw',             icoon: '🦚', type: 'dier', kosten: 20, locatie: 'loc-vogel',   beschrijving: 'Spreidt zijn prachtige staart' },
  { id: 'dier-flamingo',  naam: 'Flamingo',         icoon: '🦩', type: 'dier', kosten: 25, locatie: 'loc-vogel',   beschrijving: 'Roze op één been' },
  { id: 'dier-uil',       naam: 'Uil',              icoon: '🦉', type: 'dier', kosten: 30, locatie: 'loc-vogel',   beschrijving: 'Heel wijs en slim' },

  // ── Dieren: reptielenhuis ─────────────────────────────────────
  { id: 'dier-krokodil',  naam: 'Krokodil',        icoon: '🐊', type: 'dier', kosten: 0,  locatie: 'loc-reptiel', beschrijving: 'Pas op voor die tanden!' },
  { id: 'dier-hagedis',   naam: 'Hagedis',          icoon: '🦎', type: 'dier', kosten: 20, locatie: 'loc-reptiel', beschrijving: 'Houdt van de zon' },
  { id: 'dier-slang',     naam: 'Slang',             icoon: '🐍', type: 'dier', kosten: 30, locatie: 'loc-reptiel', beschrijving: 'Glijdt soepel voort' },
  { id: 'dier-schildpad', naam: 'Schildpad',        icoon: '🐢', type: 'dier', kosten: 25, locatie: 'loc-reptiel', beschrijving: 'Langzaam maar zeker' },

  // ── Accessoires (decoraties voor de hele dierentuin) ─────────
  { id: 'acc-boom',     naam: 'Boom',         icoon: '🌳', type: 'accessoire', kosten: 15, beschrijving: 'Schaduw voor de dieren' },
  { id: 'acc-bloemen',  naam: 'Bloemen',      icoon: '🌺', type: 'accessoire', kosten: 10, beschrijving: 'Maakt je tuin mooi' },
  { id: 'acc-waterval', naam: 'Waterval',     icoon: '💧', type: 'accessoire', kosten: 25, beschrijving: 'Klinkt heerlijk!' },
  { id: 'acc-rots',     naam: 'Rots',         icoon: '🪨', type: 'accessoire', kosten: 20, beschrijving: 'Goed om op te klimmen' },
  { id: 'acc-ijskar',   naam: 'IJskar',       icoon: '🍦', type: 'accessoire', kosten: 30, beschrijving: 'Bezoekers zijn blij!' },
  { id: 'acc-brug',     naam: 'Brug',         icoon: '🌉', type: 'accessoire', kosten: 35, beschrijving: 'Over het water' },
  { id: 'acc-bankje',   naam: 'Bankje',       icoon: '🪑', type: 'accessoire', kosten: 15, beschrijving: 'Even uitrusten' },
  { id: 'acc-vlag',     naam: 'Safari Vlag',  icoon: '🚩', type: 'accessoire', kosten: 20, beschrijving: 'Jouw eigen vlag!' },
  { id: 'acc-fontein',  naam: 'Fontein',      icoon: '⛲', type: 'accessoire', kosten: 40, beschrijving: 'Prachtig middelpunt' },
  { id: 'acc-ballon',   naam: 'Luchtballon',  icoon: '🎈', type: 'accessoire', kosten: 50, beschrijving: 'Zweef boven de dierentuin!' },

  // Speciale diploma-items — worden automatisch ontgrendeld, niet te kopen
  { id: 'spec-diploma', naam: 'Tafeldiploma 🎓', icoon: '🏆', type: 'speciaal', kosten: 0, beschrijving: 'Alle tafels beheerst! Gegeven door de juf of meester.' },
];

export const START_ITEMS = ['loc-leeuw', 'dier-leeuw'];
