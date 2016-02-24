Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoCollection = Backbone.GeoJson.FeatureCollection.extend({

    model: Backbone.SIXHIARA.Exploracao,
    url: '/exploracaos',

    filterBy: function(where){
      a = this.filter(function(element) {
        var properties = element.pick(_.keys(where));
        if (properties.utente) {
          properties.utente = properties.utente.nome;
        }
        return _.isEqual(properties, where);
      });
      return new Backbone.SIXHIARA.ExploracaoCollection(a);
    }

});
