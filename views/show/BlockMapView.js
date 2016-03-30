Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockMapView = Backbone.View.extend({

  initialize: function(){
    var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    this.map = L.map('map', {
      center: [-13.3030, 38.5050],
      zoom: 7,
      layers: [base]
    });

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
      });

      this.map.fitBounds(exploracaoLeaflet.getBounds()).setMaxBounds(exploracaoLeaflet.getBounds());
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
  }

});
