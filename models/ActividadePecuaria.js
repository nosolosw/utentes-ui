Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePecuaria = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'tipo': 'Pecuária',
    'reses': new Backbone.Collection()
  },

  initialize: function() {
    // on add, remove & update every cultivo
    this.get('reses').on('all', this.updateCEstimado, this);
  },

  updateCEstimado: function () {
    var c_estimado = 0;
    this.get('reses').forEach(function(res){
      c_estimado = c_estimado + res.get('c_estimado');
    });
    this.set('c_estimado', c_estimado);
  },

  toJSON: function () {
    var json   =  _.clone(this.attributes);
    json.reses = this.get('reses').toJSON();
    return json;
  },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Pecuária'] = new Backbone.SIXHIARA.ActividadePecuaria();
