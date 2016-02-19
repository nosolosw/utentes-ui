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
