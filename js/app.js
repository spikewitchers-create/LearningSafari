import { laadData, slaOp, schrijfOefenlog } from './storage.js';
import { kiesOpgaven, verwerkAntwoord } from './session.js';
import { genereerItems } from './onderdelen/tafels.js';

const ALLE_ITEMS = genereerItems();

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

// ── Welkomstscherm ────────────────────────────────────
document.getElementById('start-knop').addEventListener('click', () => {
  const naam = document.getElementById('naam-input').value.trim();
  if (!naam) return;
  data.profiel.naam = naam;
  slaOp(data);
  toonKeuzescherm();
});

document.getElementById('naam-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('start-knop').click();
});

// ── Keuze + voortgangscherm ───────────────────────────
function beheerstPerTafel(n) {
  let teller = 0;
  for (let b = 1; b <= 10; b++) {
    const entry = data.beheersing[`tafel-${n}x${b}`];
    if (entry?.status === 'beheerst') teller++;
  }
  return teller;
}

function toonKeuzescherm() {
  document.getElementById('keuze-naam').textContent = data.profiel.naam;

  const selectie = new Set(data.profiel.tafelselectie);
  const lijst = document.getElementById('tafel-lijst');
  lijst.innerHTML = '';

  for (let n = 1; n <= 10; n++) {
    const beheerst = beheerstPerTafel(n);
    const gekozen = selectie.has(n);

    const li = document.createElement('li');
    li.className = 'tafel-rij';

    const id = `tafel-cb-${n}`;
    li.innerHTML = `
      <label class="tafel-label" for="${id}">
        <input type="checkbox" id="${id}" value="${n}" ${gekozen ? 'checked' : ''}>
        <span class="tafel-naam">Tafel van ${n}</span>
        <span class="tafel-voortgang">
          <span class="tafel-dots">${dotjes(beheerst, 10)}</span>
          <span class="tafel-teller">${beheerst}/10</span>
        </span>
      </label>`;
    lijst.appendChild(li);
  }

  toonScherm('scherm-keuze');
}

function dotjes(beheerst, totaal) {
  return Array.from({ length: totaal }, (_, i) =>
    `<span class="dot ${i < beheerst ? 'dot-vol' : ''}"></span>`
  ).join('');
}

function leesSelectie() {
  return Array.from(document.querySelectorAll('#tafel-lijst input:checked'))
    .map(cb => Number(cb.value));
}

document.getElementById('alles-knop').addEventListener('click', () => {
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = true);
});

document.getElementById('niets-knop').addEventListener('click', () => {
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = false);
});

document.getElementById('wissel-naam-knop').addEventListener('click', () => {
  toonScherm('scherm-welkom');
});

document.getElementById('keuze-start-knop').addEventListener('click', () => {
  const selectie = leesSelectie();
  if (selectie.length === 0) return;
  data.profiel.tafelselectie = selectie;
  slaOp(data);
  startSessie(selectie);
});

// ── Sessie ────────────────────────────────────────────
function startSessie(selectie) {
  const items = ALLE_ITEMS.filter(it => {
    const a = Number(it.id.split('-')[1].split('x')[0]);
    return selectie.includes(a);
  });
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

  const naam = data.profiel.naam;
  document.getElementById('resultaat-tekst').textContent =
    `${naam}, je had ${score} van de ${sessie.length} goed!`;

  const totaalBeheerst = Object.values(data.beheersing).filter(b => b.status === 'beheerst').length;
  document.getElementById('voortgang-tekst').textContent =
    `Je beheerst nu ${totaalBeheerst} van de 100 tafels.`;

  toonScherm('scherm-resultaat');
}

document.getElementById('opnieuw-knop').addEventListener('click', toonKeuzescherm);

// ── Start ─────────────────────────────────────────────
if (data.profiel.naam) {
  toonKeuzescherm();
} else {
  toonScherm('scherm-welkom');
}
