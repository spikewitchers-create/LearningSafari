// Alle localStorage-toegang zit hier. De rest van de app roept alleen deze functies aan.

const SLEUTEL = 'learningsafari';
const VERSIE = 1;

function leegData() {
  return {
    versie: VERSIE,
    profiel: { naam: '', leerjaar: 5, tafels: true, tafelselectie: [1,2,3,4,5,6,7,8,9,10], deelsommen: false, optaft: false, verhaal: false, aantalSommen: 10, autoLees: false },
    beheersing: {},   // id → { goed, fout, rij, status, laatstGeoefend }
    oefenlog: []      // [{ datum, sessies, nieuwBeheerst }]
  };
}

export function laadData() {
  try {
    const raw = localStorage.getItem(SLEUTEL);
    if (!raw) return leegData();
    const data = JSON.parse(raw);
    if (data.versie !== VERSIE) return leegData(); // migratie later
    // Veld toegevoegd in latere versie — zet default als het ontbreekt
    if (data.profiel.tafels === undefined) data.profiel.tafels = true;
    if (!data.profiel.tafelselectie) data.profiel.tafelselectie = [1,2,3,4,5,6,7,8,9,10];
    if (data.profiel.deelsommen === undefined) data.profiel.deelsommen = false;
    if (data.profiel.optaft === undefined) data.profiel.optaft = false;
    if (data.profiel.verhaal === undefined) data.profiel.verhaal = false;
    if (data.profiel.aantalSommen === undefined) data.profiel.aantalSommen = 10;
    if (data.profiel.autoLees === undefined) data.profiel.autoLees = false;
    return data;
  } catch {
    return leegData();
  }
}

export function slaOp(data) {
  localStorage.setItem(SLEUTEL, JSON.stringify(data));
}

// Schrijft één oefendag-entry (of telt op bij bestaande entry van vandaag).
export function schrijfOefenlog(data, nieuwBeheerst) {
  const vandaag = new Date().toISOString().slice(0, 10);
  const bestaand = data.oefenlog.find(e => e.datum === vandaag);
  if (bestaand) {
    bestaand.sessies += 1;
    bestaand.nieuwBeheerst += nieuwBeheerst;
  } else {
    data.oefenlog.push({ datum: vandaag, sessies: 1, nieuwBeheerst });
  }
}
