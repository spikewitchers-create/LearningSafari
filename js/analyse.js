// Analyse van voortgang voor slimme suggesties
// Pure functie — geen DOM, geen opslag

// Alle onderdelen met hun pool en profiel-sleutel
// blok: vroeger blok = hogere urgentie bij onbeheerste items
export function analyseerOnderdelen(pools, beheersing) {
  return pools.map(({ key, label, pool, blok }) => {
    const items = pool;
    const gezien = items.filter(it => beheersing[it.id]);
    const beheerst = gezien.filter(it => beheersing[it.id].status === 'beheerst').length;
    const oefenen  = gezien.filter(it => beheersing[it.id].status === 'oefenen').length;
    const totFout  = gezien.reduce((s, it) => s + (beheersing[it.id].fout ?? 0), 0);
    const pctBeheerst = Math.round((beheerst / items.length) * 100);

    const nogNietGezien = items.length - gezien.length;
    // Eerder blok = hogere urgentie (blok 5 → gewicht 6, blok 10 → gewicht 1)
    const blokGewicht = blok ? Math.max(1, 11 - blok) : 3;
    const zwakheid = (nogNietGezien * 2 + oefenen * 3 + totFout) * blokGewicht;

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

// Weeknummer string "YYYY-WW" voor weekdoel-notificatie deduplicatie
export function huidigeWeekSleutel() {
  const nu = new Date();
  const dag = nu.getDay() || 7; // 1=ma ... 7=zo
  const maandag = new Date(nu);
  maandag.setDate(nu.getDate() - dag + 1);
  return maandag.toISOString().slice(0, 10); // "YYYY-MM-DD" van maandag
}

// Hoeveel unieke oefendagen zijn er al deze week (ma t/m zo)
export function berekenWeekVoortgang(oefenlog, doel = 3) {
  if (!oefenlog || oefenlog.length === 0) return { gedaan: 0, doel };
  const nu  = new Date();
  const dag = nu.getDay() || 7;
  const maandag = new Date(nu);
  maandag.setDate(nu.getDate() - dag + 1);
  maandag.setHours(0, 0, 0, 0);
  const mStr = maandag.toISOString().slice(0, 10);
  const dezeWeekDagen = new Set(oefenlog.filter(e => e.datum >= mStr).map(e => e.datum));
  return { gedaan: Math.min(dezeWeekDagen.size, doel), doel };
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
