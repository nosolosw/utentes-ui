Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Licencia = Backbone.Model.extend({

  defaults: {
    'lic_nro':    '', // TODO: autocalculate from exp_id
    'lic_tipo':   '',
    'cadastro':   '',
    'estado':     '',
    'c_requerid': null,
    'c_real':     null,
    'c_licencia': null,
    'd_emissao':  '1/2/2016',
    'd_validade': '1/2/2016',
  }

});
