import { laadData, slaOp, schrijfOefenlog } from './storage.js';
import { kiesOpgaven, verwerkAntwoord } from './session.js';
import { genereerItems } from './onderdelen/tafels.js';

const ALLE_ITEMS = genereerItems();

let data = laadData();
let sessie = [];
let index = 0;
let score = 0;
let nieuwBeheerst = 0;
let sessieActief = false;

// ── Navigatie ─────────────────────────────────────────
function toonScherm(id) {
  document.querySelectorAll('.scherm').forEach(el => el.hidden = true);
  document.getElementById(id).hidden = false;
}

// ── Hulpfuncties beheersing ───────────────────────────
function beheerstPerTafel(n) {
  let teller = 0;
  for (let b = 1; b <= 10; b++) {
    if (data.beheersing[`tafel-${n}x${b}`]?.status === 'beheerst') teller++;
  }
  return teller;
}

function tafelVanItem(id) {
  // id = "tafel-6x7" → 6
  return Number(id.split('-')[1].split('x')[0]);
}

// ── Welkomstscherm ────────────────────────────────────
document.getElementById('start-knop').addEventListener('click', () => {
  const naam = document.getElementById('naam-input').value.trim();
  if (!naam) return;
  data.profiel.naam = naam;
  slaOp(data);
  toonOefenscherm();
});

document.getElementById('naam-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('start-knop').click();
});

// ── Oefenscherm opbouwen ──────────────────────────────
function toonOefenscherm() {
  document.getElementById('oefenen-naam').textContent = data.profiel.naam;
  bouwTafelLijst();
  zetSessieActief(false);
  toonScherm('scherm-oefenen');
}

function bouwTafelLijst() {
  const selectie = new Set(data.profiel.tafelselectie);
  const lijst = document.getElementById('tafel-lijst');
  lijst.innerHTML = '';

  for (let n = 1; n <= 10; n++) {
    const beheerst = beheerstPerTafel(n);
    const li = document.createElement('li');
    li.className = 'tafel-rij';
    li.dataset.tafel = n;

    const cbId = `cb-${n}`;
    li.innerHTML = `
      <label class="tafel-label" for="${cbId}">
        <input type="checkbox" id="${cbId}" value="${n}" ${selectie.has(n) ? 'checked' : ''}>
        <span class="tafel-naam">× ${n}</span>
        <span class="tafel-dots">${dotjes(beheerst)}</span>
      </label>`;
    lijst.appendChild(li);
  }
}

function dotjes(beheerst) {
  return Array.from({ length: 10 }, (_, i) =>
    `<span class="dot ${i < beheerst ? 'dot-vol' : ''}"></span>`
  ).join('');
}

// Bijwerken van dotjes voor één tafel (na elk antwoord)
function hertekenDotjes(n) {
  const rij = document.querySelector(`.tafel-rij[data-tafel="${n}"]`);
  if (!rij) return;
  rij.querySelector('.tafel-dots').innerHTML = dotjes(beheerstPerTafel(n));
}

// Actieve tafel markeren
function markeerActieveTafel(n) {
  document.querySelectorAll('.tafel-rij').forEach(el => el.classList.remove('actief'));
  const rij = document.querySelector(`.tafel-rij[data-tafel="${n}"]`);
  if (rij) rij.classList.add('actief');
}

// Vinkjes en Start-knop vergrendelen/ontgrendelen tijdens sessie
function zetSessieActief(actief) {
  sessieActief = actief;
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.disabled = actief);
  document.getElementById('alles-knop').disabled = actief;
  document.getElementById('niets-knop').disabled = actief;
  document.getElementById('keuze-start-knop').disabled = actief;
  document.getElementById('wacht-kaart').hidden = actief;
  document.getElementById('sessie-inhoud').hidden = !actief;
  if (!actief) {
    document.querySelectorAll('.tafel-rij').forEach(el => el.classList.remove('actief'));
  }
}

// ── Zijbalk knoppen ───────────────────────────────────
document.getElementById('alles-knop').addEventListener('click', () =>
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = true));

document.getElementById('niets-knop').addEventListener('click', () =>
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = false));

document.getElementById('wissel-naam-knop').addEventListener('click', () =>
  toonScherm('scherm-welkom'));

document.getElementById('keuze-start-knop').addEventListener('click', () => {
  const selectie = Array.from(document.querySelectorAll('#tafel-lijst input:checked'))
    .map(cb => Number(cb.value));
  if (selectie.length === 0) return;
  data.profiel.tafelselectie = selectie;
  slaOp(data);
  startSessie(selectie);
});

// ── Sessie ────────────────────────────────────────────
function startSessie(selectie) {
  const items = ALLE_ITEMS.filter(it => selectie.includes(tafelVanItem(it.id)));
  sessie = kiesOpgaven(items, data.beheersing);
  index = 0;
  score = 0;
  nieuwBeheerst = 0;
  zetSessieActief(true);
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
  markeerActieveTafel(tafelVanItem(opgave.id));
  document.getElementById('antwoord-input').focus();
}

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

  // Dotjes van deze tafel direct bijwerken
  hertekenDotjes(tafelVanItem(opgave.id));

  if (correct) {
    score++;
    nieuwBeheerst += nb;
    document.getElementById('feedback').textContent = '✓ Goed!';
    document.getElementById('feedback').className = 'feedback goed';
  } else {
    document.getElementById('feedback').textContent = `Het antwoord is ${opgave.antwoord}`;
    document.getElementById('feedback').className = 'feedback fout';
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

// ── Resultaat ─────────────────────────────────────────
function eindSessie() {
  schrijfOefenlog(data, nieuwBeheerst);
  slaOp(data);

  document.getElementById('resultaat-tekst').textContent =
    `${data.profiel.naam}, je had ${score} van de ${sessie.length} goed!`;

  const totaal = Object.values(data.beheersing).filter(b => b.status === 'beheerst').length;
  document.getElementById('voortgang-tekst').textContent =
    `Je beheerst nu ${totaal} van de 100 tafels.`;

  toonScherm('scherm-resultaat');
}

document.getElementById('opnieuw-knop').addEventListener('click', toonOefenscherm);

// ── Start ─────────────────────────────────────────────
if (data.profiel.naam) {
  document.getElementById('naam-input').value = data.profiel.naam;
  toonOefenscherm();
} else {
  toonScherm('scherm-welkom');
}
