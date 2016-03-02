Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Utente = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'nome':       null,
    'nuit':       null,
    'reg_comerc': null,
    'reg_zona':   null,
    'loc_provin': null,
    'loc_distri': null,
    'loc_posto':  null,
    'loc_nucleo': null,
    'observacio': null,
  }

});
