# LearningSafari — Architectuur

Canoniek startdocument. Plak dit in de projectmap. Het is leidend bij elke bouwstap.

## Wat het is
Rustige, kindvriendelijke leerapp voor het Nederlandse basisonderwijs. Start: groep 5,
thuisgebruik met een ouder/begeleider. Ontworpen voor rust, voorspelbaarheid, korte
sessies; dyslexie- en autismevriendelijk. Eerste vak: rekenen, eerste onderdeel: tafels.
Moet doorgroeien t/m groep 8 en later uitbreiden naar spelling en overige vakken.

## Stack
Vanilla HTML/CSS/JavaScript met ES-modules. Geen framework, geen build-stap. Opslag in
localStorage. Werkt lokaal/offline. Later optioneel PWA. Geen TypeScript (JSDoc op
kernfuncties volstaat).

## Drie lagen (groeien onafhankelijk)
1. **Kern (engine)** — profiel, leeritem, beheersing, sessie, beloning, feedback,
   navigatie. Eén keer gebouwd, verandert nauwelijks. Weet NIETS van tafels of vakken.
2. **Onderdelen (per vak)** — losse bestanden die opgaven genereren: `tafels.js`,
   `deelsommen.js`, `optellen-aftrekken.js`, ... Hier zit de groei groep 5→8: elk
   onderdeel is één klein bestand.
3. **Leerlijn (data)** — JSON-catalogus van leerdoelen per vak/leerjaar/blok/methode.
   Groeit puur door data toe te voegen, nul code.

## Het opgave-contract (de naad die meteen goed moet)
Elk onderdeel levert opgaven in deze vorm; de kern verwerkt ze zonder te weten welk vak:

    {
      vraag: "6 × 7",          // wat het kind ziet
      antwoord: "42",          // correcte antwoord
      leerdoel: "rek-tafels",  // koppeling naar de leerlijn
      hints: [],               // optioneel: oplopende hulp (zie Scaffolding)
      keuzes: []               // optioneel: meerkeuze i.p.v. typen (zie Expliciet later)
    }

`hints` en `keuzes` zijn optioneel en mogen in de MVP leeg of afwezig zijn. De kern moet
er alvast tegen kunnen, zodat ze later gratis te gebruiken zijn.

## Datamodel (klein houden)
- **Profiel** — naam, instellingen, leerjaar (default 5).
- **LeerItem** — één oefenbaar feit; stabiel id (bv. `tafel-6x7`); verwijst naar een leerdoel.
- **Beheersing** — per leeritem: goed, fout, laatst-geoefend, status (nieuw/oefenen/
  beheerst) en leerfase (begrijpen/oefenen/automatiseren/onderhouden — veld gereserveerd,
  logica later).
- **Sessie** — ~10 opgaven, gekozen op beheersing (foute vaker terug, gemengd met
  beheerste voor succeservaring).
- **Oefenlog** — per oefendag: datum, aantal sessies, nieuw beheerste items. Vanaf de MVP
  meeschrijven (voedt zowel adaptiviteit als de dierentuin).
- **Dierentuin** — afgeleid van voortgang; zie Belonglaag.

Opslag is JSON met een versienummer, zodat latere migratie mogelijk is.

## Adaptiviteit (data nu, logica later)
- **Foutfocus**: Beheersing legt goed/fout/laatst-geoefend vast; foute items komen vaker
  terug, gemengd met beheerste. Groeit later naar spaced-repetition (korter interval na
  fout, langer na beheersing) zonder herbouw — de benodigde data wordt al vastgelegd.
- **Leerfase** bepaalt later hoeveel hulp standaard wordt aangeboden (begripsfase = meer
  hulp, automatiseren = minder).

