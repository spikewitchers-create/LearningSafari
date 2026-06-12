// Dunne wrapper rond de Web Speech API (ingebouwd in moderne browsers).
// Gebruikt nl-NL stem; later ook bruikbaar voor spelling/dictee.

const OPTIES = { lang: 'nl-NL', rate: 0.88, pitch: 1.05, volume: 1 };

export function spreekUit(tekst) {
  if (!ttsWerkt()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(tekst);
  Object.assign(u, OPTIES);
  window.speechSynthesis.speak(u);
}

export function stopSpreek() {
  window.speechSynthesis?.cancel();
}

export function ttsWerkt() {
  return 'speechSynthesis' in window;
}
