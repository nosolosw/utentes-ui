Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoCollection = Backbone.GeoJson.FeatureCollection.extend({

    model: Backbone.SIXHIARA.Exploracao,
    url: '/exploracaos.json',

    filterBy: function(where){
      a = this.filter(function(element) {
        return element.contains(where);
      });
      return new Backbone.SIXHIARA.ExploracaoCollection(a);
    }

});
