SIXHIARA.Views.FiltersView = iCarto.Views.BaseView.extend({

  initialize: function(){
    iCarto.Views.BaseView.prototype.initialize.call(this);

    // properties
    var utentes = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Anadarco Mozambique'},
      {'text': 'Municipio de Pemba'},
      {'text': 'Porto de Pemba'}
    ]);

    var provincias = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Cabo Delgado'},
      {'text': 'Niassa'},
    ]);

    var distritos = new iCarto.Collections.Dominios([
      {'text': '', 'parent': 'Niassa'},
      {'text': 'Ancuabe', 'parent': 'Niassa'},
      {'text': 'Balama', 'parent': 'Niassa'},
    ]);

    var postos = new iCarto.Collections.Dominios([
      {'text': '', 'parent': 'Ancuabe'},
      {'text': 'Mesa', 'parent': 'Ancuabe'},
      {'text': '', 'parent': 'Balama'},
      {'text': 'Metoro', 'parent': 'Balama'},
    ]);

    var licenciaTipos = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Superficial'},
      {'text': 'Subterránea'},
    ]);

    var licenciaEstados = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Irregular'},
      {'text': 'Licenciada'}
    ]);

    var exploracaoPagamento = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Pagada'},
      {'text': 'Non pagada'}
    ]);

    var actividades = new iCarto.Collections.Dominios([
      {'text': ''},
      {'text': 'Abastecemento'},
      {'text': 'Saneamento'},
      {'text': 'Industria'},
    ]);

    // updates the model
    this.addView(new iCarto.Views.Widgets({
      el: this.$el,
      model: this.model
    }));

    // select views
    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#utente'),
      collection: utentes
    }));

    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#loc_provin'),
      collection: provincias
    }));

    var selectDistritos = new iCarto.Views.SelectFiller({
      el: this.$('#loc_distri'),
      collection: new iCarto.Collections.Dominios(),
    });
    selectDistritos.listenTo(this.model, 'change:loc_provin', function(model, value, options){
      this.update(distritos.where({'parent': model.get('loc_provin')}));
    });
    this.addView(selectDistritos);

    var selectPostos = new iCarto.Views.SelectFiller({
      el: this.$('#loc_posto'),
      collection: new iCarto.Collections.Dominios(),
    });
    selectPostos.listenTo(this.model, 'change:loc_distri', function(model, value, options){
      this.update(postos.where({'parent': model.get('loc_distri')}));
    });
    this.addView(selectPostos);

    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#lic_tipo'),
      collection: licenciaTipos
    }));

    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#estado'),
      collection: licenciaEstados
    }));

    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#pagos'),
      collection: exploracaoPagamento
    }));

    this.addView(new iCarto.Views.SelectFiller({
      el: this.$('#actividade'),
      collection: actividades
    }));
  },

});
