var where = new Backbone.SIXHIARA.Where();
var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var listView, mapView;
domains.url = Backbone.SIXHIARA.Config.apiDomains;

domains.fetch({
  success: function(collection, response, options) {
    new Backbone.SIXHIARA.FiltersView({
      el: $('#filters'),
      model: where,
      domains: domains,
    }).render();
    exploracaos.listenTo(where, 'change', function(model, options){
      if (!model) return;
      var keys = _.keys(model.changed);

      if ((keys.length === 1) && (keys.indexOf('mapBounds') !== -1)) {
          exploracaosFiltered = exploracaos.filterBy(where);
          listView.update(exploracaosFiltered);
      } else {
        // Reset geo filter if the user use any other filter
        where.set('mapBounds', null, {silent:true});
        exploracaosFiltered = exploracaos.filterBy(where);
        listView.update(exploracaosFiltered);
        mapView.update(exploracaosFiltered);
      }
    });
  }
});



exploracaos.fetch({
  parse: true,
  success: function() {
    exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection(exploracaos.models);
    listView = new Backbone.UILib.ListView({
      el: $('#project_list'),
      collection: exploracaosFiltered,
      subviewTemplate: _.template($('#exploracao-li-tmpl').html())
    });

    mapView = new Backbone.SIXHIARA.MapView({
      el: $('#map'),
      collection: exploracaosFiltered,
      where: where,
    });
    listView.update(exploracaosFiltered);
    mapView.update(exploracaosFiltered);
  }
});

$('#settings').on('click', function(e){
  e.preventDefault();
  var configModalView = new Backbone.SIXHIARA.ConfigModalView({model: new Backbone.Model()});
  configModalView.show();
});
