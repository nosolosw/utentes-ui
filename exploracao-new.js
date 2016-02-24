$(document).ready(function() {
  $('#wizard-exp').bootstrapWizard({
    'withVisible': false
  });
});

var domains = DOMAINS_REPO; // TODO: take from API
var provincias      = domains.byCategory('provincia');
var distritos       = domains.byCategory('distrito');
var postos          = domains.byCategory('posto');
var bacias          = domains.byCategory('bacia');
var subacias        = domains.byCategory('subacia');
var estadosLicencia = domains.byCategory('licencia_estado');
var actividades     = domains.byCategory('actividade');
// var tiposFonte      = domains.byCategory('tipo-fonte');


var utentes = UTENTES_REPO; // TODO: take from API

var exploracao = new Backbone.SIXHIARA.Exploracao();

// add skeleton licencias
var licenciaSubterranea = new Backbone.SIXHIARA.Licencia({
  'lic_tipo': 'subterranea'
});
var licenciaSuperficial = new Backbone.SIXHIARA.Licencia({
  'lic_tipo': 'superficial'
});
exploracao.get('licencias').add(licenciaSuperficial);
exploracao.get('licencias').add(licenciaSubterranea);

new Backbone.SIXHIARA.ButtonSaveView({
  el: $('#save-button'),
  model: exploracao
}).render();

// block info
new Backbone.UILib.WidgetsView({
  el: $('#info'),
  model: exploracao
}).render();

new Backbone.UILib.SelectView({
  el: $('#loc_provin'),
  collection: provincias
}).render();

var selectDistritos = new Backbone.UILib.SelectView({
  el: $('#loc_distri'),
  collection: [],
}).render();
selectDistritos.listenTo(exploracao, 'change:loc_provin', function(model, value, options){
  this.update(distritos.where({'parent': model.get('loc_provin')}));
});

var selectPostos = new Backbone.UILib.SelectView({
  el: $('#loc_posto'),
  collection: [],
}).render();
selectPostos.listenTo(exploracao, 'change:loc_distri', function(model, value, options){
  this.update(postos.where({'parent': model.get('loc_distri')}));
});

new Backbone.UILib.SelectView({
  el: $('#loc_bacia'),
  collection: bacias
}).render();

var selectSubacias = new Backbone.UILib.SelectView({
  el: $('#loc_subaci'),
  collection: [],
}).render();
selectSubacias.listenTo(exploracao, 'change:loc_bacia', function(model, value, options){
  this.update(subacias.where({'parent': model.get('loc_bacia')}));
});

// block utente
new Backbone.UILib.WidgetsView({
  el: $('#utente'),
  model: exploracao.get('utente')
}).render();

new Backbone.SIXHIARA.SelectUtenteView({
  el: $('#utente'),
  model: utentes
}).render();

// TODO: look for a better way to organize this
new Backbone.UILib.WidgetsView({
  el: $('#actividade-explotacion'),
  model: exploracao
}).render();

new Backbone.UILib.SelectView({
  el: $('#actividade'),
  collection: actividades
}).render();

// block licencias
new Backbone.UILib.WidgetsView({
  el: $('#licencia-superficial'),
  model: licenciaSuperficial
}).render();

new Backbone.UILib.SelectView({
  el: $('.estado-superficial'),
  collection: estadosLicencia
}).render();

new Backbone.UILib.WidgetsView({
  el: $('#licencia-subterranea'),
  model: licenciaSubterranea
}).render();

new Backbone.UILib.SelectView({
  el: $('.estado-subterranea'),
  collection: estadosLicencia
}).render();

var tableFontesView = new Backbone.SIXHIARA.TableFontesView({
  el: $('#fontes'),
  collection: exploracao.get('fontes')
}).render();
tableFontesView.listenTo(exploracao.get('fontes'), 'add', function(model, collection, options){
  this.update(exploracao.get('fontes'));
});
tableFontesView.listenTo(exploracao.get('fontes'), 'destroy', function(model, collection, options){
  this.update(exploracao.get('fontes'));
});

new Backbone.SIXHIARA.ModalFonteView({
  el: $('#fonteSupModal'),
  collection: exploracao.get('fontes')
});

new Backbone.SIXHIARA.ModalFonteView({
  el: $('#fonteSubModal'),
  collection: exploracao.get('fontes')
});

// TODO: convert to domains
// new Backbone.UILib.SelectView({
//   el: $('#fonteSubModal #tipo_fonte'),
//   collection: tiposFonte.byParent('Subterránea')
// });
//
// new Backbone.UILib.SelectView({
//   el: $('#fonteSupModal #tipo_fonte'),
//   collection: tiposFonte.byParent('Superficial')
// });
