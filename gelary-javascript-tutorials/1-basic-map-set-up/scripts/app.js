var mapContainer = document.getElementById('map-container');

var platform = new H.service.Platform({
  app_id: '{YOUR_APP_ID}', // // <-- ENTER YOUR APP ID HERE
  app_code: '{YOUR_APP_CODE}', // <-- ENTER YOUR APP CODE HERE
  // Only necessary if served over HTTPS:
  useHTTPS: true
});

var HEREHQcoordinates = {
  // HERE HQ in Berlin, Germany:
  lat: 52.530974,
  lng: 13.384944
};

// Displaying the map
var mapOptions = {
  center: HEREHQcoordinates,
  zoom: 14
};

var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(
  mapContainer,
  defaultLayers.normal.map,
  mapOptions);

// Resize the map when the window is resized
window.addEventListener('resize', function () {
  map.getViewPort().resize();
});

// Basic behavior: Zooming and panning
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Marker with custom icon
var iconUrl = './images/marker-gelato.svg';

var iconOptions = {
  size: new H.math.Size(26, 34),
  anchor: new H.math.Point(14, 34)
};

var markerOptions = {
   icon: new H.map.Icon(iconUrl, iconOptions)
};

var marker = new H.map.Marker(HEREHQcoordinates, markerOptions);
map.addObject(marker);