// Statische, datierte Fakten zur mobile.de-Preisbewertung. Kein Abruf, kein Algorithmus-Nachbau, keine eigene Marktpreis-Zahl.
export const FAKTEN_GEPRUEFT_AM='2026-11-12';
export type Stufe='sehr_guter_preis'|'guter_preis'|'fairer_preis'|'erhoehter_preis'|'hoher_preis'|'ohne_bewertung';
export const STUFEN:readonly Stufe[]=['sehr_guter_preis','guter_preis','fairer_preis','erhoehter_preis','hoher_preis','ohne_bewertung'];
export interface ErklaerInput{stufe:Stufe;ausstattung_vollstaendig_angegeben?:boolean;garantie_im_feld_angegeben?:boolean;haendlerleistungen_im_text?:boolean;fahrzeug_selten_oder_alt?:boolean}
export interface TextbausteinInput{leistungen?:Array<'garantie'|'inzahlungnahme'|'gepruefte_fahrzeuge'|'aufbereitung'|'finanzierung'>}

export const disclaimer='Unabhängiges Tool, kein offizielles Produkt von mobile.de und nicht mit mobile.de verbunden. Keine Rechts- oder Preisberatung, kein Nachbau des mobile.de-Algorithmus, keine eigene Marktpreis-Zahl, kein Zugriff auf mobile.de oder eine mobile.de-API. Die genaue Berechnung veröffentlicht mobile.de nicht.';
export const scope='Arbeitet nur mit den übergebenen Angaben und statischen, datierten Fakten. Ruft keine Website ab, scrapt nichts, speichert nichts.';

const q=(titel:string,url:string,herausgeber:string,datum:string)=>({titel,url,herausgeber,datum,live_geprueft_am:FAKTEN_GEPRUEFT_AM});
export const quellen={
 newsroom_2017:q('mobile.de startet Produktoffensive: Preisbewertung, Finanzierung, Fahrzeugverkauf','https://newsroom.mobile.de/mobile-de-startet-produktoffensive-preisbewertung-finanzierung-fahrzeugverkauf/','mobile.de Newsroom','2017-09-06'),
 zdk_2018:q('Konstruktiver Dialog mit mobile.de (Pressemitteilung ZDK)','https://www.verbaende.com/news/pressemitteilung/konstruktiver-dialog-mit-mobile-de-121565/','Zentralverband Deutsches Kraftfahrzeuggewerbe (ZDK) via verbaende.com','2018-04-19'),
 kfz_betrieb_2025_07_16:q('Mobile startet neue KI-Preisbewertung – Händler kritisieren massiv','https://www.kfz-betrieb.vogel.de/mobile-startet-neue-ki-preisbewertung-haendler-kritisieren-massiv-a-c4fe1adc1d6e37b153260d25c4b5890a/','kfz-betrieb (Vogel Communications Group)','2025-07-16'),
 kfz_betrieb_2025_07_23:q('Mobile.de: Verschlechterte Preisbewertungen nur bei „vereinzelten Händlern“','https://www.kfz-betrieb.vogel.de/mobilede-verschlechterte-preisbewertungen-nur-bei-vereinzelten-haendlern-a-88fc36ce3fd49b3e92da4524f0216bfa/','kfz-betrieb (Vogel Communications Group)','2025-07-23'),
 carfalke_2026:q('Preisbewertung bei mobile.de und AutoScout24 erklärt','https://carfalke.de/de/ratgeber/preisbewertung-mobile-de-autoscout24-erklaert','CarFalke GmbH (Anbieter einer Händler-Marktsuche)','2026-11-04'),
 a21social_2026:q('mobile.de-Preisbewertung deaktivieren: Was 2026 möglich ist','https://a21social.com/blog/mobile-de-preisbewertung-deaktivieren','A21 Social (Anbieter von Fahrzeugvideo-Software)','2026-10-31')
} as const;
type QKey=keyof typeof quellen;
const fakt=(id:string,aussage:string,stand:string,belege:QKey[],hinweis?:string)=>({id,aussage,stand,quellen:belege.map(k=>quellen[k].url),...(hinweis?{hinweis}:{})});

