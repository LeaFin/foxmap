Tutorial FoxMap
===================


Dieses Tutorial ist als Seminararbeit an der ZHAW entstanden. Es gliedert sich in eine Einleitung, in welcher das Ziel des Tutorials erläutert wird, eine kurze Übersicht der verwendeten Tools und den praktischen Teil, in welchem das Vorgehen Schritt für Schritt erklärt ist. Und zum Schluss gibt es noch einige weiterführende Informationen.

Einleitung
-------------

In diesem Tutorial soll eine einfache Kartenapplikation mit integrierter Funktion zur Standortbestimmung erarbeitet werden. Zum Schluss wird erklärt wie die Applikation in den Marketplace geladen werden kann. Diese Applikation soll als Beispiel erarbeitet werden und es dem Leser ermöglichen danach seine eigene App mit ähnlichem Voraussetzungen zu erstellen, ohne sich nochmals mit allen Grundlagen der Appentwicklung für Firefox OS auseinandersetzen zu müssen. Allerdings bietet Firefox OS dem Entwickler noch weitaus mehr Optionen, welche hier nicht abgedeckt werden. Somit soll dieses Tutorial nur als Hilfe zum Einstieg ins Thema gesehen werden.
Da  HTML, CSS und Javascript grundlegend sind für die Entwicklung für Firefox OS, sollte der Leser vor Bearbeitung des Tutorials schon über deren Grundkenntnisse verfügen.

Benötigte Tools
-------------------
Für die Entwicklung von Firefox OS Apps können verschiedene Tools und Umgebungen verwendet werden. In diesem Tutorial werden folgende Komponenten benutzt.
> - Firefox (mindestens Version 34.0)
> - WebIDE (in Firefox integriert unter: Tools > Web Developer > WebIDE)
> - Firefox OS Simulator (in der WebIDE integriert)

In älteren Firefox Versionen gibt es die WebIDE nicht, dafür ist der Firefox App Manager vorhanden. In diesem Tutorial wird jedoch nur auf die neue WebIDE eingegangen.

