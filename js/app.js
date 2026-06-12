import { laadData, slaOp, schrijfOefenlog } from './storage.js';
import { spreekUit, ttsWerkt } from './tts.js';
import { kiesOpgaven, verwerkAntwoord } from './session.js';
import { genereerItems as tafelsItems } from './onderdelen/tafels.js';
import { genereerItems as deelsomItems } from './onderdelen/deelsommen.js';
import { genereerItems as verhaalItems } from './onderdelen/tafels-verhaal.js';
import { genereerItems as optAftItems } from './onderdelen/optellen-aftrekken.js';
import { vermenigvuldigItems } from './onderdelen/vermenigvuldigen.js';
import { genereerItems as deelRestItems } from './onderdelen/deelsommen-rest.js';
import { genereerItems as deelSplitsenItems } from './onderdelen/deelsommen-splitsen.js';
import { genereerItems as halverenItems } from './onderdelen/halveren-verdubbelen.js';
import { genereerItems as geldItems } from './onderdelen/geld.js';
import { genereerItems as klokItems } from './onderdelen/klokkijken.js';
import { genereerItems as deelAnalogItems } from './onderdelen/deelsommen-analogie.js';
import { genereerItems as lengteItems } from './onderdelen/lengtematen.js';
import { genereerItems as handrekenItems } from './onderdelen/handig-rekenen.js';
import { genereerItems as kalenderItems } from './onderdelen/kalender.js';
import { genereerItems as staalItems } from './onderdelen/staal-spelling.js';
import { analyseerOnderdelen, zwaksteOnderdelen, berekenSterren,
         haalMijlpalen, nieuweMijlpaal,
         berekenWeekVoortgang, huidigeWeekSleutel } from './analyse.js';
import { toonDierentuin, initialiseerDierentuin } from './dierentuin.js';
import { PUNTEN_PER_STER, WEEK_BONUS } from './dierentuin-items.js';

const TAFELS       = tafelsItems();
const DEELSOMMEN   = deelsomItems();
const OPT_AFT      = optAftItems();
const VERMENIGV    = vermenigvuldigItems();
const DEEL_REST    = deelRestItems();
const DEEL_SPLITS  = deelSplitsenItems();
const HALVERD      = halverenItems();
const GELD         = geldItems();
const KLOK         = klokItems();
const DEEL_ANALOG  = deelAnalogItems();
const LENGTE       = lengteItems();
const HANDIGREKEN  = handrekenItems();
const KALENDER     = kalenderItems();
const STAAL        = staalItems();

// Staal-spelling gesplitst per blok voor correcte urgentieberekening
const STAAL_BLOK4  = STAAL.filter(it => ['staal-apots-','staal-etje-','staal-eiij-plaat-','staal-pv-'].some(p => it.id.startsWith(p)));
const STAAL_BLOK5  = STAAL.filter(it => ['staal-cent-','staal-apomv-'].some(p => it.id.startsWith(p)));
const STAAL_BLOK6  = STAAL.filter(it => ['staal-eiij-','staal-pech-','staal-tsie-'].some(p => it.id.startsWith(p)) && !it.id.startsWith('staal-eiij-plaat-'));
const STAAL_BLOK7  = STAAL.filter(it => ['staal-cola-','staal-vd-'].some(p => it.id.startsWith(p)));
const STAAL_BLOK8  = STAAL.filter(it => ['staal-isch-','staal-sup-'].some(p => it.id.startsWith(p)));
// VERHAAL wordt per sessie opnieuw gegenereerd voor variatie in verhaalteksten

// Alle vaste pools voor analyse — blok = curriculumblok (lager = hogere urgentie)
const ALLE_POOLS = [
  { key: 'tafels',      label: 'Tafels',                   pool: TAFELS,      blok: 1  },
  { key: 'deelsommen',  label: 'Deelsommen',                pool: DEELSOMMEN,  blok: 5  },
  { key: 'optaft',      label: 'Optellen & aftrekken',      pool: OPT_AFT,     blok: 5  },
  { key: 'klok',        label: 'Klokkijken',                pool: KLOK,        blok: 5  },
  { key: 'vermenigv',   label: 'Vermenigvuldigen',          pool: VERMENIGV,   blok: 6  },
  { key: 'deelrest',    label: 'Deelsommen met rest',       pool: DEEL_REST,   blok: 6  },
  { key: 'kalender',    label: 'Kalender & datums',         pool: KALENDER,    blok: 7  },
  { key: 'deelanalog',  label: 'Deelsommen naar analogie',  pool: DEEL_ANALOG, blok: 8  },
  { key: 'geld',        label: 'Geld',                      pool: GELD,        blok: 8  },
  { key: 'deelsplits',  label: 'Deelsommen splitsen',       pool: DEEL_SPLITS, blok: 9  },
  { key: 'lengtematen', label: 'Lengtematen',               pool: LENGTE,      blok: 9  },
  { key: 'halverd',     label: 'Halveren & verdubbelen',    pool: HALVERD,     blok: 10 },
  { key: 'handigreken', label: 'Handig rekenen',            pool: HANDIGREKEN, blok: 10 },
  { key: 'staal4', label: 'Spelling blok 4 (apostrof, verk., ei/ij, pv)', pool: STAAL_BLOK4, blok: 4 },
  { key: 'staal5', label: 'Spelling blok 5 (centwoord, meervoud)',        pool: STAAL_BLOK5, blok: 5 },
  { key: 'staal6', label: 'Spelling blok 6 (ei/ij, pech, tsie)',          pool: STAAL_BLOK6, blok: 6 },
  { key: 'staal7', label: 'Spelling blok 7 (cola, voltooid deelwoord)',   pool: STAAL_BLOK7, blok: 7 },
  { key: 'staal8', label: 'Spelling blok 8 (isch, superlatief)',          pool: STAAL_BLOK8, blok: 8 },
];

