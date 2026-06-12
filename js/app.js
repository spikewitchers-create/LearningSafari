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
function toonScherm(id) {
  document.querySelectorAll('.scherm').forEach(el => el.hidden = true);
  document.getElementById(id).hidden = false;
}

// ── Hulpfuncties beheersing ───────────────────────────
function beheerstVoorPool(items) {
  return items.filter(it => data.beheersing[it.id]?.status === 'beheerst').length;
}

function tafelVanItem(id) {
  return Number(id.split('-')[1].split('x')[0]);
}

// ── 1. Welkomstscherm ─────────────────────────────────
document.getElementById('welkom-verder-knop').addEventListener('click', () => {
  const naam = document.getElementById('naam-input').value.trim();
  if (!naam) return;
  data.profiel.naam = naam;
  slaOp(data);
  toonKeuzescherm();
});

document.getElementById('naam-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('welkom-verder-knop').click();
});

// ── 2. Keuze-scherm ───────────────────────────────────
function toonKeuzescherm() {
  document.getElementById('keuze-naam').textContent = data.profiel.naam;

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

document.getElementById('keuze-naam-knop').addEventListener('click', () => {
  toonScherm('scherm-welkom');
  const input = document.getElementById('naam-input');
  input.select();
  input.focus();
});

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
  document.getElementById('antwoord-input').focus();
}

let hintIndex = 0;

function resetHint() {
  hintIndex = 0;
  document.getElementById('hint-gebied').hidden = true;
  document.getElementById('hint-tekst').hidden = true;
  document.getElementById('hint-tekst').textContent = '';
  document.getElementById('hint-knop').textContent = 'Hint →';
}

function toonHintKnop() {
  const hints = sessie[index]?.hints ?? [];
  if (hints.length > 0) document.getElementById('hint-gebied').hidden = false;
}

document.getElementById('hint-knop').addEventListener('click', () => {
  const hints = sessie[index]?.hints ?? [];
  if (hintIndex >= hints.length) return;
  const tekst = document.getElementById('hint-tekst');
  tekst.textContent = hints[hintIndex];
  tekst.hidden = false;
  hintIndex++;
  if (hintIndex >= hints.length) {
    document.getElementById('hint-knop').textContent = 'Geen hints meer';
    document.getElementById('hint-knop').disabled = true;
  }
});

function verwerkInvoer() {
  const input = document.getElementById('antwoord-input');
  const gegeven = input.value.trim();
  if (!gegeven) return;

  const opgave = sessie[index];
  const { correct, nieuwBeheerst: nb, entry } = verwerkAntwoord(
    opgave.id, gegeven, opgave, data.beheersing
  );

  data.beheersing[opgave.id] = entry;
  slaOp(data);

  if (correct) {
    score++;
    nieuwBeheerst += nb;
    document.getElementById('feedback').textContent = '✓ Goed!';
    document.getElementById('feedback').className = 'feedback goed';
  } else {
    document.getElementById('feedback').textContent = `Het antwoord is ${opgave.antwoord}`;
    document.getElementById('feedback').className = 'feedback fout';
    toonHintKnop();
  }

  index++;
  if (index < sessie.length) {
    setTimeout(toonOpgave, 900);
  } else {
    setTimeout(eindSessie, 900);
  }
}

document.getElementById('antwoord-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') verwerkInvoer();
});
document.getElementById('controleer-knop').addEventListener('click', verwerkInvoer);

// ── 4. Resultaat-scherm ───────────────────────────────
function eindSessie() {
  schrijfOefenlog(data, nieuwBeheerst);
  slaOp(data);

  document.getElementById('resultaat-tekst').textContent =
    `${data.profiel.naam}, je had ${score} van de ${sessie.length} goed!`;

  const totaal = Object.values(data.beheersing).filter(b => b.status === 'beheerst').length;
  document.getElementById('voortgang-tekst').textContent =
    `Je beheerst nu ${totaal} feiten in totaal.`;

  toonScherm('scherm-resultaat');
}

document.getElementById('opnieuw-knop').addEventListener('click', toonKeuzescherm);

// ── Start ─────────────────────────────────────────────
if (data.profiel.naam) {
  document.getElementById('naam-input').value = data.profiel.naam;
  toonKeuzescherm();
} else {
  toonScherm('scherm-welkom');
}
