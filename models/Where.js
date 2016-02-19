Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Where = Backbone.Model.extend({

  defaults: {
    'loc_provin': '',
    'loc_distri': '',
    'loc_posto':  '',
    'utente':     '',
    'lic_tipo':     '',
    'estado':     '',
    'pagos':      '',
    'actividade': '',
  },

  values: function(){
    // only return those pairs that are not void
    return _.omit(this.toJSON(), function(value, key, object){
      return value === '';
    });
  },

});
