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

// TODO: move to a configurable file endpoint
var utentes = new SIXHIARA.Collections.Utentes([
  {'nome': 'Anadarco Mozambique', 'nuit': '456', 'reg_comerc': '', 'reg_zona': ''},
  {'nome': 'iCarto', 'nuit': '123', 'reg_comerc': '', 'reg_zona': ''},
]);
var estadosLicencia = new SIXHIARA.Collections.EstadosLicencia([
  {'text': 'Irregular', 'order': 0},
  {'text': 'Licenciada', 'order': 3},
  {'text': 'Pdte Solicitaçao utente', 'order': 1},
  {'text': 'Pdte Emisao', 'order': 2},
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
});

new SIXHIARA.Views.SelectEstadoLicencia({
  el: $('.estado-superficial'),
  model: estadosLicencia
}).render();

new iCarto.Views.Widgets({
    el: $('#licencia-subterranea'),
    model: licenciaSubterranea
});

new SIXHIARA.Views.SelectEstadoLicencia({
  el: $('.estado-subterranea'),
  model: estadosLicencia
}).render();
