// TODO: take from API
var domains = DOMAINS_REPO;
var exploracaos = EXPLORACAOS_REPO;

var where = new SIXHIARA.Models.ExploracaoSummary();
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
  var filters = _.omit(model.toJSON(), function(value, key, object){
    return value === ''; // do not take into account void values
  });
  this.update(exploracaos.where(filters));
});
