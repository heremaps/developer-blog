var mapContainer = document.getElementById('map-container');

var platform = new H.service.Platform({
  app_id: '...', // // <-- ENTER YOUR APP ID HERE
  app_code: '...', // <-- ENTER YOUR APP CODE HERE
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

var map = new HEREMap(mapContainer, platform, mapOptions);