Vorgehen
------------
**Neues Projekt erstellen**  
Als erstes muss in der WebIDE von Firefox ein neues Projekt erstellt werden. Das wird über das Menu „Project > New Project“ gemacht. Nun gibt es verschiedene Projekttypen zur Auswahl. Für eine Kartenapp mit Lokalisierung muss die Option „Privileged Empty App“ gewählt werden.
Das Gerüst für die App wird dadurch automatisch erstellt. Alle Dateien können direkt in der WebIDE oder in einem bevorzugten Editor bearbeitet werden.
![Projektübersicht in der WebIDE](https://lh3.googleusercontent.com/-f4ZtBq-mUbQ/VOGzQirbKEI/AAAAAAAAAF8/vMWClaE78W0/s0/Overview.png "Overview.png")
**Das Manifest**  
Um einige Informationen über die App zu erfassen wird zuerst das Manifest angepasst. Das File enthält ein JSON mit Eigenschaften, welche gesetzt sein müssen damit die App später in den Marketplace gestellt werden kann und solchen die optional sind. Obligatorisch sind folgende Attribute:
>- `name`: Name der App
>- `description`: Kurze Beschreibung der App, welche auch im Marketplace angezeigt wird
>- `launch_path`: Pfad zur Datei, welche als Einstieg zur Applikation dient, relativ zum Projektordner
>- `icons`: Ein Dictionary mit Icons verschiedener Grössen für unterschiedliche Anzeigen. Mindestens ein Icon mit der Grösse 128x128 px muss vorhanden sein.
>- `developer`: Angaben zum Entwickler. Der Name muss hier angegeben werden, während eine URL optional gesetzt werden kann.
>- `default_locale`: Die Standardsprache ist obligatorisch, falls die App mehrsprachig verfügbar ist.

Das  Manifest von FoxMap sieht folgendermassen aus:
```JSON
{
  "version": "0.1.0",
  "name": "FoxMap",
  "description":  "A simple map basing on OpenStreetMap with localization.",
  "launch_path": "/index.html",
  "icons": {
	  "16": "/img/icons/logo16.png",
	  "48": "/img/icons/logo48.png",
	  "60": "/img/icons/logo60.png",
	  "128": "/img/icons/logo128.png",
	  "512": "/img/icons/logo512.png"
  },
  "developer": {
	  "name": "Leandra Finger"
  },
  "type": "web",
  "permissions": {
	  "geolocation": {
	      "description": "Obtain the current location of the user."
	  }
  },
  "installs_allowed_from": [
	  "*"
  ],
  "locales": {
	  "de": {
	      "name": "FoxMap",
	      "description": "Eine einfache Karte basierend auf OpenStreetMap mit  integrierter Lokalisierung."
      }
  },
  "default_locale": "en"
}
```
Zusätzlich zu den vorgegebenen Eigenschaften sind hier noch `locales` für die deutsche Übersetzung und `permissions` gesetzt. Diese Berechtigung braucht Foxmap, da die App auf die Geolocation-Schnittstelle von Firefox OS zugreift. Ausserdem wird in diesem Manifest `type` definiert. Dieses Attribut gibt den Level an Berechtigungen an, welche eine Applikation hat. Weitere Attribute, welche im Manifest gebraucht werden können, sind unter der URL https://developer.mozilla.org/en-US/Apps/Build/Manifest zu finden.

**Die Lizenz**  
Ins Dokument `LICENSE` muss die gewünschte Softwarelizenz eingefügt und angepasst werden. Die Apache Lizenz welche in der generierten App enthalten ist, kann auch weiterverwendet werden.

**Readme**  
Das generierte `README.md` File beinhaltet einige Informationen zu Firefox OS Applikationen. Hier kann zum Beispiel der Umfang der App beschrieben werden oder eine Benutzeranleitung stehen. 

**Firefox OS Simulator**  
In der WebIDE von Firefox können ganz einfach Simulatoren verschiedener OS-Versionen aufgesetzt werden, auf welchen sich die Applikation während der Entwicklung testen lässt. Dazu wir in der WebIDE „Select Runtime“ angewählt und dann „Install Simulator“. Nun stehen verschiedene Versionen zur Auswahl, welche auch parallel installiert werden können.

**Platzhalter für Karte**  
Jetzt endlich kann die Karte platziert werden. Dazu muss das File `index.html` angepasst werden. Es wird ein `div` - Element mit der ID `map` gesetzt, in welchem später mit JavaScript die Karte eingefügt wird. Gleichzeitig wird ein Titel für die Applikation gesetzt. Somit sieht das HTML-Dokument folgendermassen aus:
```HTML
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>FoxMap</title>
        <meta name="description" content="A simple map basing on OpenStreetMap with localization and search.">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link rel="stylesheet" href="css/app.css">

        <script type="text/javascript" src="js/app.js" defer></script>
    </head>
    <body>
        <section>
            <h1>FoxMap</h1>
            <div id="map"></div>
        </section>
    </body>
</html>
```
Im selben Schritt kann auch im Head des Files das Title-Tag und die Meta-description angepasst werden.

**Mapbox**  
Für das Anzeigen der Karte wird Mapbox verwendet. Mapbox ist sowohl eine JavaScript-Library, als auch eine Plattform um eigene Kartenstile für OpenStreetMap zu speichern, welche über eine API in Applikationen verwendet werden können.
Dafür muss zunächst ein Konto bei Mapbox eingerichtet werden. Das kann unter  https://www.mapbox.com/ gemacht werden. Dann muss ein Projekt angelegt werden, in welchem der Stil für die Karte nach belieben angepasst werden kann.
Für das Einbinden der Karte wird das `API access token` und die `Map ID` gebraucht. Beide sind auf der Projektübersichtsseite zu finden.

**Mapbox einbinden**  
Wie schon erwähnt, wird die Karte via JavaScript eingebunden. Dazu wird das File  `app.js` folgendermassen geändert.
```javascript
window.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var map;

  L.mapbox.accessToken = 'YOUR ACCESS TOKEN';

  // initialize map
  map = L.mapbox.map('map', 'YOUR MAP ID');
});
```
Um die Library von Mapbox verwenden zu können, muss diese im HTML noch vor dem `app.js` File geladen werden. Dazu muss folgendes Script-Tag gesetzt werden, vor dem Tag, welches das JavaScript der Applikation lädt.
```HTML
<script src="https://api.tiles.mapbox.com/mapbox.js/v2.1.4/mapbox.js">
</script>
<script type="text/javascript" src="js/app.js" defer></script>
```
Ausserdem muss für das richtige Styling noch die css-Datei von Mapbox eingebunden werden. Diese muss auch im HTML-Head geladen werden, am besten vor der Datei `app.css`, damit Styles, die anders sind als gewünscht, noch überschrieben werden können.
```HTML
<link href="https://api.tiles.mapbox.com/mapbox.js/v2.1.4/mapbox.css" rel="stylesheet" />
<link rel="stylesheet" href="css/app.css">
```

**Styling**  
Nun muss noch das css-File etwas angepasst werden, damit alles richtig erscheint. Hier hat der Entwickler natürlich auch die Freiheit alles so zu gestalten wie es ihm gefällt. Als Beispiel hier das Styling von FoxMap:
```css
html, body {
  padding: 0;
  margin: 0;
}

.leaflet-top{
  top: -5px;
}

.leaflet-top .leaflet-control-zoom {
  margin-top: 60px;
}

html, body, #map, section {
  height: 100%;
}

section {
  position: relative;
}

h1 {
  position: absolute;
  z-index: 5;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  width: 100%;
  margin-top: 0;
  height: 12%;
  max-height: 37px;
  font-weight:bold;
  line-height: 36px;
  color:#108304;
  font-family: Seravek, 'Trebuchet MS', Verdana, Arial, Helvetica, sans-serif;
}
```
Die überschriebenen Styles `.leaflet-top` und `.leaflet-top .leaflet-control-zoom` werden zur Positionierung des Zoomwerkzeugs verwendet.

**Karte in Sicht!**  
Endlich ist es soweit. Jetzt sollte die Karte mit dem Titel angezeigt werden. Dazu muss rechts oben in der  WebIDE ein Simulator ausgewählt werden und schon kann der Play-Button gedrückt werden, um die App im Simulator zu starten. Das sollte zu diesem Bild führen.  
![App im Simulator](https://lh5.googleusercontent.com/WzqqFVhgY8KmHD-BdCK8zh9Maydgc1-uJfu8dkKD3Q=s400 "Map.png")

**Standort bestimmen**  
Jetzt fehlt nur noch die Funktionalität um den eigenen Standort zu bestimmen. Dazu muss das Javascript noch etwas erweitert werden.
```javascript
var container, link, marker, map, first_location;

var LocateControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    // create the control container with a particular class name
    container = L.DomUtil.create('div', 'leaflet-control-locate');
    link = L.DomUtil.create('a', 'mapbox-icon', container);

    // set listener for locate button
    L.DomEvent.addListener(
      link, 'click', function(e){
        e.preventDefault();
        locate();
      }
    );

    return container;  // return DOM-Element
  }
});
``` 
Als erstes müssen neue Variablen eingeführt werden, um sie im nachfolgenden Code verwenden zu können.
`LocateControl` definiert das Steuerelement für die Lokalisierung und baut auf dem Basis-steuerelement von Leaflet auf. Leaflet ist eine Library, auf welcher die verwendete Library von Mapbox basiert.
In der Erweiterung wird die Position im User Interface festgelegt, sowie eine Funktion definiert, welche ausgeführt wird sobald das Element der Karte zugefügt wird. Dies ist die Funktion `onAdd`. Darin werden zuerst die benötigten DOM-Elemente erstellt, ein Container und ein Link-Tag.
Als nächstes wird ein Listener erstellt, welcher auf das anklicken des Links reagiert. Bei diesem Klick wird zuerst das Standardverhalten des Links, eine neue Seite zu öffnen, verhindert. Danach wird eine Funktion `locate` ausgeführt, welche wie folgt definiert werden muss.
``` javascript
var locate = function() {
    first_location = true; // set first location true, so the map is centered on marker
    L.DomUtil.addClass(container, 'requesting');

    // start watching Position
    navigator.geolocation.watchPosition(
      function(pos){locate_success(pos);},  // detected position
      function(){locate_error();},  // couldn't detect position
      {
        enableHighAccuracy: true,
        timeout: 60000,  // stop trying to get position after 1 Minute
        maximumAge: 10000  // get new position after 10 seconds
      }
    );
  };
```
Als erstes wird festgelegt, dass die Lokalisierung zum ersten Mal durchgeführt wird. Diese Information wird später gebraucht.
Durch das Zufügen der Klasse `requesting` zum Container-Element wird dem Benutzer gezeigt, dass die Suche läuft. Diese Klasse ist von Mapbox schon definiert.
Danach kommt die eigentliche Interaktion mit dem Geolocation-Modul von Firefox OS. Mit der Funktion `watchPosition` von `navigator.geolocation` kann die aktuelle Position vom Betriebsystem erfragt werden und zusätzlich wird die Position nach Ablaufen einer bestimmten Zeit, dem `maximumAge`, automatisch neu bestimmt. Falls die Position in der durch die Option timeout gegebenen Zeit, bestimmt werden kann, wird sie an die Funktion `locate_success` weitergegeben. Falls das nicht möglich ist wird `locate_error` ausgeführt. Beim Wiederholen der Standortbestimmung nach der gesetzten Zeit wird wieder entweder `locate_success` oder `locate_error` ausgeführt.

**Standort auf Karte anzeigen**  
In diesem Schritt wird die oben aufgerufene Funktion `locate_success` implementiert. Da zur Anzeige der Position eine Markierung für den Standort benötigt ist, muss diese zuerst erzeugt werden. Dies geschieht mit dem folgenden Code.
```javascript
// initialize marker
marker = L.marker([0,0], {
  icon: L.mapbox.marker.icon({
    'marker-color': '#108304'
  })
}); 
```
Hier wird dem Marker eine Position zugewiesen und zusätzlich eine Farbe gegeben. Die Position ist hier nicht entscheidend, weil der Marker erst sichtbar wird, wenn er der Karte zugeordnet wird.
```javascript
var locate_success = function(position) {
  if (first_location) {
    map.setView(
      [position.coords.latitude, position.coords.longitude],
      17  // Zoom-Level
    );
    first_location = false; // set first location true, so the map isn't positioned again
  }
  marker.setLatLng(L.latLng(position.coords.latitude, position.coords.longitude));
  marker.addTo(map);
  L.DomUtil.removeClass(container, 'requesting');
  L.DomUtil.addClass(container, 'active');
}; 
```

Das ist nun die Funktion welche ausgeführt wird, sobald die Position gefunden wurde. Als Input erhält sie das Positionsobjekt vom Betriebssystem. Falls die Position zum ersten Mal seit dem klicken auf den Lokalisierungs-Button bestimmt wurde, wird die Karte auf den aktuellen Standort zentriert. Dies geschieht über die Funktion `setView`. Danach wird `first_location` auf `false` gesetzt, damit die Zentrierung nicht alle 10 Sekunden wiederholt wird.
Die nachfolgenden Schritte hingegen sollen bei jeder Positionsaktualisierung durchgeführt werden. Dabei wird die Position des Markers auf den aktuellen Standort gesetzt und sichergestellt dass er auf der Karte angezeigt wird.
Und damit der Benutzer weiss, dass die Positionierung weiterläuft wird das Symbol auf dem Lokalisierungs-Button, durch die Klasse `active` angepasst.

**Lokalisierungsfehler anzeigen**  
Im Fall dass die Position nicht bestimmt werden kannn, muss dem Benutzer eine Fehlermeldung gezeigt werden. Dazu muss diese zuerst im HTML zugefügt werden.
```html
<body>
  <section>
    <h1>FoxMap</h1>
    <p class="error">Your location could not be detected!</p>
    <div id="map"></div>
  </section>
</body> 
```
Das Styling der css-Klasse `error` sieht folgendemassen aus:
```css
.error {
  position: absolute;
  z-index: 5;
  top: 30%;
  left: 10%;
  width: 80%;
  padding: 7px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  color:#FAAB00;
  font-family: Seravek, 'Trebuchet MS', Verdana, Arial, Helvetica, sans-serif;
  opacity: 0;
  pointer-events:none;
  -webkit-transition: all 0.8s ease-in;
  -moz-transition: all 0.8s ease-in;
  -ms-transition: all 0.8s ease-in;
  -o-transition: all 0.8s ease-in;
  transition: all 0.8s ease-in;
}

.error.show-error {
  opacity: 1;
  -webkit-transition: all 0.4s ease-in;
  -moz-transition: all 0.4s ease-in;
  -ms-transition: all 0.4s ease-in;
  -o-transition: all 0.4s ease-in;
  transition: all 0.4s ease-in;
} 
```
Normalerweise ist die Fehleranzeige nicht sichtbar, da `opacity` auf `0` gestellt ist. Aber durch die JavaScript-Funktion `locate_error` wird dem Element die Klasse `show-error` zugefügt, welche das Element sichtbar macht. Die Transitionen sind dazu da, dass die Sichtbarkeit langsam ändert.
```javascript
var locate_error = function() {
  error.className = error.className + " show-error";
  setTimeout(function(){
    error.className = "error";
    L.DomUtil.removeClass(container, 'active');
    L.DomUtil.removeClass(container, 'following');
  }, 5000);
  L.DomUtil.addClass(container, 'active');   
  L.DomUtil.addClass(container, 'following');
  L.DomUtil.removeClass(container, 'requesting'); 
};
```

Durch diese Funktion werden lediglich Klassen gesetzt, damit dem Benutzer der Fehler angezeigt wird. Alle Klassen welche auf den Container angewendet werden sind in der Library von Mapbox definiert.

**Steuerung anzeigen**  
Durch die folgende Zeile kann die nun implementierte Steuerung der Karte zugefügt werden. Diese Zeile muss nach dem Initialisieren der Map eingefügt werden.
```javascript
map.addControl(new LocateControl()); 
```

Nun ist es soweit. Die Map hat eine funktionierende Lokalisierung erhalten. Im Simulator erschient die App jetzt wie links zu sehen. Falls die Position nicht bestimmt werden konnte wird die Fehlermeldung (rechts) gezeigt.  
![App mit Lokalisierung](https://lh5.googleusercontent.com/-ddKrBjiHmus/VOG96wlUVLI/AAAAAAAAAGg/-cW5hvwcWOs/s400/with_loc.png "with_loc.png") ![Fehlermeldung](https://lh3.googleusercontent.com/-SDdjsjOQ3Bs/VOG-j1CCARI/AAAAAAAAAG4/YCycAmIiYYo/s400/map_error.png "map_error.png")

**Im Marketplace publizieren**  
In diesem Abschnitt wird beschrieben wie die fertige Applikation in den Marketplace gestellt werden könnte. Die Basis dazu wurde schon durch das Manifest geschaffen. Jetzt muss die Applikation noch gepackt werden. Das lässt sich durch die folgende Zeile in der Konsole machen.

```bas
zip -r meine_applikation.zip pfad_zu/meiner_applikation 
```
Auf https://marketplace.firefox.com/developers/ kann ein Account für den Marketplace erstellt werden, falls dieser noch nicht vorhanden ist. Nach dem Einloggen kann auf  https://marketplace.firefox.com/developers/submit/ Schritt für Schritt eine App eingereicht werden. Im Beispiel von FoxMap wurde eine gepackte App erstellt. Diese kann einfach als .zip-Datei hochgeladen werden. Danach wird die Applikation von Mozilla geprüft und wenn alles gut läuft, ist sie schon bald für jeden Firefox-Benutzer verfügbar.

Ausblicke
-----------
Dieses Tutorial ist während dem erarbeiten der Applikation FoxMap entstanden. Der gesamte Code der App ist auf Github unter https://github.com/LeaFin/foxmap/ zu finden. FoxMap hat noch weitere Features, welche im Tutorial nicht behandelt wurden und wird immer noch weiterentwickelt.
Für Themen der App-Entwicklung für Firefox OS, welche in diesem Tutorial nicht gedeckt werden, empfehlen sich vor allem die Seiten von Mozilla Developer Network. Ein Einstieg dazu wäre die Seite https://marketplace.firefox.com/developers. Es sind aber auch viele weitere Tutorials zu finden, welche sich mit verschiedenen Nuancen von Firefox OS beschäftigen.