## Hulp / scaffolding (naad nu, bouwen later)
Een opgave mag een oplopende reeks `hints` dragen, eventueel met een `strategie`-
verwijzing. De kern toont een hulp-knop die telkens de volgende hint laat zien.
Methode-specifiek: hintteksten noemen de strategie uit de methode — Pluspunt (rijgen,
splitsen, aanvullen, omkeren, halveren/verdubbelen, keersom zoeken), Staal (de betreffende
categorie). Hints zijn data, geen code. MVP: het contract staat hints toe, maar tafels
krijgt nog geen of hooguit één simpele hint.

## Belonglaag — dierentuin (consument van voortgang; raakt de kern niet)
- De dierentuin groeit uit voortgangsdata (sessies, beheerste onderdelen, oefendagen uit
  het Oefenlog). Welk dier/gebied vrijkomt bij welke mijlpaal staat in een **config-tabel
  als data**, niet in code, zodat motivatie te tunen is zonder de kern te raken.
- **Korte termijn**: per sessie/onderdeel groeit de dierentuin.
- **Lange termijn**: zachte doelen ("deze week 3× geoefend", "nog 2 dieren tot het
  savanne-gebied vol is") in plaats van harde streaks die naar nul resetten. Dat past bij
  rust en geen prestatiedruk, en voorkomt streak-stress bij deze doelgroep.
  **De dierentuin gaat nooit achteruit.**
- De dierentuin-UI bouw je later; het Oefenlog dat hem voedt loopt vanaf de MVP mee.

## Velden voor groei (nu in data, logica later)
`vak`, `onderdeel`, `leerjaar (5–8)` op leerdoelen en op het profiel. Filteren op leerjaar
bouwen we pas bij groep 6 — de velden staan dan al, dus geen herbouw.

## Mappenstructuur (MVP, ~7 bestanden)

    index.html                  schermen als verborgen secties
    styles.css                  rustige stijl, grote knoppen, dyslexievriendelijk
    js/app.js                   start + navigatie
    js/storage.js               laden/opslaan (JSON met versienummer) + oefenlog
    js/session.js               opgaven kiezen + antwoorden verwerken (kent geen tafels)
    js/onderdelen/tafels.js     genereert tafel-opgaven
    data/leerlijn-groep5.json   catalogus van leerdoelen

## UX-grondregels (standaardgedrag, geen latere optie)
Geen tijdsdruk. Korte oefenblokken. Grote duidelijke knoppen. Korte zinnen. Weinig
visuele ruis. Geen harde geluiden. Geen strafpunten. Vriendelijke feedback bij fouten,
rustige beloning. Kind ziet alleen de oefensessie; ouder bereikt instellingen/voortgang
via een onopvallende knop.

## Werkafspraken bij coderen (token-zuinig)
- Kleine, op zichzelf staande stappen, elk één git-commit waard. Wacht na elke stap op
  bevestiging dat het werkt.
- Geef ALLEEN gewijzigde blokken/diffs, nooit hele bestanden opnieuw. Plak geen bestanden
  terug die je al gelezen hebt.
- Bestanden klein houden (< ~200 regels).
- Kernlogica (opgaven kiezen, beheersing bijwerken) als pure functies: invoer → uitvoer,
  geen DOM, geen opslag. Los testbaar.
- Git voor undo (terugdraaien kost geen tokens). Pas committen als het werkt.

## Bouwvolgorde
1. Kern-skelet + tafels-onderdeel, tafels écht goed (selectie + rustige feedback +
   beheersing + oefenlog meeschrijven).
2. Onderdeel voor onderdeel verbreden (deelsommen, optellen/aftrekken, klokkijken, geld,
   breuken...).
3. Ouderscherm met voortgang per onderdeel.
4. Hulp/scaffolding (hints als data) en de dierentuin-UI.
5. Pas bij groep 6: leerjaar-filtering aanzetten.

## Expliciet LATER (niet in MVP)
Meerdere profielen, PWA, geluid, methodekoppeling (= alleen data), export/import van
voortgang, meerkeuze-onderdelen, spelling-vak, spaced-repetition, dierentuin-UI,
hint-systeem. Hun naden zijn gereserveerd; de bouw komt later.
