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
import { genereerItems as digKlokItems } from './onderdelen/klokkijken-digitaal.js';
import { genereerItems as deelAnalogItems } from './onderdelen/deelsommen-analogie.js';
import { genereerItems as lengteItems } from './onderdelen/lengtematen.js';
import { genereerItems as handrekenItems } from './onderdelen/handig-rekenen.js';
import { genereerItems as kalenderItems } from './onderdelen/kalender.js';
import { genereerItems as staalItems } from './onderdelen/staal-spelling.js';
import { genereerItems as breukItems } from './onderdelen/breuken.js';
import { genereerItems as gewichtItems } from './onderdelen/gewichten.js';
import { genereerItems as inhoudItems } from './onderdelen/inhoudsmaten.js';
import { genereerItems as oppervlakteItems } from './onderdelen/oppervlakte.js';
import { genereerItems as woordItems } from './onderdelen/woordsoorten.js';
import { genereerItems as engelsU4Items } from './onderdelen/engels-unit4.js';
import { analyseerOnderdelen, zwaksteOnderdelen, berekenSterren,
         haalMijlpalen, nieuweMijlpaal,
         berekenWeekVoortgang, huidigeWeekSleutel } from './analyse.js';
import { toonDierentuin, initialiseerDierentuin } from './dierentuin.js';
import { PUNTEN_PER_STER, WEEK_BONUS, WEEK_DOEL } from './dierentuin-items.js';

const TAFELS       = tafelsItems();
const DEELSOMMEN   = deelsomItems();
const OPT_AFT      = optAftItems();
const VERMENIGV    = vermenigvuldigItems();
const DEEL_REST    = deelRestItems();
const DEEL_SPLITS  = deelSplitsenItems();
const HALVERD      = halverenItems();
const GELD         = geldItems();
const KLOK         = klokItems();
const DIG_KLOK     = digKlokItems();
const DEEL_ANALOG  = deelAnalogItems();
const LENGTE       = lengteItems();
const HANDIGREKEN  = handrekenItems();
const KALENDER     = kalenderItems();
const STAAL        = staalItems();
const BREUKEN      = breukItems();
const GEWICHTEN    = gewichtItems();
const INHOUD       = inhoudItems();
const OPPERVLAKTE  = oppervlakteItems();
const WOORDSOORTEN = woordItems();
const ENGELS_U4   = engelsU4Items();

// Staal-spelling gesplitst per blok voor correcte urgentieberekening
const STAAL_BLOK4  = STAAL.filter(it => ['staal-apots-','staal-etje-','staal-eiij-plaat-','staal-pv-'].some(p => it.id.startsWith(p)));
const STAAL_BLOK5  = STAAL.filter(it => ['staal-cent-','staal-apomv-'].some(p => it.id.startsWith(p)));
const STAAL_BLOK6  = STAAL.filter(it => ['staal-eiij-','staal-pech-','staal-tsie-'].some(p => it.id.startsWith(p)) && !it.id.startsWith('staal-eiij-plaat-'));
const STAAL_BLOK7  = STAAL.filter(it => ['staal-cola-','staal-vd-'].some(p => it.id.startsWith(p)));
const STAAL_BLOK8  = STAAL.filter(it => ['staal-isch-','staal-sup-'].some(p => it.id.startsWith(p)));
// VERHAAL wordt per sessie opnieuw gegenereerd voor variatie in verhaalteksten

// Alle vaste pools voor analyse — blok = curriculumblok (lager = hogere urgentie)
const ALLE_POOLS = [
  { key: 'tafels',      label: 'Tafels',  huiswerkLabel: 'Tafeldiploma', pool: TAFELS, blok: 1 },
  { key: 'deelsommen',  label: 'Deelsommen',                pool: DEELSOMMEN,  blok: 5  },
  { key: 'optaft',      label: 'Optellen & aftrekken',      pool: OPT_AFT,     blok: 5  },
  { key: 'klok',        label: 'Klokkijken',                pool: KLOK,        blok: 5  },
  { key: 'digklok',    label: 'Digitale klok',             pool: DIG_KLOK,    blok: 5  },
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
  { key: 'staal8',       label: 'Spelling blok 8 (isch, superlatief)',  pool: STAAL_BLOK8,   blok: 8  },
  { key: 'breuken',     label: 'Breuken',                               pool: BREUKEN,       blok: 6  },
  { key: 'gewichten',   label: 'Gewichten (g/kg)',                      pool: GEWICHTEN,     blok: 9  },
  { key: 'inhoudsmaten',label: 'Inhoudsmaten (cl/dl/l)',                pool: INHOUD,        blok: 9  },
  { key: 'oppervlakte', label: 'Oppervlakte & omtrek',                  pool: OPPERVLAKTE,   blok: 8  },
  { key: 'woordsoorten',label: 'Woordsoorten',                          pool: WOORDSOORTEN,  blok: 5  },
  { key: 'engels-u4',  label: 'Engels Unit 4 (woordenschat)',          pool: ENGELS_U4,     blok: 5  },
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
  if (data.profiel.naam) { toonScherm('scherm-dierentuin'); toonDierentuin(data); }
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

  // Digitale klok
  document.getElementById('cb-digklok').checked = data.profiel.digklok ?? false;
  document.getElementById('digklok-voortgang').textContent =
    `${beheerstVoorPool(DIG_KLOK)} / ${DIG_KLOK.length}`;

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

  // Breuken
  document.getElementById('cb-breuken').checked = data.profiel.breuken ?? false;
  document.getElementById('breuken-voortgang').textContent =
    `${beheerstVoorPool(BREUKEN)} / ${BREUKEN.length}`;

  // Gewichten
  document.getElementById('cb-gewichten').checked = data.profiel.gewichten ?? false;
  document.getElementById('gewichten-voortgang').textContent =
    `${beheerstVoorPool(GEWICHTEN)} / ${GEWICHTEN.length}`;

  // Inhoudsmaten
  document.getElementById('cb-inhoudsmaten').checked = data.profiel.inhoudsmaten ?? false;
  document.getElementById('inhoudsmaten-voortgang').textContent =
    `${beheerstVoorPool(INHOUD)} / ${INHOUD.length}`;

  // Oppervlakte & omtrek
  document.getElementById('cb-oppervlakte').checked = data.profiel.oppervlakte ?? false;
  document.getElementById('oppervlakte-voortgang').textContent =
    `${beheerstVoorPool(OPPERVLAKTE)} / ${OPPERVLAKTE.length}`;

  // Woordsoorten
  document.getElementById('cb-woordsoorten').checked = data.profiel.woordsoorten ?? false;
  document.getElementById('woordsoorten-voortgang').textContent =
    `${beheerstVoorPool(WOORDSOORTEN)} / ${WOORDSOORTEN.length}`;

  // Engels Unit 4
  document.getElementById('cb-engels-u4').checked = data.profiel.engelsu4 ?? false;
  document.getElementById('engels-u4-voortgang').textContent =
    `${beheerstVoorPool(ENGELS_U4)} / ${ENGELS_U4.length}`;

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

  // Uitklap-groepen: open als geselecteerd, chip bijwerken
  bijwerkenGroepChips();

  toonScherm('scherm-keuze');
}

function bijwerkenGroepChips() {
  document.querySelectorAll('#scherm-keuze details.keuze-groep-kaart').forEach(details => {
    _updateChip(details);
    if ([...details.querySelectorAll('input[type="checkbox"]')].some(cb => cb.checked))
      details.open = true;
  });
}

function _updateChip(details) {
  const n = [...details.querySelectorAll('input[type="checkbox"]')].filter(cb => cb.checked).length;
  const chip = details.querySelector('.groep-chip');
  if (chip) chip.textContent = n > 0 ? `${n} geselecteerd` : '';
}

