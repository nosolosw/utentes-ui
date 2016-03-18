Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoShowView = Backbone.View.extend({

  initialize: function(){

    // in this view, all WidgetsView would display '-' as nullValues,
    // unless it is set otherwise in a specific WidgetsView
    Backbone.UILib.WidgetsView.prototype.displayNull = function(name){
      return '-';
    }

    this.subViews = [];
  },

  render: function(){

    var view = this;
    var exploracao = this.model;

    // TODO: how to choose the license between the possible list?
    var licencias = exploracao.get('licencias');
    var licSuperficial = licencias.where({'lic_tipo': 'Superficial'})[0];
    var licSubterranea = licencias.where({'lic_tipo': 'Subterrânea'})[0];
    if(licSuperficial == null) {
      licSuperficial = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Superficial'});
      exploracao.get('licencias').add(licSuperficial);
    }
    if(licSubterranea == null) {
      licSubterranea = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Subterrânea'});
      exploracao.get('licencias').add(licSubterranea);
    }

    var domains = new Backbone.UILib.DomainCollection();
    domains.url = Backbone.SIXHIARA.Config.apiDomains;
    domains.fetch({
      success: function(collection, response, options) {
        console.log('domains loaded');
      },
      error: function () {
        // TODO: show message to user
        console.error('could not get domains from API');
      }
    });

    // TODO add action for open file folder
    // openFolderButtonView

    // TODO: do not listen to events if button is disabled
    var buttonSaveView = new Backbone.SIXHIARA.ButtonSaveView({
      el: $('#save-button'),
      model: exploracao
    });
    this.subViews.push(buttonSaveView);

    // TODO: ask before delete it
    var buttonDeleteView = new Backbone.SIXHIARA.ButtonDeleteView({
      el: $('#delete-button'),
      model: exploracao
    });
    this.subViews.push(buttonDeleteView);

    var blockMapView = new Backbone.SIXHIARA.BlockMapView({
      model: exploracao
    });
    this.subViews.push(blockMapView);

    var blockTitleView = new Backbone.UILib.WidgetsView({
      el: $('#title'),
      model: exploracao
    }).render();
    this.subViews.push(blockTitleView);

    var blockInfoView = new Backbone.SIXHIARA.BlockInfoView({
      el: $('#info'),
      model: exploracao,
      domains: domains,
    }).render();
    this.subViews.push(blockInfoView);

    var blockLocationView = new Backbone.SIXHIARA.BlockLocationView({
      el: $('#loc-info'),
      model: exploracao,
      domains: domains,
    }).render();
    this.subViews.push(blockLocationView);

    var blockUtenteView = new Backbone.SIXHIARA.BlockUtenteView({
      el: $('#utente'),
      model: exploracao,
    }).render();
    this.subViews.push(blockUtenteView);

    var blockActivityView = new Backbone.SIXHIARA.BlockActivityView({
      el: $('#info-actividade'),
      model: exploracao,
      domains: domains,
    }).render();
    this.subViews.push(blockActivityView);

    var blockConsumosView = new Backbone.UILib.WidgetsView({
      el: $('#consumos'),
      model: exploracao
    }).render();
    blockConsumosView.listenTo(exploracao.get('fontes'), 'add destroy', blockConsumosView.render);
    blockConsumosView.listenTo(exploracao, 'change', blockConsumosView.render);
    this.subViews.push(blockConsumosView);

    var blockSuperficialView = new Backbone.SIXHIARA.BlockLicenseView({
      el: $('#licencia-superficial'),
      model: licSuperficial,
      fontes: exploracao.get('fontes'),
      domains: domains,
    }).render();
    blockSuperficialView.listenTo(licSuperficial, 'change', blockSuperficialView.render);
    this.subViews.push(blockSuperficialView);

    var blockSubterraneaView = new Backbone.SIXHIARA.BlockLicenseView({
      el: $('#licencia-subterranea'),
      model: licSubterranea,
      fontes: exploracao.get('fontes'),
      domains: domains,
    }).render();
    blockSubterraneaView.listenTo(licSubterranea, 'change', blockSubterraneaView.render);
    this.subViews.push(blockSubterraneaView);

    var blockFontesView = new Backbone.SIXHIARA.BlockFontesView({
      el: $('#fontes'),
      collection: exploracao.get('fontes'),
      domains: domains,
    }).render();
    this.subViews.push(blockFontesView);

    return this;
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
