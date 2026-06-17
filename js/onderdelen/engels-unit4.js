// Engels woordenschat — Unit 4 lesson 4 "Words to know"
// Richting: Engels → Nederlands (invullen, spelling telt)
// Toets: woensdag 24 juni

const WOORDEN = [
  { en: 'closed',              nl: 'dicht',              extra: ['gesloten'],                hint1: `"Closed" betekent dat iets niet open is — de winkel is ...`,                       hint2: `closed = dicht (of gesloten)` },
  { en: 'corner',              nl: 'hoek',               extra: [],                          hint1: `Een "corner" is de plek waar twee straten samenkomen: de ...`,                     hint2: `corner = hoek` },
  { en: 'crossroads',         nl: 'kruispunt',          extra: [],                          hint1: `Op een "crossroads" kruis je een andere straat — dat heet een ...`,                hint2: `crossroads = kruispunt` },
  { en: 'fun',                 nl: 'lol',                extra: ['pret'],                    hint1: `Als je "fun" hebt, heb je plezier — je hebt ...`,                                  hint2: `fun = lol (of pret)` },
  { en: 'happy',               nl: 'blij',               extra: [],                          hint1: `"Happy" is hoe je je voelt als alles goed gaat: je bent ...`,                     hint2: `happy = blij` },
  { en: 'left',                nl: 'links',              extra: [],                          hint1: `"Left" is de richting die tegenover "right" is: dat is ...`,                      hint2: `left = links` },
  { en: 'map',                 nl: 'kaart',              extra: ['plattegrond'],             hint1: `Met een "map" zie je hoe een stad er uitziet — een ...`,                          hint2: `map = kaart (of plattegrond)` },
  { en: 'middle',              nl: 'midden',             extra: [],                          hint1: `"Middle" is precies het centrum, precies het ...`,                                hint2: `middle = midden` },
  { en: 'open',                nl: 'open',               extra: [],                          hint1: `"Open" is het tegenovergestelde van "closed" — het is ...`,                      hint2: `open = open` },
  { en: 'park',                nl: 'park',               extra: [],                          hint1: `Een "park" is een groot groen gebied in de stad — een ...`,                      hint2: `park = park` },
  { en: 'playground',          nl: 'speelplaats',        extra: [],                          hint1: `Op een "playground" kunnen kinderen spelen — dat is een ...`,                     hint2: `playground = speelplaats` },
  { en: 'railway',             nl: 'spoorweg',           extra: [],                          hint1: `Op een "railway" rijden treinen — dat is een ...`,                                hint2: `railway = spoorweg` },
  { en: 'ride',                nl: 'rit',                extra: [],                          hint1: `Een "ride" is een korte reis, bijvoorbeeld in een auto: een ...`,                 hint2: `ride = rit` },
  { en: 'right',               nl: 'rechts',             extra: [],                          hint1: `"Right" is de richting die tegenover "left" is: dat is ...`,                     hint2: `right = rechts` },
  { en: 'road',                nl: 'weg',                extra: ['straat'],                  hint1: `Over een "road" rijden auto's — dat is een ... (of straat)`,                     hint2: `road = weg (of straat)` },
  { en: 'roller coaster',      nl: 'achtbaan',           extra: [],                          hint1: `Op een "roller coaster" ga je heel snel omhoog en omlaag — dat is een ...`,      hint2: `roller coaster = achtbaan` },
  { en: 'roundabout',          nl: 'rotonde',            extra: [],                          hint1: `Op een "roundabout" rijden auto's in een rondje — dat is een ...`,               hint2: `roundabout = rotonde` },
  { en: 'shop',                nl: 'winkel',             extra: [],                          hint1: `In een "shop" koop je dingen — dat is een ...`,                                  hint2: `shop = winkel` },
  { en: 'straight on',         nl: 'rechtdoor',          extra: [],                          hint1: `"Straight on" betekent: niet links, niet rechts — gewoon ...`,                   hint2: `straight on = rechtdoor` },
  { en: 'to buy',              nl: 'kopen',              extra: [],                          hint1: `"To buy" doe je in een winkel als je iets wil hebben: je wil het ...`,           hint2: `to buy = kopen` },
  { en: 'to enjoy',            nl: 'genieten',           extra: [],                          hint1: `"To enjoy" doe je als je ergens heel blij van wordt — dat is ...`,               hint2: `to enjoy = genieten` },
  { en: 'to follow',           nl: 'volgen',             extra: [],                          hint1: `"To follow" doe je als je iemand achterna loopt — je ...`,                       hint2: `to follow = volgen` },
  { en: 'to go back',          nl: 'teruggaan',          extra: [],                          hint1: `"To go back" betekent dat je de weg terug neemt — je gaat ...`,                  hint2: `to go back = teruggaan` },
  { en: 'to have a good time', nl: 'een leuke tijd hebben', extra: [],                       hint1: `"To have a good time" betekent dat je ervan geniet — je hebt ...`,               hint2: `to have a good time = een leuke tijd hebben` },
  { en: 'to turn right',       nl: 'rechts afslaan',     extra: ['naar rechts afslaan'],     hint1: `"To turn right" doe je als je de straat rechts in gaat — je slaat ...`,          hint2: `to turn right = rechts afslaan` },
  { en: 'to turn left',        nl: 'links afslaan',      extra: ['naar links afslaan'],      hint1: `"To turn left" doe je als je de straat links in gaat — je slaat ...`,            hint2: `to turn left = links afslaan` },
  { en: 'to walk',             nl: 'lopen',              extra: [],                          hint1: `"To walk" doe je op je benen, langzamer dan fietsen — dat is ...`,               hint2: `to walk = lopen` },
  { en: 'town',                nl: 'stad',               extra: [],                          hint1: `Een "town" is een grote woonplaats met winkels en straten — een ...`,            hint2: `town = stad` },
  { en: 'toy store',           nl: 'speelgoedwinkel',    extra: [],                          hint1: `In een "toy store" worden speeltjes verkocht — een ...`,                         hint2: `toy store = speelgoedwinkel` },
  { en: 'traffic',             nl: 'verkeer',            extra: [],                          hint1: `"Traffic" zijn alle auto's, fietsen en bussen op straat — dat is het ...`,       hint2: `traffic = verkeer` },
  { en: 'traffic light',       nl: 'verkeerslicht',      extra: [],                          hint1: `Een "traffic light" is rood, oranje of groen en regelt het verkeer — een ...`,  hint2: `traffic light = verkeerslicht` },
  { en: 'tree',                nl: 'boom',               extra: [],                          hint1: `Een "tree" staat in het park en heeft bladeren — een ...`,                       hint2: `tree = boom` },
];

export function genereerItems() {
  return WOORDEN.map(w => ({
    id: `engels-u4-${w.en.replace(/\s+/g, '-')}`,
    vraag: `Hoe zeg je "${w.en}" in het Nederlands?`,
    antwoord: w.nl,
    extraAntwoorden: w.extra,
    leerdoel: `Engels woordenschat Unit 4`,
    hints: [w.hint1, w.hint2],
    invoerType: 'tekst',
  }));
}
