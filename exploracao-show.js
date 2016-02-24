var exploracao = new Backbone.SIXHIARA.Exploracao();

var exp_id = exploracao.get('exp_id');
if((exp_id != undefined) && (exp_id != null) && (exp_id != '')){
  exploracao.url = '/exploracao/' + exp_id +'.json';
  exploracao.fetch({
    parse: true,
    success: function(){
      // block info
      new Backbone.UILib.WidgetsView({
        el: $('#info'),
        model: exploracao
      }).render();

      // block utente
      new Backbone.UILib.WidgetsView({
        el: $('#utente'),
        model: exploracao.get('utente')
      }).render();

      // block Licencias
      var licenciaSuperficial = exploracao.get('licencias').where({
        'lic_tipo': 'Superficial'
      });
      new Backbone.UILib.WidgetsView({
        el: $('#licencia-superficial'),
        model: licenciaSuperficial
      }).render();

      var licenciaSubterranea = exploracao.get('licencias').where({
        'lic_tipo': 'Subterránea'
      });
      new Backbone.UILib.WidgetsView({
        el: $('#licencia-subterranea'),
        model: licenciaSubterranea
      }).render();

      new Backbone.SIXHIARA.TableShowView({
        el: $('#fontes'),
        collection: exploracao.get('fontes'),
      }).render();
    },
    error: function(){
      populateFromFakeData();
    }
  });
} else {
  populateFromFakeData();
}

function populateFromFakeData(){
  // TODO: take from API
  exploracao = new Backbone.SIXHIARA.Exploracao({
    'exp_id':     '2016-001',
    'exp_name':   'Planta de abastecimento',
    'd_solici':   '10/07/2015',
    'observacio': 'Observações sobre linha de água e outras notas sobre localização e modo de acesso.',
    'loc_provin': 'Cabo-Delgado',
    'loc_distri': 'Ancuabe',
    'loc_posto':  'Ancuabe',
    'loc_nucleo': '',
    'loc_endere': '',
    'loc_bacia':  'Rovuma',
    'loc_subaci': 'Rovuma',
    'loc_rio':    ''
  });
  exploracao.set('utente', new Backbone.SIXHIARA.Utente({
    'nome':       'Anadarco Mozambique',
    'nuit':       'N3459',
    'reg_comerc': '1/3/2009',
    'reg_zona':   'Ancuabe'
  }));
  var licenciaSubterranea = new Backbone.SIXHIARA.Licencia({
    'lic_tipo':   'Subterránea',
    'lic_nro':    '2016-001-01',
    'cadastro':   'P86722',
    'estado':     'Licenciada',
    'c_licencia': '20',
    'c_requerid': '21',
    'c_real':     '19',
  });
  var licenciaSuperficial = new Backbone.SIXHIARA.Licencia({
    'lic_tipo':   'Superficial',
    'lic_nro':    '2016-001-02',
    'cadastro':   'N78999',
    'estado':     'Licenciada',
    'c_licencia': '90',
    'c_requerid': '89',
    'c_real':     '60',
  });
  exploracao.get('licencias').add(licenciaSuperficial);
  exploracao.get('licencias').add(licenciaSubterranea);

  var fontes = new Backbone.SIXHIARA.FonteCollection([
    {
      'tipo_agua':  'Superficial',
      'tipo_fonte': 'Río',
      'c_requerid': '90',
      'comentario': '',
    },
    {
      'tipo_agua':  'Subterránea',
      'tipo_fonte': 'Pozo',
      'c_requerid': '20',
      'comentario': '',
    }
  ]);
  exploracao.set('fontes', fontes);

  // block info
  new Backbone.UILib.WidgetsView({
    el: $('#info'),
    model: exploracao
  }).render();

  // block utente
  new Backbone.UILib.WidgetsView({
    el: $('#utente'),
    model: exploracao.get('utente')
  }).render();

  // block Licencias
  new Backbone.UILib.WidgetsView({
    el: $('#licencia-superficial'),
    model: licenciaSuperficial
  }).render();

  new Backbone.UILib.WidgetsView({
    el: $('#licencia-subterranea'),
    model: licenciaSubterranea
  }).render();

  new Backbone.SIXHIARA.TableShowView({
    el: $('#fontes'),
    collection: fontes,
  }).render();

}

new Backbone.SIXHIARA.ButtonDeleteView({
  el: $('#delete-button'),
  model: exploracao
});
