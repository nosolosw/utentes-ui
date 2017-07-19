Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePiscicultura = Backbone.SIXHIARA.ActividadeNull.extend({

  defaults: {
    'id':         null,
    'tipo':       'Piscicultura',
    'c_estimado': null,
    'area':       null,
    'v_reservas': null,
    'tanques': new Backbone.SIXHIARA.TanqueCollection(),
  },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Piscicultura'] = Backbone.SIXHIARA.ActividadePiscicultura;
