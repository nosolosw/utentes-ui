Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockUtenteView = Backbone.View.extend({

  events: {
    'click #editBlockUtente': 'renderModal'
  },

  initialize: function () {

    var view = this;
    this.subViews = [];

    var utenteView = new Backbone.UILib.WidgetsView({
      el: this.el,
      model: this.model.get('utente')
    });
    utenteView.listenTo(this.model, 'change:utente', function (model, value, options) {
      this.model = model.get('utente');
      this.render();
    });
    this.subViews.push(utenteView);

    this.utentes = new Backbone.SIXHIARA.UtenteCollection();
    this.domainsFilled = false;
    this.utentes.on('sync', this.setDomainsFilled, this);
    this.utentes.fetch({
      success: function() {
        console.log('utentes loaded');
      },
      error: function () {
        // TODO: show message to user
        console.error('could not get utentes from API');
      }
    });

  },

  setDomainsFilled: function () {
      this.domainsFilled = true;
  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (event) {

    if(!this.domainsFilled) return;

    // add modal to DOM
    var node = $(document.body).append($('#block-utente-modal-tmpl').html());

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#editUtenteModal');
    var modalViews = [];

    var selectUtente = new Backbone.SIXHIARA.SelectUtenteView({
      el: modalEl,
      model: this.model,
      collection: this.utentes,
    }).render();
    modalViews.push(selectUtente);

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      $(this).remove();
      _.invoke(modalViews, 'remove');
      modalViews = [];
    });

    // do open modal
    modalEl.modal('show');

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  },

});
