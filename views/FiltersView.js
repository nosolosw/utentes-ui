SIXHIARA.Views.FiltersView = iCarto.Views.BaseView.extend({

  initialize: function(options){
    iCarto.Views.BaseView.prototype.initialize.call(this);

    this.options = options || {};
    var domains = new iCarto.Collections.Dominios();
    if(this.options.domains) domains = this.options.domains;

    // properties
    var utentes = domains.byCategory('utente');
    var provincias = domains.byCategory('provincia');
    var distritos = domains.byCategory('distrito');
    var postos = domains.byCategory('posto');
    var licenciaTipos = domains.byCategory('tipo-licencia');
    var licenciaEstados = domains.byCategory('estado-licencia');
    var exploracaoPagamento = domains.byCategory('pagamento');
    var actividades = domains.byCategory('actividade');

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
      collection: [],
    });
    selectDistritos.listenTo(this.model, 'change:loc_provin', function(model, value, options){
      this.update(distritos.where({'parent': model.get('loc_provin')}));
    });
    this.addView(selectDistritos);

    var selectPostos = new iCarto.Views.SelectFiller({
      el: this.$('#loc_posto'),
      collection: [],
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
