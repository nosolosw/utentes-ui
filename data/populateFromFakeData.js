function populateFromFakeData(exploracao){
  // TODO: take from API

  // block info
  new Backbone.UILib.WidgetsView({
    el: $('#info'),
    model: exploracao
  }).render();

  new Backbone.UILib.WidgetsView({
    el: $('#loc-info'),
    model: exploracao
  }).render();

  // block utente
  new Backbone.UILib.WidgetsView({
    el: $('#utente'),
    model: exploracao.get('utente')
  }).render();

  // block actividade
  new Backbone.UILib.WidgetsView({
    el: $('#actividade'),
    model: exploracao.get('actividade')
  }).render();

  // block consumos
  new Backbone.UILib.WidgetsView({
    el: $('#consumos'),
    model: exploracao
  }).render();

  // block Licencias
  var licencias = exploracao.get('licencias');

  // TODO: how to choose the license between the possible list?
  var licSup = licencias.where({'lic_tipo': 'Superficial'})[0] || new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Superficial'});
  new Backbone.SIXHIARA.LicenciaView({
    el: $('#licencia-superficial'),
    model: licSup,
    template: _.template($('#licencia-tmpl').html())
  }).render();

  // TODO: how to choose the license between the possible list?
  var licSub = licencias.where({'lic_tipo': 'Subterrânea'})[0] || new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Subterrânea'});
  new Backbone.SIXHIARA.LicenciaView({
    el: $('#licencia-subterranea'),
    model: licSub,
    template: _.template($('#licencia-tmpl').html())
  }).render();

  // block fontes
  new Backbone.SIXHIARA.TableShowView({
    el: $('#fontes'),
    collection: fontes,
  }).render();

  // map
  new Backbone.SIXHIARA.ExploracaoMapView({});
}
