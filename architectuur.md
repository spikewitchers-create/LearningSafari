# LearningSafari — Architectuur & Curriculum

## Curriuclum Groep 5 (Pluspunt rekenen) — blokindeling

Bron: ouderbrieven kerst→voorjaar, voorjaar→mei, mei→zomer.

### BLOK 5 (kerst → voorjaar)
| Leerdoel | Module | Status |
|---|---|---|
| Optellen & aftrekken t/m 1000, max 3 sprongen, strategie: rijgen | `optellen-aftrekken.js` (rijgen) | ✅ |
| Optellen t/m 1000, max 2 sprongen, strategie: rijgen | `optellen-aftrekken.js` (rijgen) | ✅ |
| Deelsom uitrekenen met een keersom | `deelsommen.js` | ✅ |
| Tijd aflezen analoge klok bij 5 en 10 minuten over het halfuur | `klokkijken.js` | ✅ nieuw |

### BLOK 6 (kerst → voorjaar)
| Leerdoel | Module | Status |
|---|---|---|
| Aftrekken t/m 1000, max 2 sprongen, strategie: rijgen | `optellen-aftrekken.js` (rijgen-aft) | ✅ |
| 67×4 uitrekenen: omkeren + basisstrategie splitsen | `vermenigvuldigen.js` (splits) | ✅ |
| Deelsommen met rest, keersom strategie | `deelsommen-rest.js` | ✅ |
| Figuren (kubus, balk, bol, cilinder) en vormen benoemen | — | ❌ skip (visueel) |

### BLOK 7 (voorjaar → mei)
| Leerdoel | Module | Status |
|---|---|---|
| Optellen t/m 1000, strategie: splitsen | `optellen-aftrekken.js` (splits) | ✅ |
| Aftrekken t/m 1000, strategie: splitsen | `optellen-aftrekken.js` (splits) | ✅ |
| Deelsom met rest vlot, keersom zoeken | `deelsommen-rest.js` | ✅ |
| Jaarkalender aflezen, datum bepalen | `kalender.js` | ✅ nieuw |

### BLOK 8 (voorjaar → mei)
| Leerdoel | Module | Status |
|---|---|---|
| Aftrekken t/m 1000, strategie: aanvullen | `optellen-aftrekken.js` (aanvul) | ✅ |
| 4×69 variastrategie: te veel | `vermenigvuldigen.js` (te-veel) | ✅ |
| Deelsommen 80:4, 120:3 naar analogie (kleine som) | `deelsommen-analogie.js` | ✅ nieuw |
| Verschil en aanvullen tot hele euro's | `geld.js` | ✅ |

### BLOK 9 (mei → zomer)
| Leerdoel | Module | Status |
|---|---|---|
| Plussommen t/m 1000 "rijgen met te veel" (524+199→524+200) | `optellen-aftrekken.js` (tevel) | ✅ (zit al in tevel variant) |
| Minsommen t/m 1000 "rijgen met te veel" (618-298→618-300) | `optellen-aftrekken.js` (tevel) | ✅ (zit al in tevel variant) |
| Deelsommen 42:3 splitsen (30+12):3 | `deelsommen-splitsen.js` | ✅ |
| Lengtes in mm, cm, dm herleiden en meten | `lengtematen.js` | ✅ nieuw |

### BLOK 10 (mei → zomer)
| Leerdoel | Module | Status |
|---|---|---|
| Handig rekenen: lange optelsom (35+53+65 → eerst 35+65) | `handig-rekenen.js` | ✅ nieuw |
| Halveren & verdubbelen strategie (4×35 = 2×70) | `halveren-verdubbelen.js` | ✅ |
| Deelsommen 72:3 splitsen (60+12):3 | `deelsommen-splitsen.js` | ✅ |
| Stapel- en lijngrafieken aflezen | — | ❌ skip (visueel) |

### Doorlopend (alle blokken)
- Tafels automatiseren → `tafels.js` (prioriteit = blok 1, vroegst)
- Klokkijken herhalen → `klokkijken.js` (blok 5+)
- Verhalende sommen → `tafels-verhaal.js`

---

## Blok-prioritering in het adaptieve systeem

Eerder blok = hogere urgentie bij onbeheerste items:

```
blokGewicht = max(1, 11 - blok)
blok 1 (tafels) → gewicht 10
blok 5          → gewicht 6
blok 6          → gewicht 5
blok 7          → gewicht 4
blok 8          → gewicht 3
blok 9          → gewicht 2
blok 10         → gewicht 1
```

