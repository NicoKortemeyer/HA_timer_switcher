# Home Assistant: Eigene Integration und eigene Lovelace-Kachel für Einmal-Timer

## Ziel

Eine eigene Home-Assistant-Lösung, mit der man im Dashboard:

- eine Ziel-Entität auswählt, zum Beispiel `light.*` oder `switch.*`
- eine Aktion auswählt, zum Beispiel `einschalten` oder `ausschalten`
- eine Ausführung festlegt, entweder
  - **nach einer bestimmten Dauer** oder
  - **zu einer festen Uhrzeit**
- die Aktion **genau einmal** ausführen lässt

Das Ziel ist eine komfortable UI ohne manuelle Automationspflege pro Einzelfall.

---

## Empfohlene Architektur

Die Lösung sollte in zwei Teile getrennt werden:

### 1. Backend: Custom Integration

Die Integration übernimmt die Logik:

- Ziel speichern
- Zeitpunkt oder Countdown berechnen
- Ausführung planen
- Aktion genau einmal auslösen
- Zustand und Validierung verwalten

### 2. Frontend: Custom Lovelace Card

Die Card übernimmt nur die Bedienung:

- Ziel auswählen
- Aktion auswählen
- Zeit/Dauer konfigurieren
- Start-Button
- optional Statusanzeige für den geplanten Vorgang

Diese Trennung ist wichtig, weil sie die Lösung wartbar macht.

---

## Warum nicht alles nur in der Card?

Eine Card sollte möglichst keine Geschäftslogik enthalten. Sie ist nur UI.

Wenn du Logik in die Card packst, wird es schnell unübersichtlich:

- schwerer zu testen
- schwerer zu erweitern
- Logik landet im Browser statt im Backend
- keine saubere Trennung zwischen Darstellung und Funktion

Die Integration ist der richtige Ort für Planung, Zustandsverwaltung und Ausführung.

---

## Empfohlene Entitätsmodelle in Home Assistant

Für deinen Fall sind diese Bausteine sinnvoll:

### Option A: Eine `button`-Entity plus Helper-Entities

Das ist die pragmatischste Variante.

Beispiel:

- `input_select.timer_target`
- `input_select.timer_action`
- `input_number.timer_delay_minutes`
- `input_datetime.timer_at_time`
- `button.timer_start`

Die Integration hört auf den Button-Klick und startet dann die Planung.

### Option B: Eigene Entities in der Integration

Noch sauberer ist es, wenn die Integration eigene Entities bereitstellt:

- `button.schedule_once`
- `select.target_entity`
- `select.action`
- `number.delay_minutes`
- `datetime.run_at`
- `sensor.next_run`
- `sensor.state`

Das wirkt professioneller und lässt sich besser in Lovelace abbilden.

---

## Empfehlenswerte Logik in der Integration

Die Integration sollte mindestens diese Zustände und Schritte abbilden:

### Eingaben

- Ziel-Entität
- Aktion: `turn_on` / `turn_off`
- Modus:
  - `delay`
  - `absolute_time`
- Wert:
  - Minuten oder Sekunden
  - oder Datum/Uhrzeit

### Interne Verarbeitung

- Eingabe validieren
- berechnen, wann der Auslöser fällig ist
- Job oder Timer anlegen
- geplanten Lauf speichern
- nach Ausführung den Eintrag als erledigt markieren oder löschen

### Ausführung

- einen Home-Assistant-Service aufrufen, zum Beispiel:
  - `light.turn_on`
  - `light.turn_off`
  - `switch.turn_on`
  - `switch.turn_off`

---

## Sinnvolle Datenstruktur

Ein einfaches internes Modell könnte so aussehen:

```yaml
schedule_id: "uuid-oder-laufende-id"
entity_id: "light.wohnzimmer"
action: "turn_off"
mode: "delay"
run_at: "2026-05-11T21:30:00+02:00"
status: "scheduled"
```

Zusätzliche Felder sind oft nützlich:

- `created_at`
- `updated_at`
- `last_error`
- `last_run_at`
- `repeat: false`

---

## Was die Integration im Home-Assistant-Kontext tun sollte

### 1. Konfiguration

Der Nutzer muss im Dashboard bequem auswählen können:

- Gerät oder Entität
- Aktion
- Zeitpunkt oder Dauer

### 2. Planung

Die Integration erstellt intern eine einmalige Planung.

### 3. Ausführung

Zum Fälligkeitszeitpunkt ruft sie den richtigen Service auf.

