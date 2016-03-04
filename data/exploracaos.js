var exploracaoShow = new Backbone.SIXHIARA.Exploracao({
  'exp_id':     '2016-001',
  'exp_name':   'Planta de abastecimento',
  'd_soli':     '2010-04-02', // follow https://en.wikipedia.org/wiki/ISO_8601 formats
  'observacio': 'Observações sobre linha de água e outras notas sobre localização e modo de acesso.',
  'loc_provin': 'Cabo-Delgado',
  'loc_distri': 'Ancuabe',
  'loc_posto':  'Ocua',
  'loc_nucleo': 'núcleo',
  'loc_endere': 'enderezo',
  'loc_bacia':  'Rovuma',
  'loc_subaci': 'Rovuma',
  'loc_rio':    'río',
  'pagos':      false,
  'c_soli':     18.1,
  'c_licencia': 20,
  'c_real':     17.3,
  'c_estimado': 19,
  'area':       null,
});
exploracaoShow.set('actividade', new Backbone.Model({
  'tipo':    'Abastecemento',
  'n_hab':   10000,
  'dotacao': 20,
}));
exploracaoShow.set('utente', new Backbone.SIXHIARA.Utente({
  'nome':       'Anadarco Mozambique',
  'nuit':       'N3459',
  'reg_comerc': 'X0123',
  'reg_zona':   'Ancuabe',
  'loc_provin': 'Cabo-Delgado',
  'loc_distri': 'Ancuabe',
  'loc_posto':  'Ancuabe',
  'loc_nucleo': 'núcleo',
}));
var licenciaSubterranea = new Backbone.SIXHIARA.Licencia({
  'lic_tipo':   'Subterránea',
  'lic_nro':    '2016-001-03',
  'cadastro':   'P86722',
  'estado':     'Licenciada',
  'd_emissao':  '2012-01-01',
  'd_validade': '2020-01-01',
  'c_licencia': 20.1,
  'c_soli_tot': 20,
  'c_soli_int': 10,
  'c_soli_fon': 10,
  'c_real_tot': 13.2,
  'c_real_int': 7.2,
  'c_real_fon': 6,
});
var licenciaSuperficial = new Backbone.SIXHIARA.Licencia({
  'lic_tipo':   'Superficial',
  'lic_nro':    '2016-001-01',
  'cadastro':   'N78999',
  'estado':     'Pendente firma (Direcção)',
  'd_emissao':  '2012-03-03',
  'd_validade': '2020-01-01',
  'c_licencia': 20.1,
  'c_soli_tot': 20,
  'c_soli_int': 10,
  'c_soli_fon': 10,
  'c_real_tot': 13.2,
  'c_real_int': 7.2,
  'c_real_fon': 6,
});
exploracaoShow.get('licencias').add(licenciaSuperficial);
exploracaoShow.get('licencias').add(licenciaSubterranea);

var fontes = new Backbone.SIXHIARA.FonteCollection([
  {
    'tipo_agua':  'Superficial',
    'tipo_fonte': 'Albufeira',
    'lat_lon':    '43.26 / 24.39',
    'c_soli':     90,
    'c_max':      25,
    'c_real':     90,
    'd_dado':     '2001-09-09',
    'contador':   true,
    'metodo_est': 'Por temporizador',
    'comentario': 'Sin comentarios',
  },
  {
    'tipo_agua':  'Subterrânea',
    'tipo_fonte': 'Poço',
    'lat_lon':    null,
    'c_soli':     1.2,
    'c_max':      null,
    'c_real':     5,
    'd_dado':     '2001-09-09',
    'contador':   false,
    'metodo_est': null,
    'comentario': null,
  }
]);
exploracaoShow.set('fontes', fontes);


// ----


var exploracaoGeo1 = {
  "type": "Feature",
  "properties": {
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
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [38.4563, -13.2907],
      [38.5908, -13.2720],
      [38.5496, -13.3575],
      [38.3464, -13.4403]
    ]]
  }
};

var exploracaoGeo2 = {
  "type": "Feature",
  "properties": {
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
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [40.5581, -12.9718],
      [40.5792, -12.9779],
      [40.5629, -12.9927],
    ]]
  }
};

var exploracaoGeo3 = {
  "type": "Feature",
  "properties": {
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
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [39.6079, -13.4104],
      [39.7150, -13.3583],
      [39.7109, -13.4945],
    ]]
  }
};

// {parse: true} would force model to use parse function to build the object
var geo1 = new Backbone.GeoJson.Feature(exploracaoGeo1, {parse: true});
var geo2 = new Backbone.GeoJson.Feature(exploracaoGeo2, {parse: true});
var geo3 = new Backbone.GeoJson.Feature(exploracaoGeo3, {parse: true});
var EXPLORACAOS_REPO = new Backbone.GeoJson.FeatureCollection([
  geo1, geo2, geo3
]);
