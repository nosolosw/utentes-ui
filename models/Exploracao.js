Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Exploracao = Backbone.GeoJson.Feature.extend({

  urlRoot: Backbone.SIXHIARA.Config.apiExploracaos,

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
    'actividade': new Backbone.Model(),
    'area':       null,
    'geometry':   null,
    'utente':     new Backbone.SIXHIARA.Utente(),
    'licencias':  new Backbone.SIXHIARA.LicenciaCollection(),
    'fontes':     new Backbone.SIXHIARA.FonteCollection(),
    'geometry':   new Backbone.Model(),
    'geometry_edited': false,
  },

  initialize: function(){
    // set some computed properties
    this.set('summary_licencia_val', this.updateSummaryEstado());
    this.set('summary_licencia_msg', 'Licença');
    this.set('summary_consumo_val',  this.updateSummaryConsumo());
    this.set('summary_consumo_msg',  'Consumo');
    this.set('summary_pagos_val',    this.updateSummaryPagos());
    this.set('summary_pagos_msg',    'Pagamentos');

    this.setListeners();
    this.on('sync', function(model, response, options){
      // TODO: on sync, how to off old listeners for licenses, if any?
      this.set('summary_licencia_val', this.updateSummaryEstado());
      this.set('summary_consumo_val',  this.updateSummaryConsumo());
      this.set('summary_pagos_val',    this.updateSummaryPagos());
      this.setListeners();
    }, this);

  },

  setListeners: function(){
    var app = this;

    // licenses
    this.get('licencias').forEach(function(model){
      model.on('change:c_soli_tot', app.updateCSoli, app);
      model.on('change:c_real_tot change:c_real_int', app.updateCReal, app);
      model.on('change:c_licencia', app.updateCLicencia, app);
      model.on('change:estado', app.updateSummaryEstado, app)
      // TODO: data should be shown as it is,
      // without updating computed properties first time
      app.updateCSoli();
      app.updateCReal();
      app.updateCLicencia();
    });
    this.get('licencias').on('add', function(model, collection, options){
      model.on('change:c_soli_tot', app.updateCSoli, app);
      model.on('change:c_real_tot change:c_real_int', app.updateCReal, app);
      model.on('change:c_licencia', app.updateCLicencia, app);
      model.on('change:estado', app.updateSummaryEstado, app)
      // TODO: data should be shown as it is,
      // without updating computed properties first time
      app.updateCSoli();
      app.updateCReal();
      app.updateCLicencia();
    });
    this.get('licencias').on('remove', function(model, collection, options){
      model.off('change:c_soli_tot', app.updateCSoli, app);
      model.off('change:c_real_tot change:c_real_int', app.updateCReal, app);
      model.off('change:c_licencia', app.updateCLicencia, app);
      model.off('change:estado', app.updateSummaryEstado, app)
      // TODO: data should be shown as it is,
      // without updating computed properties first time
      app.updateCSoli();
      app.updateCReal();
      app.updateCLicencia();
    });
    this.get('licencias').on('reset', function(collection, options){
      collection.forEach(function(model){
        model.on('change:c_soli_tot', app.updateCSoli, app);
        model.on('change:c_real_tot change:c_real_int', app.updateCReal, app);
        model.on('change:c_licencia', app.updateCLicencia, app);
        model.on('change:estado', app.updateSummaryEstado)
        // TODO: data should be shown as it is,
        // without updating computed properties first time
        app.updateCSoli();
        app.updateCReal();
        app.updateCLicencia();
      });
      collection.previousModels.forEach(function(model){
        model.off('change:c_soli_tot', app.updateCSoli, app);
        model.off('change:c_real_tot', app.updateCReal, app);
        model.off('change:c_licencia', app.updateCLicencia, app);
        model.off('change:estado', app.updateSummaryEstado, app)
        // TODO: data should be shown as it is,
        // without updating computed properties first time
        app.updateCSoli();
        app.updateCReal();
        app.updateCLicencia();
      });
    });

    // fontes
    this.get('fontes').forEach(function(model){
      model.on('change:c_soli', app.updateCSoliFon, app);
      model.on('change:c_real', app.updateCRealFon, app);
      // TODO: data should be shown as it is,
      // without updating computed properties first time
      app.updateCSoliFon();
      app.updateCRealFon();
      app.updateCSoli();
      app.updateCReal();
    });
    this.get('fontes').on('add', function(model, collection, options){
      model.on('change:c_soli', app.updateCSoliFon, app);
      model.on('change:c_real', app.updateCRealFon, app);
      // TODO: data should be shown as it is,
      // without updating computed properties first time
      app.updateCSoliFon();
      app.updateCRealFon();
      app.updateCSoli();
      app.updateCReal();
    });
    this.get('fontes').on('remove', function(model, collection, options){
      model.off('change:c_soli', app.updateCSoliFon, app);
      model.off('change:c_real', app.updateCRealFon, app);
      // TODO: data should be shown as it is,
      // without updating computed properties first time
      app.updateCSoliFon();
      app.updateCRealFon();
      app.updateCSoli();
      app.updateCReal();
    });
    this.get('fontes').on('reset', function(collection, options){
      collection.forEach(function(model){
        model.on('change:c_soli', app.updateCSoliFon, app);
        model.on('change:c_real', app.updateCRealFon, app);
        // TODO: data should be shown as it is,
        // without updating computed properties first time
        app.updateCSoliFon();
        app.updateCRealFon();
        app.updateCSoli();
        app.updateCReal();
      });
      collection.previousModels.forEach(function(license){
        model.off('change:c_soli', app.updateCSoliFon, app);
        model.off('change:c_real', app.updateCRealFon, app);
        // TODO: data should be shown as it is,
        // without updating computed properties first time
        app.updateCSoliFon();
        app.updateCRealFon();
      });
    });

    // actividade
    this.get('actividade').on('change', app.updateCEstimado, app);
    this.on('change:actividade', app.changedActivity, app);

    this.once('change', app.aChangeHappens, app);
    this.get('utente').once('change', app.aChangeHappens, app);
    this.get('actividade').once('change', app.aChangeHappens, app);
    this.get('fontes').once('change', app.aChangeHappens, app);
    this.get('licencias').once('change', app.aChangeHappens, app);

    this.on('change:c_licencia change:c_real change:c_estimado', app.updateSummaryConsumo)
    this.on('change:pagos:', app.updateSummaryPagos)
  },

  changedActivity: function() {
    this.get('actividade').on('change', this.updateCEstimado, this);
    this.updateCEstimado();
  },

  updateCEstimado: function(){
    if(this.get('actividade')){
      this.set('c_estimado', this.get('actividade').get('c_estimado'));
    }
  },

  updateCSoli: function(){
    this.set('c_soli', this.getCSoliTot());
  },

  getCSoliTot: function(){
    var c_soli = null;
    this.get('licencias').forEach(function(license){
      c_soli += license.get('c_soli_tot');
    });
    return c_soli;
  },

  updateCSoliFon: function(){
    var c_soli_fon_sup = null;
    var c_soli_fon_sub = null;
    this.get('fontes').where({'tipo_agua': 'Subterrânea'}).forEach(function(fonte){
      c_soli_fon_sub += fonte.get('c_soli');
    });
    this.get('fontes').where({'tipo_agua': 'Superficial'}).forEach(function(fonte){
      c_soli_fon_sup += fonte.get('c_soli');
    });
    // TODO: how to choose the license between the possible list?
    var licSup = this.get('licencias').where({'lic_tipo': 'Superficial'})[0];
    if(licSup != null){
      // this would trigger a recalculation of exploracao.c_soli
      licSup.set('c_soli_fon', c_soli_fon_sup);
    }
    var licSub = this.get('licencias').where({'lic_tipo': 'Subterrânea'})[0];
    if(licSub != null){
      // this would trigger a recalculation of exploracao.c_soli
      licSub.set('c_soli_fon', c_soli_fon_sub);
    }
  },

  updateCReal: function(){
    this.set('c_real', this.getCRealTot());
  },

  getCRealTot: function(){
    var c_real = null;
    this.get('licencias').forEach(function(license){
      c_real += license.get('c_real_int');
    });
    this.get('fontes').forEach(function(fonte){
      c_real += fonte.get('c_real');
    })
    return c_real;
  },

  updateCRealFon: function(){
    var c_real_fon_sup = null;
    var c_real_fon_sub = null;
    this.get('fontes').where({'tipo_agua': 'Subterrânea'}).forEach(function(fonte){
      c_real_fon_sub += fonte.get('c_real');
    });
    this.get('fontes').where({'tipo_agua': 'Superficial'}).forEach(function(fonte){
      c_real_fon_sup += fonte.get('c_real');
    });
    // TODO: how to choose the license between the possible list?
    var licSup = this.get('licencias').where({'lic_tipo': 'Superficial'})[0];
    if(licSup != null){
      // this would trigger a recalculation of exploracao.c_soli
      licSup.set('c_real_fon', c_real_fon_sup);
    }
    var licSub = this.get('licencias').where({'lic_tipo': 'Subterrânea'})[0];
    if(licSub != null){
      // this would trigger a recalculation of exploracao.c_soli
      licSub.set('c_real_fon', c_real_fon_sub);
    }
  },

  updateCLicencia: function(){
    this.set('c_licencia', this.getCLicencia());
  },

  getCLicencia: function(){
    var c_lic = null;
    this.get('licencias').forEach(function(license){
      c_lic += license.get('c_licencia');
    });
    return c_lic;
  },

  updateSummaryEstado: function(){
    var valid = false;
    this.get('licencias').forEach(function(licencia){
      valid = valid || (licencia.get('estado') === 'Licenciada');
    });
    this.set('summary_licencia_val', valid);
    return valid;
  },

  updateSummaryConsumo: function(){
    var c_licencia = this.get('c_licencia'),
    c_real = this.get('c_real'),
    c_estimado = this.get('c_estimado'),
    valid = c_licencia >= c_real && c_licencia >= c_estimado;
    this.set('summary_consumo_val', valid);
    return valid;
  },

  updateSummaryPagos: function(){
    this.set('summary_pagos_val', this.get('pagos'));
    return this.get('pagos');
  },

  urlShow: function() {
    return Backbone.SIXHIARA.Config.urlShow + this.id;
  },

  parse: function(response){
    response = Backbone.GeoJson.Feature.prototype.parse.apply(this, arguments);
    this.parseDate(response, 'd_soli');

    if (_.has(response, 'utente')) {
      response.utente = new Backbone.SIXHIARA.Utente(response.utente)
    }

    if (_.has(response, 'licencias')) {
      response.licencias = new Backbone.SIXHIARA.LicenciaCollection(response.licencias, {parse:true})
    }

    if (_.has(response, 'fontes')) {
      response.fontes = new Backbone.SIXHIARA.FonteCollection(response.fontes, {parse:true})
    }

    if (_.has(response, 'actividade')) {
      if (response.actividade) {
        response.actividade = new Backbone.SIXHIARA.ActividadesFactory[response.actividade.tipo](response.actividade, {parse:true});
      } else {
        response.actividade = new Backbone.Model();
      }
    }

    return response;
  },

  parseDate: function(response, field) {
    if (response[field]) {
      response[field] = new Date(response[field]);
    }
  },

  toJSON: function() {
    var json = _.clone(this.attributes);
    json.geometry   = this.get('geometry') ? this.get('geometry').toJSON() : null;
    json.utente     = this.get('utente').toJSON();
    json.licencias  = this.get('licencias').toJSON();
    json.fontes     = this.get('fontes').toJSON();
    if (this.getActividadeTipo() === Backbone.SIXHIARA.MSG.NO_ACTIVITY) {
      json.actividade = null;
    } else {
      json.actividade = this.get('actividade').toJSON();
    }
    json.urlShow    = this.urlShow();
    return json;
  },

  validate: function(attrs, options){
    var messages = [];

    // exploracao rules
    var expValidator = validator(EXPLORACAO_SCHEMA);
    expValidator.addRule('EXP_ID_FORMAT', {
      fails: function (value) {
        var re = /^\d{4}-\d{3}$/;
        return (value && (! re.test(value)));
      }
    });
    expValidator.addRule('ACTIVITY_NOT_NULL', {
      fails: function (value) {
        return (
          (value === null) ||
          (value === undefined) ||
          (value === '') ||
          (value.tipo === null) ||
          (value.tipo === undefined) ||
          (value.tipo === '') ||
          (value.tipo === Backbone.SIXHIARA.MSG.NO_ACTIVITY)
        );
      }
    });
    expValidator.validate(this.toJSON()).forEach(function(msg){
      messages.push(msg);
    });
    messages = messages.concat(this.validateActividade());

    // licencia rules
    var licValidator = validator(LICENCIA_SCHEMA);
    licValidator.addRule('LIC_NRO_FORMAT', {
      fails: function (value) {
        var re = /^\d{4}-\d{3}-\d{3}$/;
        return (value && (! re.test(value)));
      }
    });
    this.get('licencias').forEach(function(licencia){
      licValidator.validate(licencia.toJSON()).forEach(function(msg){
        messages.push(msg);
      });
    })

    // fonte rules
    var fonValidator = validator(FONTE_SCHEMA);
    this.get('fontes').forEach(function(fonte) {
      fonValidator.validate(fonte.toJSON()).forEach(function(msg){
        messages.push(msg);
      })
    });

    // utente rules
    validator(UTENTE_SCHEMA).validate(this.get('utente').toJSON()).forEach(function(msg){
      messages.push(msg);
    });



    if (messages.length > 0) return messages;

  },

  validateActividade: function() {
    var messages = [];
    var tipo = this.getActividadeTipo();
    if(tipo !== Backbone.SIXHIARA.MSG.NO_ACTIVITY){
      // only validate activities for a subset of estados
      var notValidatableStatus = [
        'Irregular',
        'Denegada',
        'Pendente solicitação utente',
        'Pendente revisão solicitação (Direcção)',
        'Pendente revisão solicitação (D. Jurídico)',
        'Pendente aprobação tecnica (D. Cadastro)'
      ];
      var estados = [];
      this.get('licencias').forEach(function (licencia) {
        estados.push(licencia.get('estado'));
      });
      var toValidateActivity = false;
      estados.forEach(function (estado) {
        if(!notValidatableStatus.includes(estado)){
          toValidateActivity = true;
        }
      })
      if(toValidateActivity){
        var actividadeSchema = ActividadeSchema[tipo];
        validator(actividadeSchema).validate(this.get('actividade').toJSON()).forEach(function(msg){
          messages.push(msg);
        });
        if (tipo === 'Agricultura-Regadia') {
          this.get('actividade').get('cultivos').forEach(function(cultivo){
            var msgs = cultivo.validate();
            if (msgs) {
              messages = messages.concat(msgs);
            }
          });
        } else if (tipo === 'Pecuária') {
          this.get('actividade').get('reses').forEach(function(cultivo){
            var msgs = cultivo.validate();
            if (msgs) {
              messages = messages.concat(msgs);
            }
          });
        }
      }
    }
    return messages;
  },

  contains: function(where){
    var values = _.omit(where.values(), 'utente', 'lic_tipo', 'estado', 'actividade', 'pagos', 'mapBounds');
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
    var containsActividade = true;
    if (where.attributes.actividade) {
      containsActividade = (this.get('actividade').get('tipo') === where.attributes.actividade);
    }

    var containsPagos = true;
    if (! _.isNull(where.attributes.pagos)) {
      containsPagos = this.get('pagos') === where.attributes.pagos;
    }

    var containsBounds = true;
    if (where.get('mapBounds')) {
      var feature = this.toGeoJSON();
      if (! _.isEmpty(feature.geometry)) {
        var bounds = L.GeoJSON.geometryToLayer(feature).getBounds()
        if (! where.get('mapBounds').intersects(bounds)) {
          containsBounds = false;
        }
      }
    }

    return containsAttrs && containsUtente && containsLic && containsActividade && containsBounds && containsPagos;
  },

  getActividadeTipo: function() {
    var tipo = Backbone.SIXHIARA.NO_ACTIVITY;
    if (this.get('actividade')) {
      tipo = this.get('actividade').get('tipo') || tipo;
    }
    return tipo;
  },

  aChangeHappens: function() {
    this.trigger('aChangeHappens');

    this.off('change', this.aChangeHappens, this);
    this.get('utente').off('change', this.aChangeHappens, this);
    this.get('actividade').off('change', this.aChangeHappens, this);
    this.get('fontes').off('change', this.aChangeHappens, this);
    this.get('licencias').off('change', this.aChangeHappens, this);
  },

  toSHP: function() {
    var geojson = this.toGeoJSON(),
        json = geojson.properties,
        tipo_subt = false,
        tipo_supe = false,
        con_lic_sb = null,
        con_lic_su = null,
        est_li_sb = null,
        est_li_su = null;
        for (var i = 0; i < json.licencias.length; i++) {
          var l = json.licencias[i];
          if (l.lic_tipo === 'Subterrânea') {
            tipo_subt = true;
            con_lic_sb = l.c_licencia;
            est_li_sb = l.estado;
          }

          if (l.lic_tipo === 'Superficial') {
            tipo_supe = true;
            con_lic_su = l.c_licencia;
            est_li_su = l.estado;
          }

          pagamento = 'No';
          if (_.isNull(json.pagamento)){
            pagamento == null;
          } else if (json.pagamento === true) {
            pagamento = 'Si';
          }
        }
        if (! _.isEmpty(geojson.geometry)) {
          geojson.geometry.type = 'Polygon';
        }
      return {
        "type": "Feature",
        "geometry": geojson.geometry,
        "properties": {
          'exp_name': json.exp_name,
                  'exp_id': json.exp_id,
                  'd_soli': json.d_soli,
                  'loc_provin': json.loc_provin,
                  'loc_distri': json.loc_distri,
                  'loc_posto': json.loc_posto,
                  'loc_nucleo': json.loc_nucleo,
                  'loc_endere': json.loc_endere,
                  'loc_bacia': json.loc_bacia,
                  'loc_subaci': json.loc_subaci,
                  'rio': json.rio,
                  'utente': json.utente.nome,
                  'uten_nuit': json.utente.nuit,
                  'abastecem': json.actividade.tipo === 'Abastecimento',
                  'saneament': json.actividade.tipo === 'Agricultura-Regadia',
                  'agricultu': json.actividade.tipo === 'Indústria',
                  'pecuaria': json.actividade.tipo === 'Pecuária',
                  'piscicult': json.actividade.tipo === 'Piscicultura',
                  'industria': json.actividade.tipo === 'Producção de energia',
                  'pro_energ': json.actividade.tipo === 'Saneamento',
                  'tipo_subt': tipo_subt,
                  'tipo_supe': tipo_supe,
                  'con_l_su': con_lic_su,
                  'con_l_sb': con_lic_sb,
                  'con_l_to': json.c_licencia,
                  'est_l_su': est_li_su,
                  'est_l_sb': est_li_sb,
                  'pagamento': pagamento,
                  'observacio': json.observacio,
        },
      };
    },

});
