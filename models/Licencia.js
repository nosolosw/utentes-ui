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
    'taxa_fixa': null,
    'taxa_uso': null,
    'pago_mes': null,
    'iva': null,
    'pago_iva': null,
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


    if (this.get('taxa_uso') === null
        && this.get('lic_tipo') === 'Subterrânea') {
      this.set('taxa_uso', 0.6);
    }

    if (this.get('iva') === null) {
      this.set('iva', 17);
    }

    this.on('change:taxa_fixa change:taxa_uso change:c_licencia', this.updatePagoMes, this);
    this.on('change:pago_mes change:iva', this.updatePagoIva, this);

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

  updatePagoMes: function() {
    var pago_mes = this.get('taxa_fixa') + (this.get('taxa_uso') * this.get('c_licencia'));
    this.set('pago_mes', pago_mes);
  },

  updatePagoIva: function() {
    var pago_iva = this.get('pago_mes') * (1 + this.get('iva') / 100);
    this.set('pago_iva', pago_iva);
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
