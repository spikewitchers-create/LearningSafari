import { laadData, slaOp, schrijfOefenlog } from './storage.js';
import { kiesOpgaven, verwerkAntwoord } from './session.js';
import { genereerItems as tafelsItems } from './onderdelen/tafels.js';
import { genereerItems as deelsomItems } from './onderdelen/deelsommen.js';

const TAFELS    = tafelsItems();
const DEELSOMMEN = deelsomItems();

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
  'scherm-resultaat': 'Hoe ging het?',
};

const NAV_ACTIEF = {
  'scherm-welkom':    'nav-oefenen',
  'scherm-keuze':     'nav-oefenen',
  'scherm-sessie':    'nav-oefenen',
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

  if (tafelsSelectie.length === 0 && !metDeelsommen) return;

  data.profiel.tafels = metTafels;
  data.profiel.tafelselectie = tafelsSelectie;
  data.profiel.deelsommen = metDeelsommen;
  slaOp(data);

  const items = [
    ...TAFELS.filter(it => tafelsSelectie.includes(tafelVanItem(it.id))),
    ...(metDeelsommen ? DEELSOMMEN : [])
  ];
  startSessie(items);
});

// ── 3. Sessie-scherm ──────────────────────────────────
function startSessie(items) {
  sessie = kiesOpgaven(items, data.beheersing);
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
  document.getElementById('vraag').textContent = opgave.vraag;
  document.getElementById('antwoord-input').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  resetHint();
  beheersingsVerwerkt = false;
  document.getElementById('volgende-knop').hidden = true;
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

document.getElementById('hint-knop').addEventListener('click', () => {
  const hints = sessie[index]?.hints ?? [];
  if (hintIndex >= hints.length) return;
  document.getElementById('hint-tekst').textContent = hints[hintIndex];
  document.getElementById('hint-tekst').hidden = false;
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
    // Fout op eerste poging: hints aanbieden
    document.getElementById('feedback').textContent = `Niet helemaal — probeer nog eens.`;
    document.getElementById('feedback').className = 'feedback fout';
    toonHintKnop();
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
    { label: 'Tafels',      prefix: 'tafel-',   pool: TAFELS },
    { label: 'Deelsommen',  prefix: 'deelsom-', pool: DEELSOMMEN },
  ];

  for (const { label, prefix, pool } of onderdelen) {
    const inSessie = sessie.filter(it => it.id.startsWith(prefix));
    if (inSessie.length === 0) continue;
    const goed = inSessie.filter((it, i) => {
      // tel hoe vaak dit item in de sessie goed was (op basis van beheersing rij)
      return data.beheersing[it.id]?.rij > 0;
    }).length;
    const beheerst = pool.filter(it => data.beheersing[it.id]?.status === 'beheerst').length;
    const li = document.createElement('li');
    li.className = 'resultaat-detail-rij';
    li.innerHTML = `<span>${label}</span><span>${beheerst} / ${pool.length} beheerst</span>`;
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
    `Totaal beheerst: ${totaal} van de 200 feiten.`;

  toonScherm('scherm-resultaat');
}

document.getElementById('opnieuw-knop').addEventListener('click', toonKeuzescherm);

// ── Start ─────────────────────────────────────────────
updateNavNaam();
if (data.profiel.naam) {
  document.getElementById('naam-input').value = data.profiel.naam;
  toonKeuzescherm();
} else {
  toonScherm('scherm-welkom');
}
