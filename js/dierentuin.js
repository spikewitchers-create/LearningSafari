// Dierentuin — rendering en logica
// Importeer items-data apart zodat uitbreiden simpel is

import { ITEMS, START_ITEMS, WEEK_DOEL } from './dierentuin-items.js';
import { slaOp } from './storage.js';
import { berekenWeekVoortgang } from './analyse.js';

let _data = null;
let actiefTab = 'locaties';

// ── Initialiseer event handlers (éénmalig) ────────────────────
export function initialiseerDierentuin() {
  // Tab-knoppen
  document.getElementById('dzt-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.dzt-tab');
    if (!tab) return;
    document.querySelectorAll('.dzt-tab').forEach(t => t.classList.remove('actief'));
    tab.classList.add('actief');
    actiefTab = tab.dataset.tab;
    renderWinkelInhoud();
  });

  // Koop-knoppen via event delegation
  document.getElementById('dzt-winkel-inhoud').addEventListener('click', e => {
    const knop = e.target.closest('[data-koop]');
    if (!knop || !_data) return;
    const id = knop.dataset.koop;
    const item = ITEMS.find(i => i.id === id);
    if (!item || _data.dierentuin.punten < item.kosten) return;
    if (_data.dierentuin.ontgrendeld.includes(id)) return;
    _data.dierentuin.punten -= item.kosten;
    _data.dierentuin.ontgrendeld.push(id);
    slaOp(_data);
    toonDierentuin(_data);
  });
}

// ── Hoofdfunctie: render het hele scherm ──────────────────────
export function toonDierentuin(data) {
  _data = data;
  renderHeader(data);
  renderZoo(data);
  renderWinkelInhoud();
}

// ── Header: punten + weekdoel ─────────────────────────────────
function renderHeader(data) {
  const vg = berekenWeekVoortgang(data.oefenlog, WEEK_DOEL);
  const el = document.getElementById('dzt-header');

  const stippen = Array.from({ length: vg.doel }, (_, i) =>
    `<span class="dzt-stip${i < vg.gedaan ? ' gedaan' : ''}"></span>`
  ).join('');

  const doelTekst = vg.gedaan >= vg.doel
    ? `🎉 Weekdoel gehaald! (${vg.gedaan}/${vg.doel})`
    : `${vg.gedaan} van ${vg.doel} keer geoefend deze week`;

  el.innerHTML = `
    <div class="dzt-punten-badge">
      <span class="dzt-punten-icoon">⭐</span>
      <span class="dzt-punten-getal">${data.dierentuin.punten}</span>
      <span class="dzt-punten-label">punten</span>
    </div>
    <div class="dzt-weekdoel">
      <div class="dzt-stippen">${stippen}</div>
      <p class="dzt-weekdoel-tekst">${doelTekst}</p>
    </div>
  `;
}

// ── Zoo-grid: alle ontgrendelde locaties met dieren ───────────
function renderZoo(data) {
  const ontgrendeld = new Set(data.dierentuin.ontgrendeld);
  const locaties    = ITEMS.filter(i => i.type === 'locatie'    && ontgrendeld.has(i.id));
  const dieren      = ITEMS.filter(i => i.type === 'dier'       && ontgrendeld.has(i.id));
  const accessoires = ITEMS.filter(i => i.type === 'accessoire' && ontgrendeld.has(i.id));

  const grid = document.getElementById('dzt-zoo');

  if (locaties.length === 0) {
    grid.innerHTML = '<p class="dzt-leeg-tekst">Je dierentuin is nog leeg. Verdien sterren door te oefenen!</p>';
    return;
  }

  const locHTML = locaties.map(loc => {
    const locDieren = dieren.filter(d => d.locatie === loc.id);
    const dierIcons = locDieren.length > 0
      ? locDieren.map(d => `<span class="dzt-dier-icoon" title="${d.naam}">${d.icoon}</span>`).join('')
      : '<span class="dzt-dier-leeg">?</span>';
    return `
      <div class="dzt-locatie-kaart">
        <div class="dzt-loc-icoon">${loc.icoon}</div>
        <div class="dzt-loc-naam">${loc.naam}</div>
        <div class="dzt-dieren-rij">${dierIcons}</div>
      </div>`;
  }).join('');

  const accHTML = accessoires.length > 0
    ? `<div class="dzt-acc-balk">
        ${accessoires.map(a => `<span title="${a.naam}">${a.icoon}</span>`).join('')}
       </div>`
    : '';

  grid.innerHTML = locHTML + accHTML;
}

// ── Winkel: tab-inhoud ────────────────────────────────────────
function renderWinkelInhoud() {
  if (!_data) return;
  const ontgrendeld = new Set(_data.dierentuin.ontgrendeld);
  const punten      = _data.dierentuin.punten;
  const el          = document.getElementById('dzt-winkel-inhoud');

  const typeMap = { locaties: 'locatie', dieren: 'dier', accessoires: 'accessoire' };
  const type    = typeMap[actiefTab];
  const items   = ITEMS.filter(i => i.type === type);

  // Voor dieren: groepeer per locatie
  if (type === 'dier') {
    const locaties = ITEMS.filter(i => i.type === 'locatie');
    el.innerHTML = locaties.map(loc => {
      const locDieren = items.filter(d => d.locatie === loc.id);
      const locOntg = ontgrendeld.has(loc.id);
      return `
        <div class="dzt-groep-header">
          ${loc.icoon} ${loc.naam}${locOntg ? '' : ' <span class="dzt-groep-slot">🔒</span>'}
        </div>
        ${locDieren.map(item => itemHTML(item, ontgrendeld, punten)).join('')}
      `;
    }).join('');
  } else {
    el.innerHTML = items.map(item => itemHTML(item, ontgrendeld, punten)).join('');
  }
}

function itemHTML(item, ontgrendeld, punten) {
  const bezit = ontgrendeld.has(item.id);

  let statusHTML;
  if (bezit) {
    statusHTML = `<span class="dzt-bezit">✓ Jouw</span>`;
  } else if (item.locatie && !ontgrendeld.has(item.locatie)) {
    const loc = ITEMS.find(i => i.id === item.locatie);
    statusHTML = `<span class="dzt-vergrendeld">🔒 ${loc?.naam ?? 'Locatie'} nodig</span>`;
  } else {
    const kanKopen = punten >= item.kosten;
    statusHTML = `
      <button class="dzt-koop-knop${kanKopen ? '' : ' te-duur'}"
        data-koop="${item.id}" ${kanKopen ? '' : 'disabled'}>
        ⭐ ${item.kosten}${kanKopen ? '' : ' · te weinig'}
      </button>`;
  }

  return `
    <div class="dzt-winkel-item${bezit ? ' bezit' : ''}">
      <span class="dzt-item-icoon">${item.icoon}</span>
      <div class="dzt-item-info">
        <span class="dzt-item-naam">${item.naam}</span>
        <span class="dzt-item-beschr">${item.beschrijving}</span>
      </div>
      ${statusHTML}
    </div>`;
}
