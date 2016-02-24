Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.MapView = Backbone.View.extend({

  initialize: function(){
    var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    this.geoJSONLayer = L.geoJson(this.collection.toGeoJSON());
    this.map = L.map(this.el.id, {
      center: [-13, 39.25],
      zoom: 8,
      layers: [base, this.geoJSONLayer]
    });

    if(this.collection.length > 0){
      this.map.fitBounds(this.geoJSONLayer.getBounds())
      .setMaxBounds(this.geoJSONLayer.getBounds().pad(0.5));
    } else{
      // TODO: zoom to the northen area of Mozambique
      this.map.fitBounds([[-13, 39.25]]);
    }
  },

  update: function(newCollection){
    this.collection = newCollection;
    this.geoJSONLayer.clearLayers();
    if(this.collection.length > 0){
      this.geoJSONLayer.addData(this.collection.toGeoJSON());
      this.map.fitBounds(this.geoJSONLayer.getBounds())
      .setMaxBounds(this.geoJSONLayer.getBounds().pad(0.5));
    } else{
      // TODO: zoom to the northen area of Mozambique
      this.map.fitBounds([[-13, 39.25]]);
      this.map.setZoom(8);
    }
  },

});
