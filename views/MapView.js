Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.MapView = Backbone.View.extend({

  initialize: function(){
    var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    var southWest = L.latLng(-23, 31),
    northEast = L.latLng(-9, 43),
    maxBounds = L.latLngBounds(southWest, northEast);

    var self = this;
    this.geoJSONLayer = L.geoJson(this.collection.toGeoJSON(), {
      onEachFeature: function(feature, layer) {
        if (feature.properties) {
          var exp_id = feature.properties.exp_id;
          var exp = self.collection.filter({'exp_id': exp_id})[0];
          layer.bindPopup('<a href="' + exp.urlShow() + '">' + exp_id + '</a>');
        };
      }
    });

    this.map = L.map(this.el.id, {
      layers: [base, this.geoJSONLayer],
      maxBounds: maxBounds,
      minZoom: 6,
    });
  },

  update: function(newCollection){
    this.collection = newCollection;
    this.updateLayer();
    this.updateMapView();
  },

  updateLayer: function() {
    this.geoJSONLayer.clearLayers();
    var geojson = this.collection.toGeoJSON();
    if(geojson.features.length > 0){
      this.geoJSONLayer.addData(geojson);
    }
  },

  updateMapView: function() {
    if(this.geoJSONLayer.getLayers().length > 0){
      var bounds = this.geoJSONLayer.getBounds();
      this.map.fitBounds(bounds.pad(0.1))
      var center = this.map.getCenter();
      var zoom = this.map.getZoom();
      if (zoom > 15) this.map.setZoomAround(center, 15);
    } else{
      this.map.fitBounds([[-13, 39.25]]);
      this.map.setZoom(8);
    }
  },

});
