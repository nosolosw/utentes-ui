$(document).ready(function() {
  $('#wizard-exp').bootstrapWizard({
    'withVisible': false
  });
});

var exploracao = new SIXHIARA.Models.Exploracao();

new iCarto.Views.Widgets({
  el: $('#info'),
  model: exploracao
});

new SIXHIARA.Views.SaveButton({
  el: $('#save-button'),
  model: exploracao
});
