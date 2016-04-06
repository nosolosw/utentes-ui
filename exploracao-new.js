$(document).ready(function() {
  $('#wizard-exp').bootstrapWizard({
    'withVisible': false
  });
  $('#templates').load('templates.html');
});

var domains = new Backbone.UILib.DomainCollection();
domains.url = Backbone.SIXHIARA.Config.apiDomains;

domains.fetch({
  success: function(collection, response, options) {
    console.log('success fetching domains');
    fillComponentsWithDomains();
  },
  error: function (collection, response, option) {
    console.log('error fetching domains');
    alert('error fetching domains');
  }
});

var utentes = new Backbone.SIXHIARA.UtenteCollection();
utentes.fetch({
  success: function(collection, response, options) {
    console.log('success fetching utentes');
    fillSelectUtente();
  },
  error: function (collection, response, options) {
    alert('error fetching utentes');
  }
});

// model to save
var exploracao = new Backbone.SIXHIARA.Exploracao();

// save action
new Backbone.SIXHIARA.ButtonSaveView({
  el: $('#save-button'),
  model: exploracao
}).render();

// page info
new Backbone.UILib.WidgetsView({
  el: $('#info'),
  model: exploracao
}).render();

// page utente
function fillSelectUtente(){
  new Backbone.SIXHIARA.SelectUtenteView({
    el: $('#utente'),
    collection: utentes
  }).render();
}
new Backbone.UILib.WidgetsView({
  el: $('#utente'),
  model: exploracao.get('utente')
}).render();

// page licencias & fontes: superficial
var licenseSupView = new Backbone.SIXHIARA.LicenseView({
  el: $('#licencia-superficial'),
  model: exploracao,
  domains: domains,
  lic_tipo: 'Superficial',
  elModalFonte: $('#fonteSupModal'),
  elModalFonteButton: $('#fonte-superficial'),
  elModalFonteSelect: $('#fonteSupModal #fonte_tipo')
}).render();

// page licencias & fontes: subterranea
var licenseSubView = new Backbone.SIXHIARA.LicenseView({
  el: $('#licencia-subterranea'),
  model: exploracao,
  domains: domains,
  lic_tipo: 'Subterrânea',
  elModalFonte: $('#fonteSubModal'),
  elModalFonteButton: $('#fonte-subterranea'),
  elModalFonteSelect: $('#fonteSubModal #fonte_tipo'),
}).render();

// page licencias & fontes: fontes table
var tableFontesView = new Backbone.SIXHIARA.TableFontesView({
  el: $('#fontes'),
  collection: exploracao.get('fontes')
}).render();
tableFontesView.listenTo(exploracao.get('fontes'), 'update', function(model, collection, options){
  this.update(exploracao.get('fontes'));
});

function fillComponentsWithDomains(){

  var actividades     = domains.byCategory('actividade');

  // page info: localizacao
  new Backbone.SIXHIARA.SelectLocationView({
    domains: domains,
    model: exploracao,
    el: $('#info'),
  }).render();
  new Backbone.SIXHIARA.SelectBaciaView({
    domains: domains,
    model: exploracao,
    el: $('#info'),
  }).render();

  // page utente: localizacion
  new Backbone.SIXHIARA.SelectLocationView({
    domains: domains,
    model: exploracao.get('utente'),
    el: $('#utente'),
  }).render();

  // page actividade: actividades
  new Backbone.UILib.SelectView({
    el: $('#actividade'),
    collection: actividades
  }).render();

  new Backbone.SIXHIARA.SelectActividadeView({
    el: $('#actividade-explotacion'),
    model: exploracao
  });

  // Update actividades templates in the DOM adding the
  // options to the selects
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
}

// block actividade
var actividadeView = new Backbone.SIXHIARA.ActividadeView({
  el: $('#info-actividade'),
  model: exploracao,
  domains: domains,
  template: null,
  nestedViews: []
});

actividadeView.listenTo(exploracao, 'change:actividade', function(model, value, options){
  var actividade = exploracao.get('actividade');

  this.options.nestedViews.forEach(function(nestedView){
    nestedView.unbind();
    nestedView.remove();
  });
  this.options.nestedViews = [];
  $('#info-actividade').append($('<div class="actividade-render">'));

  if(exploracao.get('actividade')){
    this.template = _.template($("[id='" + exploracao.get('actividade').get('tipo') + "_edit']").html())
  } else{
    this.template = null;
  }


  this.render();

  this.options.nestedViews.push(
    new Backbone.UILib.WidgetsView({
      el: $('.actividade-render'),
      model: actividade
    }).render()
  );

  if (actividade && (actividade.get('tipo') === 'Pecuária')) {

    this.options.nestedViews.push(
      new Backbone.SIXHIARA.EditableTableView({
        el: $('Pecuária'),
        newRowBtSelector: '#newRow',
        modalSelector: '#resModal',
        tableSelector: 'table#reses',
        collection: exploracao.get('actividade').get('reses'),
        rowTemplate: '<td><%- c_estimado %></td><td><%- reses_tipo %></td><td><%- reses_nro %></td><td><%- observacio %></td><td class="close">&times;</td>',
        collectionModel: Backbone.SIXHIARA.ActividadeRes,
      })
    );

  } else if (actividade && (actividade.get('tipo') === 'Agricultura-Regadia')) {

    this.options.nestedViews.push(
      new Backbone.SIXHIARA.EditableTableView({
        el: $('Agricultura-Regadia'),
        newRowBtSelector: '#newRow',
        modalSelector: '#cultivoModal',
        tableSelector: 'table#cultivos',
        collection: exploracao.get('actividade').get('cultivos'),
        rowTemplate: '<td><%- c_estimado %></td><td><%- cultivo %></td><td><%- rega %></td><td><%- area %></td><td><%- observacio %></td><td class="close">&times;</td>',
        collectionModel: Backbone.SIXHIARA.ActividadeCultivo,

      })
    );
  }
}); // actividadeView.listenTo

$('#settings').on('click', function(e){
  e.preventDefault();
  var configModalView = new Backbone.SIXHIARA.ConfigModalView({model: new Backbone.Model()});
  configModalView.show();
});
