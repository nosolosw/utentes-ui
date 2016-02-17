//data
var EXPS = [
  {
    'exp_id':     '2016-01',
    'exp_name':   'Exploracao de Anadarco',
    'loc_provin': 'Niassa',
    'loc_distri': '',
    'loc_posto':  '',
    'utente':     'Anadarco Mozambique',
    'lic_tipo':   'Subterránea',
    'estado':     'L',
    'consumo':    'C',
    'pagos':      'P',
    'actividade': 'Saneamento',
  },
  {
    'exp_id':     '2016-02',
    'exp_name':   'Abastecemento Pemba',
    'loc_provin': 'Niassa',
    'loc_distri': '',
    'loc_posto':  '',
    'utente':     'Municipio de Pemba',
    'lic_tipo':   'Subterránea',
    'estado':     'L',
    'consumo':    'C',
    'pagos':      'P',
    'actividade': 'Saneamento',
  },
  {
    'exp_id':     '2016-03',
    'exp_name':   'Saneamento porto',
    'loc_provin': 'Cabo Delgado',
    'loc_distri': '',
    'loc_posto':  '',
    'utente':     'Porto de Pemba',
    'lic_tipo':   'Superficial',
    'estado':     'L',
    'consumo':    'C',
    'pagos':      'P',
    'actividade': 'Abastecemento',
  },
];

var exploracaos = new SIXHIARA.Collections.ExploracaosSummary(EXPS);
var listView = new iCarto.Views.ListView({
  el: $('#project_list'),
  collection: exploracaos,
  subviewTemplate: _.template($('#exploracao-li-tmpl').html())
}).render();

var where = new SIXHIARA.Models.ExploracaoSummary();
var filtersView = new SIXHIARA.Views.FiltersView({
  el: $('#filters'),
  model: where,
}).render();
where.on('change', function(e){
  var filters = _.omit(where.toJSON(), function(value, key, object){
    return value === '';
  });
  listView.update(new SIXHIARA.Collections.ExploracaosSummary(exploracaos.where(filters)));
});
