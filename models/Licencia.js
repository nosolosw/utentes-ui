Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Licencia = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'lic_nro':    null, // TODO: autocalculate from exp_id
    'lic_tipo':   null,
    'cadastro':   null,
    'estado':     null,
    'd_emissao':  null,
    'd_validade': null,
    'c_soli_tot': null,
    'c_soli_int': null,
    'c_soli_fon': null,
    'c_licencia': null,
    'c_real_tot': null,
    'c_real_int': null,
    'c_real_fon': null,
  }

});
