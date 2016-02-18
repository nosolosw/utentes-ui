iCarto.Collections.FeatureCollection = Backbone.Collection.extend({

  model: Backbone.Model,

  parse: function(response){
    return response.features;
  },

});