Formule: `zwakheid = (nogNietGezien*2 + oefenen*3 + totFout) * blokGewicht`

---

## Module-architectuur (JS)

### Opgave-contract
```js
{
  id: string,           // uniek, bijv. "klok-halfuur-3-5"
  vraag: string,        // weergegeven tekst
  antwoord: number,     // altijd een integer
  leerdoel: string,     // korte omschrijving
  hints: string[],      // max 3 hints, hint 2 = NOOIT het antwoord
  genereerVraag?: () => string  // optioneel: infinite variation
}
```

### Beheersing per item
```
nieuw    → nog niet gezien
oefenen  → gezien, rij < 3 opeenvolgend goed
beheerst → rij >= 3 opeenvolgend goed zonder hints
```

### ID-schema per module
| Module | ID-prefix | Voorbeeld |
|---|---|---|
| tafels | `tafel-` | `tafel-3x7` |
| deelsommen | `deelsom-` | `deelsom-12x3` |
| optellen-aftrekken | `optaft-` | `optaft-rijgen-opt-524-199` |
| vermenigvuldigen | `vermenigv-` | `vermenigv-splits-67-4` |
| deelsommen-rest | `deelrest-` | `deelrest-quot-17-3` |
| deelsommen-splitsen | `deelspl-` | `deelspl-42-3` |
| halveren-verdubbelen | `halverd-` | `halverd-halveer-36` |
| geld | `geld-` | `geld-aanvul1-3-45` |
| tafels-verhaal | `verhaal-` | `verhaal-3x7` |
| klokkijken | `klok-` | `klok-halfuur-3-5` |
| deelsommen-analogie | `deelanalog-` | `deelanalog-80-4` |
| lengtematen | `lengte-` | `lengte-cm2mm-5` |
| handig-rekenen | `handig-` | `handig-35-53-65` |
| kalender | `kalender-` | `kalender-daginmaand-maart` |

---

## Opslag (localStorage)

Sleutel: `learningsafari`, versie: 1 (nooit bumpen → veldmigratie).

```js
{
  versie: 1,
  profiel: {
    naam, leerjaar, tafels, tafelselectie, deelsommen, optaft, vermenigv,
    deelrest, deelsplits, halverd, geld, verhaal,
    klok,         // nieuw blok 5
    deelanalog,   // nieuw blok 8
    lengtematen,  // nieuw blok 9
    handigreken,  // nieuw blok 10
    kalender,     // nieuw blok 7
    aantalSommen, autoLees
  },
  beheersing: { [id]: { goed, fout, rij, status, laatstGeoefend } },
  oefenlog: [{ datum, sessies, nieuwBeheerst }],
  dierentuin: { punten, ontgrendeld: [], weekDoelSleutel }
}
```

---

## Staal spelling (Blok 4-8)

Toekomstige implementatie — aparte vak naast rekenen.

| Blok | Categorie | Voorbeeld |
|---|---|---|
| 4 | Apostrof-s-woord | 's morgens, 's middags |
| 4 | Verkleinwoord -etje | dingetje, zonnetje |
| 4 | Ei-plaat woorden | ei, bij, wij |
| 4 | Persoonsvorm (vraagproef) | Zij speelt → speelt zij? |
| 5 | Centwoord (c=s klank) | cent, citroen, cirkel |
| 5 | Apostrof-s-meervoud | auto's, menu's |
| 6 | Pech-versje woorden | pech, recht, licht |
| 6 | Voorzetsel | in, op, aan, bij |
| 6 | t(s)ie woord | politie, generatie |
| 6 | Ei-ij woorden (zonder plaat) | wijs, ijzer, fijn |
| 7 | Cola-woord (ou=oe) | cultuur, contant |
| 7 | Hulpwerkwoord + voltooid deelwoord | heeft gespeeld |
| 8 | Isch-woord | tropisch, magisch |
| 8 | Grondwoord + te/ste | droogte, droogste |

---

## Geplande uitbreidingen (prioriteitsvolgorde)

1. **Alle rekenen blok 5-10** — zie tabel boven (lopend)
2. **PWA** — manifest.json + service worker voor offline gebruik
3. **Meerdere profielen** — localStorage per profielnaam, switcher in nav
4. **Staal spelling** — aparte sectie, andere inputmodus (tekst)
5. **Klokkijken visueel** — SVG analoge klok naast tekstvraag
6. **Vormen & figuren** — meerkeuze (visueel)
7. **Grafieken** — stapel/lijn grafiek aflezen (visueel)
8. **Export/import voortgang** — JSON download/upload