let data = laadData();
let sessie = [];
let index = 0;
let score = 0;
let nieuwBeheerst = 0;

// ── Navigatie ─────────────────────────────────────────
const SCHERM_TITELS = {
  'scherm-welkom':      'Wie ben jij?',
  'scherm-keuze':       'Wat wil je oefenen?',
  'scherm-sessie':      'Oefenen',
  'scherm-voortgang':   'Voortgang',
  'scherm-resultaat':   'Hoe ging het?',
  'scherm-dierentuin':  '🦁 Mijn dierentuin',
};

const NAV_ACTIEF = {
  'scherm-welkom':      'nav-oefenen',
  'scherm-keuze':       'nav-oefenen',
  'scherm-sessie':      'nav-oefenen',
  'scherm-voortgang':   'nav-voortgang',
  'scherm-resultaat':   'nav-oefenen',
  'scherm-dierentuin':  'nav-dierentuin',
};

function toonScherm(id) {
  document.querySelectorAll('.scherm').forEach(el => el.hidden = true);
  document.getElementById(id).hidden = false;
  document.getElementById('scherm-titel').textContent = SCHERM_TITELS[id] ?? '';
  document.querySelectorAll('.nav-knop').forEach(k => k.classList.remove('nav-actief'));
  const actief = NAV_ACTIEF[id];
  if (actief) document.getElementById(actief)?.classList.add('nav-actief');
}

// ── Hulpfuncties beheersing ───────────────────────────
function beheerstVoorPool(items) {
  return items.filter(it => data.beheersing[it.id]?.status === 'beheerst').length;
}

function tafelVanItem(id) {
  return Number(id.split('-')[1].split('x')[0]);
}

function updateNavNaam() {
  document.getElementById('nav-naam').textContent =
    data.profiel.naam ? `👤 ${data.profiel.naam}` : '';
}

// Nav-knop "Oefenen"
document.getElementById('nav-oefenen').addEventListener('click', () => {
  if (data.profiel.naam) toonKeuzescherm();
  else toonScherm('scherm-welkom');
});

// Nav-knop "Voortgang"
document.getElementById('nav-voortgang').addEventListener('click', () => {
  if (data.profiel.naam) toonVoortgang();
  else toonScherm('scherm-welkom');
});

// Nav-knop "Dierentuin"
document.getElementById('nav-dierentuin').addEventListener('click', () => {
  if (data.profiel.naam) { toonDierentuin(data); toonScherm('scherm-dierentuin'); }
  else toonScherm('scherm-welkom');
});

// ── 1. Welkomstscherm ─────────────────────────────────
document.getElementById('welkom-verder-knop').addEventListener('click', () => {
  const naam = document.getElementById('naam-input').value.trim();
  if (!naam) return;
  data.profiel.naam = naam;
  slaOp(data);
  updateNavNaam();
  toonKeuzescherm();
});

document.getElementById('naam-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('welkom-verder-knop').click();
});

// Naam wijzigen vanuit keuze-scherm
document.getElementById('keuze-naam-knop')?.addEventListener('click', () => {
  toonScherm('scherm-welkom');
  const input = document.getElementById('naam-input');
  input.select();
  input.focus();
});

// ── 2. Keuze-scherm ───────────────────────────────────
function toonKeuzescherm() {
  // Tafels
  const cbTafels = document.getElementById('cb-tafels');
  cbTafels.checked = data.profiel.tafels;
  zetTafelsSub(data.profiel.tafels);
  bouwTafelSub();
  document.getElementById('tafels-voortgang').textContent =
    `${beheerstVoorPool(TAFELS)} / 100`;

  // Deelsommen
  document.getElementById('cb-deelsommen').checked = data.profiel.deelsommen;
  document.getElementById('deelsom-voortgang').textContent =
    `${beheerstVoorPool(DEELSOMMEN)} / 100`;

  // Optellen & aftrekken
  document.getElementById('cb-optaft').checked = data.profiel.optaft ?? false;
  document.getElementById('optaft-voortgang').textContent =
    `${beheerstVoorPool(OPT_AFT)} / ${OPT_AFT.length}`;

  // Vermenigvuldigen
  document.getElementById('cb-vermenigv').checked = data.profiel.vermenigv ?? false;
  document.getElementById('vermenigv-voortgang').textContent =
    `${beheerstVoorPool(VERMENIGV)} / ${VERMENIGV.length}`;

  // Deelsommen met rest
  document.getElementById('cb-deelrest').checked = data.profiel.deelrest ?? false;
  document.getElementById('deelrest-voortgang').textContent =
    `${beheerstVoorPool(DEEL_REST)} / ${DEEL_REST.length}`;

  // Deelsommen splitsen
  document.getElementById('cb-deelsplits').checked = data.profiel.deelsplits ?? false;
  document.getElementById('deelsplits-voortgang').textContent =
    `${beheerstVoorPool(DEEL_SPLITS)} / ${DEEL_SPLITS.length}`;

  // Halveren & verdubbelen
  document.getElementById('cb-halverd').checked = data.profiel.halverd ?? false;
  document.getElementById('halverd-voortgang').textContent =
    `${beheerstVoorPool(HALVERD)} / ${HALVERD.length}`;

  // Geld
  document.getElementById('cb-geld').checked = data.profiel.geld ?? false;
  document.getElementById('geld-voortgang').textContent =
    `${beheerstVoorPool(GELD)} / ${GELD.length}`;

  // Verhalende sommen
  document.getElementById('cb-verhaal').checked = data.profiel.verhaal ?? false;
  const verhaalPool = verhaalItems(); // alleen voor beheersing-tel
  document.getElementById('verhaal-voortgang').textContent =
    `${beheerstVoorPool(verhaalPool)} / 100`;

  // Klokkijken
  document.getElementById('cb-klok').checked = data.profiel.klok ?? false;
  document.getElementById('klok-voortgang').textContent =
    `${beheerstVoorPool(KLOK)} / ${KLOK.length}`;

  // Deelsommen naar analogie
  document.getElementById('cb-deelanalog').checked = data.profiel.deelanalog ?? false;
  document.getElementById('deelanalog-voortgang').textContent =
    `${beheerstVoorPool(DEEL_ANALOG)} / ${DEEL_ANALOG.length}`;

  // Lengtematen
  document.getElementById('cb-lengtematen').checked = data.profiel.lengtematen ?? false;
  document.getElementById('lengtematen-voortgang').textContent =
    `${beheerstVoorPool(LENGTE)} / ${LENGTE.length}`;

  // Handig rekenen
  document.getElementById('cb-handigreken').checked = data.profiel.handigreken ?? false;
  document.getElementById('handigreken-voortgang').textContent =
    `${beheerstVoorPool(HANDIGREKEN)} / ${HANDIGREKEN.length}`;

  // Kalender
  document.getElementById('cb-kalender').checked = data.profiel.kalender ?? false;
  document.getElementById('kalender-voortgang').textContent =
    `${beheerstVoorPool(KALENDER)} / ${KALENDER.length}`;

  // Staal spelling
  document.getElementById('cb-staal').checked = data.profiel.staal ?? false;
  document.getElementById('staal-voortgang').textContent =
    `${beheerstVoorPool(STAAL)} / ${STAAL.length}`;

  // Sessielengte
  document.getElementById('sessie-lengte').value = String(data.profiel.aantalSommen ?? 10);

  // Auto-lees
  document.getElementById('cb-autolees').checked = data.profiel.autoLees;
  if (!ttsWerkt()) {
    const autoLeesRij = document.getElementById('cb-autolees')?.closest('.instelling-rij');
    if (autoLeesRij) autoLeesRij.hidden = true;
  }

  // Slimme suggestie
  toonSuggestie();

  toonScherm('scherm-keuze');
}

