Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeRegadia = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'tipo':       'Agricultura-Regadia',
    'c_estimado': null,
    'cultivos':   new Backbone.Collection(),
  },

  initialize: function () {
    // on add, remove & update every cultivo
    this.get('cultivos').on('all', this.updateCEstimado, this);
  },

  updateCEstimado: function () {
    var c_estimado = 0;
    this.get('cultivos').forEach(function(cultivo){
      c_estimado = c_estimado + cultivo.get('c_estimado');
    });
    this.set('c_estimado', c_estimado);
  },

  toJSON: function () {
    var json      =  _.clone(this.attributes);
    json.cultivos = this.get('cultivos').toJSON();
    return json;
  },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Agricultura-Regadia'] = Backbone.SIXHIARA.ActividadeRegadia;
