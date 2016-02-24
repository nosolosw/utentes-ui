Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoCollection = Backbone.GeoJson.FeatureCollection.extend({

    model: Backbone.SIXHIARA.Exploracao,
    url: '/exploracaos.json',

    filterBy: function(where){
      a = this.filter(function(element) {
        var properties = element.pick(_.keys(where));
        if (properties.utente) {
          properties.utente = properties.utente.nome;
        }
        if(where.lic_tipo || where.estado){
          var lics = new Backbone.SIXHIARA.LicenciaCollection(element.get('licencias')).where(where);
          if (lics.length > 0) return true;
        }
        return _.isEqual(properties, where);
      });
      return new Backbone.SIXHIARA.ExploracaoCollection(a);
    }

});
