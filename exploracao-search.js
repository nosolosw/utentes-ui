//data
var exploracaos = new SIXHIARA.Collections.Exploracaos([
  {
    'exp_id':     '2016-01',
    'exp_name':   'Exploracao de Anadarco',
    'd_solici':   '',
    'observacio': '',
    'loc_provin': 'Niassa',
    'loc_distri': 'Ancuabe',
    'loc_posto':  'Mesa',
    'loc_nucleo': '',
    'loc_endere': '',
    'loc_bacia':  'Megaruma',
    'loc_subaci':  'Miruco',
    'loc_rio':    '',
    'utente': new SIXHIARA.Models.Utente({'nome': 'Anadarco Mozambique', 'nuit': '456', 'reg_comerc': '', 'reg_zona': ''}),
    'licencias': new SIXHIARA.Collections.Licencias([{'lic_tipo': 'subterranea'}]),
  },
  {
    'exp_id':     '2016-02',
    'exp_name':   'Mirucos',
    'd_solici':   '',
    'observacio': '',
    'loc_provin': 'Niassa',
    'loc_distri': 'Ancuabe',
    'loc_posto':  'Mesa',
    'loc_nucleo': '',
    'loc_endere': '',
    'loc_bacia':  'Megaruma',
    'loc_subaci':  'Miruco',
    'loc_rio':    '',
    'utente': new SIXHIARA.Models.Utente({'nome': 'Banco Mundial', 'nuit': '456', 'reg_comerc': '', 'reg_zona': ''}),
    'licencias': new SIXHIARA.Collections.Licencias([{'lic_tipo': 'subterranea'}]),
  },
  {
    'exp_id':     '2016-03',
    'exp_name':   'Planta de abastecemento',
    'd_solici':   '',
    'observacio': '',
    'loc_provin': 'Niassa',
    'loc_distri': 'Ancuabe',
    'loc_posto':  'Mesa',
    'loc_nucleo': '',
    'loc_endere': '',
    'loc_bacia':  'Megaruma',
    'loc_subaci':  'Miruco',
    'loc_rio':    '',
    'utente': new SIXHIARA.Models.Utente({'nome': 'Municipio de Pemba', 'nuit': '456', 'reg_comerc': '', 'reg_zona': ''}),
    'licencias': new SIXHIARA.Collections.Licencias([{'lic_tipo': 'subterranea'}]),
  },
  {
    'exp_id':     '2016-04',
    'exp_name':   'Saneamento en Pemba',
    'd_solici':   '',
    'observacio': '',
    'loc_provin': 'Niassa',
    'loc_distri': 'Ancuabe',
    'loc_posto':  'Mesa',
    'loc_nucleo': '',
    'loc_endere': '',
    'loc_bacia':  'Megaruma',
    'loc_subaci':  'Miruco',
    'loc_rio':    '',
    'utente': new SIXHIARA.Models.Utente({'nome': 'Municipio de Pemba', 'nuit': '456', 'reg_comerc': '', 'reg_zona': ''}),
    'licencias': new SIXHIARA.Collections.Licencias([{'lic_tipo': 'subterranea'}]),
  },
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

new SIXHIARA.Views.ExploracaosList({
  el: $('#project_list'),
  model: exploracaos
}).render();
