var exploracao = new SIXHIARA.Models.Exploracao({
  'exp_id':     '2016-001',
  'exp_name':   'Planta de abastecimento',
  'observacio': 'Observações sobre linha de água e outras notas sobre localização e modo de acesso. Observações sobre linha de água e outras notas sobre localização e modo de acesso.Observações sobre linha de água e outras notas sobre localização e modo de acesso. Observações sobre linha de água e outras notas sobre localização e modo de acesso.',
  'loc_provin': 'Cabo-Delgado',
  'loc_distri': 'Mandimba',
  'loc_posto':  'Posto',
  'loc_nucleo': 'núcleo',
  'loc_bacia':  'Rovuma',
  'loc_rio':    'Chiulezi'
});
exploracao.set('utente', new SIXHIARA.Models.Utente({
  'nome': 'Anadarco Mozambique',
  'nuit': 'N3459',
  'reg_comerc': '',
  'reg_zona': ''
}));
var licenciaSubterranea = new SIXHIARA.Models.Licencia({
  'lic_tipo': 'subterranea'
});
var licenciaSuperficial = new SIXHIARA.Models.Licencia({
  'lic_tipo':   'superficial',
  'lic_nro':    '2016-001-01',
  'cadastro':   'N78999',
  'estado':     'Irregular',
});
exploracao.get('licencias').add(licenciaSuperficial);
exploracao.get('licencias').add(licenciaSubterranea);

// block info
new iCarto.Views.Widgets({
  el: $('#info'),
  model: exploracao
}).render();

// block utente
new iCarto.Views.Widgets({
  el: $('#utente'),
  model: exploracao.get('utente')
}).render();

// block Licencias
new iCarto.Views.Widgets({
  el: $('#licencia-superficial'),
  model: licenciaSuperficial
}).render();
new iCarto.Views.Widgets({
  el: $('#licencia-subterranea'),
  model: licenciaSubterranea
}).render();
