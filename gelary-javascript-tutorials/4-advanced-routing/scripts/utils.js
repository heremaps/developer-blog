var Utils = {
  locationToWaypointString: function(coordinates) {
    return 'geo!' + coordinates.lat + ',' + coordinates.lng;
  },

  formatDistance: function(distanceInMeters) {
    if (distanceInMeters < 1000) {
      return distanceInMeters + 'm';
    } else {
      return (distanceInMeters / 1000).toFixed(1) + 'km';
    }
  },

  formatDuration: function(durationInSeconds) {
    var hours = Math.floor(durationInSeconds / 3600);
    var minutes = Math.floor(durationInSeconds % 3600 / 60);

    if (hours > 0) {
      return hours + 'h ' + minutes + 'min';
    } else {
      return minutes + 'min';
    }
  }
};