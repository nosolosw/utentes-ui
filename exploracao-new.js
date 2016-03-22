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
    fillComponentsWithDomains();
  }
});

var utentes = new Backbone.SIXHIARA.UtenteCollection();
utentes.fetch({
  success: function() {
    fillSelectUtente();
  }
});

// model to save
var exploracao = new Backbone.SIXHIARA.Exploracao();
var licenciaSubterranea = new Backbone.SIXHIARA.Licencia({
  'lic_tipo': 'Subterrânea'
});
var licenciaSuperficial = new Backbone.SIXHIARA.Licencia({
  'lic_tipo': 'Superficial'
});
exploracao.get('licencias').add(licenciaSuperficial);
exploracao.get('licencias').add(licenciaSubterranea);

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

// page licencias & fontes: licencias
new Backbone.UILib.WidgetsView({
  el: $('#licencia-superficial'),
  model: licenciaSuperficial
}).render();

new Backbone.UILib.WidgetsView({
  el: $('#licencia-subterranea'),
  model: licenciaSubterranea
}).render();

$('#fonte-subterranea').on('click', function(e){
  e.preventDefault();
  $('#fonteSubModal').modal('toggle');
});
new Backbone.SIXHIARA.ModalFonteView({
  el: $('#fonteSubModal'),
  collection: exploracao.get('fontes')
});

// page licencias & fontes: fontes modal
$('#fonte-superficial').on('click', function(e){
  e.preventDefault();
  $('#fonteSupModal').modal('toggle');
});
new Backbone.SIXHIARA.ModalFonteView({
  el: $('#fonteSupModal'),
  collection: exploracao.get('fontes')
});

// page licencias & fontes: fontes table
var tableFontesView = new Backbone.SIXHIARA.TableFontesView({
  el: $('#fontes'),
  collection: exploracao.get('fontes')
}).render();
tableFontesView.listenTo(exploracao.get('fontes'), 'add', function(model, collection, options){
  this.update(exploracao.get('fontes'));
});
tableFontesView.listenTo(exploracao.get('fontes'), 'destroy', function(model, collection, options){
  this.update(exploracao.get('fontes'));
});

function fillComponentsWithDomains(){

  var provincias      = domains.byCategory('provincia');
  var distritos       = domains.byCategory('distrito');
  var postos          = domains.byCategory('posto');
  var bacias          = domains.byCategory('bacia');
  var subacias        = domains.byCategory('subacia');
  var estadosLicencia = domains.byCategory('licencia_estado');
  var actividades     = domains.byCategory('actividade');
  var fonteTipos      = domains.byCategory('fonte_tipo');


  // page info: localizacao
  new Backbone.UILib.SelectView({
    el: $('#info #loc_provin'),
    collection: provincias
  }).render();

  var selectDistritos = new Backbone.UILib.SelectView({
    el: $('#info #loc_distri'),
    collection: [],
  }).render();
  selectDistritos.listenTo(exploracao, 'change:loc_provin', function(model, value, options){
    this.update(distritos.where({'parent': model.get('loc_provin')}));
  });

  var selectPostos = new Backbone.UILib.SelectView({
    el: $('#info #loc_posto'),
    collection: [],
  }).render();
  selectPostos.listenTo(exploracao, 'change:loc_distri', function(model, value, options){
    this.update(postos.where({'parent': model.get('loc_distri')}));
  });

  new Backbone.UILib.SelectView({
    el: $('#info #loc_bacia'),
    collection: bacias
  }).render();

  var selectSubacias = new Backbone.UILib.SelectView({
    el: $('#info #loc_subaci'),
    collection: [],
  }).render();
  selectSubacias.listenTo(exploracao, 'change:loc_bacia', function(model, value, options){
    this.update(subacias.where({'parent': model.get('loc_bacia')}));
  });

  // page utente: localizacion
  new Backbone.UILib.SelectView({
    el: $('#utente #loc_provin'),
    collection: provincias
  }).render();

  var distritosUtente = new Backbone.UILib.SelectView({
    el: $('#utente #loc_distri'),
    collection: [],
  }).render();
  distritosUtente.listenTo(exploracao.get('utente'), 'change:loc_provin', function(model, value, options){
    this.update(distritos.where({'parent': model.get('loc_provin')}));
  });

  var postosUtente = new Backbone.UILib.SelectView({
    el: $('#utente #loc_posto'),
    collection: [],
  }).render();
  postosUtente.listenTo(exploracao.get('utente'), 'change:loc_distri', function(model, value, options){
    this.update(postos.where({'parent': model.get('loc_distri')}));
  });

  // page actividade: actividades
  new Backbone.UILib.SelectView({
    el: $('#actividade'),
    collection: actividades
  }).render();

  new Backbone.SIXHIARA.SelectActividadeView({
    el: $('#actividade-explotacion'),
    model: exploracao
  });

  // page licencias & fontes: estados
  new Backbone.UILib.SelectView({
    el: $('.estado-superficial'),
    collection: estadosLicencia
  }).render();

  new Backbone.UILib.SelectView({
    el: $('.estado-subterranea'),
    collection: estadosLicencia
  }).render();

  // page licencias & fontes: tipos fonte
  new Backbone.UILib.SelectView({
    el: $('#fonteSubModal #fonte_tipo'),
    collection: fonteTipos.byParent('Subterrânea')
  }).render();

  new Backbone.UILib.SelectView({
    el: $('#fonteSupModal #fonte_tipo'),
    collection: fonteTipos.byParent('Superficial')
  }).render();


  // Update actividades templates in the DOM adding the
  // options to the selects
  new Backbone.UILib.SelectView({
    el: $('#tipo_indus'),
    collection: domains.byCategory('industria_tipo')
  }).render();
  new Backbone.UILib.SelectView({
    el: $('#energia_tipo'),
    collection: domains.byCategory('energia_tipo')
  }).render();
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
        rowTemplate: '<td><%- c_estimado %></td><td><%- reses_tipo %></td><td><%- reses_nro %></td><td><%- c_res %></td><td><%- observacio %></td><td class="close">&times;</td>',
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
        rowTemplate: '<td><%- c_estimado %></td><td><%- cultivo %></td><td><%- rega %></td><td><%- eficiencia %></td><td><%- area %></td><td><%- observacio %></td><td class="close">&times;</td>',
      })
    );
  }
}); // actividadeView.listenTo
