Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePecuaria = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'tipo': 'Pecuária',
    'reses': new Backbone.SIXHIARA.ResCollection()
  },

  initialize: function() {
    this.get('reses').on('all', this.updateCEstimado, this);
  },

  parse: function(response) {
      response.reses = new Backbone.SIXHIARA.ResCollection(response.reses, {parse: true});
      return response;
  },

  updateCEstimado: function () {
    var c_estimado = 0;
    this.get('reses').forEach(function(res){
      c_estimado = c_estimado + res.get('c_estimado');
    });
    this.set('c_estimado', c_estimado);
    this.trigger('change', this.model);
  },

  toJSON: function () {
    var json   =  _.clone(this.attributes);
    json.reses = this.get('reses').toJSON();
    return json;
  },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Pecuária'] = Backbone.SIXHIARA.ActividadePecuaria;
