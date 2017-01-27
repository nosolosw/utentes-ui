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
    var mapBoxApi = window.localStorage.getItem('mapBoxApi');
    var thunderforestApi = window.localStorage.getItem('thunderforestApi');

    var hotLayer = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var thunderforestLayer = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=' + thunderforestApi, {
      attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var mapboxLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=' + mapBoxApi, {
      attribution:'© <a href= "https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
    });

    var iCartoLayer = L.tileLayer('https://api.mapbox.com/styles/v1/fpuga/ciyeq8j4m00362slesun9tw70/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnB1Z2EiLCJhIjoiRTNkN1h1OCJ9.jfJA6rSdkFVm_AKa3w4vRA', {
      attribution:'© <a href= "http://icarto.es">iCarto</a>, © <a href= "https://www.mapbox.com/map-feedback/">Mapbox</a>, © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

  }

  var baseMap = window.localStorage.getItem('baseMap') || 'Offline';
  if (baseMap === 'Offline') {
    offBaseLayer.loadOffline(true);
  } else if (baseMap === 'HOT') {
    hotLayer.addTo(map);
    offBaseLayer.loadOffline(false);
  } else if (baseMap === 'Thunderforest') {
    thunderforestLayer.addTo(map);
    offBaseLayer.loadOffline(false);
  } else if (baseMap === 'Mapbox') {
    mapboxLayer.addTo(map);
    offBaseLayer.loadOffline(false);
  } else if (baseMap === 'iCarto') {
    iCartoLayer.addTo(map);
    offBaseLayer.loadOffline(false);
  }


  var control = L.control.layers({}, {}, {position:'topleft'}).addTo(map);
  control.addBaseLayer(offBaseLayer, "Offline");
  control.addBaseLayer(hotLayer, "HOT");
  control.addBaseLayer(thunderforestLayer, "Thunderforest");
  control.addBaseLayer(mapboxLayer, "Mapbox");
  control.addBaseLayer(iCartoLayer, "iCarto");



  map.on('baselayerchange', function(e) {
    window.localStorage.setItem('baseMap', e.name);
  });

  return map;
}
