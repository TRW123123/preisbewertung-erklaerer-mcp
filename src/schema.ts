import {STUFEN} from './logic';
export type Schema={type?:string;description?:string;examples?:unknown[];properties?:Record<string,Schema>;items?:Schema;required?:string[];additionalProperties?:boolean;enum?:readonly unknown[];maxLength?:number;minLength?:number;minimum?:number;exclusiveMinimum?:number;maximum?:number;maxItems?:number;pattern?:string;default?:unknown};
// Kopie der Validierung aus standkosten-rechner, ergänzt um boolean und array.
export function validate(value:unknown,s:Schema,path='arguments'):void{
 if(s.type==='object'){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error(`${path} muss ein Objekt sein.`);
  const v=value as Record<string,unknown>;
  for(const k of s.required??[])if(!(k in v))throw Error(`${path}.${k} fehlt (Pflichtfeld).`);
  for(const [k,x] of Object.entries(v)){const child=s.properties&&Object.hasOwn(s.properties,k)?s.properties[k]:undefined;if(!child){if(s.additionalProperties===false)throw Error(`${path}: unbekanntes Feld ${k}.`);}else validate(x,child,`${path}.${k}`);}
 }else if(s.type==='string'){
  if(typeof value!=='string'||!value.trim()||Array.from(value).length>(s.maxLength??Infinity)||(s.pattern&&!new RegExp(s.pattern).test(value)))throw Error(`${path} muss ein nicht leerer Text sein (höchstens ${s.maxLength} Zeichen).`);
 }else if(s.type==='number'||s.type==='integer'){
  const lower=s.exclusiveMinimum!==undefined?`größer als ${s.exclusiveMinimum}`:`mindestens ${s.minimum}`;
  if(typeof value!=='number'||!Number.isFinite(value)||value<(s.minimum??-Infinity)||(s.exclusiveMinimum!==undefined&&value<=s.exclusiveMinimum)||value>(s.maximum??Infinity)||(s.type==='integer'&&!Number.isInteger(value)))throw Error(`${path} muss eine ${s.type==='integer'?'ganze Zahl':'Zahl'} sein, ${lower} und höchstens ${s.maximum}.`);
 }else if(s.type==='boolean'){
  if(typeof value!=='boolean')throw Error(`${path} muss true oder false sein.`);
 }else if(s.type==='array'){
  if(!Array.isArray(value)||value.length>(s.maxItems??Infinity))throw Error(`${path} muss eine Liste mit höchstens ${s.maxItems} Einträgen sein.`);
  value.forEach((x,i)=>s.items&&validate(x,s.items,`${path}[${i}]`));
 }
 if(s.enum&&!s.enum.includes(value))throw Error(`${path} muss einer dieser Werte sein: ${s.enum.join(', ')}.`);
}
const bool=(description:string):Schema=>({type:'boolean',description});
export const erklaerInput:Schema={type:'object',additionalProperties:false,required:['stufe'],properties:{
 stufe:{type:'string',description:'Angezeigte Stufe: sehr_guter_preis, guter_preis, fairer_preis, erhoehter_preis, hoher_preis oder ohne_bewertung.',examples:['erhoehter_preis'],enum:STUFEN,minLength:1,maxLength:30},
 ausstattung_vollstaendig_angegeben:bool('Optional: Ist die Ausstattung vollständig in den Merkmal-Feldern des Inserats angegeben?'),
 garantie_im_feld_angegeben:bool('Optional: Steht eine vorhandene Garantie im dafür vorgesehenen Feld?'),
 haendlerleistungen_im_text:bool('Optional: Werden Händlerleistungen (Garantie, Prüfung, Inzahlungnahme) im Inseratstext genannt?'),
 fahrzeug_selten_oder_alt:bool('Optional: Ist das Fahrzeug selten oder sehr alt (wenige Vergleichsangebote)?')
}};
export const faktenInput:Schema={type:'object',additionalProperties:false,properties:{}};
export const textbausteinInput:Schema={type:'object',additionalProperties:false,properties:{
 leistungen:{type:'array',description:'Optional: gewünschte Leistungen. Ohne Angabe kommen alle.',maxItems:5,items:{type:'string',enum:['garantie','inzahlungnahme','gepruefte_fahrzeuge','aufbereitung','finanzierung'],maxLength:30}}
}};
