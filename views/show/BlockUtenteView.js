Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockUtenteView = Backbone.View.extend({

  initialize: function () {

    var view = this;
    this.subViews = [];

    var utenteView = new Backbone.UILib.WidgetsView({
      el: this.el,
      model: this.model.get('utente')
    });
    this.subViews.push(utenteView);

    this.model.on('change:utente', function(model, value, options){
      utenteView.model = view.model.get('utente');
      utenteView.render();
    });

    var utentes = new Backbone.SIXHIARA.UtenteCollection();
    utentes.on('sync', this.renderModal, this);
    utentes.fetch({
      success: function() {
        console.log('utentes loaded');
      },
      error: function () {
        // TODO: show message to user
        console.error('could not get utentes from API');
      }
    });

  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (collection, response, options) {
    $('#editUtente').on('click', function(e){
      e.preventDefault();
      $('#editUtenteModal').modal('toggle');
    });

    new Backbone.SIXHIARA.SelectUtenteViewShow({
      el: $('#editUtenteModal'),
      model: this.model.get('utente'),
      collection: collection,
    }).render();

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  },

});
