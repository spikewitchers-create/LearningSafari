import { laadData, slaOp, schrijfOefenlog } from './storage.js';
import { kiesOpgaven, verwerkAntwoord } from './session.js';
import { genereerItems } from './onderdelen/tafels.js';

const TAFEL_ITEMS = genereerItems();

let data = laadData();
let sessie = [];       // huidige rij van 10 opgaven
let index = 0;        // welke opgave we nu tonen
let score = 0;
let nieuwBeheerst = 0;

// ── Navigatie ────────────────────────────────────────────────
function toonScherm(id) {
  document.querySelectorAll('.scherm').forEach(el => el.hidden = true);
  document.getElementById(id).hidden = false;
}

// ── Welkomstscherm ───────────────────────────────────────────
document.getElementById('start-knop').addEventListener('click', () => {
  const naamInput = document.getElementById('naam-input');
  const naam = naamInput.value.trim();
  if (naam) {
    data.profiel.naam = naam;
    slaOp(data);
  }
  startSessie();
});

function startSessie() {
  sessie = kiesOpgaven(TAFEL_ITEMS, data.beheersing);
  index = 0;
  score = 0;
  nieuwBeheerst = 0;
  toonScherm('scherm-sessie');
  toonOpgave();
}

// ── Sessiescherm ─────────────────────────────────────────────
function toonOpgave() {
  const opgave = sessie[index];
  document.getElementById('voortgang').textContent = `${index + 1} / ${sessie.length}`;
  document.getElementById('vraag').textContent = opgave.vraag;
  document.getElementById('antwoord-input').value = '';
  document.getElementById('feedback').textContent = '';
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
    document.getElementById('feedback').textContent = `Niet helemaal — het is ${opgave.antwoord}`;
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

// ── Resultaatscherm ──────────────────────────────────────────
function eindSessie() {
  schrijfOefenlog(data, nieuwBeheerst);
  slaOp(data);

  const naam = data.profiel.naam || 'Goed gedaan';
  document.getElementById('resultaat-tekst').textContent =
    `${naam}, je had ${score} van de ${sessie.length} goed!`;

  const beheerst = Object.values(data.beheersing).filter(b => b.status === 'beheerst').length;
  document.getElementById('voortgang-tekst').textContent =
    `Je beheerst nu ${beheerst} van de 100 tafels.`;

  toonScherm('scherm-resultaat');
}

document.getElementById('opnieuw-knop').addEventListener('click', startSessie);

// ── Start ────────────────────────────────────────────────────
if (data.profiel.naam) {
  document.getElementById('naam-input').value = data.profiel.naam;
}
toonScherm('scherm-welkom');
