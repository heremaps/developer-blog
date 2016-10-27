function HEREMap (mapContainer, platform, mapOptions) {
  this.platform = platform;
  this.position = mapOptions.center;

  var defaultLayers = platform.createDefaultLayers();

  // Instantiate wrapped HERE map
  this.map = new H.Map(mapContainer, defaultLayers.normal.map, mapOptions);

  // Basic behavior: Zooming and panning
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

  // Watch the user's geolocation and display it
  navigator.geolocation.watchPosition(this.updateMyPosition.bind(this));

  // Resize the map when the window is resized
  window.addEventListener('resize', this.resizeToFit.bind(this));
}

HEREMap.prototype.updateMyPosition = function(event) {
  this.position = {
    lat: event.coords.latitude,
    lng: event.coords.longitude
  };

  // Remove old location marker if it exists
  if (this.myLocationMarker) {
    this.removeMarker(this.myLocationMarker);
  }

  // Draw the route from current location to HERE HQ if not yet drawn
  if (!this.route) {
    this.drawRoute(this.position, HEREHQcoordinates);
  }

  this.myLocationMarker = this.addMarker(this.position, 'iceCream');
  this.map.setCenter(this.position);
};

HEREMap.prototype.addMarker = function(coordinates, icon) {
  var markerOptions = {};

  // Dictonary for icon data
  var icons = {
    iceCream: {
      url: './images/marker-gelato.svg',
      options: {
        size: new H.math.Size(26, 34),
        anchor: new H.math.Point(14, 34)
      }
    },
    origin: {
      url: './images/origin.svg',
      options: {
        size: new H.math.Size(30, 36),
        anchor: new H.math.Point(12, 36)
      }
    },
    destination: {
      url: './images/destination.svg',
      options: {
        size: new H.math.Size(30, 36),
        anchor: new H.math.Point(12, 36)
      }
    }
  };

  if (icons[icon]) {
    markerOptions = {
      icon: new H.map.Icon(icons[icon].url, icons[icon].options)
    };
  }

  var marker = new H.map.Marker(coordinates, markerOptions);
  this.map.addObject(marker);

  return marker;
};

HEREMap.prototype.removeMarker = function(marker) {
  this.map.removeObject(marker);
};

HEREMap.prototype.drawRoute = function(fromCoordinates, toCoordinates) {
  var routeOptions = {
    mode: 'fastest;car',
    representation: 'display',
    alternatives: 2,
    routeattributes: 'waypoints,summary,shape,legs',
    waypoint0: Utils.locationToWaypointString(fromCoordinates),
    waypoint1: Utils.locationToWaypointString(toCoordinates)
  };

  this.addMarker(fromCoordinates, 'origin');
  this.addMarker(toCoordinates, 'destination');

  this.route = new HERERoute(this.map, this.platform, routeOptions);
};

HEREMap.prototype.resizeToFit = function() {
  this.map.getViewPort().resize();
};