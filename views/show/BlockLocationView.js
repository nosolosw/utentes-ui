Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLocationView = Backbone.View.extend({

  events: {
      'click #editBlockLocation': 'renderModal',
  },

  initialize: function (options) {
    this.subViews = [];
    this.options = options;

    var exploracao = this.model;

    var locationView = new Backbone.UILib.WidgetsView({
      el: this.el,
      model: exploracao
    });
    this.subViews.push(locationView);

    this.domainsFilled = false;
    options.domains.on('sync', this.setDomainsFilled, this);

    exploracao.on('change', this.render, this);
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
    var node = $(document.body).append($('#block-location-modal-tmpl').html());

    // take it from DOM and connect components, fill selects, etc
    var modalEl = $('#editLocModal');
    var modalViews = [];

    var exploracao = this.model;
    var domains    = this.options.domains;
    modalViews.push(
      new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: exploracao,
        el: $('#editLocModal'),
      }).render()
    );
    modalViews.push(
      new Backbone.SIXHIARA.SelectBaciaView({
        domains: domains,
        model: exploracao,
        el: $('#editLocModal'),
      }).render()
    );

    // TODO: this does not update the chained selects properly
    var widgetsView = new Backbone.UILib.WidgetsView({
      el: modalEl,
      model: exploracao
    }).render();
    modalViews.push(widgetsView);

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
  }

});
