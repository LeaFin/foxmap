// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var container, link, marker;

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

  var locate_success = function(position) {
    map.setView([position.coords.latitude, position.coords.longitude], 17);
    marker.setLatLng(L.latLng(position.coords.latitude, position.coords.longitude));
    marker.addTo(map);
    L.DomUtil.removeClass(container, 'requesting');
    L.DomUtil.addClass(container, 'active');
  }

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
  }

  var LocateControl = L.Control.extend({
	 options: {
    position: 'topright'
	 },

	 onAdd: function (map) {
    // create the control container with a particular class name
    container = L.DomUtil.create('div', 'leaflet-control-locate');
    link = L.DomUtil.create('a', 'mapbox-icon', container);

    L.DomEvent.addListener(
      link, 'click', function(e){
        e.preventDefault();
        L.DomUtil.addClass(container, 'requesting')
        navigator.geolocation.watchPosition(function(pos){locate_success(pos);}, function(){locate_error();}, {
  enableHighAccuracy: true, timeout: 60000*1, maximumAge: 10000});
      }
    )

    return container;
	 }
  });

  L.mapbox.accessToken = 'pk.eyJ1IjoibGVhZmluIiwiYSI6Imhsc3JHTDQifQ.eYmzx5lcXOJdYFsGnqtSqg';

  marker = L.marker([0,0], {
     icon: L.mapbox.marker.icon({
      'marker-color': '#108304'
     })
    });

  var geocoder = L.mapbox.geocoder('mapbox.places-v1');
  var map = L.mapbox.map('map', 'leafin.k41najma');
  geocoder.query('Zürich, Schweiz', showMap);

  map.addControl(new LocateControl());

  L.control.layers({
    'Streets': L.mapbox.tileLayer('leafin.k41najma').addTo(map),
    'Satallite': L.mapbox.tileLayer('examples.map-20v6611k')
}).addTo(map);

  function showMap(err, data) {
    // The geocoder can return an area, like a city, or a
    // point, like an address. Here we handle both cases,
    // by fitting the map bounds to an area or zooming to a point.
    if (data.lbounds) {
        map.fitBounds(data.lbounds);
    } else if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], 3);
    }
}


});
