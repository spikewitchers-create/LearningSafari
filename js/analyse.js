// Analyse van voortgang voor slimme suggesties
// Pure functie — geen DOM, geen opslag

// Alle onderdelen met hun pool en profiel-sleutel
// Wordt aangeroepen met de geladen pools als argument zodat er geen circulaire import is
export function analyseerOnderdelen(pools, beheersing) {
  return pools.map(({ key, label, pool }) => {
    const items = pool;
    const gezien = items.filter(it => beheersing[it.id]);
    const beheerst = gezien.filter(it => beheersing[it.id].status === 'beheerst').length;
    const oefenen  = gezien.filter(it => beheersing[it.id].status === 'oefenen').length;
    const totFout  = gezien.reduce((s, it) => s + (beheersing[it.id].fout ?? 0), 0);
    const pctBeheerst = Math.round((beheerst / items.length) * 100);

    // Zwakheid: hogere score = meer aandacht nodig
    // Nog-niet-geziene items tellen zwaar (potentieel gat)
    // Items in 'oefenen' met fouten tellen ook zwaar
    const nogNietGezien = items.length - gezien.length;
    const zwakheid = nogNietGezien * 2 + oefenen * 3 + totFout;

    return { key, label, pool, beheerst, oefenen, gezien: gezien.length,
             totaal: items.length, pctBeheerst, zwakheid };
  }).sort((a, b) => b.zwakheid - a.zwakheid);
}

// Geef de top-N zwakste onderdelen terug (minimale drempel: niet al >80% beheerst)
export function zwaksteOnderdelen(analyse, n = 3) {
  return analyse.filter(o => o.pctBeheerst < 80).slice(0, n);
}

// Bereken sessie-sterren (1–3) op basis van scorepercentage
export function berekenSterren(score, totaal) {
  const pct = totaal > 0 ? score / totaal : 0;
  if (pct >= 1.0)   return 3;
  if (pct >= 0.70)  return 2;
  return 1;
}

// Bereken huidige dagstreak vanuit oefenlog
export function berekenStreak(oefenlog) {
  if (!oefenlog || oefenlog.length === 0) return 0;
  const vandaag = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let check = new Date(vandaag);
  const datumSet = new Set(oefenlog.map(e => e.datum));
  while (datumSet.has(check.toISOString().slice(0, 10))) {
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

// Mijlpalen op basis van totaal beheerste feiten
const MIJLPALEN = [
  { drempel: 10,  label: '10 feiten',   icoon: '⭐' },
  { drempel: 25,  label: '25 feiten',   icoon: '🌟' },
  { drempel: 50,  label: '50 feiten',   icoon: '🏅' },
  { drempel: 100, label: '100 feiten',  icoon: '🥇' },
  { drempel: 150, label: '150 feiten',  icoon: '🏆' },
  { drempel: 200, label: '200 feiten',  icoon: '👑' },
  { drempel: 300, label: 'Alles!',      icoon: '🦁' },
];

export function haalMijlpalen(beheersing) {
  const totaal = Object.values(beheersing).filter(b => b.status === 'beheerst').length;
  return MIJLPALEN.map(m => ({ ...m, behaald: totaal >= m.drempel }));
}

// Geef de nieuw behaalde mijlpaal terug (net over de drempel gegaan)
export function nieuweMijlpaal(beheersing, nieuwBeheerst) {
  if (nieuwBeheerst === 0) return null;
  const totaal = Object.values(beheersing).filter(b => b.status === 'beheerst').length;
  const vorigeTotal = totaal - nieuwBeheerst;
  return MIJLPALEN.find(m => m.drempel > vorigeTotal && m.drempel <= totaal) ?? null;
}
