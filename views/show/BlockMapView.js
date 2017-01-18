Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockMapView = Backbone.View.extend({

  initialize: function(options){
    var options = options || {};
    // options.mapBackground = '#f1f4c7'; '#1f78b4';
    this.map = Backbone.SIXHIARA.mapConfig('map', options);

    var drawnItems = new L.FeatureGroup();

    var geom = this.model.get('geometry').toJSON();
    if (_.has(geom, 'coordinates') && _.has(geom, 'type')){
      var exploracaoGeoJSON = {
        "type": "Feature",
        "properties": {},
        "geometry": geom
      };

      var exploracaoLeaflet = L.geoJson(exploracaoGeoJSON, {
        onEachFeature: function (feature, layer) {
          if(feature.geometry.type=="MultiPolygon"){
            layer.eachLayer(function(child_layer){
              drawnItems.addLayer(child_layer);
            });
          }else{
            drawnItems.addLayer(layer);
          }
        },
        style: {fillOpacity: 0.5}
      });

      var bounds = exploracaoLeaflet.getBounds().pad(0.1);
      this.map.fitBounds(bounds).setMaxBounds(bounds);
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

    var layersConfig = [];
    for (var i =0 ; i< allLayers.length; i++) {
      if (allLayers[i].id !== 'Pais' &&
      allLayers[i].id!== 'Provincias' &&
      allLayers[i].id!=='PaisesPunto' &&
      allLayers[i].id!=='ProvinciasPunto' &&
      allLayers[i].id!=='Oceano') {
        layersConfig.push(allLayers[i]);
      }
    }
    Backbone.SIXHIARA.offline(this.map, layersConfig);
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
    var bounds = this.map.getBounds().extend(this.actividadeLayer.getBounds()).pad(0.1);
    this.map.fitBounds(bounds).setMaxBounds(bounds);
  },

});
