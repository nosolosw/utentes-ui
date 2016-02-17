//data
var exploracaos = new SIXHIARA.Collections.Exploracaos([
  {
    'exploracao_id':   '2016-01',
    'exploracao_name': 'Exploracao de Anadarco',
    'utente_name':     'Anadarco Mozambique',
    'estado':          'L',
    'consumo':         'C',
    'pagos':           'P'
  },
  {
    'exploracao_id':   '2016-02',
    'exploracao_name': 'Abastecemento Pemba',
    'utente_name':     'Municipio de Pemba',
    'estado':          'L',
    'consumo':         'C',
    'pagos':           'P'  },
  {
    'exploracao_id':   '2016-03',
    'exploracao_name': 'Saneamento porto',
    'utente_name':     'Porto de Pemba',
    'estado':          'L',
    'consumo':         'C',
    'pagos':           'P'  },
]);

var utentes = new iCarto.Collections.Dominios([
  {'text': 'Anadarco Mozambique'},
  {'text': 'Municipio de Pemba'},
  {'text': 'Banco Mundial'}
]);

var provincias = new iCarto.Collections.Dominios([
  {'text': 'Cabo Delgado'},
  {'text': 'Niassa'},
]);

var distritos = new iCarto.Collections.Dominios([
  {'text': 'Ancuabe', 'parent': 'Niassa'},
  {'text': 'Balama', 'parent': 'Niassa'},
]);

var postos = new iCarto.Collections.Dominios([
  {'text': 'Mesa', 'parent': 'Ancuabe'},
  {'text': 'Metoro', 'parent': 'Balama'},
]);

var licenciaTipos = new iCarto.Collections.Dominios([
  {'text': 'Superficial'},
  {'text': 'Subterránea'},
]);

var licenciaEstados = new iCarto.Collections.Dominios([
  {'text': 'Irregular'},
  {'text': 'Licenciada'}
]);

var exploracaoPagamento = new iCarto.Collections.Dominios([
  {'text': 'Pagada'},
  {'text': 'Non pagada'}
]);

var actividades = new iCarto.Collections.Dominios([
  {'text': 'Abastecemento'},
  {'text': 'Saneamento'},
  {'text': 'Industria'},
]);

// filters block

var where = new SIXHIARA.Models.Exploracao();

new iCarto.Views.Widgets({
  el: $('#filters'),
  model: where
}).render();

new iCarto.Views.SelectFiller({
  el: $('#utentes'),
  model: utentes
}).render();

new iCarto.Views.SelectFiller({
  el: $('#loc_provin'),
  model: provincias
}).render();

var selectDistritos = new iCarto.Views.SelectFiller({
  el: $('#loc_distri'),
  model: distritos,
  init: []
}).render();
selectDistritos.listenTo(where, 'change:loc_provin', selectDistritos.showFilteredOptions);

var selectPostos = new iCarto.Views.SelectFiller({
  el: $('#loc_posto'),
  model: postos,
  init: []
}).render();
selectPostos.listenTo(where, 'change:loc_distri', selectPostos.showFilteredOptions);

new iCarto.Views.SelectFiller({
  el: $('#lic_tipo'),
  model: licenciaTipos
}).render();

new iCarto.Views.SelectFiller({
  el: $('#estado'),
  model: licenciaEstados
}).render();

new iCarto.Views.SelectFiller({
  el: $('#pagos'),
  model: exploracaoPagamento
}).render();

new iCarto.Views.SelectFiller({
  el: $('#actividades'),
  model: actividades
}).render();


// exploracao list

var listView = new iCarto.Views.ListView({
  el: $('#project_list'),
  collection: exploracaos,
  subviewTemplate: _.template($('#exploracao-li-tmpl').html())
}).render();
