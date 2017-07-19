Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TanqueCollection = Backbone.GeoJson.FeatureCollection.extend({

    model: Backbone.SIXHIARA.Tanque,
    url: Backbone.SIXHIARA.Config.apiTanques,
});