Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Utente = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'nome':       null,
    'nuit':       null,
    'entidade':   null,
    'reg_comerc': null,
    'reg_zona':   null,
    'loc_provin': null,
    'loc_distri': null,
    'loc_posto':  null,
    'loc_nucleo': null,
    'observacio': null,
  },

  validate: function(attrs, options){
    var messages = [];
    validator(UTENTE_SCHEMA).validate(this.attributes).forEach(function(msg){
      messages.push(msg);
    });
    if (messages.length > 0) return messages;
  },

});
