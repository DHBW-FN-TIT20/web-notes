# WebNotes
WebNotes ist ein online Notiz-Tool mit dem Du Notizen erstellen, bearbeiten und mit deinen Freunden teilen kannst.<br/>
WebNotes wurde als Teil einer Prüfung im Modul Web Engineering an der [DHBW Friedrichshafen](https://www.ravensburg.dhbw.de/startseite) erstellt.

## Websites
| Name | Beschreibung |
| --- | --- |
| [web-notes.me](https://web-notes.me) | Liste der eigenen und geteilten Notizen mit Möglichkeit, eine neue Notiz zu erstellen
| [web-notes.me/getting-started](https://web-notes.me/getting-started) | Einführung in WebNotes |
| [web-notes.me/login](https://web-notes.me/login) | Login |
| [web-notes.me/register](https://web-notes.me/register) | Register |
| [web-notes.me/edit](https://web-notes.me/edit) | Editor der aktuell geöffneten Notiz (erstellt eine Neue Notiz beim direkten Betreten) |
| [web-notes.me/profile](https://web-notes.me/profile) | Einsicht und Änderung des Profils |

## Kompilieren und ausführen
> Hinweis: Um die Applikation lokal ausführen zu können, muss eine [Supabase](https://supabase.com) Datenbank zur Verfügung gestellt werden (siehe [Datenbank](#datenbank))
1. Repository clonen
1. [Node](https://nodejs.org/) und [NPM](https://www.npmjs.com/) installieren
1. Im Repository: benötigte Node-Packages installieren
    ```bash
    npm i
    ```
1. Den lokalen Server starten
    1. Development-Server - nach jedem Speichervorgang wird dynamisch aktualisiert
        ```bash
        npm run dev
        ```
    1. Production-Server - es wird ein optimierter Build erstellt, welcher anschließend gestartet wird
        ```bash
        npm run build
        npm run start
        ```
1. Der lokale Server steht unter dem [localhost mit Port 3000](http://localhost:3000/) zur Verfügung

## Datenbank
Als Datenbank wird [Supabase](https://supabase.com) verwendet.<br/>
Die Datenbank ist nach folgendem Schema aufgebaut:

### ERM
<img src="./readme/ERM.png" alt="erm" width="400">

### Data Dictionary
P: Primärschlüssel<br/>
F: Fremdschlüssel<br/>

#### **Note** Tabelle
| Attribut | Datentyp | NULL | Default | Schlüssel | Beschreibung |
| - | - | - | - | - | - |
| id | INTEGER | Nein | - | P | Auto-increment IDs |
| ownerID | INTEGER | Nein | - | F | User.id |
| modifiedAt | TIMESTAMP | Nein | now() | - | - |
| inUse | TEXT | Ja | NULL | F | User.name Username des aktuell bearbeitenden Users |
| title | VARCHAR | Nein |   | - | - |
| content | TEXT | Nein |   | - | - |

#### **User** Tabelle
| Attribut | Datentyp | NULL | Default | Schlüssel | Beschreibung |
| - | - | - | - | - | - |
| id | INTEGER | Nein | - | P | Auto-increment IDs |
| name | TEXT | Nein | - | - | - |
| password | TEXT | Nein | - | - | Gehasht |

#### **UserNoteRelation** Tabelle
| Attribut | Datentyp | NULL | Default | Schlüssel | Beschreibung |
| - | - | - | - | - | - |
| noteID | INTEGER | Nein | - | P, F | Note.id |
| userID | INTEGER | Nein | - | P, F | User.id |

## Lokale Umgebungsvariablen
Um lokale Variablen zu setzen muss im Root-Verzeichnis eine Datei namens *.env.local* angelegt werden.<br/>
Hier wird die DatenbankAPI eingebunden.<br/>
Dabei sind zwei Werte aus der Datenbank wichtig:<br/>
1. Supabase URL (Supabase -> Settings -> API: URL)
1. Supabase public key (Supabase -> Settings -> API: anon/public)

Zuätzlich muss ein Schlüssel für die Token-Verschlüsselung gewählt werden (beliebige Reihenfolge von Zeichen).

### .env.local
```
NEXT_PUBLIC_SUPABASE_URL="<Supabase URL>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<Supabase public key>"
TOKEN_KEY="<Schlüssel>"
```


## Autoren
* Johannes Brandenburger / [github](https://github.com/johannesbrandenburger) / [E-Mail](mailto:brandenburger-it20@it.dhbw-ravensburg.de?cc=schuler.henry-it20@it.dhbw-ravensburg.de;braun.lukas-it20@it.dhbw-ravensburg.de&amp;subject=[GitHub]%20WebNotes)
* Lukas Braun / [github](https://github.com/lukbra0108) / [E-Mail](mailto:braun.lukas-it20@it.dhbw-ravensburg.de?cc=schuler.henry-it20@it.dhbw-ravensburg.de;brandenburger-it20@it.dhbw-ravensburg.de&amp;subject=[GitHub]%20WebNotes)
* Henry Schuler / [github](https://github.com/schuler-henry) / [E-Mail](mailto:schuler.henry-it20@it.dhbw-ravensburg.de?cc=brandenburger-it20@it.dhbw-ravensburg.de;braun.lukas-it20@it.dhbw-ravensburg.de&amp;subject=[GitHub]%20WebNotes)

## [Lizenz](LICENSE)
MIT License

Copyright (c) 2022 DHBW-FN-TIT20

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.