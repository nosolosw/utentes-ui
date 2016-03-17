Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenciaBlockView = Backbone.View.extend({

  initialize: function (options) {
    this.subViews = [];
    this.options = options;

    var licSupView = new Backbone.SIXHIARA.LicenciaView({
      el: this.el,
      model: this.model,
      template: _.template($('#licencia-tmpl').html())
    });
    this.subViews.push(licSupView);

    this.model.on('change', function(){
      licSupView.render();
      // consumosView.render(); TODO move this up
    });

    options.domains.on('sync', this.renderModal, this);
  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (collection, response, options) {

    this.options.elEditButton.on('click', function(e){
      e.preventDefault();
      options.elEditModal.modal('toggle');
    });

    this.options.elFonteButton.on('click', function(e){
      e.preventDefault();
      elFonteModal.modal('toggle');
    });

    new Backbone.UILib.SelectView({
      el: this.options.elEstado,
      collection: collection.byCategory('licencia_estado')
    }).render();

    new Backbone.UILib.WidgetsView({
      el: this.options.elEditModal,
      model: this.model,
    }).render();

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
