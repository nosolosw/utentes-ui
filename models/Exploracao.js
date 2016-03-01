Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Exploracao = Backbone.GeoJson.Feature.extend({

  urlRoot: '/api/exploracaos',

  defaults: {
    'id':         null,
    'exp_id':     null,
    'exp_name':   null,
    'd_soli':     null,
    'observacio': null,
    'loc_provin': null,
    'loc_distri': null,
    'loc_posto':  null,
    'loc_nucleo': null,
    'loc_endere': null,
    'loc_bacia':  null,
    'loc_subaci': null,
    'loc_rio':    null,
    'pagos':      null,
    'c_soli':     null,
    'c_licencia': null,
    'c_real':     null,
    'c_estimado': null,
    'actividade': null,
    'area':       null,
    'utente':     new Backbone.SIXHIARA.Utente(),
    'licencias':  new Backbone.SIXHIARA.LicenciaCollection(),
    'fontes':     new Backbone.SIXHIARA.FonteCollection(),

    'consumo': 'C', // FIXME. Está en las fixtures
    'estado':  'L', // FIXME. Está en las fixtures
    // 'pagos':   'P', // FIXME. Está en las fixtures. En create tiene que ser un booleano
  },

  validate: function(attrs, options){
    var messages = [];

    var msgsExp = validator(EXPLORACAO_SCHEMA).validate(this.attributes);
    msgsExp.forEach(function(msg){
      messages.push(msg);
    });

    var msgsUtente = validator(UTENTE_SCHEMA).validate(this.get('utente').attributes);
    msgsUtente.forEach(function(msg){
      messages.push(msg);
    });

    if (messages.length > 0) return messages;

  },

  contains: function(where){
    var values = _.omit(where.values(), 'utente', 'lic_tipo', 'estado');
    var properties = this.pick(_.keys(values));
    var containsAttrs = _.isEqual(properties, values);
    var containsUtente = true;
    if (where.attributes.utente) {
      containsUtente = (this.get('utente').nome === where.attributes.utente);
    }
    var containsLic = true;
    if(where.attributes.lic_tipo || where.attributes.estado){
      containsLic = false;
      var whereLic = _.pick(where.values(), 'lic_tipo', 'estado');
      var lics = new Backbone.SIXHIARA.LicenciaCollection(this.get('licencias')).where(whereLic);
      if (lics.length > 0) {
        containsLic = true;
      }
    }
    return containsAttrs && containsUtente && containsLic;
  },

});