// Live chip update bij elke checkbox-wijziging
document.getElementById('scherm-keuze').addEventListener('change', e => {
  if (e.target.type !== 'checkbox') return;
  const details = e.target.closest('details.keuze-groep-kaart');
  if (details) _updateChip(details);
});

function deadlineUrgentie(dagenOver, mastery) {
  // Boost op basis van tijd (zelfde schaal als session.js)
  let tijdBoost;
  if (dagenOver < 0)       tijdBoost = 0;
  else if (dagenOver <= 3) tijdBoost = 6;
  else if (dagenOver <= 7) tijdBoost = 4;
  else if (dagenOver <= 14) tijdBoost = 2;
  else                     tijdBoost = 1;
  // Gecombineerd: hoe verder van beheerst + hoe dichter bij deadline
  return tijdBoost * (1 - mastery);
}

function toonSuggestie() {
  const analyse = analyseerOnderdelen(ALLE_POOLS, data.beheersing);
  const zwak    = zwaksteOnderdelen(analyse, 3);
  const weekVg  = berekenWeekVoortgang(data.oefenlog, WEEK_DOEL);
  const kaart   = document.getElementById('suggestie-kaart');
  const nu      = Date.now();

  // Kaart is altijd zichtbaar zodra toonSuggestie wordt aangeroepen
  kaart.hidden = false;

  const stippen = Array.from({ length: weekVg.doel }, (_, i) =>
    `<span class="week-stip${i < weekVg.gedaan ? ' gedaan' : ''}"></span>`
  ).join('');
  const weekTekst = weekVg.gedaan >= weekVg.doel
    ? `🎉 Weekdoel gehaald!`
    : `${weekVg.gedaan} van ${weekVg.doel} sessies deze week`;
  document.getElementById('streak-tekst').innerHTML =
    `<span class="week-stippen">${stippen}</span> ${weekTekst}`;

  // ── Deadline-suggesties ───────────────────────────────
  const deadlineEl = document.getElementById('deadline-suggesties');
  const deadlinePools = ALLE_POOLS
    .filter(p => p.pool.length > 0 && p.pool[0].toetsDatum)
    .map(p => {
      const toetsDatum = p.pool[0].toetsDatum;
      const dagenOver  = Math.ceil((new Date(toetsDatum).getTime() - nu) / 86400000);
      const beheerst   = p.pool.filter(it => data.beheersing[it.id]?.status === 'beheerst').length;
      const mastery    = beheerst / p.pool.length;
      const urgentie   = deadlineUrgentie(dagenOver, mastery);
      return { key: p.key, label: p.huiswerkLabel ?? p.label, pool: p.pool,
               dagenOver, beheerst, totaal: p.pool.length, mastery, urgentie };
    })
    .filter(d => d.dagenOver >= 0)              // voorbij = niet tonen
    .sort((a, b) => b.urgentie - a.urgentie);   // meest urgent eerst

  if (deadlinePools.length > 0) {
    deadlineEl.innerHTML = '';
    for (const d of deadlinePools) {
      const pct = Math.round(d.mastery * 100);
      let urgKlasse, urgLabel;
      if (d.dagenOver <= 3)       { urgKlasse = 'urg-rood';   urgLabel = '🔴 Heel urgent'; }
      else if (d.dagenOver <= 7)  { urgKlasse = 'urg-oranje'; urgLabel = '🟠 Urgent'; }
      else if (d.dagenOver <= 14) { urgKlasse = 'urg-geel';   urgLabel = '🟡 Binnenkort'; }
      else                        { urgKlasse = 'urg-groen';  urgLabel = '🟢 Op schema'; }

      const belang = d.urgentie > 3 ? 'Heel belangrijk' : d.urgentie > 1.5 ? 'Belangrijk' : 'Let op';

      const rij = document.createElement('div');
      rij.className = `deadline-rij ${urgKlasse}`;
      rij.innerHTML = `
        <div class="deadline-rij-kop">
          <span class="deadline-rij-label">${d.label}</span>
          <span class="deadline-rij-urgchip">${urgLabel}</span>
        </div>
        <div class="deadline-rij-meta">
          <span>${pct}% beheerst · nog ${d.dagenOver} dag${d.dagenOver === 1 ? '' : 'en'}</span>
          <span class="deadline-belang">${belang}</span>
        </div>
        <button class="knop-deadline-oefen" data-key="${d.key}">Oefen ${d.label} →</button>`;
      deadlineEl.appendChild(rij);
    }
    deadlineEl.hidden = false;
  } else {
    deadlineEl.hidden = true;
  }

  // ── Zwakke punten ────────────────────────────────────
  if (zwak.length === 0) {
    document.getElementById('suggestie-tekst').textContent = '';
    document.getElementById('zwak-start-knop').hidden = true;
    kaart.dataset.zwakKeys = '[]';
  } else {
    const labels = zwak.map(o => o.label).join(', ');
    document.getElementById('suggestie-tekst').textContent = `Tip: oefen extra aan ${labels}.`;
    document.getElementById('zwak-start-knop').hidden = false;
    kaart.dataset.zwakKeys = JSON.stringify(zwak.map(o => o.key));
  }
}

document.getElementById('zwak-start-knop').addEventListener('click', () => {
  const keys = JSON.parse(document.getElementById('suggestie-kaart').dataset.zwakKeys ?? '[]');
  const pools = ALLE_POOLS.filter(p => keys.includes(p.key));
  const items = pools.flatMap(p => p.pool);
  if (items.length === 0) return;
  const aantalUi = Number(document.getElementById('sessie-lengte').value) || data.profiel.aantalSommen || 10;
  startSessie(items, aantalUi);
});

