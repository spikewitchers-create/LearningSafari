import { laadData, slaOp, schrijfOefenlog } from './storage.js';
import { kiesOpgaven, verwerkAntwoord } from './session.js';
import { genereerItems as tafelsItems } from './onderdelen/tafels.js';
import { genereerItems as deelsomItems } from './onderdelen/deelsommen.js';

const TAFELS   = tafelsItems();
const DEELSOMMEN = deelsomItems();

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

// ── Beheersing hulpfuncties ───────────────────────────
function beheerstPerTafel(n) {
  let t = 0;
  for (let b = 1; b <= 10; b++)
    if (data.beheersing[`tafel-${n}x${b}`]?.status === 'beheerst') t++;
  return t;
}

function beheerstVoorPool(items) {
  return items.filter(it => data.beheersing[it.id]?.status === 'beheerst').length;
}

function tafelVanItem(id) {
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

// ── Oefenscherm ───────────────────────────────────────
function toonOefenscherm() {
  document.getElementById('oefenen-naam').textContent = data.profiel.naam;
  bouwZijbalk();
  zetSessieActief(false);
  toonScherm('scherm-oefenen');
}

function bouwZijbalk() {
  // Tafels hoofd-toggle
  const cbTafels = document.getElementById('cb-tafels');
  cbTafels.checked = data.profiel.tafels;
  hertekenTafelsVoortgang();
  zetTafelsSub(data.profiel.tafels);

  // Sub-lijst × 1-10
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
        <span class="tafel-dots">${dotjes(beheerst, 10)}</span>
      </label>`;
    lijst.appendChild(li);
  }

  // Deelsommen
  document.getElementById('cb-deelsommen').checked = data.profiel.deelsommen;
  hertekenDeelsom();
}

function zetTafelsSub(zichtbaar) {
  document.getElementById('tafels-sub').hidden = !zichtbaar;
}

function hertekenTafelsVoortgang() {
  const beheerst = beheerstVoorPool(TAFELS);
  document.getElementById('tafels-voortgang').textContent = `${beheerst}/100`;
}

function dotjes(beheerst, totaal) {
  return Array.from({ length: totaal }, (_, i) =>
    `<span class="dot ${i < beheerst ? 'dot-vol' : ''}"></span>`
  ).join('');
}

function hertekenDotjes(n) {
  const rij = document.querySelector(`.tafel-rij[data-tafel="${n}"]`);
  if (rij) rij.querySelector('.tafel-dots').innerHTML = dotjes(beheerstPerTafel(n), 10);
}

function hertekenDeelsom() {
  const beheerst = beheerstVoorPool(DEELSOMMEN);
  document.getElementById('deelsom-voortgang').textContent = `${beheerst}/100`;
}

function markeerActieveTafel(id) {
  document.querySelectorAll('.tafel-rij').forEach(el => el.classList.remove('actief'));
  if (id.startsWith('tafel-')) {
    const rij = document.querySelector(`.tafel-rij[data-tafel="${tafelVanItem(id)}"]`);
    if (rij) rij.classList.add('actief');
  } else if (id.startsWith('deelsom-')) {
    document.getElementById('rij-deelsommen')?.classList.add('actief');
  }
}

function zetSessieActief(actief) {
  sessieActief = actief;
  document.querySelectorAll('#tafel-lijst input, #cb-tafels, #cb-deelsommen').forEach(cb => cb.disabled = actief);
  document.getElementById('alles-knop').disabled = actief;
  document.getElementById('niets-knop').disabled = actief;
  document.getElementById('keuze-start-knop').disabled = actief;
  document.getElementById('wacht-kaart').hidden = actief;
  document.getElementById('sessie-inhoud').hidden = !actief;
  if (!actief) document.querySelectorAll('.tafel-rij').forEach(el => el.classList.remove('actief'));
}

// ── Zijbalk knoppen ───────────────────────────────────
document.getElementById('cb-tafels').addEventListener('change', e => {
  zetTafelsSub(e.target.checked);
});

document.getElementById('alles-knop').addEventListener('click', () =>
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = true));

document.getElementById('niets-knop').addEventListener('click', () =>
  document.querySelectorAll('#tafel-lijst input').forEach(cb => cb.checked = false));

document.getElementById('wissel-naam-knop').addEventListener('click', () =>
  toonScherm('scherm-welkom'));

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

// ── Sessie ────────────────────────────────────────────
function startSessie(items) {
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
  markeerActieveTafel(opgave.id);
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

  // Voortgang live bijwerken in zijbalk
  if (opgave.id.startsWith('tafel-')) { hertekenDotjes(tafelVanItem(opgave.id)); hertekenTafelsVoortgang(); }
  if (opgave.id.startsWith('deelsom-')) hertekenDeelsom();

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

  const tTotaal = Object.values(data.beheersing).filter(b => b.status === 'beheerst').length;
  document.getElementById('voortgang-tekst').textContent =
    `Je beheerst nu ${tTotaal} feiten.`;

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
