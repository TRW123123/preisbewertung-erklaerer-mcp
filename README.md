# Preisbewertungs-Erklärer (MCP-Server)

Remote-MCP-Server für Autohäuser im DACH-Raum: erklärt, was die Preisbewertung eines mobile.de-Inserats bedeutet und warum ein Inserat herabgestuft wirken kann. Mit Checkliste, datierten Fakten und Quellen.

**Unabhängig.** Kein offizielles mobile.de-Produkt, nicht mit mobile.de verbunden. Kein Nachbau des Algorithmus, keine eigene Marktpreis-Zahl, kein Zugriff auf mobile.de oder eine mobile.de-API, keine Rechts- oder Preisberatung.

- Registry-Name (vorbereitet): `de.autohaus-video/preisbewertung-erklaerer`
- Website: https://autohaus-video.de
- Entwickler: Autohaus-Video (betrieben von Safak Tepecik)
- Lizenz: MIT
- Transport: Streamable HTTP, JSON-RPC 2.0 auf `POST /mcp`; `GET /health`; Protokollversionen 2025-03-26, 2025-06-18, 2025-11-25

## Status

**Öffentliche Preview (kostenlos, Netlify Function, gleicher Code):** `https://preisbewertung-erklaerer-mcp.netlify.app/mcp` – am 12.11.2026 per curl geprüft (health, initialize, tools/list, tools/call positiv und negativ, GET 405, OPTIONS 204). Adapter: `netlify/functions/mcp.ts`. Manueller Deploy, nicht mit GitHub verknüpft.

Version 0.1.0, gebaut und getestet am 12.11.2026, lokal mit `wrangler dev` geprüft. **Noch kein Production-Deploy**: die URL `https://preisbewertung-mcp.autohaus-video.de/mcp` in `server.json` ist ein Vorschlag und erst nach Cloudflare-Login und Safaks OK erreichbar.

## Tools

| Tool | Zweck |
|---|---|
| `erklaere_preisbewertung` | Eingabe `stufe` (`sehr_guter_preis`, `guter_preis`, `fairer_preis`, `erhoehter_preis`, `hoher_preis`, `ohne_bewertung`), optional `ausstattung_vollstaendig_angegeben`, `garantie_im_feld_angegeben`, `haendlerleistungen_im_text`, `fahrzeug_selten_oder_alt` (true/false). Ausgabe: `label`, `bedeutung`, `moegliche_gruende`, `hinweise_zu_ihren_angaben`, `checkliste`, `nicht_belegt`, `quellen`, `stand`, `disclaimer`. |
| `get_preisbewertung_fakten` | Datierte Fakten mit Quellen-URL je Fakt, dazu eine Liste nicht belegter Punkte. |
| `get_textbausteine_haendlerleistung` | Textvorschläge mit Platzhaltern für Garantie, Inzahlungnahme, geprüfte Fahrzeuge, Aufbereitung, Finanzierung. Vorschläge, keine Garantie für eine bessere Bewertung. |

`stand` ist das Ausgabedatum (Europe/Berlin), `fakten_live_geprueft_am` das Datum der letzten Quellenprüfung.

## Belegte Fakten (live geprüft am 12.11.2026)

- mobile.de Newsroom, 06.09.2017: Preisbewertung „ab Herbst“ für alle Gebrauchtfahrzeuge; Marktpreis per Algorithmus, berücksichtigt u. a. Ausstattungsmerkmale sowie regionale und saisonale Effekte. https://newsroom.mobile.de/mobile-de-startet-produktoffensive-preisbewertung-finanzierung-fahrzeugverkauf/
- ZDK via verbaende.com, 19.04.2018: fünfstufige Bewertung, Ende 2017 eingeführt; Stufen damals „sehr guter / guter / angemessener / erhöhter / hoher Preis“, Umbenennung „angemessener“ → „fairer Preis“ angekündigt; 70 Attribute; mindestens 300 vergleichbare Fahrzeuge; gilt für alle Händler unabhängig vom Paket; Händlerkritik an fehlender Berücksichtigung von Qualitätsleistungen. https://www.verbaende.com/news/pressemitteilung/konstruktiver-dialog-mit-mobile-de-121565/
- kfz-betrieb, 16.07.2025: KI-Preisbewertung zum 30. Juni (2025), Ampelsystem seit 2017, Händler rutschen „teils massiv“ ab. https://www.kfz-betrieb.vogel.de/mobile-startet-neue-ki-preisbewertung-haendler-kritisieren-massiv-a-c4fe1adc1d6e37b153260d25c4b5890a/
- kfz-betrieb, 23.07.2025: laut mobile.de nur „vereinzelte Händler“ betroffen; wöchentliche Aktualisierung; mehr Fahrzeuge einbezogen. https://www.kfz-betrieb.vogel.de/mobilede-verschlechterte-preisbewertungen-nur-bei-vereinzelten-haendlern-a-88fc36ce3fd49b3e92da4524f0216bfa/
- CarFalke, 04.11.2026 (Anbieter): fünf Stufen inkl. „Fairer Preis“; Angebots- statt Verkaufspreise; nur ein Portal; Ausstattung nicht immer vollständig erfasst; ohne ausreichende Vergleiche keine Bewertung. https://carfalke.de/de/ratgeber/preisbewertung-mobile-de-autoscout24-erklaert
- A21 Social, 31.10.2026 (Anbieter): Formel nicht öffentlich; für 2026 nur Endpunkte der Skala belegt. https://a21social.com/blog/mobile-de-preisbewertung-deaktivieren

Nicht belegt und deshalb nicht behauptet: Prozentschwellen, aktuelle Mindest-Vergleichsmenge nach 2025, Einfluss eines Garantie-Felds auf die KI-Bewertung, offizielle Stufenliste 2026.

## Lokal starten und testen

```bash
npm ci
npm run typecheck
npm test
npm run secret-scan
npm run dev            # wrangler dev auf http://127.0.0.1:8794, ohne Cloudflare-Login
bash scripts/smoke.sh  # zweites Terminal
```

## Production (offen)

Braucht einen gültigen Cloudflare-Login und Safaks OK für eine Subdomain. Danach `npx wrangler deploy`, Custom Domain setzen, `scripts/smoke.sh https://…`, dann Registry-Eintrag.
