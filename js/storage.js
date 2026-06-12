// Alle localStorage-toegang zit hier. De rest van de app roept alleen deze functies aan.

const SLEUTEL = 'learningsafari';
const VERSIE = 1;

function leegData() {
  return {
    versie: VERSIE,
    profiel: { naam: '', leerjaar: 5, tafelselectie: [1,2,3,4,5,6,7,8,9,10] },
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
    if (!data.profiel.tafelselectie) data.profiel.tafelselectie = [1,2,3,4,5,6,7,8,9,10];
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