function toonSuggestie() {
  const analyse = analyseerOnderdelen(ALLE_POOLS, data.beheersing);
  const zwak    = zwaksteOnderdelen(analyse, 3);
  const weekVg  = berekenWeekVoortgang(data.oefenlog);
  const kaart   = document.getElementById('suggestie-kaart');

  const stippen = Array.from({ length: weekVg.doel }, (_, i) =>
    `<span class="week-stip${i < weekVg.gedaan ? ' gedaan' : ''}"></span>`
  ).join('');
  const weekTekst = weekVg.gedaan >= weekVg.doel
    ? `🎉 Weekdoel gehaald!`
    : `${weekVg.gedaan} van ${weekVg.doel} sessies deze week`;
  document.getElementById('streak-tekst').innerHTML =
    `<span class="week-stippen">${stippen}</span> ${weekTekst}`;

  if (zwak.length === 0) {
    kaart.hidden = false;
    document.getElementById('suggestie-tekst').textContent = '';
    document.getElementById('zwak-start-knop').hidden = true;
    kaart.dataset.zwakKeys = '[]';
    return;
  }

  const labels = zwak.map(o => o.label).join(', ');
  document.getElementById('suggestie-tekst').textContent = `Tip: oefen extra aan ${labels}.`;
  document.getElementById('zwak-start-knop').hidden = false;
  kaart.hidden = false;
  kaart.dataset.zwakKeys = JSON.stringify(zwak.map(o => o.key));
}

document.getElementById('zwak-start-knop').addEventListener('click', () => {
  const keys = JSON.parse(document.getElementById('suggestie-kaart').dataset.zwakKeys ?? '[]');
  // Zet alle onderdeel-checkboxes uit, zet de zwakste aan
  const alleKeys = ALLE_POOLS.map(p => p.key);
  alleKeys.forEach(k => {
    const cb = document.getElementById(`cb-${k}`);
    if (cb) cb.checked = keys.includes(k);
  });
  // Tafels apart: als tafels in zwakke lijst, zet tafels aan en selecteer alle
  if (keys.includes('tafels')) {
    document.getElementById('cb-tafels').checked = true;
    zetTafelsSub(true);
    document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = true);
  } else {
    document.getElementById('cb-tafels').checked = false;
    zetTafelsSub(false);
  }
  document.getElementById('keuze-start-knop').click();
});

function bouwTafelSub() {
  const selectie = new Set(data.profiel.tafelselectie);
  const lijst = document.getElementById('tafel-lijst');
  lijst.innerHTML = '';
  for (let n = 1; n <= 10; n++) {
    const li = document.createElement('li');
    li.innerHTML = `
      <label class="tafel-cb-label" for="cb-t${n}">
        <input type="checkbox" id="cb-t${n}" value="${n}" ${selectie.has(n) ? 'checked' : ''}>
        <span>× ${n}</span>
      </label>`;
    lijst.appendChild(li);
  }
}

function zetTafelsSub(zichtbaar) {
  document.getElementById('tafels-sub').hidden = !zichtbaar;
}

document.getElementById('cb-tafels').addEventListener('change', e =>
  zetTafelsSub(e.target.checked));

document.getElementById('alles-knop').addEventListener('click', () =>
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = true));

document.getElementById('niets-knop').addEventListener('click', () =>
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = false));


