$(document).ready(function() {
  $('#wizard-exp').bootstrapWizard({
    'withVisible': false
  });
});

var domains = DOMAINS_REPO; // TODO: take from API
var provincias = domains.byCategory('provincia');
var distritos = domains.byCategory('distrito');
var postos = domains.byCategory('posto');
var bacias = domains.byCategory('bacia');
var subacias = domains.byCategory('subacia');
var estadosLicencia = domains.byCategory('estado-licencia');

var utentes = UTENTES_REPO; // TODO: take from API

var exploracao = new SIXHIARA.Models.Exploracao();
var licenciaSubterranea = new SIXHIARA.Models.Licencia({
  'lic_tipo': 'subterranea'
});
var licenciaSuperficial = new SIXHIARA.Models.Licencia({
  'lic_tipo': 'superficial'
});
exploracao.get('licencias').add(licenciaSuperficial);
exploracao.get('licencias').add(licenciaSubterranea);

// TODO: review how to garbage-collect views after this window is closed

new SIXHIARA.Views.SaveButton({
  el: $('#save-button'),
  model: exploracao
}).render();

// block info
new iCarto.Views.Widgets({
  el: $('#info'),
  model: exploracao
}).render();

new iCarto.Views.SelectFiller({
  el: $('#loc_provin'),
  collection: provincias
}).render();

var selectDistritos = new iCarto.Views.SelectFiller({
  el: $('#loc_distri'),
  collection: [],
}).render();
selectDistritos.listenTo(exploracao, 'change:loc_provin', function(model, value, options){
  this.update(distritos.where({'parent': model.get('loc_provin')}));
});

var selectPostos = new iCarto.Views.SelectFiller({
  el: $('#loc_posto'),
  collection: [],
}).render();
selectPostos.listenTo(exploracao, 'change:loc_distri', function(model, value, options){
  this.update(postos.where({'parent': model.get('loc_distri')}));
});

new iCarto.Views.SelectFiller({
  el: $('#loc_bacia'),
  collection: bacias
}).render();

var selectSubacias = new iCarto.Views.SelectFiller({
  el: $('#loc_subaci'),
  collection: [],
}).render();
selectSubacias.listenTo(exploracao, 'change:loc_bacia', function(model, value, options){
  this.update(subacias.where({'parent': model.get('loc_bacia')}));
});

// block utente
new iCarto.Views.Widgets({
  el: $('#utente'),
  model: exploracao.get('utente')
}).render();

new SIXHIARA.Views.SelectUtente({
  el: $('#utente'),
  model: utentes
}).render();

// block licencias
new iCarto.Views.Widgets({
  el: $('#licencia-superficial'),
  model: licenciaSuperficial
}).render();

new iCarto.Views.SelectFiller({
  el: $('.estado-superficial'),
  collection: estadosLicencia
}).render();

new iCarto.Views.Widgets({
  el: $('#licencia-subterranea'),
  model: licenciaSubterranea
}).render();

new iCarto.Views.SelectFiller({
  el: $('.estado-subterranea'),
  collection: estadosLicencia
}).render();
