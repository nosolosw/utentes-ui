Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePecuaria = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'tipo': 'Pecuária',
    'reses': new Backbone.Collection()
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
