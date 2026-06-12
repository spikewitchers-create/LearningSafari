import { laadData, slaOp, schrijfOefenlog } from './storage.js';
import { spreekUit, ttsWerkt } from './tts.js';
import { kiesOpgaven, verwerkAntwoord } from './session.js';
import { genereerItems as tafelsItems } from './onderdelen/tafels.js';
import { genereerItems as deelsomItems } from './onderdelen/deelsommen.js';
import { genereerItems as verhaalItems } from './onderdelen/tafels-verhaal.js';

const TAFELS     = tafelsItems();
const DEELSOMMEN = deelsomItems();
// VERHAAL wordt per sessie opnieuw gegenereerd voor variatie in verhaalteksten

let data = laadData();
let sessie = [];
let index = 0;
let score = 0;
let nieuwBeheerst = 0;

// ── Navigatie ─────────────────────────────────────────
const SCHERM_TITELS = {
  'scherm-welkom':    'Wie ben jij?',
  'scherm-keuze':     'Wat wil je oefenen?',
  'scherm-sessie':    'Oefenen',
  'scherm-voortgang': 'Voortgang',
  'scherm-resultaat': 'Hoe ging het?',
};

const NAV_ACTIEF = {
  'scherm-welkom':    'nav-oefenen',
  'scherm-keuze':     'nav-oefenen',
  'scherm-sessie':    'nav-oefenen',
  'scherm-voortgang': 'nav-voortgang',
  'scherm-resultaat': 'nav-oefenen',
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

  // Verhalende sommen
  document.getElementById('cb-verhaal').checked = data.profiel.verhaal ?? false;
  const verhaalPool = verhaalItems(); // alleen voor beheersing-tel
  document.getElementById('verhaal-voortgang').textContent =
    `${beheerstVoorPool(verhaalPool)} / 100`;

  // Sessielengte
  document.getElementById('sessie-lengte').value = String(data.profiel.aantalSommen ?? 10);

  // Auto-lees
  document.getElementById('cb-autolees').checked = data.profiel.autoLees;
  if (!ttsWerkt()) document.querySelector('.keuze-optie-extra').hidden = true;

  toonScherm('scherm-keuze');
}

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
  const metDeelsommen = document.getElementById('cb-deelsommen').checked;
  const metVerhaal = document.getElementById('cb-verhaal').checked;

  if (tafelsSelectie.length === 0 && !metDeelsommen && !metVerhaal) return;

  data.profiel.tafels = metTafels;
  data.profiel.tafelselectie = tafelsSelectie;
  data.profiel.deelsommen = metDeelsommen;
  data.profiel.verhaal = metVerhaal;
  data.profiel.autoLees = document.getElementById('cb-autolees').checked;
  data.profiel.aantalSommen = Number(document.getElementById('sessie-lengte').value) || 10;
  slaOp(data);

  // Verhalende sommen: elke sessie vers gegenereerd voor variatie
  const verhaalDezesSessie = metVerhaal ? verhaalItems() : [];

  const items = [
    ...TAFELS.filter(it => tafelsSelectie.includes(tafelVanItem(it.id))),
    ...(metDeelsommen ? DEELSOMMEN : []),
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

function toonOpgave() {
  const opgave = sessie[index];
  const pct = Math.round((index / sessie.length) * 100);
  document.getElementById('voortgang').textContent = `${index + 1} / ${sessie.length}`;
  document.getElementById('voortgang-balk-vul').style.width = `${pct}%`;
  const vraagEl = document.getElementById('vraag');
  vraagEl.textContent = opgave.vraag;
  vraagEl.classList.toggle('vraag-lang', opgave.vraag.length > 60);
  document.getElementById('antwoord-input').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  resetHint();
  beheersingsVerwerkt = false;
  document.getElementById('volgende-knop').hidden = true;
  toonHintKnop();

  const leesKnop = document.getElementById('lees-knop');
  leesKnop.hidden = !ttsWerkt();
  if (ttsWerkt() && data.profiel.autoLees) spreekUit(opgave.vraag);

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
  const hints = sessie[index]?.hints ?? [];
  if (hints.length > 0) document.getElementById('hint-gebied').hidden = false;
}

document.getElementById('lees-knop').addEventListener('click', () => {
  spreekUit(sessie[index]?.vraag ?? '');
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
  const correct = gegeven.trim() === String(opgave.antwoord).trim();
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
  slaOp(data);

  const pct = Math.round((score / sessie.length) * 100);

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
  document.getElementById('resultaat-titel').textContent = titel;
  document.getElementById('resultaat-boodschap').textContent = boodschap;

  // Details per onderdeel
  const details = document.getElementById('resultaat-details');
  details.innerHTML = '';

  const onderdelen = [
    { label: 'Tafels',             prefix: 'tafel-',   pool: TAFELS,     grootte: 100 },
    { label: 'Deelsommen',         prefix: 'deelsom-', pool: DEELSOMMEN, grootte: 100 },
    { label: 'Verhalende sommen',  prefix: 'verhaal-', pool: null,        grootte: 100 },
  ];

  for (const { label, prefix, pool, grootte } of onderdelen) {
    const inSessie = sessie.filter(it => it.id.startsWith(prefix));
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

  // Onderdelen-overzicht
  const onderdelen = [
    { label: 'Tafels',            prefix: 'tafel-',   totaal: 100 },
    { label: 'Deelsommen',        prefix: 'deelsom-', totaal: 100 },
    { label: 'Verhalende sommen', prefix: 'verhaal-', totaal: 100 },
  ];
  const vgOnderdelen = document.getElementById('vg-onderdelen');
  vgOnderdelen.innerHTML = '';
  for (const o of onderdelen) {
    const beheerst = Object.entries(beh)
      .filter(([id, b]) => id.startsWith(o.prefix) && b.status === 'beheerst').length;
    const oefenen = Object.entries(beh)
      .filter(([id, b]) => id.startsWith(o.prefix) && b.status === 'oefenen').length;
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

  toonScherm('scherm-voortgang');
}

// ── Start ─────────────────────────────────────────────
updateNavNaam();
if (data.profiel.naam) {
  document.getElementById('naam-input').value = data.profiel.naam;
  toonKeuzescherm();
} else {
  toonScherm('scherm-welkom');
}
