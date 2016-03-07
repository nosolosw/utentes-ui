var where = new Backbone.SIXHIARA.Where();

// var domains = DOMAINS_REPO; // Descomentar para trabajar con fixtures
// var exploracaos = EXPLORACAOS_REPO; // Descomentar para trabajar con fixtures


var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection({url: '/api/domains'});

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

exploracaos.listenTo(where, 'change', function(model, options){
  exploracaosFiltered = exploracaos.filterBy(where);
  listView.update(exploracaosFiltered);
});

exploracaos.fetch({
  parse: true,
  success: function() {where.trigger('change');}
});
