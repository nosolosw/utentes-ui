var where = new Backbone.SIXHIARA.Where();
var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection();
domains.url = Backbone.SIXHIARA.Config.apiDomains;

domains.fetch({
  success: function(collection, response, options) {
    new Backbone.SIXHIARA.FiltersView({
      el: $('#filters'),
      model: where,
      domains: domains,
    }).render();
  }
});

var listView = new Backbone.UILib.ListView({
  el: $('#project_list'),
  collection: exploracaosFiltered,
  subviewTemplate: _.template($('#exploracao-li-tmpl').html())
});

var mapView = new Backbone.SIXHIARA.MapView({
  el: $('#map'),
  collection: exploracaosFiltered
});

exploracaos.listenTo(where, 'change', function(model, options){
  exploracaosFiltered = exploracaos.filterBy(where);
  listView.update(exploracaosFiltered);
  mapView.update(exploracaosFiltered);
});

exploracaos.fetch({
  parse: true,
  success: function() {where.trigger('change');}
});

$('#settings').on('click', function(e){
  e.preventDefault();
  var configModalView = new Backbone.SIXHIARA.ConfigModalView({model: new Backbone.Model()});
  configModalView.show();
});
