// Dunne wrapper rond de Web Speech API (ingebouwd in moderne browsers).

const OPTIES = { lang: 'nl-NL', rate: 0.88, pitch: 1.05, volume: 1 };

// Stemmen laden asynchroon in Chrome — wacht op voiceschanged
let _stemmenGeladen = false;

function _checkVoices() {
  if (!('speechSynthesis' in window)) return;
  _stemmenGeladen = speechSynthesis.getVoices().length > 0;
}

if ('speechSynthesis' in window) {
  _checkVoices();
  speechSynthesis.addEventListener('voiceschanged', () => {
    _checkVoices();
    // Herlaad de lees-knop als TTS nu beschikbaar is tijdens een opgave
    document.dispatchEvent(new CustomEvent('tts-beschikbaar'));
  });
}

export function ttsWerkt() {
  return _stemmenGeladen;
}

export function spreekUit(tekst) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(tekst);
  Object.assign(u, OPTIES);
  // Geef voorkeur aan een Nederlandse stem als die beschikbaar is
  const nlStem = speechSynthesis.getVoices().find(v => v.lang.startsWith('nl'));
  if (nlStem) u.voice = nlStem;
  window.speechSynthesis.speak(u);
}

export function stopSpreek() {
  window.speechSynthesis?.cancel();
}
