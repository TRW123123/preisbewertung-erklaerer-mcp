import {describe,it,expect} from 'vitest';
import {erklaerePreisbewertung,getFakten,getTextbausteine,heute,STUFEN,quellen,fakten,FAKTEN_GEPRUEFT_AM,disclaimer} from '../src/logic';
import {validate,erklaerInput,textbausteinInput,faktenInput} from '../src/schema';
const all=(o:unknown)=>JSON.stringify(o);
describe('erklaere_preisbewertung',()=>{
 it.each(STUFEN)('liefert für %s Label, Bedeutung, Checkliste, Quellen und Disclaimer',s=>{const r=erklaerePreisbewertung({stufe:s});expect(r.label.length).toBeGreaterThan(3);expect(r.bedeutung.length).toBeGreaterThan(20);expect(r.checkliste.length).toBeGreaterThanOrEqual(5);expect(r.quellen.length).toBe(6);expect(r.disclaimer).toBe(disclaimer);expect(r.nicht_belegt.length).toBeGreaterThan(0);});
 it('nennt bei erhöhtem Preis die belegten Grenzen',()=>{const r=erklaerePreisbewertung({stufe:'erhoehter_preis'});expect(r.label).toBe('Erhöhter Preis');expect(all(r.moegliche_gruende)).toContain('Angebotspreise');expect(all(r.moegliche_gruende)).toContain('30.06.2025');expect(all(r.moegliche_gruende)).toContain('wöchentlich');});
 it('gibt bei sehr gutem Preis keine Herabstufungsgründe',()=>expect(erklaerePreisbewertung({stufe:'sehr_guter_preis'}).moegliche_gruende).toEqual([]));
 it('erklärt ohne_bewertung mit der Mindestmenge 2018 als historisch',()=>{const r=erklaerePreisbewertung({stufe:'ohne_bewertung'});expect(r.bedeutung).toContain('300');expect(r.bedeutung).toContain('2018');expect(r.bedeutung).toContain('nicht belegt');});
 it('ergänzt Hinweise nur für die gemeldeten Lücken',()=>{expect(erklaerePreisbewertung({stufe:'hoher_preis'}).hinweise_zu_ihren_angaben).toEqual([]);const r=erklaerePreisbewertung({stufe:'hoher_preis',ausstattung_vollstaendig_angegeben:false,garantie_im_feld_angegeben:false,haendlerleistungen_im_text:false,fahrzeug_selten_oder_alt:true});expect(r.hinweise_zu_ihren_angaben).toHaveLength(4);expect(all(r.hinweise_zu_ihren_angaben)).toContain('nicht öffentlich belegt');const ok=erklaerePreisbewertung({stufe:'hoher_preis',ausstattung_vollstaendig_angegeben:true,garantie_im_feld_angegeben:true,haendlerleistungen_im_text:true,fahrzeug_selten_oder_alt:false});expect(ok.hinweise_zu_ihren_angaben).toEqual([]);});
 it('gibt keine Euro-Zahl, keinen Marktpreis und keine Prozentschwelle aus',()=>{for(const s of STUFEN){const t=all(erklaerePreisbewertung({stufe:s,ausstattung_vollstaendig_angegeben:false}));expect(t).not.toMatch(/\d\s?€|EUR|\d+\s?%/);}});
 it('koppelt das Stand-Datum an das Ausgabedatum (Europe/Berlin)',()=>{expect(erklaerePreisbewertung({stufe:'fairer_preis'},new Date('2027-01-05T10:00:00Z')).stand).toBe('2027-01-05');expect(heute(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01');expect(erklaerePreisbewertung({stufe:'fairer_preis'}).fakten_live_geprueft_am).toBe(FAKTEN_GEPRUEFT_AM);});
});
describe('get_preisbewertung_fakten',()=>{
 it('enthält die belegten Kernfakten mit Datum und Quelle',()=>{const r=getFakten();const t=all(r.fakten);for(const k of ['2017','30. Juni','300 vergleichbare','wöchentlich','fairer Preis','Angebotspreisen','eigenen Portals'])expect(t).toContain(k);for(const f of r.fakten){expect(f.stand).toMatch(/^\d{4}-\d{2}-\d{2}$/);expect(f.quellen.length).toBeGreaterThan(0);for(const u of f.quellen)expect(u).toMatch(/^https:\/\//);}});
 it('verweist nur auf definierte Quellen und markiert Anbieterquellen',()=>{const urls=new Set(Object.values(quellen).map(q=>q.url));for(const f of fakten)for(const u of f.quellen)expect(urls.has(u)).toBe(true);expect(getFakten().hinweis).toContain('Produktinteresse');for(const q of Object.values(quellen))expect(q.live_geprueft_am).toBe('2026-11-12');});
 it('führt nicht belegte Punkte offen auf',()=>expect(all(getFakten().nicht_belegt)).toContain('Prozentschwellen'));
});
describe('get_textbausteine_haendlerleistung',()=>{
 it('liefert ohne Eingabe alle fünf Leistungen',()=>expect(getTextbausteine({}).bausteine.map(b=>b.leistung)).toEqual(['garantie','inzahlungnahme','gepruefte_fahrzeuge','aufbereitung','finanzierung']));
 it('filtert und entdoppelt',()=>expect(getTextbausteine({leistungen:['garantie','garantie','inzahlungnahme']}).bausteine.map(b=>b.leistung)).toEqual(['garantie','inzahlungnahme']));
 it('markiert Vorschläge als keine Garantie und nutzt Platzhalter',()=>{const r=getTextbausteine({});expect(r.hinweis).toContain('keine Garantie für eine bessere Preisbewertung');expect(all(r.bausteine)).toMatch(/\[[A-Z_]+\]/);});
});
describe('Schema',()=>{
 it('akzeptiert gültige Eingaben',()=>{expect(()=>validate({stufe:'erhoehter_preis',garantie_im_feld_angegeben:false},erklaerInput)).not.toThrow();expect(()=>validate({},faktenInput)).not.toThrow();expect(()=>validate({leistungen:['garantie']},textbausteinInput)).not.toThrow();});
 it.each([[{} ,'fehlt'],[{stufe:'marktpreis'},'einer dieser Werte'],[{stufe:'erhoehter_preis',garantie_im_feld_angegeben:'ja'},'true oder false'],[{stufe:'erhoehter_preis',x:1},'unbekanntes Feld'],[[],'Objekt']])('lehnt %j ab',(v,msg)=>expect(()=>validate(v,erklaerInput)).toThrow(msg));
 it('lehnt falsche Textbaustein-Listen ab',()=>{expect(()=>validate({leistungen:'garantie'},textbausteinInput)).toThrow('Liste');expect(()=>validate({leistungen:['rabatt']},textbausteinInput)).toThrow('einer dieser Werte');expect(()=>validate({leistungen:Array(6).fill('garantie')},textbausteinInput)).toThrow('höchstens 5');expect(()=>validate({a:1},faktenInput)).toThrow('unbekanntes Feld');});
});
