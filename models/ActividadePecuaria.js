Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePecuaria = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'tipo': 'Pecuária',
    'reses': new Backbone.Collection()
  },

  initialize: function() {
    // Workaround. Al añadir modelos a reses por algún motivo se estaba
    // modificando el modelo de ActividadePecuaria en sí por lo que cuando se
    // creaba uno nuevo mantenía las reses creadas anteriormente
    this.set('reses', new Backbone.Collection());
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
Backbone.SIXHIARA.ActividadesFactory['Pecuária'] = Backbone.SIXHIARA.ActividadePecuaria;
