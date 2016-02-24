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
      var feature = model.toGeoJSON();
      if (! _.isEmpty(feature.geometry)) {
        features.push(feature);
      }
    });
    return {
      'type': 'FeatureCollection',
      'features': features
    };
  },

});
