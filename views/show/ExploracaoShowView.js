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
    this.licSup = licencias.where({'lic_tipo': 'Superficial'})[0];
    this.licSub = licencias.where({'lic_tipo': 'Subterrânea'})[0];

    this.domains = new Backbone.UILib.DomainCollection();
    this.domains.url = Backbone.SIXHIARA.Config.apiDomains;
    this.domains.fetch({
      success: function(collection, response, options) {
        // TODO: make views that needed to listen to sync events in the model
        // edit capabilities for views that need this should not be enabled
        // until this is sync
        view.fillComponentsWithDomains();
        console.log('domains loaded');
      },
      error: function () {
        // TODO: show message to user
        console.error('could not get domains from API');
      }
    });


    // TODO add action for open file folder

    // TODO: do not listen to events if button is disabled
    var saveButtonView = new Backbone.SIXHIARA.ButtonSaveView({
      el: $('#save-button'),
      model: exploracao
    });
    this.subViews.push(saveButtonView);

    // TODO: ask before delete it
    var deleteButtonView = new Backbone.SIXHIARA.ButtonDeleteView({
      el: $('#delete-button'),
      model: exploracao
    });
    this.subViews.push(deleteButtonView);

    var mapView = new Backbone.SIXHIARA.ExploracaoMapView({
      model: exploracao
    });
    this.subViews.push(mapView);

    var titleView = new Backbone.UILib.WidgetsView({
      el: $('#title'),
      model: exploracao
    }).render();
    this.subViews.push(titleView);

    var infoBlockView = new Backbone.SIXHIARA.InfoBlockView({
      el: $('#info'),
      model: exploracao,
      domains: this.domains,
    }).render();
    this.subViews.push(infoBlockView);

    var locBlockView = new Backbone.SIXHIARA.LocBlockView({
      el: $('#loc-info'),
      model: exploracao,
      domains: this.domains,
    }).render();
    this.subViews.push(locBlockView);

    var utenteBlockView = new Backbone.SIXHIARA.UtenteBlockView({
      el: $('#utente'),
      model: exploracao,
    }).render();
    this.subViews.push(utenteBlockView);

    var actividadeBlockView = new Backbone.SIXHIARA.ActividadeBlockView({
      el: $('#info-actividade'),
      model: exploracao,
      domains: this.domains,
    }).render();
    this.subViews.push(actividadeBlockView);

    // block consumos
    var consumosBlockView = new Backbone.UILib.WidgetsView({
      el: $('#consumos'),
      model: exploracao
    }).render();
    this.subViews.push(consumosBlockView);

    // Licencias
    if(this.licSup == null) {
      this.licSup = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Superficial'});
      exploracao.get('licencias').add(this.licSup);
    }
    var licSuperficialBlockView = new Backbone.SIXHIARA.LicenciaBlockView({
      el: $('#licencia-superficial'),
      model: this.licSup,
      domains: this.domains,
      elEditButton: $('#editLicSup'),
      elEditModal: $('#editLicSupModal'),
      elFonteButton: $('#addFonteSup'),
      elFonteModal: $('#fonteSupModal'),
      elEstado: $('#editLicSupModal #estado'),
    }).render();
    this.subViews.push(licSuperficialBlockView);

    if(this.licSub == null) {
      this.licSub = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Subterrânea'});
      exploracao.get('licencias').add(this.licSub);
    }
    var licenciaSubterraneaBlockView = new Backbone.SIXHIARA.LicenciaBlockView({
      el: $('#licencia-subterranea'),
      model: this.licSub,
      domains: this.domains,
      elEditButton: $('#editLicSub'),
      elEditModal: $('#editLicSubModal'),
      elFonteButton: $('#addFonteSub'),
      elFonteModal: $('#fonteSubModal'),
      elEstado: $('#editLicSubModal #estado'),
    }).render();
    this.subViews.push(licenciaSubterraneaBlockView);

    // block fontes
    var tableFontesView = new Backbone.SIXHIARA.TableShowView({
      el: $('#fontes'),
      collection: exploracao.get('fontes'),
    }).render();
    tableFontesView.listenTo(exploracao.get('fontes'), 'add', function(model, collection, options){
      this.update(exploracao.get('fontes'));
    });
    tableFontesView.listenTo(exploracao.get('fontes'), 'destroy', function(model, collection, options){
      this.update(exploracao.get('fontes'));
    });
    exploracao.get('fontes').on('add destroy', function(model, collection, options){
      consumosView.render();
    });

  },

  fillComponentsWithDomains: function(){
    var exploracao = this.model;
    var domains = this.domains;
    var fonteTipos  = domains.byCategory('fonte_tipo');

    // fontes: tipos fonte
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
      collection: exploracao.get('fontes')
    });

    new Backbone.SIXHIARA.ModalFonteView({
      el: $('#fonteSupModal'),
      collection: exploracao.get('fontes')
    });
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