document.getElementById('keuze-start-knop').addEventListener('click', () => {
  const metTafels = document.getElementById('cb-tafels').checked;
  const tafelsSelectie = metTafels
    ? Array.from(document.querySelectorAll('#tafel-lijst input:checked')).map(cb => Number(cb.value))
    : [];
  const metDeelsommen  = document.getElementById('cb-deelsommen').checked;
  const metOptAft      = document.getElementById('cb-optaft').checked;
  const metVermenigv   = document.getElementById('cb-vermenigv').checked;
  const metDeelRest    = document.getElementById('cb-deelrest').checked;
  const metDeelSplits  = document.getElementById('cb-deelsplits').checked;
  const metHalverd     = document.getElementById('cb-halverd').checked;
  const metGeld        = document.getElementById('cb-geld').checked;
  const metVerhaal     = document.getElementById('cb-verhaal').checked;
  const metKlok        = document.getElementById('cb-klok').checked;
  const metDeelAnalog  = document.getElementById('cb-deelanalog').checked;
  const metLengte      = document.getElementById('cb-lengtematen').checked;
  const metHandig      = document.getElementById('cb-handigreken').checked;
  const metKalender    = document.getElementById('cb-kalender').checked;
  const metStaal       = document.getElementById('cb-staal').checked;

  const erIsIets = tafelsSelectie.length > 0 || metDeelsommen || metOptAft ||
    metVermenigv || metDeelRest || metDeelSplits || metHalverd || metGeld || metVerhaal ||
    metKlok || metDeelAnalog || metLengte || metHandig || metKalender || metStaal;
  if (!erIsIets) return;

  data.profiel.tafels       = metTafels;
  data.profiel.tafelselectie = tafelsSelectie;
  data.profiel.deelsommen   = metDeelsommen;
  data.profiel.optaft       = metOptAft;
  data.profiel.vermenigv    = metVermenigv;
  data.profiel.deelrest     = metDeelRest;
  data.profiel.deelsplits   = metDeelSplits;
  data.profiel.halverd      = metHalverd;
  data.profiel.geld         = metGeld;
  data.profiel.verhaal      = metVerhaal;
  data.profiel.klok         = metKlok;
  data.profiel.deelanalog   = metDeelAnalog;
  data.profiel.lengtematen  = metLengte;
  data.profiel.handigreken  = metHandig;
  data.profiel.kalender     = metKalender;
  data.profiel.staal        = metStaal;
  data.profiel.autoLees     = document.getElementById('cb-autolees').checked;
  data.profiel.aantalSommen = Number(document.getElementById('sessie-lengte').value) || 10;
  slaOp(data);

  // Verhalende sommen: elke sessie vers gegenereerd voor variatie
  const verhaalDezesSessie = metVerhaal ? verhaalItems() : [];

  const items = [
    ...TAFELS.filter(it => tafelsSelectie.includes(tafelVanItem(it.id))),
    ...(metDeelsommen  ? DEELSOMMEN  : []),
    ...(metOptAft      ? OPT_AFT     : []),
    ...(metVermenigv   ? VERMENIGV   : []),
    ...(metDeelRest    ? DEEL_REST   : []),
    ...(metDeelSplits  ? DEEL_SPLITS : []),
    ...(metHalverd     ? HALVERD     : []),
    ...(metGeld        ? GELD        : []),
    ...(metKlok        ? KLOK        : []),
    ...(metDeelAnalog  ? DEEL_ANALOG : []),
    ...(metLengte      ? LENGTE      : []),
    ...(metHandig      ? HANDIGREKEN : []),
    ...(metKalender    ? KALENDER    : []),
    ...(metStaal       ? STAAL       : []),
    ...(verhaalDezesSessie.filter(it => {
      const a = Number(it.id.split('-')[1].split('x')[0]);
      return tafelsSelectie.length === 0 || tafelsSelectie.includes(a);
    }))
  ];
  startSessie(items, data.profiel.aantalSommen);
});

// ── 3. Sessie-scherm ──────────────────────────────────
function startSessie(items, aantal = 10) {
  sessie = kiesOpgaven(items, data.beheersing, aantal);
  index = 0;
  score = 0;
  nieuwBeheerst = 0;
  toonScherm('scherm-sessie');
  toonOpgave();
}

