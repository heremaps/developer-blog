function HERERoutesPanel(routes, options) {

  var selectedRoute;
  var selectedRouteElement;

  var render = function(routes) {
    var routeList = document.querySelector('#route-panel ul');
    routes.forEach(function(route, i) {
      routeList.appendChild(renderRouteElement(route, i));
    });
  };

  var renderRouteElement = function(route, i) {
    var element = document.createElement('li');

    // Render the title and format distance and duration
    var routeSummary = route.route.summary;
    element.innerHTML = renderRouteTitle(routeSummary, i);

    // We don't expect more than one leg as we don't have
    // defined any waypoints along the route
    var maneuvers = route.route.leg[0].maneuver;
    element.innerHTML += renderManeuvers(maneuvers);

    // Upon route selection highlight the selected element,
    // highlight the selected route on the map and trigger the
    // onRouteSelection callback if defined.
    element.addEventListener('click', function() {
      if (selectedRoute) {
        selectedRouteElement.classList.remove('selected');
      }

      element.classList.add('selected');
      selectedRoute = route;
      selectedRouteElement = element;

      if (options.onRouteSelection) {
        options.onRouteSelection(selectedRoute);
      }
    }, false);

    return element;
  };

  var renderRouteTitle = function(routeSummary, i) {
    return [
      '<strong>Route ' + (i + 1) + '</strong> (',
      Utils.formatDistance(routeSummary.distance) + ' in ',
      Utils.formatDuration(routeSummary.travelTime) + ')'
    ].join('');
  };

  var renderManeuvers = function(maneuvers) {
    return [
      '<ol class="directions">',
        maneuvers.map(function(maneuver) {
          return '<li>' + maneuver.instruction + '</li>';
        }).join(''),
      '</ol>'
    ].join('');
  };

  render(routes);
}