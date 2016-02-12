$(document).ready(function() {
  $('#wizard-exp').bootstrapWizard({
    'withVisible': false
  });
});

var exploracao = new SIXHIARA.Models.Exploracao();
var licenciaSubterranea = new SIXHIARA.Models.Licencia({
  'lic_tipo': 'subterranea'
});
var licenciaSuperficial = new SIXHIARA.Models.Licencia({
  'lic_tipo': 'superficial'
});
exploracao.get('licencias').add(licenciaSuperficial);
exploracao.get('licencias').add(licenciaSubterranea);

// TODO: DOMINIOS move to a configurable file endpoint
var utentes = new SIXHIARA.Collections.Utentes([
  {'nome': 'Anadarco Mozambique', 'nuit': '456', 'reg_comerc': '', 'reg_zona': ''},
  {'nome': 'iCarto', 'nuit': '123', 'reg_comerc': '', 'reg_zona': ''},
]);

var estadosLicencia = new iCarto.Collections.Dominios([
  {'text': 'Irregular', 'alias': 'irregular', 'order': 0},
  {'text': 'Licenciada', 'order': 3},
  {'text': 'Pdte Solicitaçao utente', 'order': 1},
  {'text': 'Pdte Emisao', 'order': 2},
]);

var provincias = new iCarto.Collections.Dominios([
  {'text': 'Cabo Delgado'},
  {'text': 'Niassa'},
]);

var distritos = new iCarto.Collections.Dominios([
  {'text': 'Ancuabe'},
  {'text': 'Balama'},
]);

var postos = new iCarto.Collections.Dominios([
  {'text': 'Mesa'},
  {'text': 'Metoro'},
]);

var bacias = new iCarto.Collections.Dominios([
  {'text': 'Megaruma'},
  {'text': 'Messalo'},
]);

var subacias = new iCarto.Collections.Dominios([
  {'text': 'Miruco'},
  {'text': 'Muaguide'},
]);

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
  model: provincias
}).render();

new iCarto.Views.SelectFiller({
  el: $('#loc_distri'),
  model: distritos
}).render();

new iCarto.Views.SelectFiller({
  el: $('#loc_posto'),
  model: postos
}).render();

new iCarto.Views.SelectFiller({
  el: $('#loc_bacia'),
  model: bacias
}).render();

new iCarto.Views.SelectFiller({
  el: $('#loc_subaci'),
  model: subacias
}).render();

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
  model: estadosLicencia
}).render();

new iCarto.Views.Widgets({
  el: $('#licencia-subterranea'),
  model: licenciaSubterranea
}).render();

new iCarto.Views.SelectFiller({
  el: $('.estado-subterranea'),
  model: estadosLicencia
}).render();