### 4. Aufräumen

Nach erfolgreicher Ausführung:

- Status auf erledigt setzen
- geplante Aufgabe entfernen oder archivieren

---

## Welche Home-Assistant-Bausteine dafür passend sind

### Services

Sehr gut geeignet, um eine Aktion von außen auszulösen.

Beispiel:

- `custom_once_timer.start`
- `custom_once_timer.cancel`
- `custom_once_timer.preview`

### Button-Entity

Gut für einen Start-Trigger.

### Number / Select / Datetime Entities

Gut für die UI-Eingaben.

### Sensoren

Gut für Status, Restzeit und Fehleranzeige.

---

## Empfohlener Frontend-Aufbau der Custom Card

Die Card könnte so aussehen:

### Bereich 1: Ziel

- Dropdown für Entität
- optional Filter nach Domain: `light`, `switch`, `fan`

### Bereich 2: Aktion

- Auswahl `Ein` / `Aus`
- optional weitere Aktionen später

### Bereich 3: Zeit

- Modus `in X Minuten`
- oder `zu Uhrzeit`
- optional Datum bei Einmalplanung

### Bereich 4: Start

- Button `Start`
- Button `Abbrechen`

### Bereich 5: Status

- nächster Lauf
- Restzeit
- aktueller Zustand
- Fehlermeldungen

---

## Technische Hinweise für die Custom Card

Die Card sollte:

- Konfigurationsobjekt annehmen
- lokale Zustände sauber behandeln
- nur die Integration-Services aufrufen
- keine Planungslogik im Browser ausführen

Das macht die Lösung robuster.

---

## Vorschlag für die API zwischen Card und Integration

### Start

```json
{
  "entity_id": "light.wohnzimmer",
  "action": "turn_off",
  "mode": "delay",
  "delay_minutes": 15
}
```

Oder:

```json
{
  "entity_id": "switch.kaffeemaschine",
  "action": "turn_on",
  "mode": "absolute_time",
  "run_at": "2026-05-11T22:15:00+02:00"
}
```

### Abbrechen

```json
{
  "schedule_id": "uuid-oder-id"
}
```

### Status lesen

```json
{
  "schedule_id": "uuid-oder-id"
}
```

---

## Mögliche Entwicklungsreihenfolge

### Phase 1

Minimalversion:

- eine Integration
- ein Service `start`
- ein Service `cancel`
- ein einfacher Timer
- eine statische Lovelace-Karte

### Phase 2

Bessere Datenhaltung:

- Statussensoren
- Fehlerbehandlung
- mehrere laufende Timer
- Persistenz nach Neustart

### Phase 3

Schöne UI:

- Entity-Auswahl in der Card
- Validierung im Frontend
- Statusanzeige
- bessere Bedienung auf Mobilgeräten

### Phase 4

Erweiterungen:

- Benachrichtigungen
- Presets
- Wiederverwendung von Favoriten
- Verlauf

---

## Vorteile dieser Lösung

- keine manuelle Automation pro Fall
- UI direkt im Dashboard
- klare Trennung zwischen Logik und Bedienung
- gut erweiterbar
- professionell wartbar

---

## Risiken und Dinge, die man beachten sollte

- Nach einem Home-Assistant-Neustart müssen geplante Jobs wiederherstellbar sein.
- Die Integration sollte mit ungültigen Entitäten sauber umgehen.
- Die Card sollte keine Logik duplizieren, die bereits in der Integration lebt.
- Für mehrere parallele Timer braucht die Integration eine saubere ID-Verwaltung.

---

## Empfehlung für deinen konkreten Use Case

Wenn du genau das willst:

- ein Dashboard-Element
- Zielgerät auswählbar
- einmalige Ausführung
- kein manuelles Basteln mit einzelnen Automationen

Dann ist die beste Kombination:

1. **Custom Integration** für Planung und Ausführung
2. **Custom Lovelace Card** für die Bedienung
3. optional **Helper-Entities**, falls du schnell prototypen willst

---

## Nächster sinnvoller Schritt

Als Grundlage für die Umsetzung brauchst du als Erstes:

- ein klares Service-API-Design
- ein Datenmodell für einen geplanten Einmal-Job
- ein UI-Konzept für die Card

Wenn gewünscht, kann daraus als Nächstes direkt ein konkretes Projektgerüst werden:

- `manifest.json`
- `__init__.py`
- `services.yaml`
- `button.py` oder `entity.py`
- `custom card` in JavaScript oder TypeScript