// SVG analoge klok — geeft een SVG-string terug
function tekenKlok(uur, minuten) {
  const rad = a => (a - 90) * Math.PI / 180;
  const pt  = (r, a) => [50 + r * Math.cos(rad(a)), 50 + r * Math.sin(rad(a))];
  const hA  = ((uur % 12) + minuten / 60) * 30;
  const mA  = minuten * 6;
  const [hx, hy] = pt(26, hA);
  const [mx, my] = pt(36, mA);
  let strepen = '';
  for (let i = 0; i < 60; i++) {
    const a = i * 6;
    const r1 = i % 5 === 0 ? 38 : 41;
    const [x1, y1] = pt(r1, a);
    const [x2, y2] = pt(44, a);
    strepen += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${i%5===0?'#1e293b':'#94a3b8'}" stroke-width="${i%5===0?2:1}"/>`;
  }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="klok-svg" aria-label="Analoge klok">
    <circle cx="50" cy="50" r="47" fill="white" stroke="#1e293b" stroke-width="2.5"/>
    ${strepen}
    <text x="50" y="16"  text-anchor="middle" font-size="9" fill="#1e293b" font-weight="bold">12</text>
    <text x="85" y="54"  text-anchor="middle" font-size="9" fill="#1e293b" font-weight="bold">3</text>
    <text x="50" y="91"  text-anchor="middle" font-size="9" fill="#1e293b" font-weight="bold">6</text>
    <text x="15" y="54"  text-anchor="middle" font-size="9" fill="#1e293b" font-weight="bold">9</text>
    <line x1="50" y1="50" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="3" fill="#1e293b"/>
  </svg>`;
}

const KLADBLOK_PREFIXEN = ['optaft-','vermenigv-','deelanalog-','deelspl-','deelrest-','geld-','halverd-'];
const LENGTE_PREFIX = 'lengte-';

function toonOpgave() {
  const opgave = sessie[index];
  const pct = Math.round((index / sessie.length) * 100);
  document.getElementById('voortgang').textContent = `${index + 1} / ${sessie.length}`;
  document.getElementById('voortgang-balk-vul').style.width = `${pct}%`;
  document.getElementById('sessie-punten').textContent = `⭐ ${data.dierentuin.punten}`;
  const vraagTekst = opgave.genereerVraag ? opgave.genereerVraag() : opgave.vraag;
  const vraagEl = document.getElementById('vraag');
  vraagEl.textContent = vraagTekst;
  const vraagLengte = vraagTekst.length;
  vraagEl.classList.toggle('vraag-lang',   vraagLengte > 55);
  vraagEl.classList.toggle('vraag-middel', vraagLengte > 20 && vraagLengte <= 55);
  const isTekst = opgave.invoerType === 'tekst';
  const inp = document.getElementById('antwoord-input');
  inp.inputMode   = isTekst ? 'text'    : 'numeric';
  inp.pattern     = isTekst ? '.*'      : '[0-9]*';
  inp.placeholder = isTekst ? 'typ hier…' : '?';
  inp.value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  // ── Kladblok-knop (vóór resetHint zodat toonHintKnop ze kan zien) ─
  const isGroteSom = KLADBLOK_PREFIXEN.some(p => opgave.id.startsWith(p));
  document.getElementById('kladblok-knop').hidden = !isGroteSom;
  document.getElementById('kladblok').hidden = true;
  document.getElementById('kladblok').value = '';

  // ── Trappenschema (lengtematen) ────────────────────────────────
  const isTrap = opgave.id.startsWith(LENGTE_PREFIX);
  document.getElementById('trap-knop').hidden = !isTrap;
  document.getElementById('trap-schema').hidden = true;

  resetHint();
  beheersingsVerwerkt = false;
  document.getElementById('volgende-knop').hidden = true;
  toonHintKnop();

  // ── Klok SVG ──────────────────────────────────────────────────
  const klokWrap = document.getElementById('klok-svg-wrap');
  if (opgave.klokTijd) {
    document.getElementById('klok-svg-inhoud').innerHTML = tekenKlok(opgave.klokTijd.uur, opgave.klokTijd.minuten);
    document.getElementById('klok-label').textContent = opgave.klokLabel ?? '';
    klokWrap.hidden = false;
  } else {
    klokWrap.hidden = true;
  }

  // ── Staal TTS / dictee-modus ───────────────────────────────────
  const isStaalDictee = !!opgave.spellingDictee;
  const ttsOk = ttsWerkt();
  document.getElementById('staal-tts-waarschuwing').hidden = !(isStaalDictee && !ttsOk);

  const leesKnop = document.getElementById('lees-knop');
  if (isStaalDictee) {
    leesKnop.hidden = false;
    leesKnop.textContent = '🔊 Hoor het woord opnieuw';
    leesKnop.onclick = () => spreekUit(opgave.spreekUit ?? vraagTekst);
    if (ttsOk) spreekUit(opgave.spreekUit ?? vraagTekst);
  } else {
    leesKnop.hidden = !ttsOk;
    leesKnop.textContent = '🔊';
    leesKnop.onclick = () => spreekUit(vraagTekst);
    if (ttsOk && data.profiel.autoLees) spreekUit(opgave.spreekUit ?? vraagTekst);
  }

  document.getElementById('antwoord-input').focus();
}

let hintIndex = 0;
let beheersingsVerwerkt = false; // voorkomt dubbel bijwerken bij herpogingen

function resetHint() {
  hintIndex = 0;
  document.getElementById('hint-gebied').hidden = true;
  document.getElementById('hint-tekst').hidden = true;
  document.getElementById('hint-tekst').textContent = '';
  document.getElementById('hint-knop').textContent = 'Hint →';
  document.getElementById('hint-knop').disabled = false;
}

function toonHintKnop() {
  const opgave = sessie[index];
  const hints = opgave?.hints ?? [];
  const heeftExtras = KLADBLOK_PREFIXEN.some(p => opgave?.id?.startsWith(p))
                   || opgave?.id?.startsWith(LENGTE_PREFIX);
  document.getElementById('hint-gebied').hidden = hints.length === 0 && !heeftExtras;
  document.getElementById('hint-knop').hidden = hints.length === 0;
}

// lees-knop.onclick wordt per opgave ingesteld in toonOpgave()

document.getElementById('kladblok-knop').addEventListener('click', () => {
  const kb = document.getElementById('kladblok');
  kb.hidden = !kb.hidden;
  if (!kb.hidden) kb.focus();
});

document.getElementById('trap-knop').addEventListener('click', () => {
  const ts = document.getElementById('trap-schema');
  ts.hidden = !ts.hidden;
});

document.getElementById('hint-knop').addEventListener('click', () => {
  const hints = sessie[index]?.hints ?? [];
  if (hintIndex >= hints.length) return;
  const hintTekst = hints[hintIndex];
  document.getElementById('hint-tekst').textContent = hintTekst;
  document.getElementById('hint-tekst').hidden = false;
  if (data.profiel.autoLees) spreekUit(hintTekst);
  hintIndex++;
  if (hintIndex >= hints.length) {
    document.getElementById('hint-knop').textContent = 'Geen hints meer';
    document.getElementById('hint-knop').disabled = true;
  }
  document.getElementById('antwoord-input').focus();
});

function volgende() {
  index++;
  document.getElementById('volgende-knop').hidden = true;
  if (index < sessie.length) {
    setTimeout(toonOpgave, 300);
  } else {
    setTimeout(eindSessie, 300);
  }
}

document.getElementById('volgende-knop').addEventListener('click', volgende);

function verwerkInvoer() {
  const input = document.getElementById('antwoord-input');
  const gegeven = input.value.trim();
  if (!gegeven) return;

  const opgave = sessie[index];

  // Beheersing alleen bij de eerste poging bijwerken
  if (!beheersingsVerwerkt) {
    const { correct, antwoordGezien, nieuwBeheerst: nb, entry } = verwerkAntwoord(
      opgave.id, gegeven, opgave, data.beheersing, hintIndex
    );
    data.beheersing[opgave.id] = entry;
    slaOp(data);
    beheersingsVerwerkt = true;

    if (antwoordGezien) {
      document.getElementById('feedback').textContent = 'Goed onthouden voor de volgende keer!';
      document.getElementById('feedback').className = 'feedback neutraal';
      document.getElementById('volgende-knop').hidden = false;
      return;
    } else if (correct) {
      score++;
      nieuwBeheerst += nb;
      toonGoed();
      return;
    }
    // Fout op eerste poging
    document.getElementById('feedback').textContent = `Niet helemaal — probeer nog eens.`;
    document.getElementById('feedback').className = 'feedback fout';
    document.getElementById('volgende-knop').hidden = false;
    input.value = '';
    input.focus();
    return;
  }

  // Herpoging (beheersing al verwerkt): alleen correctheid controleren
  const norm = s => String(s).trim().toLowerCase().replace(/[''`]/g, "'");
  const correct = norm(gegeven) === norm(opgave.antwoord);
  if (correct) {
    toonGoed();
  } else {
    document.getElementById('feedback').textContent = `Nog niet goed — probeer het nog eens.`;
    document.getElementById('feedback').className = 'feedback fout';
    input.value = '';
    input.focus();
  }
}