document.getElementById('deadline-suggesties').addEventListener('click', e => {
  const knop = e.target.closest('.knop-deadline-oefen');
  if (!knop) return;
  const pool = ALLE_POOLS.find(p => p.key === knop.dataset.key);
  if (!pool) return;
  const aantalUi = Number(document.getElementById('sessie-lengte').value) || data.profiel.aantalSommen || 10;
  startSessie(pool.pool, aantalUi);
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
  const metDigKlok     = document.getElementById('cb-digklok').checked;
  const metDeelAnalog  = document.getElementById('cb-deelanalog').checked;
  const metLengte      = document.getElementById('cb-lengtematen').checked;
  const metHandig      = document.getElementById('cb-handigreken').checked;
  const metKalender    = document.getElementById('cb-kalender').checked;
  const metStaal       = document.getElementById('cb-staal').checked;
  const metBreuken     = document.getElementById('cb-breuken').checked;
  const metGewichten   = document.getElementById('cb-gewichten').checked;
  const metInhoud      = document.getElementById('cb-inhoudsmaten').checked;
  const metOppervlakte = document.getElementById('cb-oppervlakte').checked;
  const metWoord       = document.getElementById('cb-woordsoorten').checked;
  const metEngelsU4   = document.getElementById('cb-engels-u4').checked;

  const erIsIets = tafelsSelectie.length > 0 || metDeelsommen || metOptAft ||
    metVermenigv || metDeelRest || metDeelSplits || metHalverd || metGeld || metVerhaal ||
    metKlok || metDigKlok || metDeelAnalog || metLengte || metHandig || metKalender || metStaal ||
    metBreuken || metGewichten || metInhoud || metOppervlakte || metWoord || metEngelsU4;
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
  data.profiel.digklok      = metDigKlok;
  data.profiel.deelanalog   = metDeelAnalog;
  data.profiel.lengtematen  = metLengte;
  data.profiel.handigreken  = metHandig;
  data.profiel.kalender     = metKalender;
  data.profiel.staal        = metStaal;
  data.profiel.breuken      = metBreuken;
  data.profiel.gewichten    = metGewichten;
  data.profiel.inhoudsmaten = metInhoud;
  data.profiel.oppervlakte  = metOppervlakte;
  data.profiel.woordsoorten = metWoord;
  data.profiel.engelsu4    = metEngelsU4;
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
    ...(metDigKlok     ? DIG_KLOK   : []),
    ...(metDeelAnalog  ? DEEL_ANALOG : []),
    ...(metLengte      ? LENGTE      : []),
    ...(metHandig      ? HANDIGREKEN : []),
    ...(metKalender    ? KALENDER    : []),
    ...(metStaal       ? STAAL       : []),
    ...(metBreuken     ? BREUKEN     : []),
    ...(metGewichten   ? GEWICHTEN   : []),
    ...(metInhoud      ? INHOUD      : []),
    ...(metOppervlakte ? OPPERVLAKTE : []),
    ...(metWoord       ? WOORDSOORTEN: []),
    ...(metEngelsU4    ? ENGELS_U4   : []),
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

const KLADBLOK_PREFIXEN = ['tafel-','optaft-','vermenigv-','deelanalog-','deelspl-','deelrest-','geld-','halverd-','opp-','breuk-driekwart-','breuk-tweederde-'];
const TRAP_PREFIXEN = ['lengte-','gewicht-','inhoud-'];

const TRAP_HTML = {
  lengte: `<table class="trap-tabel"><tr>
    <th>m</th><td class="trap-pijl">← ÷10 &nbsp; ×10 →</td>
    <th>dm</th><td class="trap-pijl">← ÷10 &nbsp; ×10 →</td>
    <th>cm</th><td class="trap-pijl">← ÷10 &nbsp; ×10 →</td>
    <th>mm</th>
  </tr></table><p class="trap-uitleg">Naar rechts (kleiner) = ×10 &nbsp;|&nbsp; Naar links (groter) = ÷10</p>`,
  gewicht: `<table class="trap-tabel"><tr>
    <th>kg</th><td class="trap-pijl">← ÷1000 &nbsp; ×1000 →</td>
    <th>g</th>
  </tr></table><p class="trap-uitleg">kg → g: × 1000 &nbsp;|&nbsp; g → kg: ÷ 1000</p>`,
  inhoud: `<table class="trap-tabel"><tr>
    <th>l</th><td class="trap-pijl">← ÷10 &nbsp; ×10 →</td>
    <th>dl</th><td class="trap-pijl">← ÷10 &nbsp; ×10 →</td>
    <th>cl</th><td class="trap-pijl">← ÷10 &nbsp; ×10 →</td>
    <th>ml</th>
  </tr></table><p class="trap-uitleg">Naar rechts (kleiner) = ×10 &nbsp;|&nbsp; Naar links (groter) = ÷10</p>`,
};

function toonOpgave() {
  const opgave = sessie[index];
  const pct = Math.round((index / sessie.length) * 100);
  document.getElementById('voortgang').textContent = `${index + 1} / ${sessie.length}`;
  document.getElementById('voortgang-balk-vul').style.width = `${pct}%`;
  document.getElementById('sessie-punten').textContent = `✓ ${score} / ${sessie.length}`;
  const vraagTekst = opgave.genereerVraag ? opgave.genereerVraag() : opgave.vraag;
  const vraagEl = document.getElementById('vraag');
  vraagEl.textContent = vraagTekst;
  const vraagLengte = vraagTekst.length;
  vraagEl.classList.toggle('vraag-lang',   vraagLengte > 55);
  vraagEl.classList.toggle('vraag-middel', vraagLengte > 20 && vraagLengte <= 55);
  const isTekst = opgave.invoerType === 'tekst';
  const isMeerkeuze = opgave.invoerType === 'meerkeuze';
  const inp = document.getElementById('antwoord-input');
  const antwoordKaart = inp.closest('.antwoord-kaart');
  const meerkeuzeDiv = document.getElementById('meerkeuze-opties');

  if (isMeerkeuze) {
    antwoordKaart.hidden = true;
    meerkeuzeDiv.hidden = false;
    meerkeuzeDiv.innerHTML = (opgave.opties ?? []).map(opt =>
      `<button class="knop-meerkeuze">${opt}</button>`
    ).join('');
    meerkeuzeDiv.querySelectorAll('.knop-meerkeuze').forEach(knop => {
      knop.addEventListener('click', () => verwerkInvoer(knop.textContent.trim()));
    });
  } else {
    antwoordKaart.hidden = false;
    meerkeuzeDiv.hidden = true;
    meerkeuzeDiv.innerHTML = '';
    inp.inputMode   = isTekst ? 'text'    : 'numeric';
    inp.pattern     = isTekst ? '.*'      : '[0-9]*';
    inp.placeholder = isTekst ? 'typ hier…' : '?';
    inp.value = '';
  }
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  // ── Kladblok-knop (vóór resetHint zodat toonHintKnop ze kan zien) ─
  const isGroteSom = KLADBLOK_PREFIXEN.some(p => opgave.id.startsWith(p));
  document.getElementById('kladblok-knop').hidden = !isGroteSom;
  document.getElementById('kladblok').hidden = true;
  document.getElementById('kladblok').value = '';

  // ── Trappenschema (lengtematen / gewichten / inhoudsmaten) ─────
  const trapType = opgave.trapType ?? (opgave.id.startsWith('lengte-') ? 'lengte' : null);
  const isTrap = !!trapType;
  document.getElementById('trap-knop').hidden = !isTrap;
  document.getElementById('trap-schema').hidden = true;
  if (isTrap) document.getElementById('trap-schema').innerHTML = TRAP_HTML[trapType] ?? '';

  // Visuele hint resetten (getallenlijn / driehoek)
  const visueelEl = document.getElementById('hint-visueel');
  visueelEl.hidden = true;
  visueelEl.innerHTML = '';

  resetHint();
  beheersingsVerwerkt = false;
  spellingHulpGegeven = false;
  antwoordVergrendeld = false;
  _cachedInputValue = '';
  document.getElementById('volgende-knop').hidden = true;
  toonHintKnop();

  // ── Klok SVG ──────────────────────────────────────────────────
  const klokWrap = document.getElementById('klok-svg-wrap');
  if (opgave.klokTijd) {
    document.getElementById('klok-svg-inhoud').innerHTML = tekenKlok(opgave.klokTijd.uur, opgave.klokTijd.minuten);
    document.getElementById('klok-label').textContent = isMeerkeuze ? '' : (opgave.klokLabel ?? '');
    klokWrap.hidden = false;
  } else if (opgave.digitaalSvg) {
    document.getElementById('klok-svg-inhoud').innerHTML = opgave.digitaalSvg;
    document.getElementById('klok-label').textContent = '';
    klokWrap.hidden = false;
  } else {
    klokWrap.hidden = true;
  }

  // ── Staal TTS / dictee-modus ───────────────────────────────────
  const isStaalDictee = !!opgave.spellingDictee;
  const ttsOk = ttsWerkt();
  const waarschuwEl = document.getElementById('staal-tts-waarschuwing');
  if (isStaalDictee && !ttsOk) {
    waarschuwEl.hidden = false;
    waarschuwEl.innerHTML = `🔇 Geluid niet beschikbaar. Het woord is: <em>${opgave.spreekUit ?? ''}</em>`;
  } else {
    waarschuwEl.hidden = true;
    waarschuwEl.innerHTML = '';
  }

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

  if (!isMeerkeuze) document.getElementById('antwoord-input').focus();
}

let hintIndex = 0;
let beheersingsVerwerkt = false; // voorkomt dubbel bijwerken bij herpogingen
let antwoordVergrendeld = false; // blokkeert invoer na correct antwoord tot volgende vraag

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
                   || !!opgave?.trapType
                   || TRAP_PREFIXEN.some(p => opgave?.id?.startsWith(p));
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
  // Toon visuele hint bij eerste hintklik
  if (hintIndex === 0 && sessie[index]?.hintSvg) {
    const visueel = document.getElementById('hint-visueel');
    if (visueel.hidden) {
      visueel.innerHTML = sessie[index].hintSvg;
      visueel.hidden = false;
    }
  }
  const hintTekst = hints[hintIndex];
  document.getElementById('hint-tekst').textContent = hintTekst;
  document.getElementById('hint-tekst').hidden = false;
  if (data.profiel.autoLees) spreekUit(hintTekst);
  hintIndex++;
  if (hintIndex >= hints.length) {
    document.getElementById('hint-knop').textContent = 'Geen hints meer';
    document.getElementById('hint-knop').disabled = true;
    // Laatste hint: upgrade naar volledige getallenlijn als die beschikbaar is
    const volledig = sessie[index]?.hintSvgVolledig;
    if (volledig) {
      const visueel = document.getElementById('hint-visueel');
      visueel.innerHTML = volledig;
      visueel.hidden = false;
    }
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

// ── Spellingdetectie ──────────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m + 1}, (_, i) =>
    Array.from({length: n + 1}, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function isSpellingFout(gegeven, opgave) {
  if (!opgave.spellingCheck) return false;
  const norm = s => s.trim().toLowerCase();
  const g = norm(gegeven);
  const antwoorden = [norm(opgave.antwoord), ...(opgave.extraAntwoorden ?? []).map(norm)];
  if (antwoorden.includes(g)) return false; // correct
  return antwoorden.some(a => {
    const maxDist = Math.max(1, Math.floor(a.length / 6) + 1); // 1 voor kort, 2 voor lang
    const dist = levenshtein(g, a);
    return dist > 0 && dist <= maxDist && g.length >= a.length - 2;
  });
}

let spellingHulpGegeven = false;
let _cachedInputValue = ''; // Android IME commit-fallback

document.getElementById('antwoord-input').addEventListener('input', e => {
  // Sla elke toetsaanslag op; Android committ IME soms niet bij blur
  const v = e.target.value.replace(/\n/g, '');
  if (v) _cachedInputValue = v;
});

function verwerkInvoer(override = null) {
  if (antwoordVergrendeld) return;
  const input = document.getElementById('antwoord-input');
  const gegeven = override ?? (input.value || _cachedInputValue).trim();
  if (!gegeven) return;
  // Meerkeuze: markeer de geklikte knop en blokkeer de rest
  if (override !== null) {
    document.querySelectorAll('.knop-meerkeuze').forEach(k => {
      k.disabled = true;
      if (k.textContent.trim() === override) k.classList.add('meerkeuze-geselecteerd');
    });
  }

  const opgave = sessie[index];

  // ── Spellingfout: woord herkend maar verkeerd gespeld ──
  if (!beheersingsVerwerkt && isSpellingFout(gegeven, opgave)) {
    spellingHulpGegeven = true;
    const correct = opgave.antwoord;
    document.getElementById('feedback').innerHTML =
      `Bijna! Je bedoelt: <strong>${correct}</strong> — probeer de spelling nog eens.`;
    document.getElementById('feedback').className = 'feedback neutraal';
    input.value = '';
    input.focus();
    return;
  }

  // Beheersing alleen bij de eerste poging bijwerken
  if (!beheersingsVerwerkt) {
    // Als spellingHulp gegeven was, telt een correcte invoer als "met hulp" (rij bevroren)
    const effectieveHints = spellingHulpGegeven ? Math.max(hintIndex, 1) : hintIndex;
    const { correct, antwoordGezien, nieuwBeheerst: nb, entry } = verwerkAntwoord(
      opgave.id, gegeven, opgave, data.beheersing, effectieveHints
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
    // Meerkeuze: toon het juiste antwoord in groen
    if (override !== null) {
      document.querySelectorAll('.knop-meerkeuze').forEach(k => {
        if (k.textContent.trim() === opgave.antwoord) k.classList.add('meerkeuze-correct');
      });
      document.getElementById('volgende-knop').hidden = false;
    } else {
      if (opgave.hintSvg) {
        const visueel = document.getElementById('hint-visueel');
        visueel.innerHTML = opgave.hintSvg;
        visueel.hidden = false;
        document.getElementById('hint-gebied').hidden = false;
      }
      input.value = '';
      input.focus();
    }
    return;
  }

  // Herpoging (beheersing al verwerkt): alleen correctheid controleren
  const norm = s => String(s).replace(/[\u00AD\u200B-\u200F\u202A-\u202E\uFEFF\u180E]/g, '').trim().toLowerCase().replace(/[\u2018\u2019`]/g, "'");
  const correct = norm(gegeven) === norm(opgave.antwoord)
    || (opgave.extraAntwoorden ?? []).some(a => norm(a) === norm(gegeven));
  if (correct) {
    toonGoed();
  } else {
    document.getElementById('feedback').textContent = `Nog niet goed — probeer het nog eens.`;
    document.getElementById('feedback').className = 'feedback fout';
    document.getElementById('volgende-knop').hidden = false;
    input.value = '';
    input.focus();
  }
}

function toonGoed() {
  antwoordVergrendeld = true;
  document.getElementById('feedback').textContent = hintIndex > 0 ? '✓ Goed, met een hint!' : '✓ Goed!';
  document.getElementById('feedback').className = 'feedback goed';
  document.getElementById('hint-gebied').hidden = true;
  document.getElementById('volgende-knop').hidden = true;
  // Meerkeuze: markeer correct antwoord groen
  const opgave = sessie[index];
  if (opgave?.invoerType === 'meerkeuze') {
    document.querySelectorAll('.knop-meerkeuze').forEach(k => {
      if (k.textContent.trim() === opgave.antwoord) k.classList.add('meerkeuze-correct');
    });
  }
  setTimeout(volgende, 1100);
}

// enterkeyhint="go" zorgt op Android Chrome dat de Go-toets key='Enter' stuurt.
// Dedup-vlag voorkomt dubbele aanroep als keydown én keyup beide vuren (desktop).
let _enterKeydown = false;
document.getElementById('antwoord-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') { _enterKeydown = true; verwerkInvoer(); }
});
document.getElementById('antwoord-input').addEventListener('keyup', e => {
  if (e.key === 'Enter') { if (!_enterKeydown) verwerkInvoer(); _enterKeydown = false; }
});
document.getElementById('controleer-knop').addEventListener('click', () => verwerkInvoer());

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
  const weekVg = berekenWeekVoortgang(data.oefenlog, WEEK_DOEL);
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
    { label: 'Spelling blok 8',         prefix: null,          pool: STAAL_BLOK8,   grootte: STAAL_BLOK8.length   },
    { label: 'Breuken',                 prefix: 'breuk-',      pool: BREUKEN,       grootte: BREUKEN.length       },
    { label: 'Gewichten',               prefix: 'gewicht-',    pool: GEWICHTEN,     grootte: GEWICHTEN.length     },
    { label: 'Inhoudsmaten',            prefix: 'inhoud-',     pool: INHOUD,        grootte: INHOUD.length        },
    { label: 'Oppervlakte & omtrek',    prefix: 'opp-',        pool: OPPERVLAKTE,   grootte: OPPERVLAKTE.length   },
    { label: 'Woordsoorten',            prefix: 'woord-',      pool: WOORDSOORTEN,  grootte: WOORDSOORTEN.length  },
    { label: 'Engels Unit 4',          prefix: 'engels-u4-',  pool: ENGELS_U4,     grootte: ENGELS_U4.length     },
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

function toonHuiswerkBalk(beh) {
  const kaart  = document.getElementById('vg-huiswerk-kaart');
  const inhoud = document.getElementById('vg-huiswerk-inhoud');

  const nu = Date.now();
  const huiswerkPools = ALLE_POOLS
    .filter(p => p.pool.length > 0 && p.pool[0].toetsDatum)
    .map(p => {
      const toetsDatum = p.pool[0].toetsDatum;
      const dagenOver  = Math.ceil((new Date(toetsDatum).getTime() - nu) / 86400000);
      const beheerst   = p.pool.filter(it => beh[it.id]?.status === 'beheerst').length;
      return { label: p.huiswerkLabel ?? p.label, toetsDatum, dagenOver, beheerst, totaal: p.pool.length };
    });

  if (huiswerkPools.length === 0) { kaart.hidden = true; return; }

  inhoud.innerHTML = '';
  for (const hw of huiswerkPools) {
    const pct      = Math.round(hw.beheerst / hw.totaal * 100);
    const datumNl  = new Date(hw.toetsDatum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
    let klasse, dagenTekst;
    if (hw.dagenOver < 0) {
      dagenTekst = 'toets voorbij'; klasse = 'hw-voorbij';
    } else if (hw.dagenOver === 0) {
      dagenTekst = 'vandaag!'; klasse = 'hw-urgent';
    } else if (hw.dagenOver <= 3) {
      dagenTekst = `nog ${hw.dagenOver} dag${hw.dagenOver === 1 ? '' : 'en'}`; klasse = 'hw-urgent';
    } else if (hw.dagenOver <= 7) {
      dagenTekst = `nog ${hw.dagenOver} dagen`; klasse = 'hw-snel';
    } else {
      dagenTekst = `nog ${hw.dagenOver} dagen`; klasse = 'hw-normaal';
    }

    const div = document.createElement('div');
    div.className = 'vg-huiswerk-rij';
    div.innerHTML = `
      <div class="hw-kop">
        <span class="hw-label">${hw.label}</span>
        <span class="hw-datum-chip ${klasse}">${datumNl} &mdash; ${dagenTekst}</span>
      </div>
      <div class="vg-balk-wrap">
        <div class="vg-balk-vul vg-balk-beheerst" style="width:${pct}%"></div>
      </div>
      <p class="vg-sub">${hw.beheerst} van ${hw.totaal} beheerst (${pct}%)</p>`;
    inhoud.appendChild(div);
  }
  kaart.hidden = false;
}

const BLOK_NAMEN = {
  1:  'Blok 1 — Tafels & basisrekenen',
  4:  'Blok 4 — Spelling (apostrof, ei/ij)',
  5:  'Blok 5 — Optellen, aftrekken & klok',
  6:  'Blok 6 — Vermenigvuldigen & breuken',
  7:  'Blok 7 — Kalender & splitsen',
  8:  'Blok 8 — Geld, analogie & oppervlakte',
  9:  'Blok 9 — Maten, inhoud & deelsplitsen',
  10: 'Blok 10 — Halveren, verdubbelen & handig rekenen',
};

function toonGeschattNiveau(beh) {
  const kaart  = document.getElementById('vg-niveau-kaart');
  const label  = document.getElementById('vg-niveau-label');
  const sub    = document.getElementById('vg-niveau-sub');
  const balkWr = document.getElementById('vg-niveau-balk-wrap');

  const DREMPEL_DATA = 4;   // minimaal geziene items per blok om mee te tellen
  const DREMPEL_BEHEERST_PCT = 0.65; // ≥65% → blok als beheerst beschouwen

  const blokNummers = [...new Set(ALLE_POOLS.map(p => p.blok))].sort((a, b) => a - b);

  // Per blok: hoeveel items gezien en hoeveel beheerst
  const blokInfo = blokNummers.map(nr => {
    const items = ALLE_POOLS.filter(p => p.blok === nr).flatMap(p => p.pool);
    const gezien = items.filter(it => beh[it.id]);
    const beheerst = gezien.filter(it => beh[it.id].status === 'beheerst').length;
    return { nr, gezien: gezien.length, beheerst, totaal: items.length,
             pct: gezien.length >= DREMPEL_DATA ? beheerst / gezien.length : null };
  });

  // Blokken met genoeg data
  const metData = blokInfo.filter(b => b.pct !== null);
  if (metData.length === 0) { kaart.hidden = true; return; }

  // Frontier = eerste blok (in volgorde) dat NIET als beheerst geldt
  const frontier = blokInfo.find(b => b.pct !== null && b.pct < DREMPEL_BEHEERST_PCT)
                ?? blokInfo.filter(b => b.pct !== null).at(-1); // alles beheerst → laatste

  const alleBeheerstTotNu = blokInfo
    .filter(b => b.nr < frontier.nr && b.pct !== null)
    .every(b => b.pct >= DREMPEL_BEHEERST_PCT);

  // Label & omschrijving
  const naam = BLOK_NAMEN[frontier.nr] ?? `Blok ${frontier.nr}`;
  label.textContent = naam;

  const pctTekst = frontier.pct !== null
    ? `${Math.round(frontier.pct * 100)}% van de geoefende items beheerst`
    : '';
  sub.textContent = alleBeheerstTotNu && frontier.pct >= DREMPEL_BEHEERST_PCT
    ? `Alle blokken t/m ${frontier.nr} zijn goed beheerst! 🎉`
    : pctTekst;

  // Minibalken: één streep per blok
  balkWr.innerHTML = '';
  for (const b of blokInfo) {
    const wrap = document.createElement('div');
    wrap.className = 'vg-niveau-stap';
    wrap.title = `Blok ${b.nr}: ${b.pct !== null ? Math.round(b.pct*100)+'%' : 'nog niet gezien'}`;

    let klasse = 'vg-ns-leeg';
    if (b.pct === null)                       klasse = 'vg-ns-leeg';
    else if (b.pct >= DREMPEL_BEHEERST_PCT)   klasse = 'vg-ns-beheerst';
    else if (b.pct > 0)                       klasse = 'vg-ns-bezig';
    else                                       klasse = 'vg-ns-leeg';

    const bal = document.createElement('div');
    bal.className = `vg-niveau-stap-vul ${klasse}${b.nr === frontier.nr ? ' vg-ns-huidig' : ''}`;
    wrap.appendChild(bal);

    const lbl = document.createElement('span');
    lbl.className = 'vg-ns-label';
    lbl.textContent = b.nr;
    wrap.appendChild(lbl);
    balkWr.appendChild(wrap);
  }

  kaart.hidden = false;
}

function toonVoortgang() {
  const beh = data.beheersing;

  // ── Huiswerk & toetsen ────────────────────────────────
  toonHuiswerkBalk(beh);

  // ── Geschat niveau ────────────────────────────────────
  toonGeschattNiveau(beh);

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

  // Onderdelen-overzicht — gegroepeerd en uitklapbaar
  const onderdeelGroepen = [
    { titel: '📖 Tafels & deling', items: [
      { label: 'Tafels',               prefix: 'tafel-',      totaal: 100 },
      { label: 'Deelsommen',           prefix: 'deelsom-',    totaal: 100 },
      { label: 'Deelsommen met rest',  prefix: 'deelrest-',   totaal: DEEL_REST.length },
      { label: 'Deelsommen splitsen',  prefix: 'deelspl-',    totaal: DEEL_SPLITS.length },
      { label: 'Deels. naar analogie', prefix: 'deelanalog-', totaal: DEEL_ANALOG.length },
    ]},
    { titel: '➕ Rekenen', items: [
      { label: 'Optellen & aftrekken',   prefix: 'optaft-',    totaal: OPT_AFT.length },
      { label: 'Vermenigvuldigen',       prefix: 'vermenigv-', totaal: VERMENIGV.length },
      { label: 'Halveren & verdubbelen', prefix: 'halverd-',   totaal: HALVERD.length },
      { label: 'Handig rekenen',         prefix: 'handig-',    totaal: HANDIGREKEN.length },
      { label: 'Breuken',               prefix: 'breuk-',     totaal: BREUKEN.length },
      { label: 'Oppervlakte & omtrek',  prefix: 'opp-',       totaal: OPPERVLAKTE.length },
    ]},
    { titel: '⏰ Meten & tijd', items: [
      { label: 'Klokkijken',       prefix: 'klok-',      totaal: KLOK.length },
      { label: 'Digitale klok',    prefix: 'digklok-',   totaal: DIG_KLOK.length },
      { label: 'Kalender & datums',prefix: 'kalender-',  totaal: KALENDER.length },
      { label: 'Lengtematen',      prefix: 'lengte-',    totaal: LENGTE.length },
      { label: 'Gewichten',        prefix: 'gewicht-',   totaal: GEWICHTEN.length },
      { label: 'Inhoudsmaten',     prefix: 'inhoud-',    totaal: INHOUD.length },
      { label: 'Geld',             prefix: 'geld-',      totaal: GELD.length },
    ]},
    { titel: '📝 Taal & verhaal', items: [
      { label: 'Verhalende sommen',  prefix: 'verhaal-',   totaal: 100 },
      { label: 'Spelling (Staal)',   prefix: 'staal-',     totaal: STAAL.length },
      { label: 'Woordsoorten',       prefix: 'woord-',     totaal: WOORDSOORTEN.length },
      { label: 'Engels Unit 4',      prefix: 'engels-u4-', totaal: ENGELS_U4.length },
    ]},
  ];

  const nu = Date.now();

  // Bepaal 1 van 6 visuele staten op basis van rij + fouthistorie
  function itemStaat(id) {
    const b = beh[id];
    if (!b || b.status === 'nieuw') return 'grijs';
    if (b.status === 'beheerst')    return 'donkergroen';
    const rij     = b.rij     ?? 0;
    const fout    = b.fout    ?? 0;
    const metHint = b.metHint ?? 0;
    if (fout === 0 && metHint === 0) return 'lichtgroen'; // zelfstandig, nooit fout
    if (fout === 0 && metHint  > 0)  return 'geel';       // nooit fout, maar leunde op hints
    if (rij === 0)                   return 'rood';        // laatste antwoord fout
    if (rij === 1)                   return 'oranje';      // 1 goed na een fout
    return                                  'geel';        // 2+ goed maar eerder fout
  }

  // Prioriteitsscore + chip-klasse voor sorteren en labels
  function itemPrioriteit(item) {
    const staat = itemStaat(item.id);
    const toets = item.toetsDatum ? new Date(item.toetsDatum).getTime() : null;
    const dagen = toets ? (toets - nu) / 86400000 : 999;

    const STAAT_INFO = {
      grijs:       { score: 4, chip: 'grijs',      label: 'Nog niet gezien' },
      rood:        { score: 5, chip: 'rood',        label: 'Fout gemaakt' },
      oranje:      { score: 4, chip: 'oranje',      label: 'Laatste goed, eerder fout' },
      geel:        { score: 3, chip: 'geel',        label: 'Hint gebruikt / bijna hersteld' },
      lichtgroen:  { score: 2, chip: 'lichtgroen',  label: 'Goed bezig — zelfstandig' },
      donkergroen: { score: 1, chip: 'donkergroen', label: 'Beheerst' },
    };
    const info = { ...STAAT_INFO[staat] };

    // Deadlineboost: verhoog score bij naderende toets
    if (staat !== 'donkergroen' && dagen <= 3)  { info.score += 3; info.label = 'Deadline!'; info.chip = 'rood'; }
    else if (staat !== 'donkergroen' && dagen <= 7) { info.score += 2; info.label = 'Deadline nadert'; }
    return info;
  }

  function maakOnderdeelRij(o) {
    const match = ([id]) => id.startsWith(o.prefix);
    // Tel per staat
    const tellen = s => Object.entries(beh).filter(e => match(e) && itemStaat(e[0]) === s).length;
    const n_donkergroen = tellen('donkergroen');
    const n_lichtgroen  = tellen('lichtgroen');
    const n_geel        = tellen('geel');
    const n_oranje      = tellen('oranje');
    const n_rood        = tellen('rood');
    const n_grijs       = o.totaal - n_donkergroen - n_lichtgroen - n_geel - n_oranje - n_rood;

    // Balkbreedte: gesegmenteerd van links (donkergroen) naar rechts, grijs = rest
    const p = v => Math.round((v / o.totaal) * 100);
    const cum = (a, b, c, d, e) => p(a + b + c + d + e);
    const balkSegmenten = [
      { klasse: 'vg-balk-rood',        breedte: cum(n_donkergroen, n_lichtgroen, n_geel, n_oranje, n_rood) },
      { klasse: 'vg-balk-oranje',       breedte: cum(n_donkergroen, n_lichtgroen, n_geel, n_oranje, 0) },
      { klasse: 'vg-balk-geel',         breedte: cum(n_donkergroen, n_lichtgroen, n_geel, 0, 0) },
      { klasse: 'vg-balk-lichtgroen',   breedte: cum(n_donkergroen, n_lichtgroen, 0, 0, 0) },
      { klasse: 'vg-balk-donkergroen',  breedte: p(n_donkergroen) },
    ].map(s => `<div class="vg-balk-vul ${s.klasse}" style="width:${s.breedte}%"></div>`).join('');

    // Chips — alleen tonen als > 0
    const chips = [
      [n_donkergroen, 'donkergroen', '✓'],
      [n_lichtgroen,  'lichtgroen',  '◎'],
      [n_geel,        'geel',        '~'],
      [n_oranje,      'oranje',      '!'],
      [n_rood,        'rood',        '✗'],
      [n_grijs,       'grijs',       '?'],
    ].filter(([n]) => n > 0)
     .map(([n, k, icoon]) => `<span class="vg-chip vg-chip-${k}">${icoon} ${n}</span>`)
     .join('');

    // Zoek pool-items via ALLE_POOLS
    const poolItems = ALLE_POOLS.flatMap(p => p.pool.filter(it => it.id.startsWith(o.prefix)));

    const el = document.createElement('details');
    el.className = 'vg-onderdeel-details';

    const summary = document.createElement('summary');
    summary.className = 'vg-onderdeel';
    summary.innerHTML = `
      <div class="vg-onderdeel-kop">
        <span>${o.label}</span>
        <span class="vg-cijfer">${n_donkergroen} / ${o.totaal}</span>
      </div>
      <div class="vg-balk-wrap">${balkSegmenten}</div>
      <div class="vg-sub-rij">${chips}<span class="vg-onderdeel-pijl">▸</span></div>`;
    el.appendChild(summary);

    if (poolItems.length > 0) {
      const inhoud = document.createElement('div');
      inhoud.className = 'vg-items-inhoud';

      const staat = it => itemStaat(it.id);
      const groepenItems = {
        rood:        poolItems.filter(it => staat(it) === 'rood'),
        oranje:      poolItems.filter(it => staat(it) === 'oranje'),
        geel:        poolItems.filter(it => staat(it) === 'geel'),
        lichtgroen:  poolItems.filter(it => staat(it) === 'lichtgroen'),
        donkergroen: poolItems.filter(it => staat(it) === 'donkergroen'),
        grijs:       poolItems.filter(it => staat(it) === 'grijs'),
      };

      const sorter = (a, b) => itemPrioriteit(b).score - itemPrioriteit(a).score;

      function maakRij(it) {
        const p = itemPrioriteit(it);
        return `<div class="vg-item-rij prio-${p.chip}" data-item-id="${it.id}" role="button" tabindex="0" title="Klik voor details">
          <span class="vg-item-chip prio-chip-${p.chip}">${p.label}</span>
          <span class="vg-item-vraag">${it.vraag}</span>
          <span class="vg-item-info-knop">ℹ</span>
        </div>`;
      }

      function sectie(items, titel, maxToon = 12, titelKlasse = '') {
        if (items.length === 0) return '';
        const gesorteerd = [...items].sort(sorter);
        const zichtbaar = gesorteerd.slice(0, maxToon);
        const rest = gesorteerd.slice(maxToon);
        const meerHTML = rest.length > 0
          ? `<div class="vg-meer-items" hidden>${rest.map(maakRij).join('')}</div>
             <button class="vg-toon-meer-knop" onclick="this.previousElementSibling.hidden=false;this.hidden=true">
               Toon alle ${items.length} ▾
             </button>` : '';
        return `<div class="vg-items-sectie">
          <p class="vg-items-sectie-titel ${titelKlasse}">${titel} <span class="vg-items-aantal">(${items.length})</span></p>
          ${zichtbaar.map(maakRij).join('')}${meerHTML}
        </div>`;
      }

      inhoud.innerHTML =
        sectie(groepenItems.grijs,       'Nog niet gezien',               12, 'vg-sectie-grijs') +
        sectie(groepenItems.rood,        'Fout gemaakt — herhalen',       12, 'vg-sectie-rood') +
        sectie(groepenItems.oranje,      'Laatste goed, eerder fout',     12, 'vg-sectie-oranje') +
        sectie(groepenItems.geel,        '2–3 goed, eerder fout of hint gebruikt', 12, 'vg-sectie-geel') +
        sectie(groepenItems.lichtgroen,  'Goed bezig — zelfstandig, nooit fout', 12, 'vg-sectie-lichtgroen') +
        sectie(groepenItems.donkergroen, 'Beheerst',                       8, 'vg-sectie-donkergroen');

      el.appendChild(inhoud);
    }

    return el;
  }

  const vgOnderdelen = document.getElementById('vg-onderdelen');
  vgOnderdelen.innerHTML = '';
  for (const groep of onderdeelGroepen) {
    const details = document.createElement('details');
    details.className = 'vg-groep';
    details.open = true;
    const summary = document.createElement('summary');
    summary.className = 'vg-groep-titel';
    summary.textContent = groep.titel;
    details.appendChild(summary);
    const inhoud = document.createElement('div');
    inhoud.className = 'vg-groep-inhoud';
    for (const o of groep.items) inhoud.appendChild(maakOnderdeelRij(o));
    details.appendChild(inhoud);
    vgOnderdelen.appendChild(details);
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
  const weekVg = berekenWeekVoortgang(data.oefenlog, WEEK_DOEL);
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

  toonPatroonAnalyse(beh);

  // Click-to-detail op items in voortgangspanelen
  vgOnderdelen.onclick = e => {
    const rij = e.target.closest('[data-item-id]');
    if (!rij) return;
    toonItemDetail(rij.dataset.itemId);
  };
  vgOnderdelen.onkeydown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const rij = e.target.closest('[data-item-id]');
      if (rij) { e.preventDefault(); toonItemDetail(rij.dataset.itemId); }
    }
  };

  toonScherm('scherm-voortgang');
}

function toonItemDetail(itemId) {
  const b = data.beheersing[itemId];
  // Zoek het item in alle pools
  const item = ALLE_POOLS.flatMap(p => p.pool).find(it => it.id === itemId);
  if (!item) return;

  const status = b?.status ?? 'nieuw';
  const goed   = b?.goed   ?? 0;
  const fout   = b?.fout   ?? 0;
  const rij    = b?.rij    ?? 0;
  const metHint = b?.metHint ?? 0;
  const gezien  = b?.gezien  ?? 0;
  const fouten  = b?.fouteAntwoorden ?? [];
  const totaal  = goed + fout;
  const pct     = totaal > 0 ? Math.round((goed / totaal) * 100) : null;

  const statusLabel = { nieuw: '🔴 Nog niet gezien', oefenen: '🟡 In oefening', beheerst: '🟢 Beheerst' }[status] ?? status;
  const datumTekst  = b?.laatstGeoefend ? `Laatste keer: ${b.laatstGeoefend}` : 'Nog niet geoefend';

  const overlay = document.getElementById('vg-item-detail-overlay');
  document.getElementById('vg-item-detail-inhoud').innerHTML = `
    <div class="vid-kop">
      <span class="vid-vraag">${item.vraag}</span>
      <span class="vid-antwoord">→ ${item.antwoord}</span>
    </div>
    <div class="vid-status">${statusLabel}</div>
    <div class="vid-stats">
      <div class="vid-stat">
        <span class="vid-getal">${totaal}</span>
        <span class="vid-lbl">keer geoefend</span>
      </div>
      <div class="vid-stat goed">
        <span class="vid-getal">${goed}</span>
        <span class="vid-lbl">goed</span>
      </div>
      <div class="vid-stat fout">
        <span class="vid-getal">${fout}</span>
        <span class="vid-lbl">fout</span>
      </div>
      ${pct !== null ? `<div class="vid-stat">
        <span class="vid-getal">${pct}%</span>
        <span class="vid-lbl">raak</span>
      </div>` : ''}
    </div>
    ${metHint > 0 || gezien > 0 ? `<div class="vid-hulp-rij">
      ${metHint > 0 ? `<span class="vid-hulp-chip">💡 ${metHint}× met hint</span>` : ''}
      ${gezien  > 0 ? `<span class="vid-hulp-chip">👁 ${gezien}× antwoord gezien</span>` : ''}
    </div>` : ''}
    ${rij > 0 ? `<p class="vid-rij">Huidige goede reeks: ${rij} ✓</p>` : ''}
    ${fouten.length > 0 ? `
      <p class="vid-fouten-titel">Eerdere foute antwoorden:</p>
      <div class="vid-fouten">${fouten.map(f => `<span class="vid-fout-chip">${f}</span>`).join('')}</div>
    ` : ''}
    <p class="vid-datum">${datumTekst}</p>
  `;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('zichtbaar'));
}

// Init detail-overlay sluitknoppen (éénmalig in module scope)
document.getElementById('vg-item-detail-sluit')?.addEventListener('click', () => sluitItemDetail());
document.getElementById('vg-item-detail-overlay')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) sluitItemDetail();
});
function sluitItemDetail() {
  const overlay = document.getElementById('vg-item-detail-overlay');
  overlay.classList.remove('zichtbaar');
  overlay.addEventListener('transitionend', () => { overlay.hidden = true; }, { once: true });
}

function toonPatroonAnalyse(beh) {
  const kaart = document.getElementById('vg-analyse-kaart');
  const inhoud = document.getElementById('vg-analyse-inhoud');
  const bevindingen = [];

  function pct(items) {
    if (!items.length) return 0;
    return Math.round(items.filter(it => beh[it.id]?.status === 'beheerst').length / items.length * 100);
  }
  function gezien(items) {
    return items.some(it => beh[it.id]);
  }

  // Tafels: per tafel
  for (let n = 1; n <= 10; n++) {
    const groep = TAFELS.filter(it => tafelVanItem(it.id) === n);
    if (!gezien(groep)) continue;
    const p = pct(groep);
    if (p < 50) bevindingen.push({ ernst: 'zwak', tekst: `Tafel van ${n}: slechts ${p}% beheerst — extra oefening nodig.` });
    else if (p < 80) bevindingen.push({ ernst: 'mid', tekst: `Tafel van ${n}: ${p}% beheerst — bijna goed, nog wat herhalen.` });
  }

  // Klokkijken: types
  const klokGroepen = [
    { naam: 'kwart over', items: KLOK.filter(it => it.id.startsWith('klok-kwartover-')) },
    { naam: 'het halfuur', items: KLOK.filter(it => it.id.startsWith('klok-half-')) },
    { naam: 'kwart voor', items: KLOK.filter(it => it.id.startsWith('klok-kwartvoor-')) },
    { naam: 'minuten over het uur', items: KLOK.filter(it => it.id.startsWith('klok-over-')) },
    { naam: 'minuten voor het uur', items: KLOK.filter(it => it.id.startsWith('klok-voor-')) },
    { naam: 'minuten over het halfuur', items: KLOK.filter(it => it.id.startsWith('klok-halfuur-')) },
  ];
  for (const g of klokGroepen) {
    if (!g.items.length || !gezien(g.items)) continue;
    const p = pct(g.items);
    if (p < 60) bevindingen.push({ ernst: 'zwak', tekst: `Klokkijken — ${g.naam}: ${p}% beheerst.` });
  }

  // Digitale klok: types
  const digGroepen = [
    { naam: 'precies het uur', items: DIG_KLOK.filter(it => it._min === 0) },
    { naam: 'kwart over', items: DIG_KLOK.filter(it => it._min === 15) },
    { naam: 'halfuur', items: DIG_KLOK.filter(it => it._min === 30) },
    { naam: 'kwart voor', items: DIG_KLOK.filter(it => it._min === 45) },
    { naam: 'minuten over', items: DIG_KLOK.filter(it => it._min > 0 && it._min < 30 && it._min !== 15) },
    { naam: 'minuten voor', items: DIG_KLOK.filter(it => it._min > 30 && it._min !== 45) },
  ];
  for (const g of digGroepen) {
    if (!g.items.length || !gezien(g.items)) continue;
    const p = pct(g.items);
    if (p < 60) bevindingen.push({ ernst: 'zwak', tekst: `Digitale klok — ${g.naam}: ${p}% beheerst.` });
  }

  // Optellen & aftrekken: per strategie
  const optGroepen = [
    { naam: 'rijgen optellen', items: OPT_AFT.filter(it => it.id.startsWith('optaft-rijgen-opt-')) },
    { naam: 'rijgen aftrekken', items: OPT_AFT.filter(it => it.id.startsWith('optaft-rijgen-aft-')) },
    { naam: 'splitsen optellen', items: OPT_AFT.filter(it => it.id.startsWith('optaft-splits-opt-')) },
    { naam: 'splitsen aftrekken', items: OPT_AFT.filter(it => it.id.startsWith('optaft-splits-aft-')) },
    { naam: 'aanvullen', items: OPT_AFT.filter(it => it.id.startsWith('optaft-aanvul-')) },
    { naam: 'rijgen met te veel (optellen)', items: OPT_AFT.filter(it => it.id.startsWith('optaft-tevel-opt-')) },
    { naam: 'rijgen met te veel (aftrekken)', items: OPT_AFT.filter(it => it.id.startsWith('optaft-tevel-aft-')) },
  ];
  for (const g of optGroepen) {
    if (!g.items.length || !gezien(g.items)) continue;
    const p = pct(g.items);
    if (p < 60) bevindingen.push({ ernst: 'zwak', tekst: `Optellen & aftrekken — ${g.naam}: ${p}% beheerst.` });
  }

  // Breuken: per type
  const breukGroepen = [
    { naam: 'de helft (½)', items: BREUKEN.filter(it => it.id.startsWith('breuk-half-')) },
    { naam: 'een kwart (¼)', items: BREUKEN.filter(it => it.id.startsWith('breuk-kwart-') && !it.id.startsWith('breuk-driekwart-')) },
    { naam: 'driekwart (¾)', items: BREUKEN.filter(it => it.id.startsWith('breuk-driekwart-')) },
    { naam: 'een derde (⅓)', items: BREUKEN.filter(it => it.id.startsWith('breuk-derde-') && !it.id.startsWith('breuk-tweederde-')) },
    { naam: 'twee derde (⅔)', items: BREUKEN.filter(it => it.id.startsWith('breuk-tweederde-')) },
  ];
  for (const g of breukGroepen) {
    if (!g.items.length || !gezien(g.items)) continue;
    const p = pct(g.items);
    if (p < 60) bevindingen.push({ ernst: 'zwak', tekst: `Breuken — ${g.naam}: ${p}% beheerst.` });
  }

  // Spelling: per categorie
  const staalGroepen = [
    { naam: 'apostrof', items: STAAL.filter(it => it.id.startsWith('staal-apots-')) },
    { naam: 'verkleinwoorden (-etje)', items: STAAL.filter(it => it.id.startsWith('staal-etje-')) },
    { naam: 'ei/ij (plaatjes)', items: STAAL.filter(it => it.id.startsWith('staal-eiij-plaat-')) },
    { naam: 'persoonsvorm', items: STAAL.filter(it => it.id.startsWith('staal-pv-')) },
    { naam: 'centwoord', items: STAAL.filter(it => it.id.startsWith('staal-cent-')) },
    { naam: 'meervoud', items: STAAL.filter(it => it.id.startsWith('staal-apomv-')) },
    { naam: 'ei/ij (woorden)', items: STAAL.filter(it => it.id.startsWith('staal-eiij-') && !it.id.startsWith('staal-eiij-plaat-')) },
    { naam: 'voltooid deelwoord', items: STAAL.filter(it => it.id.startsWith('staal-vd-')) },
  ];
  for (const g of staalGroepen) {
    if (!g.items.length || !gezien(g.items)) continue;
    const p = pct(g.items);
    if (p < 60) bevindingen.push({ ernst: 'zwak', tekst: `Spelling — ${g.naam}: ${p}% beheerst.` });
  }

  // Positief bericht als alles goed gaat
  const gescoordePools = ALLE_POOLS.filter(p => gezien(p.pool));
  if (bevindingen.length === 0 && gescoordePools.length > 0) {
    const algPct = Math.round(gescoordePools.reduce((s, p) => s + pct(p.pool), 0) / gescoordePools.length);
    bevindingen.push({ ernst: 'goed', tekst: `Geweldig! Gemiddeld ${algPct}% beheerst over alle onderdelen. Zo te zien gaat het heel goed!` });
  }

  if (bevindingen.length === 0) {
    kaart.hidden = true;
    return;
  }
  kaart.hidden = false;
  inhoud.innerHTML = '';
  for (const b of bevindingen) {
    const div = document.createElement('div');
    div.className = `vg-analyse-item vg-analyse-${b.ernst}`;
    div.textContent = b.tekst;
    inhoud.appendChild(div);
  }
}

// ── Start ─────────────────────────────────────────────
initialiseerDierentuin();
updateNavNaam();
if (data.profiel.naam) {
  document.getElementById('naam-input').value = data.profiel.naam;
  toonKeuzescherm();
} else {
  toonScherm('scherm-welkom');
  document.getElementById('naam-input').focus();
}
