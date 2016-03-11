// All WidgetsView would display '-' as nullValues, unless it is set otherwise
Backbone.UILib.WidgetsView.prototype.displayNull = function(name){
  return '-';
}

function idIsNotValid(id){
  // TODO: check id against all id in collection
  return (id === undefined) || (id === null) || (id === '');
}

var exploracao = new Backbone.SIXHIARA.Exploracao();
var utentes = new Backbone.SIXHIARA.UtenteCollection();
var domains = new Backbone.UILib.DomainCollection();
domains.url = Backbone.SIXHIARA.Config.apiDomains;

var licSup, licSub;

exploracao.set('id', window.location.search.split('=')[1], {silent: true});
if(idIsNotValid(exploracao.get('id'))){
  window.location = Backbone.SIXHIARA.Config.urlSearch;
}

exploracao.fetch({
  parse: true,
  success: function(){

    // TODO actions: delete, save, open file folder

    // TODO: do not listen to events if button is disabled
    new Backbone.SIXHIARA.ButtonSaveView({
      el: $('#save-button'),
      model: exploracao
    });

    // TODO: ask before delete it
    new Backbone.SIXHIARA.ButtonDeleteView({
      el: $('#delete-button'),
      model: exploracao
    });

    // map
    new Backbone.SIXHIARA.ExploracaoMapView({
      model: exploracao
    });

    // block title: exp_id
    new Backbone.UILib.WidgetsView({
      el: $('#title'),
      model: exploracao
    }).render();

    // block info & its modal
    var infoView = new Backbone.UILib.WidgetsView({
      el: $('#info'),
      model: exploracao
    }).render();

    $('#editInfo').on('click', function(e){
      e.preventDefault();
      $('#editInfoModal').modal('toggle');
    });

    // summaries licencia, consumo & pagos
    var summaryLicenciaView = new Backbone.SIXHIARA.SummaryLicenciaView({
      el: $('#summary_licencia_msg'),
      model: exploracao
    }).render();

    var summaryConsumoView = new Backbone.SIXHIARA.SummaryConsumoView({
      el: $('#summary_consumo_msg'),
      model: exploracao
    }).render();

    // TODO: pagos is boolean, make select to use alias
    var summaryPagosView = new Backbone.SIXHIARA.SummaryPagosView({
      el: $('#summary_pagos_msg'),
      model: exploracao
    }).render();

    // block loc-info & its modal
    var locView = new Backbone.UILib.WidgetsView({
      el: $('#loc-info'),
      model: exploracao
    }).render();

    $('#editLoc').on('click', function(e){
      e.preventDefault();
      $('#editLocModal').modal('toggle');
    });

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
    var actividadeView = new Backbone.UILib.WidgetsView({
      el: $('#info-actividade'),
      model: exploracao,
    });
    actividadeView.displayNull = function(name){
      if(name === 'actividade') return 'Actividade non declarada';
      return '-';
    };
    actividadeView.render();

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
    var licencias = exploracao.get('licencias');

    // TODO: how to choose the license between the possible list?
    licSup = licencias.where({'lic_tipo': 'Superficial'})[0];
    if(licSup == null) {
      licSup = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Superficial'});
      exploracao.get('licencias').add(licSup);
    }
    var licSupView = new Backbone.SIXHIARA.LicenciaView({
      el: $('#licencia-superficial'),
      model: licSup,
      template: _.template($('#licencia-tmpl').html())
    }).render();
    licSup.on('change', function(){
      licSupView.render();
      summaryLicenciaView.render();
    });

    $('#editLicSup').on('click', function(e){
      e.preventDefault();
      $('#editLicSupModal').modal('toggle');
    });

    // TODO: how to choose the license between the possible list?
    licSub = licencias.where({'lic_tipo': 'Subterrânea'})[0];
    if(licSub == null) {
      licSub = new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Subterrânea'});
      exploracao.get('licencias').add(licSub);
    }
    var licSubView = new Backbone.SIXHIARA.LicenciaView({
      el: $('#licencia-subterranea'),
      model: licSub,
      template: _.template($('#licencia-tmpl').html())
    }).render();
    licSub.on('change', function(){
      licSubView.render();
      summaryLicenciaView.render();
    });

    $('#editLicSub').on('click', function(e){
      e.preventDefault();
      $('#editLicSubModal').modal('toggle');
    });

    // block fontes
    new Backbone.SIXHIARA.TableShowView({
      el: $('#fontes'),
      collection: exploracao.get('fontes'),
    }).render();

    domains.fetch({
      success: function(collection, response, options) {
        fillComponentsWithDomains();
      }
    });

    utentes.fetch({
      success: function() {
        fillSelectUtente();
      }
    });

    // TODO: listen to specific attributes
    exploracao.on('change', function(model, value, options){
      // TODO: enable save button

      infoView.render();
      summaryConsumoView.render();
      summaryPagosView.render();
      locView.render();
      consumosView.render();
      actividadeView.render();

      // TODO: render licencias & fontes?
    });

    exploracao.on('change:utente', function(model, value, options){
      utenteView.model = exploracao.get('utente');
      utenteView.render();
    });

  },

  error: function(){
    console.log('could not load data');
    window.location = Backbone.SIXHIARA.Config.urlSearch;
  }

});