function toonGoed() {
  document.getElementById('feedback').textContent = hintIndex > 0 ? '✓ Goed, met een hint!' : '✓ Goed!';
  document.getElementById('feedback').className = 'feedback goed';
  document.getElementById('hint-gebied').hidden = true;
  document.getElementById('volgende-knop').hidden = true;
  setTimeout(volgende, 900);
}

document.getElementById('antwoord-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') verwerkInvoer();
});
document.getElementById('controleer-knop').addEventListener('click', verwerkInvoer);

// ── 4. Resultaat-scherm ───────────────────────────────
function eindSessie() {
  schrijfOefenlog(data, nieuwBeheerst);

  const pct     = Math.round((score / sessie.length) * 100);
  const sterren = berekenSterren(score, sessie.length);
  const mijlpaal = nieuweMijlpaal(data.beheersing, nieuwBeheerst);

  // Tafeldiploma: check of alle tafels nu beheerst zijn
  const nieuwDiploma = !data.profiel.tafeldiploma &&
    TAFELS.every(it => data.beheersing[it.id]?.status === 'beheerst');
  if (nieuwDiploma) {
    data.profiel.tafeldiploma = true;
    data.dierentuin.punten += 100; // bonus
    if (!data.dierentuin.ontgrendeld.includes('spec-diploma'))
      data.dierentuin.ontgrendeld.push('spec-diploma');
  }

  // Punten toekennen
  const verdiend = PUNTEN_PER_STER[sterren] ?? 10;
  data.dierentuin.punten += verdiend;
  const weekVg = berekenWeekVoortgang(data.oefenlog);
  let weekBonus = 0;
  if (weekVg.gedaan >= weekVg.doel) {
    const weekSleutel = huidigeWeekSleutel();
    if (data.dierentuin.weekDoelSleutel !== weekSleutel) {
      data.dierentuin.weekDoelSleutel = weekSleutel;
      weekBonus = WEEK_BONUS;
      data.dierentuin.punten += weekBonus;
    }
  }

  slaOp(data);

  // Icoon + boodschap op basis van score
  let icoon, titel, boodschap;
  if (pct === 100) {
    icoon = '🌟'; titel = 'Perfect!';
    boodschap = `Wauw ${data.profiel.naam}, alles goed! Geweldig gedaan.`;
  } else if (pct >= 70) {
    icoon = '😊'; titel = 'Goed gedaan!';
    boodschap = `${data.profiel.naam}, je had ${score} van de ${sessie.length} goed. Goed bezig!`;
  } else {
    icoon = '💪'; titel = 'Blijven oefenen!';
    boodschap = `${data.profiel.naam}, je had ${score} van de ${sessie.length} goed. Volgende keer beter!`;
  }

  document.getElementById('resultaat-icoon').textContent = icoon;
  document.getElementById('resultaat-boodschap').textContent = `${titel} ${boodschap}`;

  // Sterren
  document.getElementById('resultaat-sterren').textContent = '⭐'.repeat(sterren) + '☆'.repeat(3 - sterren);

  // Punten verdiend
  const streakEl = document.getElementById('resultaat-streak');
  let puntentekst = `⭐ +${verdiend} punten verdiend`;
  if (weekBonus > 0) puntentekst += ` · 🎉 +${weekBonus} weekbonus!`;
  puntentekst += ` · Totaal: ${data.dierentuin.punten}`;
  streakEl.textContent = puntentekst;
  streakEl.hidden = false;

  // Mijlpaal
  const mijlEl = document.getElementById('resultaat-mijlpaal');
  if (nieuwDiploma) {
    mijlEl.textContent = `🎓 TAFELDIPLOMA BEHAALD! Alle tafels beheerst! +100 punten bonus!`;
    mijlEl.hidden = false;
    mijlEl.className = 'resultaat-mijlpaal diploma';
  } else if (mijlpaal) {
    mijlEl.textContent = `${mijlpaal.icoon} Mijlpaal behaald: ${mijlpaal.label} beheerst!`;
    mijlEl.hidden = false;
    mijlEl.className = 'resultaat-mijlpaal';
  } else {
    mijlEl.hidden = true;
  }

  // Details per onderdeel
  const details = document.getElementById('resultaat-details');
  details.innerHTML = '';

  const onderdelen = [
    { label: 'Tafels',                   prefix: 'tafel-',      pool: TAFELS,      grootte: 100 },
    { label: 'Deelsommen',               prefix: 'deelsom-',    pool: DEELSOMMEN,  grootte: 100 },
    { label: 'Optellen & aftrekken',     prefix: 'optaft-',     pool: OPT_AFT,     grootte: OPT_AFT.length },
    { label: 'Klokkijken',               prefix: 'klok-',       pool: KLOK,        grootte: KLOK.length },
    { label: 'Vermenigvuldigen',         prefix: 'vermenigv-',  pool: VERMENIGV,   grootte: VERMENIGV.length },
    { label: 'Deelsommen met rest',      prefix: 'deelrest-',   pool: DEEL_REST,   grootte: DEEL_REST.length },
    { label: 'Kalender & datums',        prefix: 'kalender-',   pool: KALENDER,    grootte: KALENDER.length },
    { label: 'Deels. naar analogie',     prefix: 'deelanalog-', pool: DEEL_ANALOG, grootte: DEEL_ANALOG.length },
    { label: 'Geld',                     prefix: 'geld-',       pool: GELD,        grootte: GELD.length },
    { label: 'Deelsommen splitsen',      prefix: 'deelspl-',    pool: DEEL_SPLITS, grootte: DEEL_SPLITS.length },
    { label: 'Lengtematen',              prefix: 'lengte-',     pool: LENGTE,      grootte: LENGTE.length },
    { label: 'Halveren & verdubbelen',   prefix: 'halverd-',    pool: HALVERD,     grootte: HALVERD.length },
    { label: 'Handig rekenen',           prefix: 'handig-',     pool: HANDIGREKEN, grootte: HANDIGREKEN.length },
    { label: 'Verhalende sommen',        prefix: 'verhaal-',    pool: null,        grootte: 100 },
    { label: 'Spelling blok 4',         prefix: 'staal-',      pool: STAAL_BLOK4, grootte: STAAL_BLOK4.length },
    { label: 'Spelling blok 5',         prefix: null,          pool: STAAL_BLOK5, grootte: STAAL_BLOK5.length },
    { label: 'Spelling blok 6',         prefix: null,          pool: STAAL_BLOK6, grootte: STAAL_BLOK6.length },
    { label: 'Spelling blok 7',         prefix: null,          pool: STAAL_BLOK7, grootte: STAAL_BLOK7.length },
    { label: 'Spelling blok 8',         prefix: null,          pool: STAAL_BLOK8, grootte: STAAL_BLOK8.length },
  ];

  for (const { label, prefix, pool, grootte } of onderdelen) {
    const inSessie = pool
      ? sessie.filter(it => pool.some(p => p.id === it.id))
      : sessie.filter(it => it.id.startsWith(prefix));
    if (inSessie.length === 0) continue;
    const beheerst = pool
      ? pool.filter(it => data.beheersing[it.id]?.status === 'beheerst').length
      : Object.entries(data.beheersing).filter(([id, b]) => id.startsWith(prefix) && b.status === 'beheerst').length;
    const li = document.createElement('li');
    li.className = 'resultaat-detail-rij';
    li.innerHTML = `<span>${label}</span><span>${beheerst} / ${grootte} beheerst</span>`;
    details.appendChild(li);
  }

  // Nieuw beheerste feiten
  if (nieuwBeheerst > 0) {
    const li = document.createElement('li');
    li.className = 'resultaat-detail-rij resultaat-nieuw';
    li.innerHTML = `<span>✨ Nieuw beheerst</span><span>+${nieuwBeheerst}</span>`;
    details.appendChild(li);
  }

  const totaal = Object.values(data.beheersing).filter(b => b.status === 'beheerst').length;
  document.getElementById('resultaat-totaal').textContent =
    `Totaal beheerst: ${totaal} feiten.`;

  toonScherm('scherm-resultaat');
}

