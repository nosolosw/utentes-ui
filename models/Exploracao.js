Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Exploracao = Backbone.GeoJson.Feature.extend({

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
    'pagos':  false,
    'utente': new Backbone.SIXHIARA.Utente(),
    'licencias': new Backbone.SIXHIARA.LicenciaCollection(),
    'fontes': [],

    'consumo': 'C' // FIXME. Está en las fixtures
  },

});
