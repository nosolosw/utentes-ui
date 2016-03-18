Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockInfoView = Backbone.View.extend({

  // TODO:
  // - pagos select to update models
  // - pagosView to re-render on exploracao.pagos update

  initialize: function (options) {
    this.subViews = [];

    var exploracao = this.model;
    var licSup = exploracao.get('licencias').where({'lic_tipo': 'Superficial'})[0];
    var licSub = exploracao.get('licencias').where({'lic_tipo': 'Subterrânea'})[0];

    exploracao.on('change', this.render, this);
    options.domains.on('sync', this.renderModal, this);

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

  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (collection, response, options) {
    // TODO: open modal with JS to avoid event & memory leaks
    // that prevent proper operation
    $('#editInfo').on('click', function(e){
      e.preventDefault();
      $('#editInfoModal').modal('toggle');
    });

    // fill select pagos
    new Backbone.UILib.SelectView({
      el: $('#editInfoModal #pagos'),
      collection: collection.byCategory('pagamentos'),
    }).render();

    // TODO: pagos is boolean, make select to use alias
    // connect components in modal with model
    new Backbone.UILib.WidgetsView({
      el: $('#editInfoModal'),
      model: this.model
    }).render();
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
