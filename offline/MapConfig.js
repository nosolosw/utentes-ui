Backbone.SIXHIARA.mapConfig = function(mapId, initOptions) {
  var options = initOptions || {};
  if (options.online) {
    var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
  }

  var southWest = L.latLng(-23, 31),
  northEast = L.latLng(-9, 43),
  maxBounds = L.latLngBounds(southWest, northEast);

  var defaultMapOptions = {
    zoom: 7,
    center: [-13, 38.5050],
    maxBounds: maxBounds,
    minZoom: 7,
    maxZoom: 19,
  };

  var mapOptions = _.defaults(_.extend({}, defaultMapOptions, options.mapOptions || {}), defaultMapOptions);

  if (options.online) {
    mapOptions.layers = [base]
  }
  if (options.mapBackground) {
    $('#'+ mapId).css('background-color', options.mapBackground);
  }
  return L.map(mapId, mapOptions);

}
