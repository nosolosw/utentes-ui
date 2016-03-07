var utentes = new Backbone.SIXHIARA.UtenteCollection();

var formatValue = function(k, v, rowData) {
  var showUrl = Backbone.SIXHIARA.Config.showUrl;
  if (k === 'nome') {
    v = '<a href="#" target="_blank">' + v + '</a><br>' + (rowData.get('nuit') || '');
  } else if (k === 'nuit') {
    v = null;
  } else if (k === 'exploracaos') {
    v = v.map(function(e){
      return '<a href="' + showUrl + e.gid + '" target="_blank">' + e.exp_id + ' ' + e.exp_name + '</a>: ' + e.actividade;
    }).join('<br>');
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
  columnNames: ['nome', 'reg_comerc', 'reg_zona', 'loc_provin', 'loc_distri', 'loc_posto', 'loc_nucleo', 'exploracaos', 'observacio'],
  // 'nuit', Is show with 'nome' and not it its own column
  columnTitles: {
    'id':         'ID',
    'nome':       'Nome',
    'nuit':       'Nuit',
    'reg_comerc': 'Reg. Comercial',
    'reg_zona':   'Reg. Zona',
    'loc_provin': 'Provincia',
    'loc_distri': 'Distrito',
    'loc_posto':  'Posto',
    'loc_nucleo': 'Núcleo',
    'exploracaos': 'Exploracaos',
    'observacio': 'Observacións',
  },
  formatValue: formatValue
});

utentes.fetch({
  parse: true,
  reset: true
});
