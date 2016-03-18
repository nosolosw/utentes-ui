Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockInfoView = Backbone.View.extend({

  events: {
    'click #editInfo': 'renderModal'
  },

  initialize: function (options) {
    this.subViews = [];
    this.options = options;

    var exploracao = this.model;
    var licSup = exploracao.get('licencias').where({'lic_tipo': 'Superficial'})[0];
    var licSub = exploracao.get('licencias').where({'lic_tipo': 'Subterrânea'})[0];

    // create subviews
    var infoView = new Backbone.UILib.WidgetsView({
      el: $('#info'),
      model: exploracao
    });
    this.subViews.push(infoView);

    var summaryLicenseView = new Backbone.SIXHIARA.SummaryLicenseView({
      el: $('#summary_licencia_msg'),
      model: exploracao
    });
    summaryLicenseView.listenTo(licSup, 'change', summaryLicenseView.render);
    summaryLicenseView.listenTo(licSub, 'change', summaryLicenseView.render);
    this.subViews.push(summaryLicenseView);

    var summaryConsumoView = new Backbone.SIXHIARA.SummaryConsumoView({
      el: $('#summary_consumo_msg'),
      model: exploracao
    });
    this.subViews.push(summaryConsumoView);

    var summaryPagosView = new Backbone.SIXHIARA.SummaryPagosView({
      el: $('#summary_pagos_msg'),
      model: exploracao
    });
    this.subViews.push(summaryPagosView);

    this.domainsFilled = false;
    options.domains.on('sync', this.domainsFilled, this);

    exploracao.on('change', this.render, this);

  },

  domainsFilled: function () {
    this.domainsFilled = true;
  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (event) {

    if(!this.domainsFilled) return;

    // add modal to DOM
    var node = $(document.body).append($('#block-info-modal-tmpl').html());

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#editInfoModal');
    new Backbone.UILib.SelectView({
      el: $('#editInfoModal #pagos'),
      collection: this.options.domains.byCategory('pagamentos'),
    }).render();
    new Backbone.UILib.WidgetsView({
      el: modalEl,
      model: this.model
    }).render();

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      // should we unbind the events too?
      $(this).remove();
    });

    // do open modal
    modalEl.modal('show');

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
