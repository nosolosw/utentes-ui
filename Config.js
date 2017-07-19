Backbone.SIXHIARA = Backbone.SIXHIARA || {};

Backbone.SIXHIARA.Config = {
  urlSearch:      '/static/cetmar-ui/exploracao-search.html',
  urlShow:        '/static/cetmar-ui/exploracao-show.html?id=',
  urlUtentes:     '/static/cetmar-ui/utentes.html',
  apiDomains:     '/api/domains',
  apiExploracaos: '/api/exploracaos',
  apiUtentes:     '/api/utentes',
  apiCultivos:    '/api/cultivos',
  apiTanques:     '/api/tanques',
};

Backbone.SIXHIARA.MSG = {
  NO_ACTIVITY: 'Actividade non declarada',
}

$(document).ready(function() {
  var navBar = new Backbone.SIXHIARA.NavBarView({
    model: new Backbone.Model(),
    el: $('menu'),
  }).render();

  $('#settings').on('click', function(e){
    e.preventDefault();
    var configModalView = new Backbone.SIXHIARA.ConfigModalView({model: new Backbone.Model()});
    configModalView.show();
  });
});
