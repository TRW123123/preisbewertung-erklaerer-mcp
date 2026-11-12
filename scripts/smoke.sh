#!/usr/bin/env bash
# Lokaler MCP-Smoke: initialize, tools/list, tools/call positiv und negativ.
set -euo pipefail
base="${1:-http://127.0.0.1:8794}"
call() {
  curl --fail-with-body --silent --show-error --max-time 10 "$base/mcp" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' --data "$1"
  echo
}
curl --fail --silent --show-error --max-time 10 "$base/health"; echo
call '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"1"}}}'
call '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"erklaere_preisbewertung","arguments":{"stufe":"erhoehter_preis","ausstattung_vollstaendig_angegeben":false,"garantie_im_feld_angegeben":false}}}'
call '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_preisbewertung_fakten","arguments":{}}}'
call '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_textbausteine_haendlerleistung","arguments":{"leistungen":["garantie","inzahlungnahme"]}}}'
echo '# negativ (erwartet isError=true):'
call '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"erklaere_preisbewertung","arguments":{"stufe":"marktpreis"}}}'
