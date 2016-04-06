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

    var openFolderButtonView = new Backbone.SIXHIARA.OpenFolderButtonView({
      el: $('#documentos'),
      model: exploracao
    });
    this.subViews.push(openFolderButtonView);

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
      el: $('#block-title'),
      model: exploracao
    }).render();
    this.subViews.push(blockTitleView);

    var blockInfoView = new Backbone.SIXHIARA.BlockInfoView({
      el: $('#block-info'),
      model: exploracao,
      domains: domains,
    }).render();
    this.subViews.push(blockInfoView);

    var blockLocationView = new Backbone.SIXHIARA.BlockLocationView({
      el: $('#block-location'),
      model: exploracao,
      domains: domains,
    }).render();
    this.subViews.push(blockLocationView);

    var blockUtenteView = new Backbone.SIXHIARA.BlockUtenteView({
      el: $('#block-utente'),
      model: exploracao,
    }).render();
    this.subViews.push(blockUtenteView);

    var blockActivityView = new Backbone.SIXHIARA.BlockActivityView({
      el: $('#block-activity'),
      model: exploracao,
      domains: domains,
    }).render();
    this.subViews.push(blockActivityView);

    var blockConsumosView = new Backbone.UILib.WidgetsView({
      el: $('#block-consumos'),
      model: exploracao
    }).render();
    blockConsumosView.listenTo(exploracao.get('fontes'), 'add destroy', blockConsumosView.render);
    blockConsumosView.listenTo(exploracao, 'change', blockConsumosView.render);
    this.subViews.push(blockConsumosView);

    var blockSuperficialView = new Backbone.SIXHIARA.BlockLicenseView({
      el: $('#block-superficial'),
      model: exploracao,
      domains: domains,
      lic_tipo: 'Superficial',
    }).render();
    this.subViews.push(blockSuperficialView);

    var blockSubterraneaView = new Backbone.SIXHIARA.BlockLicenseView({
      el: $('#block-subterranea'),
      model: exploracao,
      domains: domains,
      lic_tipo: 'Subterrânea',
    }).render();
    this.subViews.push(blockSubterraneaView);

    var blockFontesView = new Backbone.SIXHIARA.BlockFontesView({
      el: $('#block-fontes'),
      collection: exploracao.get('fontes'),
      domains: domains,
    }).render();
    this.subViews.push(blockFontesView);

    domains.on('sync', function(){
      new Backbone.UILib.SelectView({
        el: $('#resModal #reses_tipo'),
        collection: domains.byCategory('animal_tipo'),
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#cultivoModal #cultivo'),
        collection: domains.byCategory('cultivo_tipo'),
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#cultivoModal #rega'),
        collection: domains.byCategory('rega_tipo'),
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#resModalEdit #reses_tipo'),
        collection: domains.byCategory('animal_tipo'),
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#cultivoModalEdit #cultivo'),
        collection: domains.byCategory('cultivo_tipo'),
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#cultivoModalEdit #rega'),
        collection: domains.byCategory('rega_tipo'),
      }).render();
    });


    return this;
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