document.getElementById('opnieuw-knop').addEventListener('click', toonKeuzescherm);

// ── 5. Voortgang-scherm ───────────────────────────────
function toonVoortgang() {
  const beh = data.beheersing;

  // Totaalregel
  const totaal = Object.values(beh).filter(b => b.status === 'beheerst').length;
  document.getElementById('vg-totaal').textContent =
    `${data.profiel.naam} heeft ${totaal} feiten beheerst.`;

  // Blokken-overzicht: groepeer ALLE_POOLS per blok
  const blokkenEl = document.getElementById('vg-blokken');
  blokkenEl.innerHTML = '';
  const blokNamen = {
    4: 'Blok 4', 5: 'Blok 5', 6: 'Blok 6', 7: 'Blok 7',
    8: 'Blok 8', 9: 'Blok 9', 10: 'Blok 10',
  };
  const blokNummers = [...new Set(ALLE_POOLS.map(p => p.blok))].sort((a, b) => a - b);
  for (const nr of blokNummers) {
    const pools = ALLE_POOLS.filter(p => p.blok === nr);
    const alleItems = pools.flatMap(p => p.pool);
    const totBlok = alleItems.length;
    if (totBlok === 0) continue;
    const behBlok = alleItems.filter(it => beh[it.id]?.status === 'beheerst').length;
    const oefBlok = alleItems.filter(it => beh[it.id]?.status === 'oefenen').length;
    const pct = Math.round((behBlok / totBlok) * 100);
    const cel = document.createElement('div');
    cel.className = 'vg-blok-cel';
    cel.innerHTML = `
      <div class="vg-blok-kop">
        <span class="vg-blok-naam">${blokNamen[nr] ?? `Blok ${nr}`}</span>
        <span class="vg-cijfer">${behBlok}/${totBlok}</span>
      </div>
      <div class="vg-balk-wrap vg-balk-gelaagd">
        <div class="vg-balk-vul vg-balk-oefenen" style="width:${Math.round(((behBlok+oefBlok)/totBlok)*100)}%"></div>
        <div class="vg-balk-vul vg-balk-beheerst vg-balk-abs" style="width:${pct}%"></div>
      </div>
      <p class="vg-sub">${pools.map(p => p.label).join(' · ')}</p>`;
    blokkenEl.appendChild(cel);
  }

  // Onderdelen-overzicht
  const onderdelen = [
    { label: 'Tafels',                  prefix: 'tafel-',      totaal: 100 },
    { label: 'Deelsommen',              prefix: 'deelsom-',    totaal: 100 },
    { label: 'Optellen & aftrekken',    prefix: 'optaft-',     totaal: OPT_AFT.length },
    { label: 'Klokkijken',              prefix: 'klok-',       totaal: KLOK.length },
    { label: 'Vermenigvuldigen',        prefix: 'vermenigv-',  totaal: VERMENIGV.length },
    { label: 'Deelsommen met rest',     prefix: 'deelrest-',   totaal: DEEL_REST.length },
    { label: 'Kalender & datums',       prefix: 'kalender-',   totaal: KALENDER.length },
    { label: 'Deels. naar analogie',    prefix: 'deelanalog-', totaal: DEEL_ANALOG.length },
    { label: 'Geld',                    prefix: 'geld-',       totaal: GELD.length },
    { label: 'Deelsommen splitsen',     prefix: 'deelspl-',    totaal: DEEL_SPLITS.length },
    { label: 'Lengtematen',             prefix: 'lengte-',     totaal: LENGTE.length },
    { label: 'Halveren & verdubbelen',  prefix: 'halverd-',    totaal: HALVERD.length },
    { label: 'Handig rekenen',          prefix: 'handig-',     totaal: HANDIGREKEN.length },
    { label: 'Verhalende sommen',       prefix: 'verhaal-',    totaal: 100 },
    { label: 'Spelling (Staal)',        prefix: 'staal-',      totaal: STAAL.length },
  ];
  const vgOnderdelen = document.getElementById('vg-onderdelen');
  vgOnderdelen.innerHTML = '';
  for (const o of onderdelen) {
    const match = o.pool
      ? ([id]) => o.pool.some(it => it.id === id)
      : ([id]) => id.startsWith(o.prefix);
    const beheerst = Object.entries(beh).filter(e => match(e) && e[1].status === 'beheerst').length;
    const oefenen  = Object.entries(beh).filter(e => match(e) && e[1].status === 'oefenen').length;
    const pct = Math.round((beheerst / o.totaal) * 100);
    const div = document.createElement('div');
    div.className = 'vg-onderdeel';
    div.innerHTML = `
      <div class="vg-onderdeel-kop">
        <span>${o.label}</span>
        <span class="vg-cijfer">${beheerst} / ${o.totaal}</span>
      </div>
      <div class="vg-balk-wrap">
        <div class="vg-balk-vul vg-balk-beheerst" style="width:${pct}%"></div>
      </div>
      <p class="vg-sub">${beheerst} beheerst · ${oefenen} in oefening · ${o.totaal - beheerst - oefenen} nog niet gezien</p>`;
    vgOnderdelen.appendChild(div);
  }

  // Tafels-grid: één cel per tafel (1–10) met kleur naar beheersing
  const tafelsKaart = document.getElementById('vg-tafels-kaart');
  const heeftTafels = Object.keys(beh).some(id => id.startsWith('tafel-'));
  tafelsKaart.hidden = !heeftTafels;

  if (heeftTafels) {
    const grid = document.getElementById('vg-tafels-grid');
    grid.innerHTML = '';
    for (let n = 1; n <= 10; n++) {
      const itemsVanN = TAFELS.filter(it => tafelVanItem(it.id) === n);
      const beheerst = itemsVanN.filter(it => beh[it.id]?.status === 'beheerst').length;
      const pct = Math.round((beheerst / itemsVanN.length) * 100);
      const klasse = pct === 100 ? 'vg-tafel-cel beheerst' : pct > 0 ? 'vg-tafel-cel oefenen' : 'vg-tafel-cel nieuw';
      const cel = document.createElement('div');
      cel.className = klasse;
      cel.innerHTML = `<span class="vg-tafel-n">× ${n}</span><span class="vg-tafel-pct">${pct}%</span>`;
      grid.appendChild(cel);
    }
  }

  // Tafeldiploma badge
  const diplomaBadge = document.getElementById('vg-diploma');
  if (diplomaBadge) diplomaBadge.hidden = !data.profiel.tafeldiploma;

  // Weekdoel-chip naast mijlpalen-titel
  const weekVg = berekenWeekVoortgang(data.oefenlog);
  document.getElementById('vg-streak').textContent =
    weekVg.gedaan >= weekVg.doel
      ? `🎉 Weekdoel gehaald!`
      : `${weekVg.gedaan}/${weekVg.doel} deze week`;

  const mijlpalen = haalMijlpalen(beh);
  const mgrid = document.getElementById('vg-mijlpalen-grid');
  mgrid.innerHTML = '';
  for (const m of mijlpalen) {
    const cel = document.createElement('div');
    cel.className = `vg-mijlpaal-cel${m.behaald ? ' behaald' : ''}`;
    cel.innerHTML = `<span class="vg-mijlpaal-icoon">${m.behaald ? m.icoon : '🔒'}</span><span class="vg-mijlpaal-label">${m.label}</span>`;
    mgrid.appendChild(cel);
  }

  toonScherm('scherm-voortgang');
}

// ── Start ─────────────────────────────────────────────
initialiseerDierentuin();
updateNavNaam();
if (data.profiel.naam) {
  document.getElementById('naam-input').value = data.profiel.naam;
  toonKeuzescherm();
} else {
  toonScherm('scherm-welkom');
}
