Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoShowView = Backbone.View.extend({

  initialize: function(){

    // in this view, all WidgetsView would display '-' as nullValues,
    // unless it is set otherwise in a specific WidgetsView
    Backbone.UILib.WidgetsView.prototype.displayNull = function(name){
      return '-';
    }

    // auxiliary models we need and fetch on render
    this.utentes = new Backbone.SIXHIARA.UtenteCollection();
    this.domains = new Backbone.UILib.DomainCollection();
    this.domains.url = Backbone.SIXHIARA.Config.apiDomains;

    this.subViews = [];
  },

  render: function(){

    var view = this;
    var exploracao = this.model;

    // TODO: how to choose the license between the possible list?
    var licencias = exploracao.get('licencias');
    this.licSup = licencias.where({'lic_tipo': 'Superficial'})[0];
    this.licSub = licencias.where({'lic_tipo': 'Subterrânea'})[0];

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

    this.utentes.fetch({
      success: function() {
        // TODO: make views that needed to listen to sync events in the model
        // edit capabilities for views that need this should not be enabled
        // until this is sync
        view.fillSelectUtente();
        console.log('utentes loaded');
      },
      error: function () {
        // TODO: show message to user
        console.error('could not get utentes from API');
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

    // block utente
    var utenteView = new Backbone.UILib.WidgetsView({
      el: $('#utente'),
      model: exploracao.get('utente'),
    }).render();

    $('#editUtente').on('click', function(e){
      e.preventDefault();
      $('#editUtenteModal').modal('toggle');
    });

    // block actividade
    var actividadeView = new Backbone.SIXHIARA.ActividadeView({
      el: $('#info-actividade'),
      model: exploracao,
      template: _.template($("[id='" + exploracao.get('actividade').get('tipo') + "']").html())
    });
    actividadeView.render();
    actividadeView.listenTo(exploracao, 'change:actividade', function(model, value, options){
      this.template = _.template($("[id='" + exploracao.get('actividade').get('tipo') + "']").html())
      this.render();
    });
    // TODO: listen to changes inside actividade values
    // care! actividade may change

    $('#editActividade').on('click', function(e){
      e.preventDefault();
      $('#editActividadeModal').modal('toggle');
    });

    // block consumos
    var consumosView = new Backbone.UILib.WidgetsView({
      el: $('#consumos'),
      model: exploracao
    }).render();

    // block Licencias
    if(this.licSup == null) {
      this.licSup = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Superficial'});
      exploracao.get('licencias').add(this.licSup);
    }
    var licSupView = new Backbone.SIXHIARA.LicenciaView({
      el: $('#licencia-superficial'),
      model: this.licSup,
      template: _.template($('#licencia-tmpl').html())
    }).render();
    this.licSup.on('change', function(){
      licSupView.render();
      consumosView.render();
    });

    $('#editLicSup').on('click', function(e){
      e.preventDefault();
      $('#editLicSupModal').modal('toggle');
    });

    $('#addFonteSup').on('click', function(e){
      e.preventDefault();
      $('#fonteSupModal').modal('toggle');
    });

    if(this.licSub == null) {
      this.licSub = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Subterrânea'});
      exploracao.get('licencias').add(this.licSub);
    }
    var licSubView = new Backbone.SIXHIARA.LicenciaView({
      el: $('#licencia-subterranea'),
      model: this.licSub,
      template: _.template($('#licencia-tmpl').html())
    }).render();
    this.licSub.on('change', function(){
      licSubView.render();
      consumosView.render();
    });

    $('#editLicSub').on('click', function(e){
      e.preventDefault();
      $('#editLicSubModal').modal('toggle');
    });

    $('#addFonteSub').on('click', function(e){
      e.preventDefault();
      $('#fonteSubModal').modal('toggle');
    });

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

    exploracao.on('change:utente', function(model, value, options){
      utenteView.model = exploracao.get('utente');
      utenteView.render();
    });

  },

  fillSelectUtente: function(){
    new Backbone.SIXHIARA.SelectUtenteView({
      el: $('#editUtenteModal'),
      model: this.utentes
    }).render();
  },

  fillComponentsWithDomains: function(){
    var exploracao = this.model;
    var domains = this.domains;
    var actividades = domains.byCategory('actividade');
    var estadosLic  = domains.byCategory('licencia_estado');
    var fonteTipos  = domains.byCategory('fonte_tipo');

    // modal actividade: actividades
    new Backbone.UILib.SelectView({
      el: $('#editActividadeModal #actividade'),
      collection: actividades
    }).render();

    new Backbone.SIXHIARA.SelectActividadeView({
      el: $('#actividade-explotacion'),
      model: exploracao
    });

    // modals licencias
    new Backbone.UILib.SelectView({
      el: $('#editLicSubModal #estado'),
      collection: estadosLic
    }).render();

    new Backbone.UILib.WidgetsView({
      el: $('#editLicSubModal'),
      model: this.licSub,
    }).render();

    new Backbone.UILib.SelectView({
      el: $('#editLicSupModal #estado'),
      collection: estadosLic
    }).render();

    new Backbone.UILib.WidgetsView({
      el: $('#editLicSupModal'),
      model: this.licSup,
    }).render();

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
