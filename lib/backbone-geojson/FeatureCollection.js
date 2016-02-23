Backbone.GeoJson = Backbone.GeoJson || {};
Backbone.GeoJson.FeatureCollection = Backbone.Collection.extend({

  model: Backbone.GeoJson.Feature,

  parse: function(response){
    return response.features;
  },

  toGeoJSON: function(){
    var features = [];
    this.models.forEach(function(model){
      features.push(model.toGeoJSON());
    });
    return {
      'type': 'FeatureCollection',
      'features': features
    };
  },

});
