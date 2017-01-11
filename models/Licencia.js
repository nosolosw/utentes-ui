Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Licencia = Backbone.Model.extend({

  defaults: {
    'id':         null,
    'lic_nro':    null, // TODO: autocalculate from exp_id
    'lic_tipo':   null,
    'cadastro':   null,
    'estado':     null,
    'd_emissao':  null,
    'd_validade': null,
    'c_soli_tot': null,
    'c_soli_int': null,
    'c_soli_fon': null,
    'c_licencia': null,
    'c_real_tot': null,
    'c_real_int': null,
    'c_real_fon': null,
  },

  initialize: function(){
    this.on('change:c_soli_int change:c_soli_fon', function(model, value, options){
      // TODO: set c_soli_tot, taking into account null values
      this.set('c_soli_tot', this.getSoliTot());
    }, this);
    this.on('change:c_real_int change:c_real_fon', function(model, value, options){
      // TODO: set c_real_tot, taking into account null values
      this.set('c_real_tot', this.getRealTot());
    }, this);
  },

  parse: function(response) {
    this.parseDate(response, 'd_emissao');
    this.parseDate(response, 'd_validade');
    return response;
  },

  parseDate: function(response, field) {
    if (response[field]) {
      response[field] = new Date(response[field]);
    }
  },

  getSoliTot: function(){
    return this.get('c_soli_int') + this.get('c_soli_fon');
  },

  getRealTot: function(){
    return this.get('c_real_int') + this.get('c_real_fon');
  },

  impliesValidateActivity: function() {
    return ! [
      'Irregular',
      'Não aprovada',
      'Pendente de solicitação do utente',
      'Pendente de revisão da solicitação (Direcção)',
      'Pendente de revisão da solicitação (D. Jurídico)',
      'Pendente de aprovação tecnica (R. Cadastro)',
    ].includes(this.get('estado'));
  },

  isLicensed: function() {
    return this.get('estado') === 'Licenciada';
  },

});