export const fakten=[
 fakt('ankuendigung_2017','mobile.de kündigte am 06.09.2017 an, „ab Herbst“ bei allen Gebrauchtfahrzeugen eine datenbasierte Preisbewertung anzuzeigen. Ein Algorithmus ermittle einen aktuellen Marktpreis für das Modell und berücksichtige „unter anderem relevante Ausstattungsmerkmale sowie regionale und saisonale Effekte“.','2017-09-06',['newsroom_2017']),
 fakt('einfuehrung_ende_2017','Laut ZDK wurde die fünfstufige Preisbewertung Ende 2017 eingeführt; kfz-betrieb schreibt, mobile.de bewerte die Händlerpreise seit 2017 in einem Ampelsystem.','2018-04-19',['zdk_2018','kfz_betrieb_2025_07_16']),
 fakt('stufen_2018','Skala laut ZDK (April 2018): „sehr guter Preis“, „guter Preis“, „angemessener Preis“, „erhöhter Preis“, „hoher Preis“. mobile.de kündigte an, „angemessener Preis“ kurzfristig in „fairer Preis“ umzubenennen.','2018-04-19',['zdk_2018']),
 fakt('stufen_2026','Eine Händler-Software-Seite (CarFalke, 04.11.2026) nennt fünf Stufen: „Sehr guter Preis“, „Guter Preis“, „Fairer Preis“, „Erhöhter Preis“, „Hoher Preis“. Fahrzeuge mit zu wenigen Vergleichen bleiben laut CarFalke ohne Bewertung.','2026-11-04',['carfalke_2026'],'Keine offizielle mobile.de-Quelle für 2026 live gefunden; A21 Social schreibt, für 2026 seien nur die Endpunkte „Sehr guter Preis“ und „Hoher Preis“ belegt. Aktuelle Bezeichnungen im eigenen Händlerbereich prüfen.'),
 fakt('attribute_und_mindestmenge_2018','Laut ZDK (April 2018) erklärte mobile.de, die Bewertung beruhe auf 70 Attributen, ein selbstlernender Algorithmus optimiere sie, und als Basis seien mindestens 300 vergleichbare Fahrzeuge nötig. Angekündigt war, die Attribute um etwa 70 weitere zu verdoppeln.','2018-04-19',['zdk_2018'],'Historischer Stand 2018. Ob die Mindestmenge von 300 nach der KI-Umstellung 2025 noch gilt, ist nicht öffentlich belegt.'),
 fakt('haendlerkritik_2018','Händler kritisierten 2018 laut ZDK, die besonderen Qualitätsleistungen des Fabrikatshandels würden bei den Bewertungen nicht ausreichend berücksichtigt; eine vergleichsweise negative Preisbewertung sei für viele Kunden ein Ausstiegskriterium. Laut mobile.de gilt die Preisbewertung für alle Händler, unabhängig vom gebuchten Servicepaket.','2018-04-19',['zdk_2018']),
 fakt('ki_umstellung_2025','Zum 30. Juni (2025) führte mobile.de laut kfz-betrieb eine überarbeitete Preisbewertung auf Basis künstlicher Intelligenz ein. Händler rutschten mit ihren Preisbewertungen „teils massiv“ ab.','2025-07-16',['kfz_betrieb_2025_07_16']),
 fakt('reaktion_mobile_de_2025','Laut einem mobile.de-Sprecher (kfz-betrieb, 23.07.2025) betreffen verschlechterte Bewertungen nur „vereinzelte Händler“; die Funktion arbeite „deutlich präziser als zuvor“. Der KI-Mechanismus werde jetzt wöchentlich aktualisiert, und es seien mehr Fahrzeuge in die Bewertungsroutine einbezogen.','2025-07-23',['kfz_betrieb_2025_07_23'],'Folge der wöchentlichen Aktualisierung: Die Stufe kann sich ändern, ohne dass das Inserat geändert wurde.'),
 fakt('grenze_angebotspreise','Verglichen wird mit Angebotspreisen ähnlicher Inserate auf demselben Portal, nicht mit tatsächlichen Verkaufspreisen.','2026-11-04',['carfalke_2026']),
 fakt('grenze_ein_portal','Die Bewertung kennt nur die Angebote des eigenen Portals.','2026-11-04',['carfalke_2026']),
 fakt('grenze_ausstattung_zustand','Teure Pakete oder seltene Motorisierungen werden laut CarFalke nicht immer vollständig erfasst; ein gut ausgestattetes Auto kann deshalb „erhöht“ wirken. Zustand und Historie fließen nur begrenzt ein. Kleine Preisänderungen können ein Angebot eine Stufe verschieben.','2026-11-04',['carfalke_2026']),
 fakt('formel_nicht_oeffentlich','Die genaue Formel veröffentlicht mobile.de nicht.','2026-11-04',['carfalke_2026','a21social_2026'])
];

