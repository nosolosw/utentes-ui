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
    this.renderCultivos();


    this.listenTo(this.model, 'change:actividade', this.renderCultivos);

    var layersConfig = {};
    for (i in Backbone.SIXHIARA.LayerConfig) {
      if (i !== 'json_Pais' && i !== 'json_Provincias' && i!=='json_PaisesPunto' && i!=='json_ProvinciasPunto') {
        layersConfig[i] = Backbone.SIXHIARA.LayerConfig[i];
      }
    }
    Backbone.SIXHIARA.offline(this.map, layersConfig);
  },

  renderCultivos: function() {
    if (this.cultivosLayer) this.cultivosLayer.clearLayers();
    var tipo = this.model.get('actividade') && this.model.get('actividade').get('tipo');
    if (tipo !== "Agricultura-Regadia") return;
    var cultivos = this.model.get('actividade').get('cultivos');
    if (! cultivos) return;
    var geojson = cultivos.toGeoJSON();
    if (geojson.features.length == 0) return;
    var self = this;
    this.cultivosLayer = L.geoJson(geojson, {
      onEachFeature: function(feature, layer) {
        var label = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'label',
            html: feature.properties.cult_id,
            iconSize: [100, 40]
          })
        }).addTo(self.map);
      },
      style: {
        stroke: true,
        color: '#00b300',
        weight: 1,
        opacity: 1,
        fillColor: '#00b300',
        fillOpacity: 0.5,
      }
    });
    this.cultivosLayer.addTo(this.map);
    var bounds = this.map.getBounds().extend(this.cultivosLayer.getBounds()).pad(0.1);
    this.map.fitBounds(bounds).setMaxBounds(bounds);
  },

});
