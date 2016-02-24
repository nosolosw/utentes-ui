Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Licencia = Backbone.Model.extend({

  defaults: {
    'lic_nro':    '', // TODO: autocalculate from exp_id
    'lic_tipo':   '',
    'cadastro':   '',
    'estado':     '',
    'c_requerid': null,
  }

});