export const nichtBelegt=[
 'Prozentschwellen zwischen den Stufen (nicht öffentlich).',
 'Aktuelle Mindestzahl an Vergleichsfahrzeugen nach der KI-Umstellung 2025 (belegt ist nur „mindestens 300“, Stand 2018).',
 'Ob ein Garantie-Feld oder Händlerleistungen die heutige KI-Bewertung verändern.',
 'Offizielle mobile.de-Liste der Stufen-Bezeichnungen für 2026.'
];

const stufenInfo:Record<Stufe,{label:string;richtung:'unter'|'nahe'|'ueber'|'keine'}>={
 sehr_guter_preis:{label:'Sehr guter Preis',richtung:'unter'},guter_preis:{label:'Guter Preis',richtung:'unter'},fairer_preis:{label:'Fairer Preis',richtung:'nahe'},
 erhoehter_preis:{label:'Erhöhter Preis',richtung:'ueber'},hoher_preis:{label:'Hoher Preis',richtung:'ueber'},ohne_bewertung:{label:'Ohne Bewertung',richtung:'keine'}
};
export const heute=(d=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);

export function erklaerePreisbewertung(input:ErklaerInput,now=new Date()){
 const info=stufenInfo[input.stufe];
 const bedeutung={
  unter:'Der Angebotspreis liegt nach mobile.de-Einordnung unter dem Vergleichsniveau ähnlicher Angebote auf mobile.de. Laut CarFalke kann ein sehr niedriger Preis für Käufer auch ein Warnsignal sein.',
  nahe:'Der Angebotspreis liegt nach mobile.de-Einordnung etwa im Bereich ähnlicher Angebote auf mobile.de.',
  ueber:'Der Angebotspreis liegt nach mobile.de-Einordnung über dem Vergleichsniveau ähnlicher Angebote auf mobile.de. Das sagt nichts darüber, ob der Preis für dieses konkrete Fahrzeug gerechtfertigt ist.',
  keine:'Es wird keine Stufe angezeigt. Laut CarFalke bleiben Fahrzeuge mit zu wenigen Vergleichen ohne Bewertung; 2018 nannte mobile.de laut ZDK mindestens 300 vergleichbare Fahrzeuge als Basis (aktueller Wert nicht belegt).'
 }[info.richtung];
 const gruende:string[]=[];
 if(info.richtung==='ueber'||info.richtung==='nahe'){
  gruende.push('Verglichen werden Angebotspreise ähnlicher Inserate auf demselben Portal, nicht Verkaufspreise und nicht andere Portale (CarFalke).');
  gruende.push('Teure Pakete oder seltene Motorisierungen werden nicht immer vollständig erfasst; ein gut ausgestattetes Auto kann deshalb „erhöht“ wirken (CarFalke).');
  gruende.push('Zustand und Historie fließen nur begrenzt ein (CarFalke).');
  gruende.push('Seit der KI-Umstellung zum 30.06.2025 wird wöchentlich neu berechnet; die Stufe kann sich ohne Änderung am Inserat verschieben (kfz-betrieb, 16.07. und 23.07.2025).');
  gruende.push('Schon kleine Preisänderungen können ein Angebot eine Stufe verschieben (CarFalke).');
 }
 const hinweise:string[]=[];
 if(input.ausstattung_vollstaendig_angegeben===false)hinweise.push('Sie haben angegeben, dass die Ausstattung nicht vollständig im Inserat steht. mobile.de nannte 2017 Ausstattungsmerkmale als Teil der Berechnung; fehlende Merkmale können den Vergleich mit ähnlichen Angeboten verzerren. Zuerst die Ausstattung vollständig pflegen.');
 if(input.garantie_im_feld_angegeben===false)hinweise.push('Die Garantie steht nicht im dafür vorgesehenen Feld. Ob dieses Feld die heutige KI-Bewertung verändert, ist nicht öffentlich belegt. Für Käufer sichtbar macht es die Leistung trotzdem, die den Preis begründet.');
 if(input.haendlerleistungen_im_text===false)hinweise.push('Händlerleistungen stehen nicht im Inseratstext. Händler kritisierten schon 2018 (ZDK), dass Qualitätsleistungen in der Bewertung nicht ausreichend berücksichtigt werden. Leistungen deshalb für Käufer klar benennen (siehe Tool get_textbausteine_haendlerleistung).');
 if(input.fahrzeug_selten_oder_alt===true)hinweise.push('Bei seltenen oder alten Fahrzeugen gibt es weniger Vergleichsangebote. Dann kann die Bewertung fehlen oder auf wenigen Vergleichen beruhen.');
 const checkliste=[
  'Ausstattung vollständig und korrekt in den Merkmal-Feldern angeben, nicht nur im Freitext.',
  'Basisdaten prüfen: Erstzulassung, Laufleistung, Leistung, Kraftstoff, Getriebe, Vorbesitzer.',
  'Garantie, Prüfungen und Aufbereitung in den vorgesehenen Feldern und im Text nennen.',
  'Zustand und Historie (Scheckheft, Unfallfreiheit, HU) belegen, damit Käufer einen höheren Preis nachvollziehen können.',
  'Die Stufe an einem festen Tag pro Woche prüfen, weil mobile.de seit 2025 wöchentlich neu berechnet.',
  'Vor einer Preisänderung erst die Daten korrigieren, dann den Preis bewerten; die Preisentscheidung bleibt beim Betrieb.',
  'Dasselbe Fahrzeug auf anderen Portalen vergleichen; die Bewertung kennt nur das eigene Portal.'
 ];
 return {
  stufe:input.stufe,label:info.label,bedeutung,
  moegliche_gruende:gruende,
  hinweise_zu_ihren_angaben:hinweise,
  checkliste,
  nicht_belegt:nichtBelegt,
  quellen:Object.values(quellen),
  stand:heute(now),fakten_live_geprueft_am:FAKTEN_GEPRUEFT_AM,
  disclaimer,scope
 };
}
export function getFakten(now=new Date()){
 return {fakten,nicht_belegt:nichtBelegt,quellen:Object.values(quellen),stand:heute(now),fakten_live_geprueft_am:FAKTEN_GEPRUEFT_AM,hinweis:'Statische, datierte Fakten. Kein Live-Abruf. Vor Veröffentlichung die Quellen erneut prüfen. CarFalke und A21 Social sind Anbieter mit eigenem Produktinteresse.',disclaimer,scope};
}
const BAUSTEINE:Record<NonNullable<TextbausteinInput['leistungen']>[number],string[]>={
 garantie:['Inklusive [GARANTIEDAUER] Monate Gebrauchtwagengarantie über [GARANTIEGEBER]; Umfang laut Garantiebedingungen.','Garantie: [GARANTIEDAUER] Monate, Bedingungen senden wir Ihnen gern vorab.'],
 inzahlungnahme:['Inzahlungnahme Ihres Fahrzeugs möglich – Bewertung vor Ort in [ORT] nach Terminvereinbarung.','Wir nehmen Ihr bisheriges Fahrzeug nach Besichtigung in Zahlung.'],
 gepruefte_fahrzeuge:['Fahrzeug vor Verkauf durch unsere Werkstatt geprüft (Prüfprotokoll vom [DATUM] auf Anfrage).','Geprüft nach [PRUEFUMFANG]; HU neu bzw. gültig bis [HU_DATUM].'],
 aufbereitung:['Professionell aufbereitet: [LEISTUNGEN_AUFBEREITUNG].'],
 finanzierung:['Finanzierung über [BANK] möglich; Konditionen nach Bonitätsprüfung, Angebot auf Anfrage.']
};
export function getTextbausteine(input:TextbausteinInput,now=new Date()){
 const keys=input.leistungen?.length?[...new Set(input.leistungen)]:Object.keys(BAUSTEINE) as Array<keyof typeof BAUSTEINE>;
 return {
  bausteine:keys.map(k=>({leistung:k,vorschlaege:BAUSTEINE[k]})),
  hinweis:'Vorschläge, keine Garantie für eine bessere Preisbewertung. Platzhalter in [ECKIGEN KLAMMERN] durch eigene, zutreffende Angaben ersetzen; nur Leistungen nennen, die der Betrieb tatsächlich erbringt. Wettbewerbsrechtliche Prüfung bleibt beim Betrieb.',
  stand:heute(now),disclaimer,scope
 };
}
