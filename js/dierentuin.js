// Dierentuin — rendering en logica
import { ITEMS, START_ITEMS, WEEK_DOEL } from './dierentuin-items.js';
import { slaOp } from './storage.js';
import { berekenWeekVoortgang } from './analyse.js';

let _data = null;
let actiefTab = 'locaties';

// Kaart-afmetingen (pixels binnen het canvas)
const KAART_W = 700;
const KAART_H = 610;

// Zandpaden: [x1,y1, x2,y2] verbindingen tussen locatie-centra
const PADEN = [
  [112, 100, 348,  97],  // leeuw → giraf
  [348,  97, 585, 100],  // giraf → vogel
  [112, 100, 207, 297],  // leeuw → olifant
  [348,  97, 480, 297],  // giraf → gorilla
  [207, 297, 480, 297],  // olifant → gorilla
  [207, 297, 112, 504],  // olifant → pinguïn
  [480, 297, 585, 504],  // gorilla → reptiel
  [112, 504, 346, 504],  // pinguïn → dolfijn
  [346, 504, 585, 504],  // dolfijn → reptiel
];

// Posities voor accessoires in open gebieden tussen zones
const ACC_POSITIES = [
  [218, 65],  // tussen leeuw en giraf (boven)
  [455, 65],  // tussen giraf en vogel (boven)
  [20,  240], // links naast olifant
  [322, 268], // tussen olifant en gorilla
  [594, 260], // rechts naast gorilla
  [218, 458], // tussen pinguïn en dolfijn
  [457, 458], // tussen dolfijn en reptiel
  [20,  385], // links, boven pinguïn
];

// ── Kaart schalen naar container-breedte via CSS zoom ────────
function schaalKaart() {
  const outer = document.querySelector('.dzt-kaart-outer');
  const wrap  = document.querySelector('.dzt-kaart-wrap');
  if (!outer || !wrap) return;
  const schaal = outer.clientWidth / KAART_W;
  wrap.style.zoom = schaal;
  outer.style.height = Math.round(KAART_H * schaal) + 'px';
}

// ── Init (éénmalig) ───────────────────────────────────────────
export function initialiseerDierentuin() {
  window.addEventListener('resize', schaalKaart);
  document.getElementById('dzt-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.dzt-tab');
    if (!tab) return;
    document.querySelectorAll('.dzt-tab').forEach(t => t.classList.remove('actief'));
    tab.classList.add('actief');
    actiefTab = tab.dataset.tab;
    renderWinkelInhoud();
  });

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

  // Klik op kaartzone → detail
  document.getElementById('dzt-zoo').addEventListener('click', e => {
    const zone = e.target.closest('.dzt-zone[data-loc]');
    if (!zone || !_data) return;
    toonLocatieDetail(zone.dataset.loc);
  });

  // Detail-paneel sluiten
  document.getElementById('dzt-detail-sluit').addEventListener('click', sluitDetail);
  document.getElementById('dzt-detail-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) sluitDetail();
  });
}

// ── Hoofdrender ───────────────────────────────────────────────
export function toonDierentuin(data) {
  _data = data;
  renderHeader(data);
  renderKaart(data);
  renderWinkelInhoud();
  requestAnimationFrame(schaalKaart);
}

// ── Header ────────────────────────────────────────────────────
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

