var utentes = new Backbone.SIXHIARA.UtenteCollection();

var formatValue = function(k, v, rowData) {
  var urlShow = Backbone.SIXHIARA.Config.urlShow;
  if (k === 'nome') {
    v = v + '<br>' + (rowData.get('nuit') || '');
  } else if (k === 'nuit') {
    v = null;
  } else if (k === 'exploracaos') {
    v = v.map(function(e){
      return '<a href="' + urlShow + e.gid + '" >' + e.exp_id + ' ' + e.exp_name + '</a>: ' + e.actividade.tipo;
    }).join('<br>');
  } else if (k === 'actions') {
    v = '<button type="button" class="btn btn-default btn-xs edit">Editar</button>';
    v += '<br><br>';
    v += '<button type="button" class="btn btn-default btn-xs delete">Eliminar</button>';
  } else if (k === 'registro'){
    var com = rowData.get('reg_comerc'),
        zon = rowData.get('reg_zona');

    if (!com && !zon) {
      v = '';
    } else {
        v = (com || '-') + ' / ' + (zon || '-');
    }

  } else if (k === 'localizacion') {
    var prov = rowData.get('loc_provin'),
        dist = rowData.get('loc_distri'),
        post = rowData.get('loc_posto'),
        nucl = rowData.get('loc_nucleo');

  if (!prov && !dist) {
    v = '';
  } else {
    v = (prov || '-') + ' / ' + (dist || '-');
  }

  if (post) v += '<br><span class="title">Posto:</span> ' + post;
  if (nucl) v += '<br><span class="title">Núcleo:</span> ' + nucl;

  } else if (_.isEmpty(v)) {
    v = '';
  } else if (v === false) {
    v = 'No';
  } else if (v === true) {
    v = 'Sí';
  } else if (typeof(v) === 'number') {
    v = formatter().format(v);
  }
  return v;
};

var tableUtentes = new Backbone.SIXHIARA.TableUtentes({
  collection: utentes,
  el: $('#the_utentes_table'),
  columnNames: ['nome', 'entidade', 'registro', 'localizacion', 'exploracaos', 'observacio', 'actions'],
  // 'actions' column is used to render the buttons
  // 'nuit', Is show with 'nome' and not it its own column
  // 'reg_comerc', 'reg_zona' are shown as 'registro'
  // 'loc_provin', 'loc_distri', 'loc_posto', 'loc_nucleo' are shown as 'localizacion'
  columnsWithOutTitle: ['actions'],
  columnTitles: {
    'id':          'ID',
    'nome':        'Nome',
    'entidade':    'Entidade',
    'nuit':        'Nuit',
    'registro':    'Reg. (Comercial / Zona)',
    'reg_comerc':  'Reg. Comercial',
    'reg_zona':    'Reg. Zona',
    'localizacion':'Localizaçao',
    'loc_provin':  'Província',
    'loc_distri':  'Distrito',
    'loc_posto':   'Posto',
    'loc_nucleo':  'Núcleo',
    'exploracaos': 'Exploraçôes',
    'observacio':  'Observaçôes',
    'actions':     '',
  },
  formatValue: formatValue,
  colReorderOptions: false,
  columnDefs: [{
              "type": "localesort",
              "targets": '_all'
          }],
});

utentes.fetch({
  parse: true,
  reset: true
});
