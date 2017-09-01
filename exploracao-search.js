var where = new Backbone.SIXHIARA.Where();
var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var listView, mapView;
domains.url = Backbone.SIXHIARA.Config.apiDomains;

var myLeafletEvent = function(e) {
    if (e.type === 'mouseover') {
        var item = this.$('#exp_id-' + e.exp_id).parent();
        item[0].scrollIntoView();
        item.addClass('leaflet-mouseover');
    } else {
        var item = this.$('#exp_id-' + e.exp_id).parent();
        item.removeClass('leaflet-mouseover')
    }
}

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
                listView.listenTo(exploracaosFiltered, 'leaflet', myLeafletEvent);
                listView.update(exploracaosFiltered);
            } else {
                // Reset geo filter if the user use any other filter
                where.set('mapBounds', null, {silent:true});
                exploracaosFiltered = exploracaos.filterBy(where);
                listView.listenTo(exploracaosFiltered, 'leaflet', myLeafletEvent);
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

        new Backbone.SIXHIARA.ButtonExportXLSView({
            el: $('#projects h1'),
            listView: listView,
        }).render();

        new Backbone.SIXHIARA.ButtonExportSHPView({
            el: $('#projects h1'),
            collection: exploracaos,
        }).render();

        mapView = new Backbone.SIXHIARA.MapView({
            el: $('#map'),
            collection: exploracaosFiltered,
            where: where,
        });

        listView.listenTo(exploracaosFiltered, 'leaflet', myLeafletEvent);
        listView.update(exploracaosFiltered);
        mapView.update(exploracaosFiltered);
    }
});