function fillSelectUtente(){
  new Backbone.SIXHIARA.SelectUtenteView({
    el: $('#editUtenteModal'),
    model: utentes
  }).render();
}

function fillComponentsWithDomains(){
  var pagos       = domains.byCategory('pagamentos');
  var provincias  = domains.byCategory('provincia');
  var distritos   = domains.byCategory('distrito');
  var postos      = domains.byCategory('posto');
  var bacias      = domains.byCategory('bacia');
  var subacias    = domains.byCategory('subacia');
  var actividades = domains.byCategory('actividade');
  var estadosLic  = domains.byCategory('licencia_estado');

  // modal info
  new Backbone.UILib.SelectView({
    el: $('#editInfoModal #pagos'),
    collection: pagos
  }).render();

  new Backbone.UILib.WidgetsView({
    el: $('#editInfoModal'),
    model: exploracao
  }).render();

  // modal loc
  new Backbone.UILib.SelectView({
    el: $('#editLocModal #loc_provin'),
    collection: provincias
  }).render();

  var selectDistritos = new Backbone.UILib.SelectView({
    el: $('#editLocModal #loc_distri'),
    collection: []
  }).render();
  selectDistritos.listenTo(exploracao, 'change:loc_provin', function(model, value, options){
    this.update(distritos.where({'parent': model.get('loc_provin')}));
  });

  var selectPostos = new Backbone.UILib.SelectView({
    el: $('#editLocModal #loc_posto'),
    collection: []
  }).render();
  selectPostos.listenTo(exploracao, 'change:loc_distri', function(model, value, options){
    this.update(postos.where({'parent': model.get('loc_distri')}));
  });

  new Backbone.UILib.SelectView({
    el: $('#editLocModal #loc_bacia'),
    collection: bacias
  }).render();

  var selectSubacias = new Backbone.UILib.SelectView({
    el: $('#editLocModal #loc_subaci'),
    collection: [],
  }).render();
  selectSubacias.listenTo(exploracao, 'change:loc_bacia', function(model, value, options){
    this.update(subacias.where({'parent': model.get('loc_bacia')}));
  });

  new Backbone.UILib.WidgetsView({
    el: $('#editLocModal'),
    model: exploracao
  }).render();

  // modal actividade: actividades
  new Backbone.UILib.SelectView({
    el: $('#editActividadeModal #actividade'),
    collection: actividades
  }).render();

  new Backbone.UILib.WidgetsView({
    el: $('#editActividadeModal'),
    model: exploracao,
  }).render();

  // modals licencias
  new Backbone.UILib.SelectView({
    el: $('#editLicSubModal #estado'),
    collection: estadosLic
  }).render();

  new Backbone.UILib.WidgetsView({
    el: $('#editLicSubModal'),
    model: licSub,
  }).render();

  new Backbone.UILib.SelectView({
    el: $('#editLicSupModal #estado'),
    collection: estadosLic
  }).render();

  new Backbone.UILib.WidgetsView({
    el: $('#editLicSupModal'),
    model: licSup,
  }).render();

}
