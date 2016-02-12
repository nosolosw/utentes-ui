$(document).ready(function() {
  $('#wizard-exp').bootstrapWizard({
    'withVisible': false
  });
});

var exploracao = new SIXHIARA.Models.Exploracao();
var utentes = new SIXHIARA.Collections.Utentes([
  {'nome': 'Anadarco Mozambique', 'nuit': '456', 'reg_comerc': '', 'reg_zona': ''},
  {'nome': 'iCarto', 'nuit': '123', 'reg_comerc': '', 'reg_zona': ''},
]);

// TODO: review how to garbage-collect views after this window is closed

new iCarto.Views.Widgets({
  el: $('#info'),
  model: exploracao
}).render();

new iCarto.Views.Widgets({
  el: $('#utente'),
  model: exploracao.get('utente')
}).render();

new SIXHIARA.Views.SaveButton({
  el: $('#save-button'),
  model: exploracao
}).render();

new SIXHIARA.Views.SelectUtente({
  el: $('#utente'),
  model: utentes
}).render();
