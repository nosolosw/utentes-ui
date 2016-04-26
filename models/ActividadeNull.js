Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeNull = Backbone.Model.extend({

  defaults: {
    'id': null,
    'tipo': 'Actividade non declarada',
  },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Actividade non declarada'] = Backbone.SIXHIARA.ActividadeNull;
