Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Exploracao = Backbone.GeoJson.Feature.extend({

  urlRoot: '/exploracao',
  
  defaults: {
    'exp_id':     '',
    'exp_name':   '',
    'd_solici':   '',
    'observacio': '',
    'loc_provin': '',
    'loc_distri': '',
    'loc_posto':  '',
    'loc_nucleo': '',
    'loc_endere': '',
    'loc_bacia':  '',
    'loc_subaci':  '',
    'loc_rio':    '',
    'pagos':      false,
    'utente':     new Backbone.SIXHIARA.Utente(), // FIXME. No se está rellenando como un modelo si no como obj js
    'licencias':  new Backbone.SIXHIARA.LicenciaCollection(),
    'fontes':     new Backbone.SIXHIARA.FonteCollection(),
    'actividade': '',

    'consumo': 'C', // FIXME. Está en las fixtures
    'estado':  'L', // FIXME. Está en las fixtures
    // 'pagos':   'P', // FIXME. Está en las fixtures. En create tiene que ser un booleano
  },

  initialize: function(){
    // TODO: take exp_id from url
    var exp_id = window.location.search.split('=')[1];
    if((exp_id != undefined) && (exp_id != '') && (exp_id != null)){
      this.set('exp_id', exp_id);
    }
  },

  validate: function(attrs, options){
    var messages = [];
    if((attrs.exp_id === '') || (attrs.exp_id === undefined) || (attrs.exp_id === null)){
      messages.push('Nº de exploracão vacío')
    }
    var nome = this.get('utente').get('nome');
    if((nome === '') || (nome === undefined) || (nome === null)){
      messages.push('Nome de utente vacío')
    }
    if (messages.length > 0) return messages;
  }

});
