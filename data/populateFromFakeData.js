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
  new Backbone.UILib.WidgetsView({
    el: $('#licencia-superficial'),
    model: exploracao.get('licencias').at(0)
  }).render();

  new Backbone.UILib.WidgetsView({
    el: $('#licencia-subterranea'),
    model: exploracao.get('licencias').at(1)
  }).render();

  // block fontes
  new Backbone.SIXHIARA.TableShowView({
    el: $('#fontes'),
    collection: fontes,
  }).render();

}
