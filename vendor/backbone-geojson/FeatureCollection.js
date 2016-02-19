Backbone.GeoJson = Backbone.GeoJson || {};
Backbone.GeoJson.FeatureCollection = Backbone.Collection.extend({

  model: Backbone.GeoJson.Feature,

  parse: function(response){
    return response.features;
  },

  filterBy: function(where){
    return new Backbone.GeoJson.FeatureCollection(this.filter(function(element){
      var properties = _.pick(element.get('properties'), _.keys(where));
      return _.isEqual(properties, where);
    }));
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
