// Visuele hint-generators — SVG-strings voor getallenlijn en driehoek

const W = 440, H = 92, LINEY = 62;

function _baseLijn(xs) {
  const x0 = xs[0] - 18, x1 = xs[xs.length - 1] + 18;
  return `<line x1="${x0}" y1="${LINEY}" x2="${x1}" y2="${LINEY}" stroke="#64748b" stroke-width="2.5"/>
          <polygon points="${x1},${LINEY} ${x1-8},${LINEY-4} ${x1-8},${LINEY+4}" fill="#64748b"/>`;
}

function _tick(x, kleur) {
  return `<line x1="${x}" y1="${LINEY-7}" x2="${x}" y2="${LINEY+7}" stroke="${kleur}" stroke-width="2"/>`;
}

function _label(x, tekst, kleur = '#1e293b', dy = 16) {
  return `<text x="${x}" y="${LINEY + dy}" text-anchor="middle" font-size="12" font-weight="bold" fill="${kleur}" font-family="Verdana,sans-serif">${tekst}</text>`;
}

function _boog(x1, x2, deltaTekst, positief) {
  const kleur = positief ? '#2563eb' : '#dc2626';
  const mx = (x1 + x2) / 2;
  const hoogte = Math.min(34, Math.max(20, (x2 - x1) * 0.32));
  const py = LINEY - hoogte;
  return `<path d="M ${x1},${LINEY} Q ${mx},${py} ${x2},${LINEY}" fill="none" stroke="${kleur}" stroke-width="2.5" stroke-linecap="round"/>
          <text x="${mx}" y="${py - 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="${kleur}" font-family="Verdana,sans-serif">${deltaTekst}</text>`;
}

function _xPosities(n) {
  const pad = 60;
  return Array.from({ length: n }, (_, i) => Math.round(pad + i * (W - 2 * pad) / (n - 1)));
}

/**
 * Getallenlijn met bogen.
 * stappen: [{ van, naar, delta: '+200', positief: true }, ...]
 */
export function getallenLijn(stappen) {
  const nummers = [stappen[0].van, ...stappen.map(s => s.naar)];
  const xs = _xPosities(nummers.length);

  let inner = _baseLijn(xs);
  for (let i = 0; i < nummers.length; i++) {
    const kleur = i === 0 ? '#1e293b' : (stappen[i - 1]?.positief ? '#2563eb' : '#dc2626');
    inner += _tick(xs[i], kleur);
    inner += _label(xs[i], nummers[i], kleur);
  }
  for (let i = 0; i < stappen.length; i++) {
    inner += _boog(xs[i], xs[i + 1], stappen[i].delta, stappen[i].positief);
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="hint-svg" aria-hidden="true">${inner}</svg>`;
}

/**
 * Driehoek/boogje voor handig rekenen.
 * a + k + b, waarbij a+b = rond (bijv. 100)
 */
export function driehoek(a, k, b, rond) {
  const W2 = 320, H2 = 88;
  // Posities: a links, k midden, b rechts, bovenste rij
  const xA = 48, xK = 160, xB = 272, yGetal = 36;
  const yBoog = 68; // boogje bevindt zich onder de getallen

  // Cirkelletterboxen voor elk getal
  function doos(x, y, getal, kleur) {
    return `<rect x="${x - 18}" y="${y - 16}" width="36" height="28" rx="7" fill="${kleur}" stroke="none"/>
            <text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" font-weight="bold" fill="white" font-family="Verdana,sans-serif">${getal}</text>`;
  }

  // Boogje die a en b verbindt (via halfronde bezier)
  const boogMidX = (xA + xB) / 2;
  const boogTop = yGetal + 12;
  const boog = `<path d="M ${xA},${boogTop} Q ${boogMidX},${yBoog + 8} ${xB},${boogTop}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="none" stroke-linecap="round"/>`;
  const boogLabel = `<text x="${boogMidX}" y="${yBoog + 22}" text-anchor="middle" font-size="11" font-weight="bold" fill="#2563eb" font-family="Verdana,sans-serif">= ${rond}</text>`;

  // Plus-tekens tussen getallen
  function plus(x, y) {
    return `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" fill="#64748b" font-family="Verdana,sans-serif">+</text>`;
  }

  const inner = doos(xA, yGetal, a, '#2563eb') +
    plus(xA + 30, yGetal) +
    doos(xK, yGetal, k, '#0284c7') +
    plus(xK + 30, yGetal) +
    doos(xB, yGetal, b, '#2563eb') +
    boog + boogLabel;

  return `<svg viewBox="0 0 ${W2} ${H2}" xmlns="http://www.w3.org/2000/svg" class="hint-svg" aria-hidden="true">${inner}</svg>`;
}
