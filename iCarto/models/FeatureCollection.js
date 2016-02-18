iCarto.Collections.FeatureCollection = Backbone.Collection.extend({

  model: Backbone.Model,

  parse: function(response){
    return response.features;
  },

  filterBy: function(where){
    return new iCarto.Collections.FeatureCollection(this.filter(function(element){
      var properties = _.pick(element.get('properties'), _.keys(where));
      return _.isEqual(properties, where);
    }));
  },

});
