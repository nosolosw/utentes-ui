SIXHIARA.Models.Exploracao = Backbone.Model.extend({

  defaults: {
    'exp_id'    : '',
    'exp_name'  : '',
    'observacio': '',
    'loc_provin': '',
    'loc_distri': '',
    'loc_posto':  '',
    'loc_nucleo': '',
    'loc_bacia':  '',
    'loc_rio':    '',
    'utente': new SIXHIARA.Models.Utente(),
  }

});
