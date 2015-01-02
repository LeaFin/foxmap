// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var container, link, marker, geocoder, map, geocoderControl;

  /*var translate = navigator.mozL10n.get;

  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);

  // ---

  function start() {

    var message = document.getElementById('message');

    // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
    // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations
    message.textContent = translate('message');

  }*/

  var error = document.getElementsByClassName('error')[0];
  var first_location = true;

  var place_found = function(res) {
    marker.setLatLng(L.latLng(res.feature.center[1], res.feature.center[0]));
    marker.addTo(map);
  };

  var locate_success = function(position) {
    if (first_location) {
      map.setView([position.coords.latitude, position.coords.longitude], 17);
      first_location = false; // set first location true, so the map isn't positiond again
    }
    marker.setLatLng(L.latLng(position.coords.latitude, position.coords.longitude));
    marker.addTo(map);
    L.DomUtil.removeClass(container, 'requesting');
    L.DomUtil.addClass(container, 'active');
  };

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

  var showMap = function(err, data) {
    if (data.lbounds) {
        map.fitBounds(data.lbounds);
    } else if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], 3);
    }
  };

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
          first_location = true; // set first location true, so the map is centered on marker
          L.DomUtil.addClass(container, 'requesting');
          // start watching Position
          navigator.geolocation.watchPosition(function(pos){locate_success(pos);}, function(){locate_error();}, {
    enableHighAccuracy: true, timeout: 60000*1, maximumAge: 10000});
        }
      );

      return container;
    }

  });

  L.mapbox.accessToken = 'pk.eyJ1IjoibGVhZmluIiwiYSI6Imhsc3JHTDQifQ.eYmzx5lcXOJdYFsGnqtSqg';

  // initiate marker
  marker = L.marker([0,0], {
     icon: L.mapbox.marker.icon({
      'marker-color': '#108304'
     })
  });

  // initiate map
  map = L.mapbox.map('map', 'leafin.k41najma');

  // initiate geocoder and set map to Zürich, Schweiz
  geocoder = L.mapbox.geocoder('mapbox.places-v1');
  geocoder.query('Zürich, Schweiz', showMap);

  // add geocoding
  geocoderControl = L.mapbox.geocoderControl('mapbox.places-v1', {autocomplete: true});
  geocoderControl.on('select', function(res){place_found(res);});
  map.addControl(geocoderControl);

  map.addControl(new LocateControl());

  // Add Layers to the map
  L.control.layers({
    'Streets': L.mapbox.tileLayer('leafin.k41najma'),
    'Topography': L.mapbox.tileLayer('leafin2.kk721egp')
  }).addTo(map);

});
