Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePiscicultura = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'tipo':       'Piscicultura',
    'c_estimado': null,
    'area':       null,
    'v_reservas': null
  },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Piscicultura'] = new Backbone.SIXHIARA.ActividadePiscicultura();
