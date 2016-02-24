Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FiltersView = Backbone.UILib.BaseView.extend({

  initialize: function(options){
    Backbone.UILib.BaseView.prototype.initialize.call(this);

    this.options = options || {};
    var domains = new Backbone.UILib.DomainCollection();
    if(this.options.domains) domains = this.options.domains;

    // properties
    var utentes = domains.byCategory('utente');
    var provincias = domains.byCategory('provincia');
    var distritos = domains.byCategory('distrito');
    var postos = domains.byCategory('posto');
    var licenciaTipos = domains.byCategory('licencia_tipo');
    var licenciaEstados = domains.byCategory('licencia_estado');
    var exploracaoPagamento = domains.byCategory('pagamentos');
    var actividades = domains.byCategory('actividade');

    // updates the model
    this.addView(new Backbone.UILib.WidgetsView({
      el: this.$el,
      model: this.model
    }));

    // select views
    this.addView(new Backbone.UILib.SelectView({
      el: this.$('#utente'),
      collection: utentes
    }));

    this.addView(new Backbone.UILib.SelectView({
      el: this.$('#loc_provin'),
      collection: provincias
    }));

    var selectDistritos = new Backbone.UILib.SelectView({
      el: this.$('#loc_distri'),
      collection: [],
    });
    selectDistritos.listenTo(this.model, 'change:loc_provin', function(model, value, options){
      this.update(distritos.where({'parent': model.get('loc_provin')}));
    });
    this.addView(selectDistritos);

    var selectPostos = new Backbone.UILib.SelectView({
      el: this.$('#loc_posto'),
      collection: [],
    });
    selectPostos.listenTo(this.model, 'change:loc_distri', function(model, value, options){
      this.update(postos.where({'parent': model.get('loc_distri')}));
    });
    this.addView(selectPostos);

    this.addView(new Backbone.UILib.SelectView({
      el: this.$('#lic_tipo'),
      collection: licenciaTipos
    }));

    this.addView(new Backbone.UILib.SelectView({
      el: this.$('#estado'),
      collection: licenciaEstados
    }));

    this.addView(new Backbone.UILib.SelectView({
      el: this.$('#pagos'),
      collection: exploracaoPagamento
    }));

    this.addView(new Backbone.UILib.SelectView({
      el: this.$('#actividade'),
      collection: actividades
    }));
  },

});
