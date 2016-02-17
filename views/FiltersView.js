SIXHIARA.Views.FiltersView = iCarto.Views.BaseView.extend({

  initialize: function(){
    iCarto.Views.BaseView.prototype.initialize.call(this);

    // this view updates the model where
    this.addView(new iCarto.Views.Widgets({
      el: $('#filters'),
      model: this.model
    }));

    // views to selects and listen for cascade events
    var utentes = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Anadarco Mozambique'},
      {'text': 'Municipio de Pemba'},
      {'text': 'Porto de Pemba'}
    ]);
    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#utente'),
      model: utentes
    }));

    var provincias = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Cabo Delgado'},
      {'text': 'Niassa'},
    ]);
    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#loc_provin'),
      model: provincias
    }));

    var distritos = new iCarto.Collections.Dominios([
      {'text': '', 'parent': 'Niassa'},
      {'text': 'Ancuabe', 'parent': 'Niassa'},
      {'text': 'Balama', 'parent': 'Niassa'},
    ]);
    var selectDistritos = new iCarto.Views.SelectFiller({
      el: this.$('#loc_distri'),
      model: distritos,
      init: []
    });
    selectDistritos.listenTo(this.model, 'change:loc_provin', selectDistritos.showFilteredOptions);
    this.addView(selectDistritos);

    var postos = new iCarto.Collections.Dominios([
      {'text': '', 'parent': 'Ancuabe'},
      {'text': 'Mesa', 'parent': 'Ancuabe'},
      {'text': '', 'parent': 'Balama'},
      {'text': 'Metoro', 'parent': 'Balama'},
    ]);
    var selectPostos = new iCarto.Views.SelectFiller({
      el: this.$('#loc_posto'),
      model: postos,
      init: []
    });
    selectPostos.listenTo(this.model, 'change:loc_distri', selectPostos.showFilteredOptions);
    this.addView(selectPostos);

    var licenciaTipos = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Superficial'},
      {'text': 'Subterránea'},
    ]);
    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#lic_tipo'),
      model: licenciaTipos
    }));

    var licenciaEstados = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Irregular'},
      {'text': 'Licenciada'}
    ]);
    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#estado'),
      model: licenciaEstados
    }));

    var exploracaoPagamento = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Pagada'},
      {'text': 'Non pagada'}
    ]);
    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#pagos'),
      model: exploracaoPagamento
    }));

    var actividades = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Abastecemento'},
      {'text': 'Saneamento'},
      {'text': 'Industria'},
    ]);
    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#actividade'),
      model: actividades
    }));
  }

});
