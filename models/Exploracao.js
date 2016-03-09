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
    'geometry':   null,
    'utente':     new Backbone.SIXHIARA.Utente(),
    'licencias':  new Backbone.SIXHIARA.LicenciaCollection(),
    'fontes':     new Backbone.SIXHIARA.FonteCollection(),
    'geometry':   new Backbone.Model(),

  },

  initialize: function(){
    // set some computed properties
    this.set('summary_licencia_val', this.getSummaryEstado());
    this.set('summary_licencia_msg', 'Licencia');
    this.set('summary_consumo_val',  this.getSummaryConsumo());
    this.set('summary_consumo_msg',  'Consumo');
    this.set('summary_pagos_val',    this.getSummaryPagos());
    this.set('summary_pagos_msg',    'Pagos');
  },

  getSummaryEstado: function(){
    var valid = true;
    this.get('licencias').forEach(function(licencia){
      valid = valid && (licencia.get('estado') === 'Licenciada');
    });
    return valid;
  },

  getSummaryConsumo: function(){
    return (this.get('c_licencia') >= this.get('c_real'));
  },

  getSummaryPagos: function(){
    return this.get('pagos');
  },

  showUrl: function() {
    return Backbone.SIXHIARA.Config.showUrl + this.id;
  },

  parse: function(response){
    response = Backbone.GeoJson.Feature.prototype.parse.apply(this, arguments);

    if (_.has(response, 'utente')) {
      response.utente = new Backbone.SIXHIARA.Utente(response.utente)
    }

    if (_.has(response, 'licencias')) {
      response.licencias = new Backbone.SIXHIARA.LicenciaCollection(response.licencias)
    }

    if (_.has(response, 'fontes')) {
      response.fontes = new Backbone.SIXHIARA.FonteCollection(response.fontes)
    }

    return response;
  },

  toJSON: function() {
    var json =  _.clone(this.attributes);
    json.geometry = this.get('geometry').toJSON();
    json.utente = this.get('utente').toJSON();
    json.licencias = this.get('licencias').toJSON();
    json.fontes = this.get('fontes').toJSON();
    json.showUrl = this.showUrl();
    return json;
  },

  validate: function(attrs, options){
    var messages = [];

    var expValidator = validator(EXPLORACAO_SCHEMA);
    expValidator.addRule('EXP_ID_FORMAT', {
      fails: function (value) {
        var re = /^\d{4}-\d{3}$/;
        return (value && (! re.test(value)));
      }
    });

    expValidator.validate(this.attributes).forEach(function(msg){
      messages.push(msg);
    });

    var licValidator = validator(LICENCIA_SCHEMA);
    licValidator.addRule('LIC_NRO_FORMAT', {
      fails: function (value) {
        var re = /^\d{4}-\d{3}-\d{3}$/;
        return (value && (! re.test(value)));
      }
    });
    this.get('licencias').forEach(function(licencia){
      licValidator.validate(licencia.attributes).forEach(function(msg){
        messages.push(msg);
      });
    })

    var fonValidator = validator(FONTE_SCHEMA);
    this.get('fontes').forEach(function(fonte) {
      fonValidator.validate(fonte.toJSON()).forEach(function(msg){
        messages.push(msg);
      })
    });

    validator(UTENTE_SCHEMA).validate(this.get('utente').attributes).forEach(function(msg){
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
      containsUtente = (this.get('utente').get('nome') === where.attributes.utente);
    }
    var containsLic = true;
    if(where.attributes.lic_tipo || where.attributes.estado){
      containsLic = false;
      var whereLic = _.pick(where.values(), 'lic_tipo', 'estado');
      var lics = this.get('licencias').where(whereLic);
      if (lics.length > 0) {
        containsLic = true;
      }
    }
    return containsAttrs && containsUtente && containsLic;
  }

});
