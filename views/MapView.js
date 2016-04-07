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
      style: this.leafletStyle,
      onEachFeature: function(feature, layer) {
        if (feature.properties) {
          var exp_id = feature.properties.exp_id;
          var exp = self.collection.filter({'exp_id': exp_id})[0];
          layer.bindPopup('<a href="' + exp.urlShow() + '">' + exp_id + '</a>');
        };
        layer.on({
          mouseover: function(e) {
            var layer = e.target;
            var exp_id = layer.feature.properties.exp_id
            self.collection.trigger('leaflet', {
              type: 'mouseover',
              exp_id: exp_id,
            })

            layer.setStyle({
                opacity: 1,
                fillOpacity: 0.4
            });

            layer.bringToFront();

          },
          mouseout: function(e) {
            self.geoJSONLayer.resetStyle(self.geoJSONLayer);
            self.collection.trigger('leaflet', {
              type: 'mouseout',
              exp_id: exp_id,
            })
          },
        });
      }
    });

    this.map = L.map(this.el.id, {
      layers: [base, this.geoJSONLayer],
      maxBounds: maxBounds,
      minZoom: 6,
    });
  },

  leafletStyle: function style(feature) {
    /* Even if the default style is used, to get resetStyle working is needed
    to pass a function to L.geojson */
    return {
      stroke: true,
      color: '#03f',
      weight: 4,
      opacity: 0.5,
      fillColor: '#03f',
      fillOpacity: 0.2
    };
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
