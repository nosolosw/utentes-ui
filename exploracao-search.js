

var where = new Backbone.SIXHIARA.Where();

// var domains = DOMAINS_REPO; // Descomentar para trabajar con fixtures
// var exploracaos = EXPLORACAOS_REPO; // Descomentar para trabajar con fixtures


var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();

MyDomains = Backbone.UILib.DomainCollection.extend({
  url: '/domains.json'
});
var domains = new Backbone.UILib.DomainCollection();
domains.url = '/domains.json';

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
  collection: exploracaos,
  subviewTemplate: _.template($('#exploracao-li-tmpl').html())
});

listView.listenTo(where, 'change', function(model, options){
  this.update(exploracaos.where(where.values()));
});

listView.listenTo(exploracaos, 'reset', function(model, options){
  this.update(exploracaos);
});

var mapView = new Backbone.SIXHIARA.MapView({
  el: $('#map'),
  collection: exploracaos
});
mapView.listenTo(where, 'change', function(model, options){
  this.update(new Backbone.GeoJson.FeatureCollection(exploracaos.where(where.values())));
});
mapView.listenTo(where, 'change', function(model, options){
  this.update(new Backbone.GeoJson.FeatureCollection(exploracaos.where(where.values())));
});

exploracaos.fetch({parse: true, reset: true})
// exploracaos.trigger('reset'); // Descomentar para trabajar con fixtures
