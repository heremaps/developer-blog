function HERERoute (map, platform, routeOptions) {

  var router = platform.getRoutingService();
  var routeLineStyles = {
    normal: { strokeColor: 'rgba(0, 85, 170, 0.5)', lineWidth: 3 },
    selected: { strokeColor: 'rgba(255, 0, 0, 0.7)', lineWidth: 7 }
  };
  var selectedRoute;

  var onSuccess = function(result) {
    if (result.response.route) {
      var routeLineGroup = new H.map.Group();

      var routes = result.response.route.map(function(route) {
        var routeLine = drawRoute(route);
        routeLineGroup.addObject(routeLine);

        return {
          route: route,
          routeLine: routeLine
        };
      });

      map.addObject(routeLineGroup);
      map.setViewBounds(routeLineGroup.getBounds());

      this.routePanel = new HERERoutesPanel(routes,
        { onRouteSelection: onRouteSelection }
      );
    }
  };

  var onError = function(error) {
    console.error('Oh no! There was some communication error!', error);
  };

  var onRouteSelection = function(route) {
    console.log('A route has been selected.', route);
    if (selectedRoute) {
      selectedRoute.routeLine.setStyle(routeLineStyles.normal).setZIndex(1);
    }

    route.routeLine.setStyle(routeLineStyles.selected).setZIndex(10);
    selectedRoute = route;
  };

  var drawRoute = function(route) {
    var routeShape = route.shape;

    // Create a strip to use as a point source for the route line
    var strip = new H.geo.Strip();

    // Push all the points in the shape into the strip:
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      strip.pushLatLngAlt(parts[0], parts[1]);
    });

    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(strip,
      { style: routeLineStyles.normal }
    );

    return routeLine;
  };

  router.calculateRoute(routeOptions, onSuccess, onError);
}