// ── Interactieve kaart ────────────────────────────────────────
function renderKaart(data) {
  const ontgrendeld = new Set(data.dierentuin.ontgrendeld);
  const dieren      = ITEMS.filter(i => i.type === 'dier'       && ontgrendeld.has(i.id));
  const accessoires = ITEMS.filter(i => i.type === 'accessoire' && ontgrendeld.has(i.id));
  const locaties    = ITEMS.filter(i => i.type === 'locatie');
  const el          = document.getElementById('dzt-zoo');

  if (ontgrendeld.size === 0) {
    el.innerHTML = '<p class="dzt-leeg-tekst">Je dierentuin is nog leeg. Verdien sterren door te oefenen!</p>';
    return;
  }

  // SVG zandpaden
  const padenSVG = PADEN.map(([x1,y1,x2,y2]) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
      stroke="#c9a96e" stroke-width="20" stroke-linecap="round" opacity="0.75"/>`
  ).join('');

  // Verblijf-zones
  const zonesHTML = locaties.map(loc => {
    const p = loc.mapPos;
    const bezit = ontgrendeld.has(loc.id);

    if (!bezit) {
      return `
        <div class="dzt-zone dzt-zone-slot"
          style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;">
          <span class="dzt-zone-slot-icoon">🔒</span>
          <span class="dzt-zone-slot-kosten">⭐ ${loc.kosten}</span>
        </div>`;
    }

    const locDieren = dieren.filter(d => d.locatie === loc.id);
    const dierHTML = locDieren.length > 0
      ? locDieren.map(d => `<span class="dzt-zone-dier" title="${d.naam}">${d.icoon}</span>`).join('')
      : '<span class="dzt-zone-leeg">?</span>';

    return `
      <div class="dzt-zone" data-loc="${loc.id}"
        style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;background:${loc.kleur};">
        <div class="dzt-zone-hemel">
          <span class="dzt-zone-naam">${loc.naam}</span>
          <span class="dzt-zone-badge">${loc.icoon}</span>
        </div>
        <div class="dzt-zone-grond">
          <div class="dzt-zone-dieren">${dierHTML}</div>
        </div>
      </div>`;
  }).join('');

  // Accessoires als decoraties op open plekken
  const accHTML = accessoires.slice(0, ACC_POSITIES.length).map((a, i) => {
    const [ax, ay] = ACC_POSITIES[i];
    return `<span class="dzt-kaart-acc" style="left:${ax}px;top:${ay}px;" title="${a.naam}">${a.icoon}</span>`;
  }).join('');

  el.innerHTML = `
    <div class="dzt-kaart-outer">
      <div class="dzt-kaart-wrap">
        <svg class="dzt-kaart-svg" width="${KAART_W}" height="${KAART_H}" viewBox="0 0 ${KAART_W} ${KAART_H}">
          <defs>
            <pattern id="gras" patternUnits="userSpaceOnUse" width="30" height="30">
              <rect width="30" height="30" fill="#5a9e38"/>
              <circle cx="5"  cy="5"  r="2"   fill="#4a8e2a" opacity="0.4"/>
              <circle cx="20" cy="18" r="1.5" fill="#6aae48" opacity="0.3"/>
              <circle cx="14" cy="25" r="1"   fill="#4a8e2a" opacity="0.25"/>
            </pattern>
          </defs>
          <rect width="${KAART_W}" height="${KAART_H}" fill="url(#gras)" rx="14"/>
          ${padenSVG}
        </svg>
        ${accHTML}
        ${zonesHTML}
      </div>
    </div>`;
}

// ── Detail-paneel ─────────────────────────────────────────────
function toonLocatieDetail(locId) {
  const loc       = ITEMS.find(i => i.id === locId);
  const ontg      = new Set(_data.dierentuin.ontgrendeld);
  const locDieren = ITEMS.filter(i => i.type === 'dier' && i.locatie === locId);

  const dierenHTML = locDieren.map(d => {
    const bezit = ontg.has(d.id);
    return `
      <div class="dzt-dd-dier${bezit ? ' bezit' : ''}">
        <span class="dzt-dd-icoon">${d.icoon}</span>
        <div class="dzt-dd-info">
          <strong>${d.naam}</strong>
          <span>${d.beschrijving}</span>
        </div>
        ${bezit
          ? `<span class="dzt-dd-bezit">✓</span>`
          : `<span class="dzt-dd-kosten">⭐ ${d.kosten}</span>`}
      </div>`;
  }).join('');

  document.getElementById('dzt-detail-inhoud').innerHTML = `
    <div class="dzt-dd-header" style="background:${loc.kleur};">
      <span class="dzt-dd-header-icoon">${loc.icoon}</span>
      <div class="dzt-dd-header-tekst">
        <strong>${loc.naam}</strong>
        <p>${loc.beschrijving}</p>
      </div>
    </div>
    <p class="dzt-dd-subtitel">Dieren in dit verblijf</p>
    <div class="dzt-dd-dieren">${dierenHTML}</div>`;

  const overlay = document.getElementById('dzt-detail-overlay');
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('zichtbaar'));
}

function sluitDetail() {
  const overlay = document.getElementById('dzt-detail-overlay');
  overlay.classList.remove('zichtbaar');
  overlay.addEventListener('transitionend', () => { overlay.hidden = true; }, { once: true });
}

// ── Winkel ────────────────────────────────────────────────────
function renderWinkelInhoud() {
  if (!_data) return;
  const ontgrendeld = new Set(_data.dierentuin.ontgrendeld);
  const punten      = _data.dierentuin.punten;
  const el          = document.getElementById('dzt-winkel-inhoud');

  const typeMap = { locaties: 'locatie', dieren: 'dier', accessoires: 'accessoire' };
  const type    = typeMap[actiefTab];
  const items   = ITEMS.filter(i => i.type === type);

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
    statusHTML = `<span class="dzt-bezit">✓ In jouw tuin</span>`;
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
