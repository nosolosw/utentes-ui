Backbone.SIXHIARA.CENTER = [-13, 38.5050];

Backbone.SIXHIARA.mapConfig = function(mapId, initOptions) {
  var options = initOptions || {};

  var southWest = L.latLng(-23, 31),
  northEast = L.latLng(-9, 43),
  maxBounds = L.latLngBounds(southWest, northEast);

  var defaultMapOptions = {
    zoom: 7,
    center: Backbone.SIXHIARA.CENTER,
    maxBounds: maxBounds,
    minZoom: 7,
    maxZoom: 19,
  };

  var mapOptions = _.defaults(_.extend({}, defaultMapOptions, options.mapOptions || {}), defaultMapOptions);



  if (options.mapBackground) {
    $('#'+ mapId).css('background-color', options.mapBackground);
  }

  var map = L.map(mapId, mapOptions);

  if (options.offline && options.offline.layers) {
    var offBaseLayer = Backbone.SIXHIARA.offline(map, options.offline.layers);

    /* A bug in leaflet makes that the order which is used to add the layers to
    the control is not respected. Add and Remove the layer to create the layer-id
    partially solves this situation */
    map.addLayer(offBaseLayer);
    map.removeLayer(offBaseLayer);
    /* workaround end */
  }

  if (options.online || true) {
    var onBaseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
  }

  var baseMap = window.sessionStorage.getItem('baseMap') || 'Offline';
  if (baseMap === 'Offline') {
    offBaseLayer.loadOffline(true);
  } else {
    onBaseLayer.addTo(map);
    offBaseLayer.loadOffline(false);
  }


  var control = L.control.layers().addTo(map);
  control.addBaseLayer(offBaseLayer, "Offline");
  control.addBaseLayer(onBaseLayer, "Online");


  map.on('baselayerchange', function(e) {
    window.sessionStorage.setItem('baseMap', e.name);
  });

  return map;
}
