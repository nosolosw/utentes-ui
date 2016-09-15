var domains = new Backbone.UILib.DomainCollection();
domains.url = Backbone.SIXHIARA.Config.apiDomains;
domains.fetch();

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
  } else if (k === 'edit') {
    v = '<i class="edit fa fa-pencil-square-o"></i>';
  } else if (k === 'delete'){
    v = '<i class="delete fa fa-trash"></i>';
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
  if (nucl) v += '<br><span class="title">Bairro:</span> ' + nucl;

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
  el: $('#the_utentes_table'),
  collection: utentes,
  domains: domains,
  columnNames: ['nome', 'entidade', 'registro', 'localizacion', 'exploracaos', 'observacio', 'edit', 'delete'],
  // 'edit' & 'delete' column are used to render the buttons
  // 'nuit', Is show with 'nome' and not it its own column
  // 'reg_comerc', 'reg_zona' are shown as 'registro'
  // 'loc_provin', 'loc_distri', 'loc_posto', 'loc_nucleo' are shown as 'localizacion'
  columnsWithOutTitle: ['edit', 'delete'],
  columnTitles: {
    'id':          'ID',
    'nome':        'Nome / Nuit',
    'entidade':    'Tipo de entidade',
    'nuit':        'Nuit',
    'registro':    'Reg. (Comercial / Zona)',
    'reg_comerc':  'Nº Registro Comercial',
    'reg_zona':    'Registrado em',
    'localizacion':'Localizaçao',
    'loc_provin':  'Província',
    'loc_distri':  'Distrito',
    'loc_posto':   'Posto',
    'loc_nucleo':  'Bairro',
    'exploracaos': 'Exploraçôes',
    'observacio':  'Observaçôes',
    'edit':        '',
    'delete':      '',
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



$('#settings').on('click', function(e){
  e.preventDefault();
  var configModalView = new Backbone.SIXHIARA.ConfigModalView({model: new Backbone.Model()});
  configModalView.show();
});
