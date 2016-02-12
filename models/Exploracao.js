SIXHIARA.Models.Exploracao = Backbone.Model.extend({

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
    'utente': new SIXHIARA.Models.Utente(),
    'licencias': new SIXHIARA.Collections.Licencias(),
  }

});
