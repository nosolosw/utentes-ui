Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FontesBlockView = Backbone.View.extend({

  initialize: function (options) {

    this.subViews = [];
    this.options = options;

    var tableFontesView = new Backbone.SIXHIARA.TableShowView({
      el: $('#fontes'),
      collection: this.collection,
      domains: this.options.domains,
    });
    tableFontesView.listenTo(this.collection, 'add', function(model, collection, options){
      this.update(collection);
    });
    tableFontesView.listenTo(this.collection, 'destroy', function(model, collection, options){
      this.update(collection);
    });
    this.subViews.push(tableFontesView);
  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function () {
    var domains = this.options.domains;
    var fonteTipos = domains.byCategory('fonte_tipo');

    new Backbone.UILib.SelectView({
      el: $('#fonteSubModal #fonte_tipo'),
      collection: fonteTipos.byParent('Subterrânea')
    }).render();

    new Backbone.UILib.SelectView({
      el: $('#fonteSupModal #fonte_tipo'),
      collection: fonteTipos.byParent('Superficial')
    }).render();

    // fontes modals
    new Backbone.SIXHIARA.ModalFonteView({
      el: $('#fonteSubModal'),
      collection: this.collection
    });

    new Backbone.SIXHIARA.ModalFonteView({
      el: $('#fonteSupModal'),
      collection: this.collection
    });

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  },

});
