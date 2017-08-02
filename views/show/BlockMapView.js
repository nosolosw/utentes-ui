Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockMapView = Backbone.View.extend({

  initialize: function(options){
    var options = options || {};
    var baseOfflineLayers = allLayers.filter(function(l) {
      return ! ['Pais', 'Provincias', 'PaisesPunto', 'ProvinciasPunto', 'Oceano'].includes(l.id);
    });
    options.offline = {layers: baseOfflineLayers};
    this.map = Backbone.SIXHIARA.mapConfig('map', options);

    var self = this;
    self.map.scrollWheelZoom.disable();
    self.map.on('focus', function() { self.map.scrollWheelZoom.enable(); });
    self.map.on('blur', function() { self.map.scrollWheelZoom.disable(); });

    var drawnItems = new L.FeatureGroup();

    var geom = this.model.get('geometry').toJSON();
    if (_.has(geom, 'coordinates') && _.has(geom, 'type')){
      var exploracaoGeoJSON = {
        "type": "Feature",
        "properties": {},
        "geometry": geom
      };

      this.geoJSONLayer = L.geoJson(exploracaoGeoJSON, {
        onEachFeature: function (feature, layer) {
          if(feature.geometry.type=="MultiPolygon"){
            layer.eachLayer(function(child_layer){
              drawnItems.addLayer(child_layer);
            });
          }else{
            drawnItems.addLayer(layer);
          }
        },
        style: {stroke: true,
          color: '#00b300',
          weight: 4,
          opacity: 0.5,
          fillColor: '#00b300',
          fillOpacity: 0.2}
        });

        var bounds = this.geoJSONLayer.getBounds();
        this.fitToBounds(this.map, bounds, 0.1, 18, null);
        this.setThisAsMaxBounds();
    }

    var drawControl = new L.Control.Draw({
      draw: {
        circle: false,
        rectangle: false,
        marker: false,
        polyline: false
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    this.map.addControl(drawControl);

    var self = this;
    this.map.on('draw:created draw:edited draw:deleted', function(e){
      if (e.layerType) drawnItems.addLayer(e.layer);
      self.model.set('geometry_edited', true);
      var multipolygon = drawnItems.getLayers().map(function(l){return l.getLatLngs()});
      var geojson = L.multiPolygon(multipolygon).toGeoJSON().geometry;
      if (geojson.coordinates.length) {
        self.model.get('geometry').set('type', geojson.type);
        self.model.get('geometry').set('coordinates', geojson.coordinates);
      } else {
        self.model.set('geometry', null);
      }

    });

    drawnItems.addTo(this.map);
    this.renderActividade();


    this.listenTo(this.model, 'change:actividade', this.renderCultivos);
  },

  fitToBounds: function(map, bounds, boundsPadding, maxZoom, minZoom) {
    maxZoom = maxZoom || Number.MAX_SAFE_INTEGER;
    minZoom = minZoom || Number.MIN_SAFE_INTEGER;
    map.fitBounds(bounds.pad(boundsPadding));
    var zoom = this.map.getZoom();
    if (zoom > maxZoom) {
      var center = this.map.getCenter();
      map.setZoomAround(center, maxZoom);
    }
    if (zoom < minZoom) {
      var center = this.map.getCenter();
      map.setZoomAround(center, minZoom);
    }
    return map.getBounds();
  },

  setThisAsMaxBounds: function() {
      // el padding es para asegurarse de que entra
      // si no intenta hacer un _panInsideMaxBounds y puede
      // entrar en un bucle infinito
      var bounds = this.map.getBounds().pad(0.15);
      this.map.setMaxBounds(bounds)
  },

  /*
    If the activity should render any geometry, like the cultivos for Regadio
    activities it's done in this method
  */
  renderActividade: function() {
    if (this.actividadeLayer) this.actividadeLayer.clearLayers();
    var act = this.model.get('actividade');
    if (! act) {
      return;
    }

    this.actividadeLayer = act.getActividadeLayer(this.map);
    if (! this.actividadeLayer) {
      return;
    }

    this.actividadeLayer.addTo(this.map);

    var bounds = this.geoJSONLayer.getBounds().extend(this.actividadeLayer.getBounds());
    this.fitToBounds(this.map, bounds, 0.1, 18, null);
    this.setThisAsMaxBounds();
  },

});
