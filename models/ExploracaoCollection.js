Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoCollection = Backbone.Collection.extend({

    model: Backbone.SIXHIARA.Exploracao,
    url: '/exploracaos.json'

});
