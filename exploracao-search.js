// TODO: take from API
var domains = DOMAINS_REPO;
var exploracaos = EXPLORACAOS_REPO;
var exploracaosGeoJson = EXPLORACAOS_GEO;
// TODO: exploracaos & exploracaosGeoJson might be consolidated
// to use the same collection. It requires some thought.

var where = new SIXHIARA.Models.Where();
var filtersView = new SIXHIARA.Views.FiltersView({
  el: $('#filters'),
  model: where,
  domains: domains,
}).render();

var listView = new iCarto.Views.ListView({
  el: $('#project_list'),
  collection: exploracaos,
  subviewTemplate: _.template($('#exploracao-li-tmpl').html())
}).render();
listView.listenTo(where, 'change', function(model, options){
  this.update(exploracaos.where(where.values()));
});

var mapView = new SIXHIARA.Views.MapView({
  el: $('#map'),
  collection: exploracaosGeoJson
});
mapView.listenTo(where, 'change', function(model, options){
  this.update(exploracaosGeoJson.filterBy(where.values()));
});
