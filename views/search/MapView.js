Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.MapView = Backbone.View.extend({

  initialize: function(options){

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

    options = options || {};
    options.mapOptions = options.mapOptions || {zoom:SIXHIARA.search.zoom};
    options.offline = {layers: allLayers};
    this.map = Backbone.SIXHIARA.mapConfig(this.el.id, options);

    this.mapEvents();
    this.geoJSONLayer.addTo(this.map);

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
      this.map.fitBounds(bounds.pad(0.04))
      var center = this.map.getCenter();
      var zoom = this.map.getZoom();
      if (zoom > 15) this.map.setZoomAround(center, 15);
    } else{
      this.map.setView(SIXHIARA.center, SIXHIARA.search.zoom);
    }
  },

  mapEvents: function() {
    var self = this;
    this.map.on('moveend', function(e){
      // user or programatic event? https://github.com/Leaflet/Leaflet/issues/2267
      if (e.hard) return;
      where.set('mapBounds', self.map.getBounds());
    });
  }

});
